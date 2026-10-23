package com.hsk.assignment;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.RoleEntity;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.PasswordResetTokenRepository;
import com.hsk.account.repository.RoleRepository;
import com.hsk.account.repository.TeacherRequestRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.assignment.domain.AssignmentEntity;
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.dto.AdjustScoreRequest;
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.dto.StudentAnswerItemDto;
import com.hsk.assignment.dto.SubmitAssignmentRequest;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.assignment.service.AssignmentService;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.dto.CreateClassCommand;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.classroom.service.ClassroomService;
import com.hsk.common.audit.AuditLogEntity;
import com.hsk.common.audit.AuditLogRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.dto.CreateExerciseQuestionItem;
import com.hsk.exercise.dto.CreateExerciseRequest;
import com.hsk.exercise.dto.ExerciseResponse;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.exercise.service.ExerciseService;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.QuestionOptionResponse;
import com.hsk.question.dto.QuestionResponse;
import com.hsk.question.repository.QuestionOptionRepository;
import com.hsk.question.repository.QuestionRepository;
import com.hsk.question.service.QuestionService;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Integration Test suite cho User Story HTT-06-CN-007 — Điều chỉnh điểm.
 * Bao phủ đầy đủ 6 Acceptance Criteria:
 * - TC-01: Lượt làm đã chấm -> Giáo viên nhập điểm mới kèm lý do -> Lưu điểm điều chỉnh, giữ điểm gốc, bảng điểm cập nhật.
 * - TC-02: Bỏ trống lý do -> Yêu cầu nhập lý do và không đổi điểm.
 * - TC-03: Điểm mới âm hoặc lớn hơn tổng điểm của bài -> Báo không hợp lệ và không lưu.
 * - TC-04: Bài nộp thuộc lớp giáo viên khác hoặc người dùng là học sinh -> 403 Forbidden.
 * - TC-05: Ghi nhận Audit Log đầy đủ điểm gốc, điểm mới, lý do, người sửa.
 * - TC-06: Bảng điểm hiển thị điểm cao nhất giữa các lượt làm bài (effectiveScore).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
public class AdjustScoreH2Test {

	private static final String PASSWORD = "Password123@";

	@Autowired private MockMvc mockMvc;
	private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
	@Autowired private UserRepository userRepository;
	@Autowired private UserRoleRepository userRoleRepository;
	@Autowired private RoleRepository roleRepository;
	@Autowired private RegistrationService registrationService;
	@Autowired private ClassroomService classroomService;
	@Autowired private QuestionService questionService;
	@Autowired private ExerciseService exerciseService;
	@Autowired private AssignmentService assignmentService;
	@Autowired private ClassRepository classRepository;
	@Autowired private ClassMemberRepository classMemberRepository;
	@Autowired private ClassMemberEventRepository classMemberEventRepository;
	@Autowired private ClassJoinAttemptRepository classJoinAttemptRepository;
	@Autowired private QuestionRepository questionRepository;
	@Autowired private QuestionOptionRepository questionOptionRepository;
	@Autowired private ExerciseRepository exerciseRepository;
	@Autowired private ExerciseQuestionRepository exerciseQuestionRepository;
	@Autowired private AssignmentRepository assignmentRepository;
	@Autowired private AssignmentSubmissionRepository submissionRepository;
	@Autowired private TeacherRequestRepository teacherRequestRepository;
	@Autowired private PasswordResetTokenRepository passwordResetTokenRepository;
	@Autowired private AuditLogRepository auditLogRepository;
	@Autowired private VocabSetItemRepository vocabSetItemRepository;
	@Autowired private VocabSetRepository vocabSetRepository;
	@Autowired private VocabularyRepository vocabularyRepository;
	@Autowired private HskLevelRepository hskLevelRepository;

