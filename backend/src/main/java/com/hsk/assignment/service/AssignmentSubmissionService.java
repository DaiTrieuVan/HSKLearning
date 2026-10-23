package com.hsk.assignment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.assignment.domain.AssignmentEntity;
import com.hsk.assignment.domain.AssignmentStudentOverrideEntity;
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.dto.AdjustScoreRequest;
import com.hsk.assignment.dto.AssignmentSnapshotOptionDto;
import com.hsk.assignment.dto.AssignmentSnapshotQuestionDto;
import com.hsk.assignment.dto.AssignmentSubmissionsOverviewResponse;
import com.hsk.assignment.dto.DetailedQuestionResultDto;
import com.hsk.assignment.dto.GrantExtensionRequest;
import com.hsk.assignment.dto.GrantRetakeRequest;
import com.hsk.assignment.dto.SaveDraftRequest;
import com.hsk.assignment.dto.StudentAnswerItemDto;
import com.hsk.assignment.dto.StudentOverrideResponse;
import com.hsk.assignment.dto.StudentQuestionDto;
import com.hsk.assignment.dto.StudentQuestionOptionDto;
import com.hsk.assignment.dto.StudentSubmissionSummaryDto;
import com.hsk.assignment.dto.SubmissionResultResponse;
import com.hsk.assignment.dto.SubmitAssignmentRequest;
import com.hsk.assignment.dto.TakeAssignmentResponse;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentStudentOverrideRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.common.audit.AuditLogService;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.BlankAnswerDto;
import com.hsk.question.dto.FillBlankPayloadDto;
import com.hsk.question.dto.MatchingPairDto;
import com.hsk.question.dto.MatchingPayloadDto;
import com.hsk.question.dto.OrderingPayloadDto;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service xử lý nghiệp vụ Học sinh làm bài tập và nộp bài (HTT-06-CN-003).
 * Tuân thủ nghiêm ngặt các quy tắc:
 * - QTN-02: Học sinh chỉ xem bài nộp và điểm của chính mình.
 * - QTN-11: Chỉ làm bài trong hạn nộp (hoặc hạn đã gia hạn).
 * - QTN-12: Giới hạn số lượt làm bài (1 lượt hoặc số lượt được giáo viên cấp làm lại).
 * - QTN-18: Học sinh bắt buộc phải là thành viên lớp đang hoạt động.
 * - QTN-20: Tự động nộp khi hết giờ/quá hạn (AUTO_SUBMITTED) và lưu nháp liên tục.
 */
@Service
public class AssignmentSubmissionService {

	private final AssignmentRepository assignmentRepository;
	private final AssignmentSubmissionRepository submissionRepository;
	private final AssignmentStudentOverrideRepository overrideRepository;
	private final ClassMemberRepository classMemberRepository;
	private final UserRepository userRepository;
	private final UserRoleRepository userRoleRepository;
	private final AuditLogService auditLogService;
	private final com.hsk.learning.service.XpLevelService xpLevelService;
	private final ObjectMapper objectMapper;

	public AssignmentSubmissionService(
			AssignmentRepository assignmentRepository,
			AssignmentSubmissionRepository submissionRepository,
			AssignmentStudentOverrideRepository overrideRepository,
			ClassMemberRepository classMemberRepository,
			UserRepository userRepository,
			UserRoleRepository userRoleRepository,
			AuditLogService auditLogService,
			com.hsk.learning.service.XpLevelService xpLevelService
	) {
		this.assignmentRepository = assignmentRepository;
		this.submissionRepository = submissionRepository;
		this.overrideRepository = overrideRepository;
		this.classMemberRepository = classMemberRepository;
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
		this.auditLogService = auditLogService;
		this.xpLevelService = xpLevelService;
		this.objectMapper = new ObjectMapper();
	}

	/**
	 * Bắt đầu làm bài hoặc tiếp tục làm bài dở (TC-01, TC-02, TC-04, TC-05, TC-09, TC-10, TC-12).
	 */
	@Transactional
	public TakeAssignmentResponse takeAssignment(Long studentId, Long assignmentId) {
		UserEntity student = userRepository.findById(studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		AssignmentEntity assignment = assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.ASSIGNMENT_NOT_FOUND));

		// QTN-18 / TC-09: Học sinh bắt buộc phải là thành viên hoạt động của lớp
		verifyStudentMembership(assignment.getClassroom().getId(), studentId);

		Instant now = Instant.now();

		// TC-10: Kiểm tra thời gian bắt đầu
		if (assignment.getStartTime().isAfter(now)) {
			throw new ApiException(ApiErrorCode.ASSIGNMENT_NOT_YET_STARTED);
		}

		Optional<AssignmentStudentOverrideEntity> overrideOpt = overrideRepository
				.findByAssignment_IdAndStudent_Id(assignmentId, studentId);
		Instant effectiveDueTime = overrideOpt
				.map(AssignmentStudentOverrideEntity::getExtendedDueTime)
				.filter(t -> t != null)
				.orElse(assignment.getDueTime());
		int allowedAttempts = overrideOpt
				.map(AssignmentStudentOverrideEntity::getAllowedAttempts)
				.filter(a -> a != null)
				.orElse(1);

