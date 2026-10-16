package com.hsk.assignment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.assignment.domain.AssignmentEntity;
import com.hsk.assignment.domain.AssignmentStatus;
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentDetailResponse;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.dto.AssignmentSnapshotOptionDto;
import com.hsk.assignment.dto.AssignmentSnapshotQuestionDto;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.common.audit.AuditLogService;
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseQuestionEntity;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionOptionEntity;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Dịch vụ xử lý giao bài cho lớp (HTT-06-CN-001).
 * Tuân thủ nghiêm ngặt các quy tắc QTN-01 (cách ly theo lớp), QTN-09 (điều kiện bài tập),
 * QTN-10 (bản chụp snapshot bất biến) và QTN-19 (quyền sở hữu).
 */
@Service
public class AssignmentService {

	private final AssignmentRepository assignmentRepository;
	private final ExerciseRepository exerciseRepository;
	private final ClassRepository classRepository;
	private final ClassMemberRepository classMemberRepository;
	private final UserRepository userRepository;
	private final UserRoleRepository userRoleRepository;
	private final AuditLogService auditLogService;
	private final ObjectMapper objectMapper;

	public AssignmentService(
			AssignmentRepository assignmentRepository,
			ExerciseRepository exerciseRepository,
			ClassRepository classRepository,
			ClassMemberRepository classMemberRepository,
			UserRepository userRepository,
			UserRoleRepository userRoleRepository,
			AuditLogService auditLogService
	) {
		this.assignmentRepository = assignmentRepository;
		this.exerciseRepository = exerciseRepository;
		this.classRepository = classRepository;
		this.classMemberRepository = classMemberRepository;
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
		this.auditLogService = auditLogService;
		this.objectMapper = new ObjectMapper();
	}

	/**
	 * HTT-06-CN-001 / TC-01 -> TC-12: Giao bài tập cho lớp học.
	 */
	@Transactional
	public AssignmentResponse assignExercise(Long teacherId, AssignExerciseRequest request) {
		assertTeacherOrAdmin(teacherId);

		// TC-05: Kiểm tra dữ liệu bắt buộc
		if (request == null) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}
		if (request.classId() == null) {
			throw new ApiException(ApiErrorCode.ASSIGNMENT_CLASS_REQUIRED);
		}
		if (request.dueTime() == null) {
			throw new ApiException(ApiErrorCode.ASSIGNMENT_DUE_DATE_REQUIRED);
		}
		if (request.exerciseId() == null) {
			throw new ApiException(ApiErrorCode.EXERCISE_NOT_FOUND);
		}