	private Long teacherAId;
	private Long teacherBId;
	private Long student1Id;
	private Long student2Id;
	private String teacherAToken;
	private String teacherBToken;
	private String student1Token;
	private Long classAId;
	private QuestionResponse question;
	private Long correctOptId;
	private ExerciseResponse exercise;
	private AssignmentResponse assignmentA;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Giáo viên A và Giáo viên B
		registrationService.registerStudent(new RegisterStudentRequest("Teacher A", "teacherA.cn007@test.com", PASSWORD, PASSWORD));
		UserEntity teacherA = userRepository.findByEmailIgnoreCase("teacherA.cn007@test.com").orElseThrow();
		teacherAId = teacherA.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacherA, teacherRole, null));

		registrationService.registerStudent(new RegisterStudentRequest("Teacher B", "teacherB.cn007@test.com", PASSWORD, PASSWORD));
		UserEntity teacherB = userRepository.findByEmailIgnoreCase("teacherB.cn007@test.com").orElseThrow();
		teacherBId = teacherB.getId();
		userRoleRepository.save(UserRoleEntity.of(teacherB, teacherRole, null));

		// 2. Tạo Học sinh 1 và Học sinh 2
		registrationService.registerStudent(new RegisterStudentRequest("Student 1", "student1.cn007@test.com", PASSWORD, PASSWORD));
		UserEntity student1 = userRepository.findByEmailIgnoreCase("student1.cn007@test.com").orElseThrow();
		student1Id = student1.getId();

		registrationService.registerStudent(new RegisterStudentRequest("Student 2", "student2.cn007@test.com", PASSWORD, PASSWORD));
		UserEntity student2 = userRepository.findByEmailIgnoreCase("student2.cn007@test.com").orElseThrow();
		student2Id = student2.getId();

		teacherAToken = loginAndGetToken("teacherA.cn007@test.com", PASSWORD);
		teacherBToken = loginAndGetToken("teacherB.cn007@test.com", PASSWORD);
		student1Token = loginAndGetToken("student1.cn007@test.com", PASSWORD);

		// 3. Giáo viên A tạo lớp A & thêm Học sinh 1 và Học sinh 2 vào lớp
		classroomService.createClass("teacherA.cn007@test.com", new CreateClassCommand("Lớp Học A CN007", "Mô tả"));
		ClassEntity classEntity = classRepository.findByTeacher_IdOrderByCreatedAtDesc(teacherAId).get(0);
		classAId = classEntity.getId();
		classMemberRepository.save(ClassMemberEntity.create(classEntity, student1));
		classMemberRepository.save(ClassMemberEntity.create(classEntity, student2));

		// 4. Tạo Câu hỏi (10 điểm) và Bài tập
		question = questionService.createMultipleChoiceQuestion(teacherAId, new CreateQuestionRequest(
				"Câu hỏi trắc nghiệm?",
				"Giải thích chi tiết của câu hỏi",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Đáp án đúng", true),
						new CreateQuestionOptionRequest("Đáp án sai", false)
				)
		));
		correctOptId = question.options().stream().filter(QuestionOptionResponse::isCorrect).findFirst().orElseThrow().id();

		exercise = exerciseService.createExercise(teacherAId, new CreateExerciseRequest(
				"Bài tập CN007",
				"Kiểm tra",
				ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(question.id(), BigDecimal.valueOf(10.0), 1))
		));

		// 5. Giao bài tập cho Lớp A (Tổng điểm = 10.0)
		Instant now = Instant.now();
		assignmentA = assignmentService.assignExercise(
				teacherAId,
				new AssignExerciseRequest(
						exercise.id(),
						classAId,
						now.minus(1, ChronoUnit.HOURS),
						now.plus(1, ChronoUnit.DAYS)
				)
		);
	}

	@AfterEach
	void tearDown() {
		questionService.clearUsedInExerciseQuestionIds();
		submissionRepository.deleteAll();
		assignmentRepository.deleteAll();
		exerciseQuestionRepository.deleteAll();
		exerciseRepository.deleteAll();
		questionOptionRepository.deleteAll();
		questionRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		auditLogRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		vocabularyRepository.deleteAll();
		hskLevelRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		String body = String.format("{\"email\": \"%s\", \"password\": \"%s\"}", email, password);
		MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.get("token").asText();
	}

	@Test
	@DisplayName("HTT-06-CN-007-TC-01: Luồng thành công - Giáo viên điều chỉnh điểm kèm lý do, giữ điểm gốc và cập nhật bảng điểm")
	void testAdjustScore_Success() throws Exception {
		// 1. Học sinh 1 mở bài và nộp bài (chọn đáp án đúng -> điểm gốc = 10.0)
		mockMvc.perform(post("/api/assignments/" + assignmentA.id() + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		SubmitAssignmentRequest submitReq = new SubmitAssignmentRequest(
				List.of(new StudentAnswerItemDto(question.id(), correctOptId, null))
		);
		mockMvc.perform(post("/api/assignments/" + assignmentA.id() + "/submit")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(submitReq)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(10.0)));

		AssignmentSubmissionEntity sub = submissionRepository.findAll().get(0);
		assertEquals(0, sub.getScore().compareTo(BigDecimal.valueOf(10.0)));

		// 2. Giáo viên A điều chỉnh điểm xuống 8.5 kèm lý do
		AdjustScoreRequest adjustReq = new AdjustScoreRequest(BigDecimal.valueOf(8.5), "Trừ 1.5đ do nộp muộn thảo luận nhóm");
		mockMvc.perform(post("/api/assignments/submissions/" + sub.getId() + "/adjust-score")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(adjustReq)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(10.0))) // Giữ nguyên điểm gốc
				.andExpect(jsonPath("$.adjustedScore", is(8.5))) // Điểm điều chỉnh mới
				.andExpect(jsonPath("$.adjustReason", is("Trừ 1.5đ do nộp muộn thảo luận nhóm")));

		// 3. Kiểm tra DB
		AssignmentSubmissionEntity updatedSub = submissionRepository.findById(sub.getId()).orElseThrow();
		assertEquals(0, updatedSub.getScore().compareTo(BigDecimal.valueOf(10.0))); // Điểm gốc nguyên vẹn
		assertEquals(0, updatedSub.getAdjustedScore().compareTo(BigDecimal.valueOf(8.5)));
		assertEquals("Trừ 1.5đ do nộp muộn thảo luận nhóm", updatedSub.getAdjustReason());
		assertNotNull(updatedSub.getAdjustedAt());

		// 4. Kiểm tra tổng quan bảng điểm hiển thị effectiveScore = 8.5
		mockMvc.perform(get("/api/assignments/" + assignmentA.id() + "/submissions")
						.header("Authorization", "Bearer " + teacherAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.students[0].score", is(10.0)))
				.andExpect(jsonPath("$.students[0].adjustedScore", is(8.5)))
				.andExpect(jsonPath("$.students[0].effectiveScore", is(8.5)));
	}

	@Test
	@DisplayName("HTT-06-CN-007-TC-02: Thiếu dữ liệu - Bỏ trống lý do -> Từ chối và không đổi điểm")
	void testAdjustScore_MissingReason() throws Exception {
		mockMvc.perform(post("/api/assignments/" + assignmentA.id() + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assignmentA.id() + "/submit")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of()))))
				.andExpect(status().isOk());

		AssignmentSubmissionEntity sub = submissionRepository.findAll().get(0);

		// Thử gửi lý do rỗng
		String body = "{\"adjustedScore\": 8.0, \"reason\": \"   \"}";
		mockMvc.perform(post("/api/assignments/submissions/" + sub.getId() + "/adjust-score")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isBadRequest());

		AssignmentSubmissionEntity unchanged = submissionRepository.findById(sub.getId()).orElseThrow();
		assertEquals(null, unchanged.getAdjustedScore());
	}

	@Test
	@DisplayName("HTT-06-CN-007-TC-03: Dữ liệu không hợp lệ - Điểm mới âm hoặc lớn hơn tổng điểm bài tập -> Báo lỗi và không lưu")
	void testAdjustScore_InvalidScore() throws Exception {
		mockMvc.perform(post("/api/assignments/" + assignmentA.id() + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assignmentA.id() + "/submit")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of()))))
				.andExpect(status().isOk());

		AssignmentSubmissionEntity sub = submissionRepository.findAll().get(0);

		// Điểm âm (-1.0)
		String negativeScoreBody = "{\"adjustedScore\": -1.0, \"reason\": \"Trừ điểm nghịch\"}";
		mockMvc.perform(post("/api/assignments/submissions/" + sub.getId() + "/adjust-score")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(negativeScoreBody))
				.andExpect(status().isBadRequest());

		// Điểm vượt quá tổng điểm bài tập (tổng điểm bài là 10.0, nhập 15.0)
		String excessScoreBody = "{\"adjustedScore\": 15.0, \"reason\": \"Cộng điểm thưởng\"}";
		mockMvc.perform(post("/api/assignments/submissions/" + sub.getId() + "/adjust-score")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(excessScoreBody))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("INVALID_ADJUSTED_SCORE")));

		AssignmentSubmissionEntity unchanged = submissionRepository.findById(sub.getId()).orElseThrow();
		assertEquals(null, unchanged.getAdjustedScore());
	}

	@Test
	@DisplayName("HTT-06-CN-007-TC-04: Không có quyền - Giáo viên lớp khác hoặc Học sinh cố sửa điểm -> 403 Forbidden")
	void testAdjustScore_Forbidden() throws Exception {
		mockMvc.perform(post("/api/assignments/" + assignmentA.id() + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assignmentA.id() + "/submit")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of()))))
				.andExpect(status().isOk());

		AssignmentSubmissionEntity sub = submissionRepository.findAll().get(0);
		AdjustScoreRequest adjustReq = new AdjustScoreRequest(BigDecimal.valueOf(9.0), "Sửa trái phép");

		// Giáo viên B lớp khác cố sửa -> 403 Forbidden
		mockMvc.perform(post("/api/assignments/submissions/" + sub.getId() + "/adjust-score")
						.header("Authorization", "Bearer " + teacherBToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(adjustReq)))
				.andExpect(status().isForbidden());

		// Học sinh cố sửa -> 403 Forbidden
		mockMvc.perform(post("/api/assignments/submissions/" + sub.getId() + "/adjust-score")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(adjustReq)))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("HTT-06-CN-007-TC-05: Lưu lịch sử - Ghi nhận Audit Log đầy đủ")
	void testAdjustScore_AuditLogRecorded() throws Exception {
		mockMvc.perform(post("/api/assignments/" + assignmentA.id() + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assignmentA.id() + "/submit")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of()))))
				.andExpect(status().isOk());

		AssignmentSubmissionEntity sub = submissionRepository.findAll().get(0);

		AdjustScoreRequest adjustReq = new AdjustScoreRequest(BigDecimal.valueOf(8.0), "Chấm phúc khảo bài làm");
		mockMvc.perform(post("/api/assignments/submissions/" + sub.getId() + "/adjust-score")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(adjustReq)))
				.andExpect(status().isOk());

		List<AuditLogEntity> logs = auditLogRepository.findAll();
		boolean found = logs.stream().anyMatch(log ->
				"ADJUST_SUBMISSION_SCORE".equals(log.getAction()) &&
						log.getDetail() != null &&
						log.getDetail().contains("8.0") &&
						log.getDetail().contains("Chấm phúc khảo bài làm")
		);
		assertTrue(found, "Audit Log phải ghi nhận hành động ADJUST_SUBMISSION_SCORE kèm chi tiết");
	}

	@Test
	@DisplayName("HTT-06-CN-007-TC-06: Bảng điểm lấy điểm cao nhất giữa các lượt làm bài")
	void testAdjustScore_MultiAttemptHighestScore() throws Exception {
		AssignmentEntity assignment = assignmentRepository.findById(assignmentA.id()).orElseThrow();
		UserEntity student = userRepository.findById(student1Id).orElseThrow();

		// Lượt 1: Điểm gốc 5.0, giáo viên điều chỉnh thành 8.0
		AssignmentSubmissionEntity attempt1 = AssignmentSubmissionEntity.createAttempt(assignment, student, 1);
		attempt1.submit(BigDecimal.valueOf(5.0), "[]");
		attempt1.adjustScore(BigDecimal.valueOf(8.0), "Cộng điểm phần sáng tạo");
		submissionRepository.save(attempt1);

		// Lượt 2: Điểm gốc 7.0, không điều chỉnh
		AssignmentSubmissionEntity attempt2 = AssignmentSubmissionEntity.createAttempt(assignment, student, 2);
		attempt2.submit(BigDecimal.valueOf(7.0), "[]");
		submissionRepository.save(attempt2);

		// Bảng điểm tổng quan phải hiển thị 8.0 = max(8.0, 7.0)
		mockMvc.perform(get("/api/assignments/" + assignmentA.id() + "/submissions")
						.header("Authorization", "Bearer " + teacherAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.students[0].effectiveScore", is(8.0)));
	}

	@Test
	@DisplayName("HTT-06-CN-007: Không thể sửa điểm khi bài nộp vẫn đang ở trạng thái IN_PROGRESS")
	void testAdjustScore_InProgress_Fails() throws Exception {
		mockMvc.perform(post("/api/assignments/" + assignmentA.id() + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		AssignmentSubmissionEntity sub = submissionRepository.findAll().get(0);
		assertEquals(SubmissionStatus.IN_PROGRESS, sub.getStatus());

		AdjustScoreRequest adjustReq = new AdjustScoreRequest(BigDecimal.valueOf(9.0), "Chấm sớm khi chưa nộp");
		mockMvc.perform(post("/api/assignments/submissions/" + sub.getId() + "/adjust-score")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(adjustReq)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("SUBMISSION_NOT_IN_PROGRESS")));
	}
}