		List<AssignmentSubmissionEntity> existingSubs = submissionRepository
				.findByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, studentId);

		AssignmentSubmissionEntity submission;
		if (existingSubs.isEmpty()) {
			// TC-04 / QTN-11: Nếu chưa có lượt làm nào và đã quá hạn (hoặc hạn gia hạn) -> Từ chối bắt đầu
			if (now.isAfter(effectiveDueTime)) {
				throw new ApiException(ApiErrorCode.ASSIGNMENT_ALREADY_EXPIRED);
			}

			// Tạo lượt làm bài mới
			submission = AssignmentSubmissionEntity.createInitial(assignment, student);
			submission.setAnswersData("[]");
			submission = submissionRepository.save(submission);

			auditLogService.record(
					student,
					"START_ASSIGNMENT",
					"ASSIGNMENT_SUBMISSION",
					submission.getId().toString(),
					"Học sinh " + student.getEmail() + " bắt đầu làm bài tập '" + assignment.getTitle() + "'"
			);
		} else {
			AssignmentSubmissionEntity latest = existingSubs.get(0);
			if (latest.getStatus() == SubmissionStatus.IN_PROGRESS) {
				// QTN-20 / TC-05 / QTN-11: Nếu lượt đang IN_PROGRESS nhưng đã quá hạn -> Tự động nộp
				if (now.isAfter(effectiveDueTime)) {
					autoGradeAndFinalize(latest, assignment, SubmissionStatus.AUTO_SUBMITTED, parseAnswers(latest.getAnswersData()));
					submission = submissionRepository.save(latest);

					auditLogService.record(
							student,
							"AUTO_SUBMIT_ASSIGNMENT",
							"ASSIGNMENT_SUBMISSION",
							submission.getId().toString(),
							"Bài làm của học sinh " + student.getEmail() + " đã tự động nộp do quá hạn (Điểm: " + submission.getScore() + ")"
					);
				} else {
					submission = latest;
				}
			} else {
				// Lượt gần nhất đã SUBMITTED hoặc AUTO_SUBMITTED
				// QTN-12 / TC-03: Kiểm tra nếu giáo viên đã cấp thêm lượt làm lại
				if (existingSubs.size() < allowedAttempts) {
					if (now.isAfter(effectiveDueTime)) {
						throw new ApiException(ApiErrorCode.ASSIGNMENT_ALREADY_EXPIRED);
					}

					int nextAttemptNumber = existingSubs.size() + 1;
					submission = AssignmentSubmissionEntity.createAttempt(assignment, student, nextAttemptNumber);
					submission.setAnswersData("[]");
					submission = submissionRepository.save(submission);

					auditLogService.record(
							student,
							"START_ASSIGNMENT_RETAKE",
							"ASSIGNMENT_SUBMISSION",
							submission.getId().toString(),
							"Học sinh " + student.getEmail() + " bắt đầu làm lại bài tập '" + assignment.getTitle() + "' (Lượt: " + nextAttemptNumber + ")"
					);
				} else {
					submission = latest;
				}
			}
		}

		// Parse câu hỏi snapshot và chuyển thành DTO học sinh (bảo mật: ẩn isCorrect và explanation)
		List<AssignmentSnapshotQuestionDto> snapshotQuestions = parseSnapshotQuestions(assignment.getSnapshotData());
		List<StudentQuestionDto> studentQuestions = snapshotQuestions.stream()
				.map(q -> new StudentQuestionDto(
						q.questionId(),
						q.type(),
						q.content(),
						q.payload(),
						q.points(),
						q.sortOrder(),
						q.options() != null ? q.options().stream()
								.map(opt -> new StudentQuestionOptionDto(opt.id(), opt.content(), opt.sortOrder()))
								.toList() : Collections.emptyList()
				))
				.toList();

		List<StudentAnswerItemDto> savedAnswers = parseAnswers(submission.getAnswersData());

		return new TakeAssignmentResponse(
				submission.getId(),
				assignment.getId(),
				assignment.getTitle(),
				assignment.getDescription(),
				assignment.getStartTime(),
				effectiveDueTime,
				assignment.getTotalPoints(),
				submission.getStatus(),
				submission.getStartedAt(),
				submission.getSubmittedAt(),
				submission.getScore(),
				submission.getAttemptNumber(),
				studentQuestions,
				savedAnswers,
				now.toEpochMilli()
		);
	}

	/**
	 * Lưu nháp câu trả lời khi đang làm bài (TC-02, TC-05, TC-12).
	 */
	@Transactional
	public void saveDraft(Long studentId, Long assignmentId, SaveDraftRequest request) {
		AssignmentEntity assignment = assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.ASSIGNMENT_NOT_FOUND));

		verifyStudentMembership(assignment.getClassroom().getId(), studentId);

		AssignmentSubmissionEntity submission = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.SUBMISSION_NOT_FOUND));

		if (submission.getStatus() != SubmissionStatus.IN_PROGRESS) {
			throw new ApiException(ApiErrorCode.SUBMISSION_NOT_IN_PROGRESS);
		}

		Instant now = Instant.now();
		Instant effectiveDueTime = resolveEffectiveDueTime(assignment, studentId);
		// QTN-20 / TC-05 / QTN-11: Nếu tới hạn nộp khi đang gửi draft -> Tự động nộp
		if (now.isAfter(effectiveDueTime)) {
			List<StudentAnswerItemDto> answers = request != null && request.answers() != null ? request.answers() : parseAnswers(submission.getAnswersData());
			autoGradeAndFinalize(submission, assignment, SubmissionStatus.AUTO_SUBMITTED, answers);
			submissionRepository.save(submission);
			throw new ApiException(ApiErrorCode.ASSIGNMENT_ALREADY_EXPIRED);
		}

		List<StudentAnswerItemDto> answers = request != null && request.answers() != null ? request.answers() : Collections.emptyList();
		submission.setAnswersData(serializeAnswers(answers));
		submissionRepository.save(submission);
	}

	/**
	 * Học sinh nộp bài chính thức và hệ thống chấm điểm tự động (TC-01, TC-03, TC-05, TC-06, TC-07, TC-08, TC-11).
	 */
	@Transactional
	public SubmissionResultResponse submitAssignment(Long studentId, Long assignmentId, SubmitAssignmentRequest request) {
		UserEntity student = userRepository.findById(studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		AssignmentEntity assignment = assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.ASSIGNMENT_NOT_FOUND));

		verifyStudentMembership(assignment.getClassroom().getId(), studentId);

		AssignmentSubmissionEntity submission = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.SUBMISSION_NOT_FOUND));

		// TC-06 / QTN-12: Nếu bài đã nộp rồi thì từ chối nộp lại
		if (submission.getStatus() == SubmissionStatus.SUBMITTED || submission.getStatus() == SubmissionStatus.AUTO_SUBMITTED) {
			throw new ApiException(ApiErrorCode.ASSIGNMENT_ALREADY_SUBMITTED);
		}

		if (submission.getStatus() != SubmissionStatus.IN_PROGRESS) {
			throw new ApiException(ApiErrorCode.SUBMISSION_NOT_IN_PROGRESS);
		}

		Instant now = Instant.now();
		Instant effectiveDueTime = resolveEffectiveDueTime(assignment, studentId);
		SubmissionStatus targetStatus = now.isAfter(effectiveDueTime)
				? SubmissionStatus.AUTO_SUBMITTED
				: SubmissionStatus.SUBMITTED;

		// Lấy danh sách câu trả lời: ưu tiên request gửi lên, nếu null/rỗng thì dùng draft đã lưu
		List<StudentAnswerItemDto> answersToGrade;
		if (request != null && request.answers() != null && !request.answers().isEmpty()) {
			answersToGrade = request.answers();
		} else {
			answersToGrade = parseAnswers(submission.getAnswersData());
		}

		// Chấm điểm tự động và hoàn tất bài nộp
		List<DetailedQuestionResultDto> detailedResults = autoGradeAndFinalize(submission, assignment, targetStatus, answersToGrade);
		AssignmentSubmissionEntity saved = submissionRepository.save(submission);

		// TC-11 & HTT-06-CN-004-TC-09: Ghi nhật ký nộp bài và chấm điểm vào Audit Log
		auditLogService.record(
				student,
				targetStatus == SubmissionStatus.AUTO_SUBMITTED ? "AUTO_SUBMIT_ASSIGNMENT" : "SUBMIT_ASSIGNMENT",
				"ASSIGNMENT_SUBMISSION",
				saved.getId().toString(),
				"Học sinh " + student.getEmail() + " đã nộp bài tập '" + assignment.getTitle() + "' (Điểm gốc: " + saved.getScore() + "/" + assignment.getTotalPoints() + ", Trạng thái: " + targetStatus + ")"
		);
		auditLogService.record(
				student,
				"AUTO_GRADE_ASSIGNMENT",
				"ASSIGNMENT_SUBMISSION",
				saved.getId().toString(),
				"Chấm điểm tự động bài tập '" + assignment.getTitle() + "' cho học sinh " + student.getEmail() + ": Điểm gốc " + saved.getScore() + "/" + assignment.getTotalPoints()
		);

		// HTT-08-CN-005-TC-02: Nộp bài tập thưởng +20 XP (Idempotent theo assignmentId)
		xpLevelService.awardXp(
				student,
				20,
				"ASSIGNMENT_SUBMISSION",
				"assignment:" + assignment.getId(),
				"Hoàn thành nộp bài tập: " + assignment.getTitle()
		);

		boolean isPastDue = (assignment.getDueTime() == null) || !now.isBefore(assignment.getDueTime());
		boolean showSolutions = isPastDue; // Khi vừa nộp bài, nếu chưa hết hạn -> ẩn đáp án và giải thích (TC-02)

		List<AssignmentSnapshotQuestionDto> snapshotQuestions = parseSnapshotQuestions(assignment.getSnapshotData());
		Map<Long, StudentAnswerItemDto> answerMap = parseAnswers(saved.getAnswersData()).stream()
				.filter(a -> a.questionId() != null)
				.collect(Collectors.toMap(StudentAnswerItemDto::questionId, a -> a, (a1, a2) -> a1));
		List<DetailedQuestionResultDto> maskedResults = buildDetailedResults(snapshotQuestions, answerMap, showSolutions);

		return new SubmissionResultResponse(
				saved.getId(),
				assignment.getId(),
				assignment.getTitle(),
				assignment.getDescription(),
				saved.getStatus(),
				saved.getStartedAt(),
				saved.getSubmittedAt(),
				saved.getScore(),
				assignment.getTotalPoints(),
				saved.getAttemptNumber(),
				showSolutions,
				assignment.getDueTime(),
				saved.getAdjustedScore(),
				saved.getAdjustReason(),
				maskedResults
		);
	}

	/**
	 * HTT-06-CN-004-TC-08: Chấm lại bài nộp đã hoàn tất (Idempotent - Không tạo thêm điểm mới và giữ nguyên điểm gốc).
	 */
	@Transactional
	public SubmissionResultResponse regradeSubmission(Long studentId, Long assignmentId) {
		AssignmentEntity assignment = assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.ASSIGNMENT_NOT_FOUND));

		verifyStudentMembership(assignment.getClassroom().getId(), studentId);

		AssignmentSubmissionEntity submission = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.SUBMISSION_NOT_FOUND));

		// TC-08: Nếu bài nộp đã được chấm (SUBMITTED hoặc AUTO_SUBMITTED), giữ nguyên điểm gốc và không tạo điểm mới
		if (submission.getStatus() == SubmissionStatus.SUBMITTED || submission.getStatus() == SubmissionStatus.AUTO_SUBMITTED) {
			return toSubmissionResultResponse(submission, assignment, studentId, false, false);
		}

		throw new ApiException(ApiErrorCode.SUBMISSION_NOT_IN_PROGRESS, "Bài làm chưa được nộp nên không thể chấm lại");
	}

	/**
	 * Xem chi tiết kết quả bài đã nộp kèm đáp án đúng và giải thích (QTN-02, TC-01, TC-02, TC-03, TC-04, TC-05).
	 */
	@Transactional(readOnly = true)
	public SubmissionResultResponse getSubmissionResult(Long userId, Long assignmentId) {
		return getSubmissionResult(userId, assignmentId, null);
	}

	@Transactional(readOnly = true)
	public SubmissionResultResponse getSubmissionResult(Long userId, Long assignmentId, Long targetStudentId) {
		AssignmentEntity assignment = assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.ASSIGNMENT_NOT_FOUND));

		ClassEntity classroom = assignment.getClassroom();
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom.getTeacher().getId().equals(userId);

		Long studentIdToQuery = (targetStudentId != null) ? targetStudentId : userId;

		// QTN-02 / TC-05: Nếu người gọi không phải học sinh sở hữu, không phải giáo viên phụ trách, không phải admin -> từ chối
		if (!userId.equals(studentIdToQuery) && !isTeacherOwner && !isAdmin) {
			throw new ApiException(ApiErrorCode.FORBIDDEN, "Bạn không có quyền xem bài nộp của học sinh khác");
		}

		if (!isTeacherOwner && !isAdmin) {
			verifyStudentMembership(classroom.getId(), userId);
		}

		AssignmentSubmissionEntity submission = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, studentIdToQuery)
				.orElseThrow(() -> new ApiException(ApiErrorCode.SUBMISSION_NOT_FOUND));

		if (submission.getStatus() == SubmissionStatus.IN_PROGRESS) {
			throw new ApiException(ApiErrorCode.SUBMISSION_NOT_IN_PROGRESS, "Bài làm đang trong quá trình thực hiện, chưa có kết quả chấm điểm");
		}

		return toSubmissionResultResponse(submission, assignment, userId, isTeacherOwner, isAdmin);
	}

	/**
	 * Xem chi tiết kết quả bài nộp theo mã bài nộp trực tiếp (TC-05 / QTN-02).
	 */
	@Transactional(readOnly = true)
	public SubmissionResultResponse getSubmissionResultById(Long userId, Long submissionId) {
		AssignmentSubmissionEntity submission = submissionRepository.findById(submissionId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.SUBMISSION_NOT_FOUND));

		AssignmentEntity assignment = submission.getAssignment();
		ClassEntity classroom = assignment.getClassroom();
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom.getTeacher().getId().equals(userId);
		boolean isOwner = submission.getStudent().getId().equals(userId);

		// QTN-02 / TC-05: Học sinh chỉ xem dữ liệu của mình. Mở bài thuộc học sinh khác bằng link trực tiếp -> từ chối
		if (!isOwner && !isTeacherOwner && !isAdmin) {
			throw new ApiException(ApiErrorCode.FORBIDDEN, "Bạn không có quyền xem bài nộp của học sinh khác");
		}

		if (submission.getStatus() == SubmissionStatus.IN_PROGRESS) {
			throw new ApiException(ApiErrorCode.SUBMISSION_NOT_IN_PROGRESS, "Bài làm đang trong quá trình thực hiện, chưa có kết quả chấm điểm");
		}

		return toSubmissionResultResponse(submission, assignment, userId, isTeacherOwner, isAdmin);
	}

	/**
	 * Giáo viên điều chỉnh điểm số của bài nộp kèm lý do minh bạch (HTT-06-CN-007, TC-01..TC-06, QTN-13).
	 */
	@Transactional
	public SubmissionResultResponse adjustScore(Long userId, Long submissionId, AdjustScoreRequest request) {
		AssignmentSubmissionEntity submission = submissionRepository.findById(submissionId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.SUBMISSION_NOT_FOUND));

		AssignmentEntity assignment = submission.getAssignment();
		ClassEntity classroom = assignment.getClassroom();
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom.getTeacher().getId().equals(userId);

		// TC-04 & QTN-01: Không có quyền nếu không phải giáo viên phụ trách lớp hoặc admin
		if (!isTeacherOwner && !isAdmin) {
			throw new ApiException(ApiErrorCode.FORBIDDEN, "Chỉ giáo viên phụ trách lớp hoặc Quản trị viên mới có quyền điều chỉnh điểm");
		}

		// Điều kiện bắt đầu: Bài nộp đã được chấm tự động (SUBMITTED hoặc AUTO_SUBMITTED)
		if (submission.getStatus() == SubmissionStatus.IN_PROGRESS) {
			throw new ApiException(ApiErrorCode.SUBMISSION_NOT_IN_PROGRESS, "Chỉ có thể điều chỉnh điểm khi học sinh đã hoàn tất bài nộp");
		}

		// TC-02: Lý do điều chỉnh điểm bắt buộc không được bỏ trống
		if (request.reason() == null || request.reason().trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.ADJUST_REASON_REQUIRED, "Lý do điều chỉnh điểm không được để trống");
		}

		// TC-03: Điểm điều chỉnh phải nằm trong khoảng từ 0 đến tổng điểm bài tập
		if (request.adjustedScore() == null
				|| request.adjustedScore().compareTo(BigDecimal.ZERO) < 0
				|| request.adjustedScore().compareTo(assignment.getTotalPoints()) > 0) {
			throw new ApiException(ApiErrorCode.INVALID_ADJUSTED_SCORE,
					"Điểm điều chỉnh không hợp lệ: phải nằm trong khoảng 0 đến " + assignment.getTotalPoints());
		}

		submission.adjustScore(request.adjustedScore(), request.reason().trim());
		AssignmentSubmissionEntity saved = submissionRepository.save(submission);

		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		// TC-05: Lưu nhật ký Audit Log đầy đủ
		auditLogService.record(
				user,
				"ADJUST_SUBMISSION_SCORE",
				"ASSIGNMENT_SUBMISSION",
				saved.getId().toString(),
				"Giáo viên " + user.getEmail() + " đã điều chỉnh điểm bài nộp của học sinh "
						+ submission.getStudent().getEmail() + " từ " + submission.getScore() + " thành "
						+ request.adjustedScore() + " (Lý do: " + request.reason().trim() + ")"
		);

		return toSubmissionResultResponse(saved, assignment, userId, isTeacherOwner, isAdmin);
	}

	/**
	 * Giáo viên gia hạn thời gian nộp bài riêng cho một học sinh trong lớp (HTT-06-CN-008, QTN-11, TC-01, TC-02, TC-04, TC-05, TC-06, TC-08).
	 */
	@Transactional
	public StudentOverrideResponse grantExtension(Long teacherId, Long assignmentId, Long studentId, GrantExtensionRequest request) {
		AssignmentEntity assignment = assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.ASSIGNMENT_NOT_FOUND));

		ClassEntity classroom = assignment.getClassroom();
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(teacherId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom.getTeacher().getId().equals(teacherId);

		// TC-04 & TC-05 & QTN-01: Chỉ giáo viên phụ trách lớp hoặc Admin mới có quyền gia hạn
		if (!isTeacherOwner && !isAdmin) {
			throw new ApiException(ApiErrorCode.FORBIDDEN, "Bạn không có quyền gia hạn bài tập cho lớp học này");
		}

		UserEntity student = userRepository.findById(studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy học sinh"));

		boolean isMember = classMemberRepository.findByClassroom_IdAndStudent_Id(classroom.getId(), studentId)
				.filter(m -> m.getStatus() == ClassMemberStatus.ACTIVE)
				.isPresent();
		if (!isMember) {
			throw new ApiException(ApiErrorCode.FORBIDDEN, "Học sinh không thuộc lớp học này");
		}

		Instant now = Instant.now();
		// TC-02: Hạn mới phải sau thời điểm hiện tại
		if (request.extendedDueTime() == null || !request.extendedDueTime().isAfter(now)) {
			throw new ApiException(ApiErrorCode.EXTENSION_DUE_TIME_INVALID, "Thời gian gia hạn phải sau thời điểm hiện tại");
		}

		List<AssignmentSubmissionEntity> existingSubs = submissionRepository.findByAssignment_Id(assignmentId).stream()
				.filter(s -> s.getStudent() != null && s.getStudent().getId().equals(studentId))
				.toList();

		// TC-08: Nếu học sinh có lượt đã được hệ thống tự nộp (AUTO_SUBMITTED) khi hết hạn -> Không mở lại lượt đó, báo giáo viên và gợi ý cấp làm lại
		boolean hasAutoSubmitted = existingSubs.stream().anyMatch(s -> s.getStatus() == SubmissionStatus.AUTO_SUBMITTED);
		if (hasAutoSubmitted) {
			throw new ApiException(ApiErrorCode.CANNOT_EXTEND_AUTO_SUBMITTED,
					"Bài làm của học sinh đã bị hệ thống tự động nộp khi hết hạn. Vui lòng cấp lượt làm lại thay vì gia hạn");
		}

		boolean hasManuallySubmitted = existingSubs.stream().anyMatch(s -> s.getStatus() == SubmissionStatus.SUBMITTED);
		if (hasManuallySubmitted) {
			throw new ApiException(ApiErrorCode.CANNOT_EXTEND_ALREADY_SUBMITTED,
					"Học sinh đã nộp bài thành công. Vui lòng cấp lượt làm lại nếu muốn cho học sinh làm lại bài");
		}

		AssignmentStudentOverrideEntity override = overrideRepository
				.findByAssignment_IdAndStudent_Id(assignmentId, studentId)
				.orElseGet(() -> AssignmentStudentOverrideEntity.create(assignment, student, request.extendedDueTime(), 1, request.reason()));

		override.grantExtension(request.extendedDueTime(), request.reason());
		AssignmentStudentOverrideEntity saved = overrideRepository.save(override);

		UserEntity teacher = userRepository.findById(teacherId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		// TC-06: Ghi nhật ký Audit Log
		auditLogService.record(
				teacher,
				"GRANT_EXTENSION",
				"ASSIGNMENT_STUDENT_OVERRIDE",
				saved.getId().toString(),
				"Giáo viên " + teacher.getEmail() + " đã gia hạn bài tập '" + assignment.getTitle() + "' cho học sinh "
						+ student.getEmail() + " đến " + request.extendedDueTime()
						+ (request.reason() != null ? " (Lý do: " + request.reason() + ")" : "")
		);

		return new StudentOverrideResponse(
				assignmentId,
				studentId,
				saved.getExtendedDueTime(),
				saved.getAllowedAttempts(),
				saved.getReason(),
				saved.getUpdatedAt()
		);
	}

	/**
	 * Giáo viên cho phép học sinh làm lại bài tập (HTT-06-CN-008, QTN-12, TC-03, TC-04, TC-05, TC-06, TC-07).
	 */
	@Transactional
	public StudentOverrideResponse grantRetake(Long teacherId, Long assignmentId, Long studentId, GrantRetakeRequest request) {
		AssignmentEntity assignment = assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.ASSIGNMENT_NOT_FOUND));

		ClassEntity classroom = assignment.getClassroom();
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(teacherId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom.getTeacher().getId().equals(teacherId);

		// TC-04 & TC-05 & QTN-01: Chỉ giáo viên phụ trách lớp hoặc Admin mới có quyền cho làm lại
		if (!isTeacherOwner && !isAdmin) {
			throw new ApiException(ApiErrorCode.FORBIDDEN, "Bạn không có quyền thao tác trên lớp học này");
		}

		UserEntity student = userRepository.findById(studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy học sinh"));

		boolean isMember = classMemberRepository.findByClassroom_IdAndStudent_Id(classroom.getId(), studentId)
				.filter(m -> m.getStatus() == ClassMemberStatus.ACTIVE)
				.isPresent();
		if (!isMember) {
			throw new ApiException(ApiErrorCode.FORBIDDEN, "Học sinh không thuộc lớp học này");
		}

		List<AssignmentSubmissionEntity> existingSubs = submissionRepository.findByAssignment_Id(assignmentId).stream()
				.filter(s -> s.getStudent() != null && s.getStudent().getId().equals(studentId))
				.toList();

		int currentCompletedAttempts = existingSubs.size();
		int targetAttempts = (request != null && request.allowedAttempts() != null && request.allowedAttempts() >= 2)
				? request.allowedAttempts()
				: Math.max(2, currentCompletedAttempts + 1);

		AssignmentStudentOverrideEntity override = overrideRepository
				.findByAssignment_IdAndStudent_Id(assignmentId, studentId)
				.orElseGet(() -> AssignmentStudentOverrideEntity.create(assignment, student, null, targetAttempts, request != null ? request.reason() : null));

		override.grantRetake(targetAttempts, request != null ? request.reason() : null);
		AssignmentStudentOverrideEntity saved = overrideRepository.save(override);

		UserEntity teacher = userRepository.findById(teacherId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		// TC-06: Ghi nhật ký Audit Log
		auditLogService.record(
				teacher,
				"GRANT_RETAKE",
				"ASSIGNMENT_STUDENT_OVERRIDE",
				saved.getId().toString(),
				"Giáo viên " + teacher.getEmail() + " đã cấp quyền làm lại bài tập '" + assignment.getTitle() + "' cho học sinh "
						+ student.getEmail() + " (Số lượt tối đa: " + targetAttempts
						+ (request != null && request.reason() != null ? ", Lý do: " + request.reason() : "") + ")"
		);

		return new StudentOverrideResponse(
				assignmentId,
				studentId,
				saved.getExtendedDueTime(),
				saved.getAllowedAttempts(),
				saved.getReason(),
				saved.getUpdatedAt()
		);
	}

	public Instant resolveEffectiveDueTime(AssignmentEntity assignment, Long studentId) {
		return overrideRepository.findByAssignment_IdAndStudent_Id(assignment.getId(), studentId)
				.map(AssignmentStudentOverrideEntity::getExtendedDueTime)
				.filter(t -> t != null)
				.orElse(assignment.getDueTime());
	}

	/**
	 * Giáo viên xem danh sách học sinh và trạng thái bài nộp của bài đã giao (HTT-06-CN-006, QTN-01, HTT-06-CN-008).
	 */
	@Transactional(readOnly = true)
	public AssignmentSubmissionsOverviewResponse getAssignmentSubmissionsOverview(Long teacherId, Long assignmentId) {
		AssignmentEntity assignment = assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.ASSIGNMENT_NOT_FOUND));

		ClassEntity classroom = assignment.getClassroom();
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(teacherId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom.getTeacher().getId().equals(teacherId);

		// QTN-01: Cách ly dữ liệu giữa các lớp - Giáo viên chỉ thấy và thao tác trên lớp do mình phụ trách
		if (!isTeacherOwner && !isAdmin) {
			throw new ApiException(ApiErrorCode.FORBIDDEN, "Bạn không có quyền truy cập dữ liệu bài nộp của lớp khác");
		}

		// Lấy danh sách thành viên ACTIVE của lớp kèm UserEntity
		List<ClassMemberEntity> activeMembers = classMemberRepository.findByClassroomIdWithStudent(classroom.getId())
				.stream()
				.filter(cm -> cm.getStatus() == ClassMemberStatus.ACTIVE)
				.toList();

		// Batch fetch tất cả submission của assignment để tránh N+1
		List<AssignmentSubmissionEntity> submissions = submissionRepository.findByAssignment_Id(assignmentId);

		// Batch fetch tất cả override của assignment
		List<AssignmentStudentOverrideEntity> overrides = overrideRepository.findByAssignment_Id(assignmentId);
		Map<Long, AssignmentStudentOverrideEntity> overrideMap = overrides.stream()
				.filter(o -> o.getStudent() != null)
				.collect(Collectors.toMap(o -> o.getStudent().getId(), o -> o, (o1, o2) -> o1));

		// Gom nhóm submission theo studentId
		Map<Long, List<AssignmentSubmissionEntity>> submissionsByStudent = submissions.stream()
				.filter(s -> s.getStudent() != null)
				.collect(Collectors.groupingBy(s -> s.getStudent().getId()));

		int submittedCount = 0;
		int inProgressCount = 0;
		int notStartedCount = 0;

		List<StudentSubmissionSummaryDto> studentSummaries = new ArrayList<>();

		for (ClassMemberEntity member : activeMembers) {
			UserEntity student = member.getStudent();
			List<AssignmentSubmissionEntity> studentSubs = new ArrayList<>(submissionsByStudent.getOrDefault(student.getId(), Collections.emptyList()));
			AssignmentStudentOverrideEntity studentOverride = overrideMap.get(student.getId());
			Instant extendedDueTime = studentOverride != null ? studentOverride.getExtendedDueTime() : null;
			Integer allowedAttempts = studentOverride != null ? studentOverride.getAllowedAttempts() : 1;

			if (studentSubs.isEmpty()) {
				notStartedCount++;
				studentSummaries.add(new StudentSubmissionSummaryDto(
						student.getId(),
						student.getFullName() != null ? student.getFullName() : student.getEmail(),
						student.getEmail(),
						"NOT_STARTED",
						null,
						null,
						null,
						null,
						null,
						0,
						null,
						null,
						extendedDueTime,
						allowedAttempts
				));
			} else {
				// Sắp xếp theo attemptNumber giảm dần để lấy lượt mới nhất
				studentSubs.sort((s1, s2) -> Integer.compare(s2.getAttemptNumber(), s1.getAttemptNumber()));
				AssignmentSubmissionEntity latestSub = studentSubs.get(0);

				// Tính điểm cao nhất (effectiveScore) trong các lượt hợp lệ (SUBMITTED hoặc AUTO_SUBMITTED) (QTN-13)
				BigDecimal bestScore = null;
				for (AssignmentSubmissionEntity sub : studentSubs) {
					if (sub.getStatus() == SubmissionStatus.SUBMITTED || sub.getStatus() == SubmissionStatus.AUTO_SUBMITTED) {
						BigDecimal attemptEffective = sub.getAdjustedScore() != null ? sub.getAdjustedScore() : sub.getScore();
						if (attemptEffective != null) {
							if (bestScore == null || attemptEffective.compareTo(bestScore) > 0) {
								bestScore = attemptEffective;
							}
						}
					}
				}

				String statusStr;
				if (latestSub.getStatus() == SubmissionStatus.IN_PROGRESS) {
					statusStr = "IN_PROGRESS";
					inProgressCount++;
				} else if (latestSub.getStatus() == SubmissionStatus.AUTO_SUBMITTED) {
					statusStr = "AUTO_SUBMITTED";
					submittedCount++;
				} else {
					statusStr = "SUBMITTED";
					submittedCount++;
				}

				studentSummaries.add(new StudentSubmissionSummaryDto(
						student.getId(),
						student.getFullName() != null ? student.getFullName() : student.getEmail(),
						student.getEmail(),
						statusStr,
						latestSub.getId(),
						latestSub.getScore(),
						latestSub.getAdjustedScore(),
						latestSub.getAdjustReason(),
						bestScore != null ? bestScore : latestSub.getScore(),
						latestSub.getAttemptNumber(),
						latestSub.getStartedAt(),
						latestSub.getSubmittedAt(),
						extendedDueTime,
						allowedAttempts
				));
			}
		}

		return new AssignmentSubmissionsOverviewResponse(
				assignment.getId(),
				assignment.getTitle(),
				assignment.getDescription(),
				assignment.getTotalPoints(),
				assignment.getDueTime(),
				assignment.getStatus().name(),
				activeMembers.size(),
				submittedCount,
				inProgressCount,
				notStartedCount,
				studentSummaries
		);
	}

	private SubmissionResultResponse toSubmissionResultResponse(
			AssignmentSubmissionEntity submission,
			AssignmentEntity assignment,
			Long userId,
			boolean isTeacherOwner,
			boolean isAdmin
	) {
		boolean isTeacherOrAdmin = isTeacherOwner || isAdmin;
		Instant dueTime = assignment.getDueTime();
		boolean isPastDue = (dueTime == null) || !Instant.now().isBefore(dueTime);
		boolean showSolutions = isTeacherOrAdmin || isPastDue;

		List<AssignmentSnapshotQuestionDto> snapshotQuestions = parseSnapshotQuestions(assignment.getSnapshotData());
		List<StudentAnswerItemDto> scoredAnswers = parseAnswers(submission.getAnswersData());
		Map<Long, StudentAnswerItemDto> answerMap = scoredAnswers.stream()
				.filter(a -> a.questionId() != null)
				.collect(Collectors.toMap(StudentAnswerItemDto::questionId, a -> a, (a1, a2) -> a1));

		List<DetailedQuestionResultDto> detailedResults = buildDetailedResults(snapshotQuestions, answerMap, showSolutions);

		return new SubmissionResultResponse(
				submission.getId(),
				assignment.getId(),
				assignment.getTitle(),
				assignment.getDescription(),
				submission.getStatus(),
				submission.getStartedAt(),
				submission.getSubmittedAt(),
				submission.getScore(),
				assignment.getTotalPoints(),
				submission.getAttemptNumber(),
				showSolutions,
				dueTime,
				submission.getAdjustedScore(),
				submission.getAdjustReason(),
				detailedResults
		);
	}

	// -------------------------------------------------------------------------
	// Core Auto-Grading & Helpers (HTT-06-CN-004)
	// -------------------------------------------------------------------------

	private record GradedResult(boolean isCorrect, BigDecimal pointsEarned) {}

	private List<DetailedQuestionResultDto> autoGradeAndFinalize(
			AssignmentSubmissionEntity submission,
			AssignmentEntity assignment,
			SubmissionStatus finalStatus,
			List<StudentAnswerItemDto> studentAnswers
	) {
		List<AssignmentSnapshotQuestionDto> snapshotQuestions = parseSnapshotQuestions(assignment.getSnapshotData());
		Map<Long, StudentAnswerItemDto> studentAnswerMap = new HashMap<>();
		if (studentAnswers != null) {
			for (StudentAnswerItemDto a : studentAnswers) {
				if (a.questionId() != null) {
					studentAnswerMap.put(a.questionId(), a);
				}
			}
		}

		BigDecimal totalScore = BigDecimal.ZERO;
		List<StudentAnswerItemDto> finalizedScoredAnswers = new ArrayList<>();
		List<DetailedQuestionResultDto> detailedResults = new ArrayList<>();

		for (AssignmentSnapshotQuestionDto q : snapshotQuestions) {
			BigDecimal questionPoints = q.points() != null ? q.points() : BigDecimal.ZERO;
			StudentAnswerItemDto ans = studentAnswerMap.get(q.questionId());

			GradedResult graded = gradeQuestion(q, ans);

			totalScore = totalScore.add(graded.pointsEarned());

			finalizedScoredAnswers.add(new StudentAnswerItemDto(
					q.questionId(),
					ans != null ? ans.selectedOptionId() : null,
					ans != null ? ans.textAnswer() : null,
					graded.isCorrect(),
					graded.pointsEarned()
			));

			detailedResults.add(new DetailedQuestionResultDto(
					q.questionId(),
					q.type(),
					q.content(),
					q.explanation(),
					questionPoints,
					graded.pointsEarned(),
					graded.isCorrect(),
					ans != null ? ans.selectedOptionId() : null,
					ans != null ? ans.textAnswer() : null,
					q.payload(),
					q.options()
			));
		}

		// TC-07: Tổng điểm làm tròn đến 1 chữ số thập phân và lưu làm điểm gốc
		totalScore = totalScore.setScale(1, RoundingMode.HALF_UP);

		String answersJson = serializeAnswers(finalizedScoredAnswers);
		if (finalStatus == SubmissionStatus.AUTO_SUBMITTED) {
			submission.autoSubmit(totalScore, answersJson);
		} else {
			submission.submit(totalScore, answersJson);
		}

		return detailedResults;
	}

	/**
	 * Chấm điểm từng câu hỏi theo đúng loại câu hỏi và quy tắc chấm (TC-01 đến TC-06).
	 */
	private GradedResult gradeQuestion(AssignmentSnapshotQuestionDto q, StudentAnswerItemDto ans) {
		BigDecimal questionPoints = q.points() != null ? q.points() : BigDecimal.ZERO;

		// TC-06: Bỏ trống câu hỏi -> 0 điểm và đánh dấu sai/chưa trả lời
		if (ans == null) {
			return new GradedResult(false, BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP));
		}

		String typeStr = q.type() != null ? q.type().toUpperCase() : "MCQ";
		QuestionType qType;
		try {
			qType = QuestionType.valueOf(typeStr);
		} catch (IllegalArgumentException e) {
			qType = QuestionType.MCQ;
		}

		switch (qType) {
			case MCQ -> {
				// TC-01 & TC-02: Trắc nghiệm
				Long selectedOptId = ans.selectedOptionId();
				if (selectedOptId != null && q.options() != null) {
					for (AssignmentSnapshotOptionDto opt : q.options()) {
						if (opt.id().equals(selectedOptId)) {
							if (opt.isCorrect()) {
								return new GradedResult(true, questionPoints.setScale(1, RoundingMode.HALF_UP));
							}
							break;
						}
					}
				}
				return new GradedResult(false, BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP));
			}

			case FILL -> {
				// TC-03: Điền từ - Làm sạch khoảng trắng và đối chiếu đáp án chấp nhận được
				String text = ans.textAnswer();
				if (text == null || text.trim().isEmpty() || q.payload() == null || q.payload().trim().isEmpty()) {
					return new GradedResult(false, BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP));
				}
				try {
					FillBlankPayloadDto payload = objectMapper.readValue(q.payload(), FillBlankPayloadDto.class);
					if (payload.blanks() != null && !payload.blanks().isEmpty()) {
						BlankAnswerDto blank = payload.blanks().get(0);
						String cleaned = text.trim();
						boolean isMatch = false;

						if (blank.correctAnswer() != null && blank.correctAnswer().trim().equalsIgnoreCase(cleaned)) {
							isMatch = true;
						} else if (blank.acceptableAnswers() != null) {
							for (String acc : blank.acceptableAnswers()) {
								if (acc != null && acc.trim().equalsIgnoreCase(cleaned)) {
									isMatch = true;
									break;
								}
							}
						}

						if (isMatch) {
							return new GradedResult(true, questionPoints.setScale(1, RoundingMode.HALF_UP));
						}
					}
				} catch (Exception ignored) {
				}
				return new GradedResult(false, BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP));
			}

			case MATCH -> {
				// TC-04: Nối cặp - Tính điểm tỷ lệ theo số cặp nối đúng
				String text = ans.textAnswer();
				if (text == null || text.trim().isEmpty() || q.payload() == null || q.payload().trim().isEmpty()) {
					return new GradedResult(false, BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP));
				}
				try {
					MatchingPayloadDto payload = objectMapper.readValue(q.payload(), MatchingPayloadDto.class);
					List<MatchingPairDto> pairs = payload.pairs();
					if (pairs == null || pairs.isEmpty()) {
						return new GradedResult(false, BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP));
					}

					int totalPairs = pairs.size();
					Map<String, String> studentPairs = parseStudentMatchingAnswer(text);

					int correctCount = 0;
					for (MatchingPairDto p : pairs) {
						if (p.left() == null || p.right() == null) continue;
						String studentRight = studentPairs.get(p.left().trim());
						if (studentRight != null && studentRight.trim().equalsIgnoreCase(p.right().trim())) {
							correctCount++;
						}
					}

					if (correctCount == 0) {
						return new GradedResult(false, BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP));
					}

					BigDecimal pointsEarned = questionPoints
							.multiply(BigDecimal.valueOf(correctCount))
							.divide(BigDecimal.valueOf(totalPairs), 1, RoundingMode.HALF_UP);

					boolean allCorrect = (correctCount == totalPairs);
					return new GradedResult(allCorrect, pointsEarned);
				} catch (Exception ignored) {
				}
				return new GradedResult(false, BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP));
			}

			case ORDER -> {
				// TC-05: Sắp xếp câu - Đúng thứ tự 100% được tối đa điểm, sai thứ tự 0 điểm
				String text = ans.textAnswer();
				if (text == null || text.trim().isEmpty() || q.payload() == null || q.payload().trim().isEmpty()) {
					return new GradedResult(false, BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP));
				}
				try {
					OrderingPayloadDto payload = objectMapper.readValue(q.payload(), OrderingPayloadDto.class);
					List<String> correctOrder = payload.correctOrder();
					if (correctOrder == null || correctOrder.isEmpty()) {
						return new GradedResult(false, BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP));
					}

					List<String> studentOrder = parseStudentOrderingAnswer(text);
					if (studentOrder.size() == correctOrder.size()) {
						boolean isSame = true;
						for (int i = 0; i < correctOrder.size(); i++) {
							String expected = correctOrder.get(i).trim();
							String actual = studentOrder.get(i).trim();
							if (!expected.equalsIgnoreCase(actual)) {
								isSame = false;
								break;
							}
						}
						if (isSame) {
							return new GradedResult(true, questionPoints.setScale(1, RoundingMode.HALF_UP));
						}
					}
				} catch (Exception ignored) {
				}
				return new GradedResult(false, BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP));
			}
		}

		return new GradedResult(false, BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP));
	}

	private Map<String, String> parseStudentMatchingAnswer(String text) {
		Map<String, String> map = new HashMap<>();
		if (text == null || text.trim().isEmpty()) {
			return map;
		}
		String trimmed = text.trim();
		try {
			if (trimmed.startsWith("{")) {
				return objectMapper.readValue(trimmed, new TypeReference<Map<String, String>>() {});
			} else if (trimmed.startsWith("[")) {
				try {
					List<MatchingPairDto> list = objectMapper.readValue(trimmed, new TypeReference<List<MatchingPairDto>>() {});
					for (MatchingPairDto pair : list) {
						if (pair != null && pair.left() != null && pair.right() != null) {
							map.put(pair.left().trim(), pair.right().trim());
						}
					}
					return map;
				} catch (Exception ignored) {
				}
			}
		} catch (Exception ignored) {
		}

		String[] lines = trimmed.split("[\\n;,]+");
		for (String line : lines) {
			String[] parts = line.split("[:=-]+", 2);
			if (parts.length == 2) {
				map.put(parts[0].trim(), parts[1].trim());
			}
		}
		return map;
	}

	private List<String> parseStudentOrderingAnswer(String text) {
		List<String> list = new ArrayList<>();
		if (text == null || text.trim().isEmpty()) {
			return list;
		}
		String trimmed = text.trim();
		if (trimmed.startsWith("[")) {
			try {
				return objectMapper.readValue(trimmed, new TypeReference<List<String>>() {});
			} catch (Exception ignored) {
			}
		}

		String[] parts = trimmed.split("[\\s,]+");
		for (String p : parts) {
			if (!p.trim().isEmpty()) {
				list.add(p.trim());
			}
		}
		return list;
	}

	private List<DetailedQuestionResultDto> buildDetailedResults(
			List<AssignmentSnapshotQuestionDto> snapshotQuestions,
			Map<Long, StudentAnswerItemDto> answerMap
	) {
		return buildDetailedResults(snapshotQuestions, answerMap, true);
	}

	private List<DetailedQuestionResultDto> buildDetailedResults(
			List<AssignmentSnapshotQuestionDto> snapshotQuestions,
			Map<Long, StudentAnswerItemDto> answerMap,
			boolean showSolutions
	) {
		List<DetailedQuestionResultDto> results = new ArrayList<>();
		for (AssignmentSnapshotQuestionDto q : snapshotQuestions) {
			BigDecimal questionPoints = q.points() != null ? q.points() : BigDecimal.ZERO;
			StudentAnswerItemDto ans = answerMap.get(q.questionId());
			Boolean isCorrect = ans != null && Boolean.TRUE.equals(ans.isCorrect());
			BigDecimal pointsEarned = ans != null && ans.pointsEarned() != null ? ans.pointsEarned() : BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP);
			Long selectedOptId = ans != null ? ans.selectedOptionId() : null;
			String textAns = ans != null ? ans.textAnswer() : null;

			// Anti-cheating (TC-02, TC-03): Khi chưa hết hạn nộp bài, che đáp án đúng và lời giải
			String explanation = showSolutions ? q.explanation() : null;
			String payload = showSolutions ? q.payload() : null;

			List<AssignmentSnapshotOptionDto> options = q.options();
			if (!showSolutions && options != null) {
				options = options.stream()
						.map(opt -> new AssignmentSnapshotOptionDto(opt.id(), opt.content(), false, opt.sortOrder()))
						.toList();
			}

			results.add(new DetailedQuestionResultDto(
					q.questionId(),
					q.type(),
					q.content(),
					explanation,
					questionPoints,
					pointsEarned,
					isCorrect,
					selectedOptId,
					textAns,
					payload,
					options
			));
		}
		return results;
	}

	private void verifyStudentMembership(Long classId, Long studentId) {
		ClassMemberEntity member = classMemberRepository.findByClassroom_IdAndStudent_Id(classId, studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.FORBIDDEN));

		if (member.getStatus() != ClassMemberStatus.ACTIVE) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}
	}

	private List<AssignmentSnapshotQuestionDto> parseSnapshotQuestions(String json) {
		if (json == null || json.trim().isEmpty()) {
			return Collections.emptyList();
		}
		try {
			return objectMapper.readValue(json, new TypeReference<List<AssignmentSnapshotQuestionDto>>() {});
		} catch (JsonProcessingException e) {
			return Collections.emptyList();
		}
	}

	private List<StudentAnswerItemDto> parseAnswers(String json) {
		if (json == null || json.trim().isEmpty()) {
			return Collections.emptyList();
		}
		try {
			return objectMapper.readValue(json, new TypeReference<List<StudentAnswerItemDto>>() {});
		} catch (JsonProcessingException e) {
			return Collections.emptyList();
		}
	}

	private String serializeAnswers(List<StudentAnswerItemDto> answers) {
		try {
			return objectMapper.writeValueAsString(answers != null ? answers : Collections.emptyList());
		} catch (JsonProcessingException e) {
			return "[]";
		}
	}
}