		UserEntity teacher = userRepository.findById(teacherId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		// 1. Kiểm tra bài tập
		ExerciseEntity exercise = exerciseRepository.findById(request.exerciseId())
				.orElseThrow(() -> new ApiException(ApiErrorCode.EXERCISE_NOT_FOUND));

		// QTN-19 / TC-08: Bài tập phải thuộc quyền sở hữu của giáo viên
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(teacherId, RoleCode.ADMIN);
		if (!exercise.getOwnerId().equals(teacherId) && !isAdmin) {
			throw new ApiException(ApiErrorCode.ACCESS_DENIED_EXERCISE);
		}

		// QTN-09 / TC-04: Bài tập phải có ít nhất 1 câu hỏi
		if (exercise.getQuestions() == null || exercise.getQuestions().isEmpty()) {
			throw new ApiException(ApiErrorCode.ASSIGNMENT_EXERCISE_EMPTY);
		}

		// 2. Kiểm tra lớp học
		ClassEntity classroom = classRepository.findById(request.classId())
				.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND));

		// QTN-01 / TC-07: Giáo viên chỉ được thao tác trên lớp do mình phụ trách
		if (!classroom.getTeacher().getId().equals(teacherId) && !isAdmin) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}

		// TC-06: Lớp đã lưu trữ không được phép giao bài
		if (classroom.isArchived()) {
			throw new ApiException(ApiErrorCode.CLASS_ALREADY_ARCHIVED);
		}

		// 3. Xử lý thời gian bắt đầu và hạn nộp (QTN-09 / TC-02, TC-03)
		Instant now = Instant.now();
		Instant startTime = request.startTime() != null ? request.startTime() : now;
		Instant dueTime = request.dueTime();

		// TC-03: Hạn nộp phải sau thời điểm bắt đầu/thời điểm giao
		if (!dueTime.isAfter(startTime)) {
			throw new ApiException(ApiErrorCode.ASSIGNMENT_DUE_DATE_INVALID);
		}

		// Xác định trạng thái ban đầu (TC-01, TC-02)
		AssignmentStatus initialStatus = startTime.isAfter(now)
				? AssignmentStatus.SCHEDULED
				: AssignmentStatus.ACTIVE;

		// 4. Tạo bản chụp snapshot câu hỏi, đáp án, điểm số (QTN-10 / TC-10, TC-12)
		List<AssignmentSnapshotQuestionDto> snapshotQuestions = buildSnapshotQuestions(exercise);
		String snapshotJson;
		try {
			snapshotJson = objectMapper.writeValueAsString(snapshotQuestions);
		} catch (JsonProcessingException e) {
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR, "Không thể đóng gói bản chụp câu hỏi bài tập");
		}

		// 5. Lưu phiên giao bài
		AssignmentEntity assignment = new AssignmentEntity(
				exercise,
				classroom,
				teacher,
				exercise.getTitle(),
				exercise.getDescription(),
				startTime,
				dueTime,
				exercise.getTotalPoints(),
				initialStatus,
				snapshotJson
		);
		AssignmentEntity saved = assignmentRepository.save(assignment);

		// 6. Ghi nhật ký Audit Log (TC-10)
		auditLogService.record(
				teacher,
				"ASSIGN_EXERCISE",
				"ASSIGNMENT",
				saved.getId().toString(),
				"Giáo viên " + teacher.getEmail() + " đã giao bài tập '" + exercise.getTitle() + "' cho lớp '" + classroom.getTitle() + "' (Hạn: " + dueTime + ")"
		);

		return mapToResponse(saved, snapshotQuestions.size());
	}

	/**
	 * Lấy danh sách bài tập đã giao cho một lớp học (HTT-06-CN-001).
	 * Học sinh chỉ thấy bài đã tới thời điểm bắt đầu hoặc bài còn hạn nộp (TC-02, TC-09).
	 */
	@Transactional(readOnly = true)
	public List<AssignmentResponse> getAssignmentsForClass(Long userId, Long classId) {
		ClassEntity classroom = classRepository.findById(classId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND));

		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom.getTeacher().getId().equals(userId);

		List<AssignmentEntity> assignments = assignmentRepository.findByClassroom_IdOrderByCreatedAtDesc(classId);

		// Nếu là giáo viên phụ trách hoặc quản trị viên -> xem toàn bộ
		if (isTeacherOwner || isAdmin) {
			return assignments.stream()
					.map(this::mapToResponse)
					.toList();
		}

		// Nếu là học sinh: kiểm tra quyền thành viên lớp
		ClassMemberEntity member = classMemberRepository.findByClassIdAndStudentId(classId, userId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.FORBIDDEN));

		if (member.getStatus() != ClassMemberStatus.ACTIVE) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}

		Instant now = Instant.now();
		// Học sinh chỉ thấy các bài tập không phải trạng thái lên lịch trong tương lai (TC-02),
		// hoặc các bài còn hạn nộp (TC-09: học sinh vào sau vẫn thấy bài còn hạn nộp)
		return assignments.stream()
				.filter(a -> {
					// Nếu bài đã bắt đầu (startTime <= now) -> học sinh được thấy
					if (!a.getStartTime().isAfter(now)) {
						return true;
					}
					// Nếu bài chưa bắt đầu nhưng còn hạn nộp trong tương lai và trạng thái SCHEDULED -> ẩn khỏi danh sách làm bài học sinh
					return false;
				})
				.map(this::mapToResponse)
				.toList();
	}

	/**
	 * Xem chi tiết lần giao bài kèm nội dung câu hỏi snapshot (QTN-10).
	 */
	@Transactional(readOnly = true)
	public AssignmentDetailResponse getAssignmentDetail(Long userId, Long assignmentId) {
		AssignmentEntity assignment = assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.ASSIGNMENT_NOT_FOUND));

		ClassEntity classroom = assignment.getClassroom();
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom.getTeacher().getId().equals(userId);

		if (!isTeacherOwner && !isAdmin) {
			// Kiểm tra quyền học sinh
			ClassMemberEntity member = classMemberRepository.findByClassIdAndStudentId(classroom.getId(), userId)
					.orElseThrow(() -> new ApiException(ApiErrorCode.FORBIDDEN));
			if (member.getStatus() != ClassMemberStatus.ACTIVE) {
				throw new ApiException(ApiErrorCode.FORBIDDEN);
			}

			// Nếu bài tập được lên lịch trong tương lai mà chưa tới giờ -> học sinh chưa được xem nội dung câu hỏi (TC-02)
			if (assignment.getStartTime().isAfter(Instant.now())) {
				throw new ApiException(ApiErrorCode.FORBIDDEN, "Bài tập chưa đến thời gian mở làm bài");
			}
		}

		List<AssignmentSnapshotQuestionDto> questions = parseSnapshotQuestions(assignment.getSnapshotData());

		return new AssignmentDetailResponse(
				assignment.getId(),
				assignment.getExercise().getId(),
				classroom.getId(),
				classroom.getTitle(),
				assignment.getTeacher().getId(),
				assignment.getTitle(),
				assignment.getDescription(),
				assignment.getStartTime(),
				assignment.getDueTime(),
				assignment.getTotalPoints(),
				resolveCurrentStatus(assignment),
				questions.size(),
				questions,
				assignment.getCreatedAt()
		);
	}

	// -------------------------------------------------------------------------
	// Helpers & Snapshot Serialization
	// -------------------------------------------------------------------------

	private List<AssignmentSnapshotQuestionDto> buildSnapshotQuestions(ExerciseEntity exercise) {
		List<AssignmentSnapshotQuestionDto> result = new ArrayList<>();
		if (exercise.getQuestions() == null) {
			return result;
		}

		for (ExerciseQuestionEntity eq : exercise.getQuestions()) {
			QuestionEntity q = eq.getQuestion();
			List<AssignmentSnapshotOptionDto> options = new ArrayList<>();
			if (q.getOptions() != null) {
				for (QuestionOptionEntity opt : q.getOptions()) {
					options.add(new AssignmentSnapshotOptionDto(
							opt.getId(),
							opt.getContent(),
							opt.isCorrect(),
							opt.getSortOrder()
					));
				}
			}

			result.add(new AssignmentSnapshotQuestionDto(
					q.getId(),
					q.getType() != null ? q.getType().name() : "MCQ",
					q.getContent(),
					q.getExplanation(),
					q.getPayload(),
					eq.getPoints(),
					eq.getSortOrder(),
					options
			));
		}
		return result;
	}

	public List<AssignmentSnapshotQuestionDto> parseSnapshotQuestions(String json) {
		if (json == null || json.trim().isEmpty()) {
			return Collections.emptyList();
		}
		try {
			return objectMapper.readValue(json, new TypeReference<List<AssignmentSnapshotQuestionDto>>() {});
		} catch (Exception e) {
			return Collections.emptyList();
		}
	}

	private AssignmentResponse mapToResponse(AssignmentEntity entity) {
		int questionCount = 0;
		if (entity.getSnapshotData() != null) {
			questionCount = parseSnapshotQuestions(entity.getSnapshotData()).size();
		}
		return mapToResponse(entity, questionCount);
	}

	private AssignmentResponse mapToResponse(AssignmentEntity entity, int questionCount) {
		return new AssignmentResponse(
				entity.getId(),
				entity.getExercise().getId(),
				entity.getClassroom().getId(),
				entity.getClassroom().getTitle(),
				entity.getTeacher().getId(),
				entity.getTitle(),
				entity.getDescription(),
				entity.getStartTime(),
				entity.getDueTime(),
				entity.getTotalPoints(),
				resolveCurrentStatus(entity),
				questionCount,
				entity.getCreatedAt()
		);
	}

	private AssignmentStatus resolveCurrentStatus(AssignmentEntity entity) {
		Instant now = Instant.now();
		if (entity.getStatus() == AssignmentStatus.ARCHIVED) {
			return AssignmentStatus.ARCHIVED;
		}
		if (entity.getStartTime().isAfter(now)) {
			return AssignmentStatus.SCHEDULED;
		}
		if (entity.getDueTime().isBefore(now)) {
			return AssignmentStatus.CLOSED;
		}
		return AssignmentStatus.ACTIVE;
	}

	private void assertTeacherOrAdmin(Long userId) {
		boolean isTeacher = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.TEACHER);
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.ADMIN);
		if (!isTeacher && !isAdmin) {
			throw new ApiException(ApiErrorCode.TEACHER_ROLE_NOT_GRANTED);
		}
	}
}
