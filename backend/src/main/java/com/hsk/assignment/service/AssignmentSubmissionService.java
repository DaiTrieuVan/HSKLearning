package com.hsk.assignment.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.assignment.domain.AssignmentEntity;
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.dto.AssignmentSnapshotOptionDto;
import com.hsk.assignment.dto.AssignmentSnapshotQuestionDto;
import com.hsk.assignment.dto.DetailedQuestionResultDto;
import com.hsk.assignment.dto.SaveDraftRequest;
import com.hsk.assignment.dto.StudentAnswerItemDto;
import com.hsk.assignment.dto.StudentQuestionDto;
import com.hsk.assignment.dto.StudentQuestionOptionDto;
import com.hsk.assignment.dto.SubmissionResultResponse;
import com.hsk.assignment.dto.SubmitAssignmentRequest;
import com.hsk.assignment.dto.TakeAssignmentResponse;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.common.audit.AuditLogService;
import java.math.BigDecimal;
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
 * - QTN-11: Chỉ làm bài trong hạn nộp (trước due_time).
 * - QTN-12: Giới hạn 1 lượt làm duy nhất cho mỗi bài giao.
 * - QTN-18: Học sinh bắt buộc phải là thành viên lớp đang hoạt động.
 * - QTN-20: Tự động nộp khi hết giờ/quá hạn (AUTO_SUBMITTED) và lưu nháp liên tục.
 */
@Service
public class AssignmentSubmissionService {

	private final AssignmentRepository assignmentRepository;
	private final AssignmentSubmissionRepository submissionRepository;
	private final ClassMemberRepository classMemberRepository;
	private final UserRepository userRepository;
	private final UserRoleRepository userRoleRepository;
	private final AuditLogService auditLogService;
	private final ObjectMapper objectMapper;

	public AssignmentSubmissionService(
			AssignmentRepository assignmentRepository,
			AssignmentSubmissionRepository submissionRepository,
			ClassMemberRepository classMemberRepository,
			UserRepository userRepository,
			UserRoleRepository userRoleRepository,
			AuditLogService auditLogService
	) {
		this.assignmentRepository = assignmentRepository;
		this.submissionRepository = submissionRepository;
		this.classMemberRepository = classMemberRepository;
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
		this.auditLogService = auditLogService;
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

		Optional<AssignmentSubmissionEntity> submissionOpt = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, studentId);

		AssignmentSubmissionEntity submission;
		if (submissionOpt.isEmpty()) {
			// TC-04 / QTN-11: Nếu chưa có lượt làm nào và đã quá hạn -> Từ chối bắt đầu
			if (now.isAfter(assignment.getDueTime())) {
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
			submission = submissionOpt.get();

			// QTN-20 / TC-05: Nếu lượt đang IN_PROGRESS nhưng đã quá hạn -> Tự động nộp
			if (submission.getStatus() == SubmissionStatus.IN_PROGRESS && now.isAfter(assignment.getDueTime())) {
				autoGradeAndFinalize(submission, assignment, SubmissionStatus.AUTO_SUBMITTED, parseAnswers(submission.getAnswersData()));
				submission = submissionRepository.save(submission);

				auditLogService.record(
						student,
						"AUTO_SUBMIT_ASSIGNMENT",
						"ASSIGNMENT_SUBMISSION",
						submission.getId().toString(),
						"Bài làm của học sinh " + student.getEmail() + " đã tự động nộp do quá hạn (Điểm: " + submission.getScore() + ")"
				);
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
				assignment.getDueTime(),
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
		// QTN-20 / TC-05: Nếu tới hạn nộp khi đang gửi draft -> Tự động nộp
		if (now.isAfter(assignment.getDueTime())) {
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
		SubmissionStatus targetStatus = now.isAfter(assignment.getDueTime())
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

		// TC-11: Ghi nhật ký nộp bài vào Audit Log
		auditLogService.record(
				student,
				targetStatus == SubmissionStatus.AUTO_SUBMITTED ? "AUTO_SUBMIT_ASSIGNMENT" : "SUBMIT_ASSIGNMENT",
				"ASSIGNMENT_SUBMISSION",
				saved.getId().toString(),
				"Học sinh " + student.getEmail() + " đã nộp bài tập '" + assignment.getTitle() + "' (Điểm: " + saved.getScore() + "/" + assignment.getTotalPoints() + ", Trạng thái: " + targetStatus + ")"
		);

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
				detailedResults
		);
	}

	/**
	 * Xem chi tiết kết quả bài đã nộp kèm đáp án đúng và giải thích (QTN-02).
	 */
	@Transactional(readOnly = true)
	public SubmissionResultResponse getSubmissionResult(Long userId, Long assignmentId) {
		AssignmentEntity assignment = assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.ASSIGNMENT_NOT_FOUND));

		ClassEntity classroom = assignment.getClassroom();
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom.getTeacher().getId().equals(userId);

		// Nếu không phải giáo viên phụ trách hoặc admin -> bắt buộc là học sinh sở hữu (QTN-02)
		Long targetStudentId = userId;
		if (isTeacherOwner || isAdmin) {
			// Giáo viên có thể xem bài của học sinh nếu truyền vào context hoặc xem submission mặc định
			// Ở đây phục vụ endpoint của học sinh, targetStudentId = userId
		} else {
			verifyStudentMembership(classroom.getId(), userId);
		}

		AssignmentSubmissionEntity submission = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, targetStudentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.SUBMISSION_NOT_FOUND));

		if (submission.getStatus() == SubmissionStatus.IN_PROGRESS) {
			throw new ApiException(ApiErrorCode.SUBMISSION_NOT_IN_PROGRESS, "Bài làm đang trong quá trình thực hiện, chưa có kết quả chấm điểm");
		}

		List<AssignmentSnapshotQuestionDto> snapshotQuestions = parseSnapshotQuestions(assignment.getSnapshotData());
		List<StudentAnswerItemDto> scoredAnswers = parseAnswers(submission.getAnswersData());
		Map<Long, StudentAnswerItemDto> answerMap = scoredAnswers.stream()
				.filter(a -> a.questionId() != null)
				.collect(Collectors.toMap(StudentAnswerItemDto::questionId, a -> a, (a1, a2) -> a1));

		List<DetailedQuestionResultDto> detailedResults = buildDetailedResults(snapshotQuestions, answerMap);

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
				detailedResults
		);
	}

	// -------------------------------------------------------------------------
	// Core Auto-Grading & Helpers
	// -------------------------------------------------------------------------

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

			boolean isCorrect = false;
			BigDecimal pointsEarned = BigDecimal.ZERO;
			Long selectedOptId = ans != null ? ans.selectedOptionId() : null;

			if (selectedOptId != null && q.options() != null) {
				// Tìm option được chọn xem có phải là đáp án đúng không
				for (AssignmentSnapshotOptionDto opt : q.options()) {
					if (opt.id().equals(selectedOptId)) {
						if (opt.isCorrect()) {
							isCorrect = true;
							pointsEarned = questionPoints;
						}
						break;
					}
				}
			}

			totalScore = totalScore.add(pointsEarned);

			finalizedScoredAnswers.add(new StudentAnswerItemDto(
					q.questionId(),
					selectedOptId,
					ans != null ? ans.textAnswer() : null,
					isCorrect,
					pointsEarned
			));

			detailedResults.add(new DetailedQuestionResultDto(
					q.questionId(),
					q.type(),
					q.content(),
					q.explanation(),
					questionPoints,
					pointsEarned,
					isCorrect,
					selectedOptId,
					q.options()
			));
		}

		String answersJson = serializeAnswers(finalizedScoredAnswers);
		if (finalStatus == SubmissionStatus.AUTO_SUBMITTED) {
			submission.autoSubmit(totalScore, answersJson);
		} else {
			submission.submit(totalScore, answersJson);
		}

		return detailedResults;
	}

	private List<DetailedQuestionResultDto> buildDetailedResults(
			List<AssignmentSnapshotQuestionDto> snapshotQuestions,
			Map<Long, StudentAnswerItemDto> answerMap
	) {
		List<DetailedQuestionResultDto> results = new ArrayList<>();
		for (AssignmentSnapshotQuestionDto q : snapshotQuestions) {
			BigDecimal questionPoints = q.points() != null ? q.points() : BigDecimal.ZERO;
			StudentAnswerItemDto ans = answerMap.get(q.questionId());
			Boolean isCorrect = ans != null ? ans.isCorrect() : false;
			BigDecimal pointsEarned = ans != null && ans.pointsEarned() != null ? ans.pointsEarned() : BigDecimal.ZERO;
			Long selectedOptId = ans != null ? ans.selectedOptionId() : null;

			results.add(new DetailedQuestionResultDto(
					q.questionId(),
					q.type(),
					q.content(),
					q.explanation(),
					questionPoints,
					pointsEarned,
					isCorrect,
					selectedOptId,
					q.options()
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
