package com.hsk.assignment;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
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
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Integration Test suite cho User Story HTT-06-CN-005 — Xem kết quả và đáp án.
 * Bao phủ đầy đủ 5 Acceptance Criteria:
 * - TC-01: Học sinh xem kết quả bài đã nộp -> Hiển thị tổng điểm, kết quả đúng sai và đáp án đã chọn.
 * - TC-02: Chưa hết hạn nộp bài -> Hệ thống chưa hiển thị đáp án đúng và giải thích (Anti-cheating).
 * - TC-03: Đã hết hạn nộp bài -> Hệ thống hiển thị thêm đáp án đúng và giải thích của từng câu.
 * - TC-04: Giáo viên đã điều chỉnh điểm bài làm -> Hệ thống hiển thị điểm sau điều chỉnh kèm lý do (QTN-13).
 * - TC-05: Bài nộp thuộc học sinh khác -> Hệ thống từ chối với 403 Forbidden và không tiết lộ dữ liệu (QTN-02).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ViewSubmissionResultH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
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

	private Long teacherId;
	private Long studentAId;
	private Long studentBId;
	private String studentAToken;
	private String studentBToken;
	private String teacherToken;
	private Long classId;
	private QuestionResponse mcqQuestion;
	private Long correctOptId;
	private Long wrongOptId;
	private ExerciseResponse exercise;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Giáo viên
		registrationService.registerStudent(new RegisterStudentRequest("Teacher CN005", "teacher.cn005@test.com", PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase("teacher.cn005@test.com").orElseThrow();
		teacherId = teacher.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// 2. Tạo Học sinh A
		registrationService.registerStudent(new RegisterStudentRequest("Student A CN005", "studentA.cn005@test.com", PASSWORD, PASSWORD));
		UserEntity studentA = userRepository.findByEmailIgnoreCase("studentA.cn005@test.com").orElseThrow();
		studentAId = studentA.getId();

		// 3. Tạo Học sinh B
		registrationService.registerStudent(new RegisterStudentRequest("Student B CN005", "studentB.cn005@test.com", PASSWORD, PASSWORD));
		UserEntity studentB = userRepository.findByEmailIgnoreCase("studentB.cn005@test.com").orElseThrow();
		studentBId = studentB.getId();

		teacherToken = loginAndGetToken("teacher.cn005@test.com", PASSWORD);
		studentAToken = loginAndGetToken("studentA.cn005@test.com", PASSWORD);
		studentBToken = loginAndGetToken("studentB.cn005@test.com", PASSWORD);

		// 4. Tạo Lớp học & thêm Học sinh A vào lớp (Học sinh B cũng vào lớp để test quyền xem bài của nhau)
		classroomService.createClass("teacher.cn005@test.com", new CreateClassCommand("Lớp Tiếng Trung CN005", "Lớp kiểm thử HTT-06-CN-005"));
		ClassEntity classEntity = classRepository.findByTeacher_IdOrderByCreatedAtDesc(teacherId).get(0);
		classId = classEntity.getId();
		classMemberRepository.save(ClassMemberEntity.create(classEntity, studentA));
		classMemberRepository.save(ClassMemberEntity.create(classEntity, studentB));

		// 5. Tạo Câu hỏi MCQ có giải thích chi tiết
		List<CreateQuestionOptionRequest> options = List.of(
				new CreateQuestionOptionRequest("Táo", true),
				new CreateQuestionOptionRequest("Lê", false)
		);
		mcqQuestion = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Quả táo tiếng Trung là gì?",
				"Táo trong tiếng Trung là 苹果 (píngguǒ). Lê là 梨 (lí).",
				QuestionType.MCQ,
				null,
				options
		));
		correctOptId = mcqQuestion.options().stream().filter(QuestionOptionResponse::isCorrect).findFirst().orElseThrow().id();
		wrongOptId = mcqQuestion.options().stream().filter(o -> !o.isCorrect()).findFirst().orElseThrow().id();

		// 6. Tạo Bài tập 1 câu (10 điểm)
		exercise = exerciseService.createExercise(teacherId, new CreateExerciseRequest(
				"Bài tập Trắc nghiệm CN005",
				"Kiểm tra HSK 1",
				ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(mcqQuestion.id(), BigDecimal.valueOf(10.0), 1))
		));
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
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		vocabularyRepository.deleteAll();
		hskLevelRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classMemberRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		auditLogRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		record LoginRequest(String email, String password) {}
		String body = objectMapper.writeValueAsString(new LoginRequest(email, password));
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString());
		return node.get("token").asText();
	}

	private Long assignWithDueTime(Instant startTime, Instant dueTime) {
		AssignmentResponse assignResp = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exercise.id(),
				classId,
				startTime,
				dueTime
		));
		return assignResp.id();
	}

	/**
	 * HTT-06-CN-005-TC-01 — Luồng thành công xem kết quả bài đã nộp.
	 * Given: Học sinh đã nộp và bài đã được chấm.
	 * When: Học sinh mở bài đã nộp.
	 * Then: Hệ thống hiển thị tổng điểm, kết quả đúng sai và đáp án đã chọn của từng câu.
	 */
	@Test
	@DisplayName("TC-01: Học sinh xem kết quả bài đã nộp -> Hiển thị điểm, kết quả đúng sai và câu trả lời đã chọn")
	void test_TC01_viewSubmittedResult_showsScoreAndStudentAnswers() throws Exception {
		Long assignmentId = assignWithDueTime(Instant.now().minus(1, ChronoUnit.HOURS), Instant.now().plus(2, ChronoUnit.DAYS));

		// Bắt đầu làm bài
		mockMvc.perform(post("/api/assignments/" + assignmentId + "/take")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk());

		// Nộp bài với câu trả lời đúng
		SubmitAssignmentRequest submitReq = new SubmitAssignmentRequest(List.of(
				new StudentAnswerItemDto(mcqQuestion.id(), correctOptId, null)
		));
		mockMvc.perform(post("/api/assignments/" + assignmentId + "/submit")
						.header("Authorization", "Bearer " + studentAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(submitReq)))
				.andExpect(status().isOk());

		// When: Học sinh mở xem kết quả
		mockMvc.perform(get("/api/assignments/" + assignmentId + "/result")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("SUBMITTED")))
				.andExpect(jsonPath("$.score", is(10.0)))
				.andExpect(jsonPath("$.maxScore", is(10.0)))
				.andExpect(jsonPath("$.questions[0].questionId", is(mcqQuestion.id().intValue())))
				.andExpect(jsonPath("$.questions[0].isCorrect", is(true)))
				.andExpect(jsonPath("$.questions[0].pointsEarned", is(10.0)))
				.andExpect(jsonPath("$.questions[0].selectedOptionId", is(correctOptId.intValue())));
	}

	/**
	 * HTT-06-CN-005-TC-02 — Chưa hết hạn nộp bài -> Ẩn đáp án đúng và lời giải để chống gian lận.
	 * Given: Chưa hết hạn nộp bài (dueTime in future).
	 * When: Học sinh xem kết quả bài đã nộp.
	 * Then: Hệ thống chưa hiển thị đáp án đúng và giải thích (showSolutions = false).
	 */
	@Test
	@DisplayName("TC-02: Chưa hết hạn nộp bài -> Che đáp án đúng và giải thích để tránh học sinh chép cho nhau")
	void test_TC02_viewResult_beforeDeadline_hidesSolutionsAndExplanations() throws Exception {
		// Hạn nộp còn 1 ngày (chưa hết hạn)
		Long assignmentId = assignWithDueTime(Instant.now().minus(1, ChronoUnit.HOURS), Instant.now().plus(1, ChronoUnit.DAYS));

		// Bắt đầu làm bài và nộp bài
		mockMvc.perform(post("/api/assignments/" + assignmentId + "/take")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk());

		SubmitAssignmentRequest submitReq = new SubmitAssignmentRequest(List.of(
				new StudentAnswerItemDto(mcqQuestion.id(), wrongOptId, null)
		));
		mockMvc.perform(post("/api/assignments/" + assignmentId + "/submit")
						.header("Authorization", "Bearer " + studentAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(submitReq)))
				.andExpect(status().isOk());

		// When: Học sinh xem kết quả
		MvcResult result = mockMvc.perform(get("/api/assignments/" + assignmentId + "/result")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.showSolutions", is(false)))
				.andExpect(jsonPath("$.questions[0].explanation", nullValue()))
				.andReturn();

		JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
		JsonNode options = json.get("questions").get(0).get("options");
		assertNotNull(options);
		assertTrue(options.size() > 0);
		// Tất cả options đều bị mask isCorrect = false
		for (JsonNode opt : options) {
			assertFalse(opt.get("isCorrect").asBoolean(), "Khi chưa hết hạn, options không được lộ isCorrect = true");
		}
	}

	/**
	 * HTT-06-CN-005-TC-03 — Đã hết hạn nộp bài -> Hiển thị đầy đủ đáp án đúng và lời giải chi tiết.
	 * Given: Đã hết hạn nộp bài (dueTime in past).
	 * When: Học sinh xem kết quả bài đã nộp.
	 * Then: Hệ thống hiển thị thêm đáp án đúng và giải thích của từng câu (showSolutions = true).
	 */
	@Test
	@DisplayName("TC-03: Đã hết hạn nộp bài -> Hệ thống hiển thị đầy đủ đáp án đúng và giải thích")
	void test_TC03_viewResult_afterDeadline_revealsSolutionsAndExplanations() throws Exception {
		// Tạo assignment với hạn nộp
		Long assignmentId = assignWithDueTime(Instant.now().minus(2, ChronoUnit.HOURS), Instant.now().plus(1, ChronoUnit.HOURS));

		// Làm và nộp bài
		mockMvc.perform(post("/api/assignments/" + assignmentId + "/take")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assignmentId + "/submit")
						.header("Authorization", "Bearer " + studentAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of(
								new StudentAnswerItemDto(mcqQuestion.id(), wrongOptId, null)
						)))))
				.andExpect(status().isOk());

		// Giả lập thời gian đã quá hạn nộp: cập nhật assignment.dueTime về quá khứ
		AssignmentEntity entity = assignmentRepository.findById(assignmentId).orElseThrow();
		entity.setDueTime(Instant.now().minus(10, ChronoUnit.MINUTES));
		assignmentRepository.save(entity);

		// When: Học sinh mở xem kết quả sau khi đã hết hạn
		MvcResult result = mockMvc.perform(get("/api/assignments/" + assignmentId + "/result")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.showSolutions", is(true)))
				.andExpect(jsonPath("$.questions[0].explanation", is("Táo trong tiếng Trung là 苹果 (píngguǒ). Lê là 梨 (lí).")))
				.andReturn();

		JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
		JsonNode options = json.get("questions").get(0).get("options");
		boolean hasCorrectOpt = false;
		for (JsonNode opt : options) {
			if (opt.get("id").asLong() == correctOptId) {
				assertTrue(opt.get("isCorrect").asBoolean(), "Sau khi hết hạn, đáp án đúng phải trả về isCorrect = true");
				hasCorrectOpt = true;
			}
		}
		assertTrue(hasCorrectOpt, "Phải tìm thấy đáp án đúng");
	}

	/**
	 * HTT-06-CN-005-TC-04 — Giáo viên đã điều chỉnh điểm của bài làm (QTN-13).
	 * Given: Giáo viên đã điều chỉnh điểm của bài (từ 0 lên 7 điểm kèm lý do).
	 * When: Học sinh xem kết quả.
	 * Then: Hệ thống hiển thị điểm sau điều chỉnh kèm lý do minh bạch.
	 */
	@Test
	@DisplayName("TC-04: Giáo viên đã điều chỉnh điểm -> Hiển thị điểm sau điều chỉnh kèm lý do")
	void test_TC04_viewResult_showsAdjustedScoreWithReason() throws Exception {
		Long assignmentId = assignWithDueTime(Instant.now().minus(1, ChronoUnit.HOURS), Instant.now().plus(1, ChronoUnit.DAYS));

		// Học sinh nộp bài sai -> được 0 điểm
		mockMvc.perform(post("/api/assignments/" + assignmentId + "/take")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assignmentId + "/submit")
						.header("Authorization", "Bearer " + studentAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of(
								new StudentAnswerItemDto(mcqQuestion.id(), wrongOptId, null)
						)))))
				.andExpect(status().isOk());

		AssignmentSubmissionEntity submission = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, studentAId)
				.orElseThrow();
		assertEquals(0.0, submission.getScore().doubleValue());

		// Giáo viên điều chỉnh điểm thành 7.0 kèm lý do
		AdjustScoreRequest adjustReq = new AdjustScoreRequest(BigDecimal.valueOf(7.0), "Cộng 7 điểm khuyến khích giải thích tốt");
		mockMvc.perform(post("/api/assignments/submissions/" + submission.getId() + "/adjust-score")
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(adjustReq)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.adjustedScore", is(7.0)))
				.andExpect(jsonPath("$.adjustReason", is("Cộng 7 điểm khuyến khích giải thích tốt")));

		// When: Học sinh mở xem lại kết quả
		mockMvc.perform(get("/api/assignments/" + assignmentId + "/result")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(0.0))) // Điểm gốc
				.andExpect(jsonPath("$.adjustedScore", is(7.0))) // Điểm điều chỉnh
				.andExpect(jsonPath("$.adjustReason", is("Cộng 7 điểm khuyến khích giải thích tốt")));
	}

	/**
	 * HTT-06-CN-005-TC-05 — QTN-02: Học sinh chỉ xem dữ liệu của mình.
	 * Given: Bài nộp thuộc học sinh khác (học sinh A).
	 * When: Học sinh B mở bài đó bằng đường dẫn trực tiếp (/api/assignments/submissions/{id}).
	 * Then: Hệ thống từ chối và trả về 403 Forbidden, không tiết lộ dữ liệu.
	 */
	@Test
	@DisplayName("TC-05: Học sinh khác mở link trực tiếp bài nộp -> Trả về 403 Forbidden")
	void test_TC05_viewOtherStudentSubmission_forbidden() throws Exception {
		Long assignmentId = assignWithDueTime(Instant.now().minus(1, ChronoUnit.HOURS), Instant.now().plus(1, ChronoUnit.DAYS));

		// Học sinh A làm và nộp bài
		mockMvc.perform(post("/api/assignments/" + assignmentId + "/take")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assignmentId + "/submit")
						.header("Authorization", "Bearer " + studentAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of(
								new StudentAnswerItemDto(mcqQuestion.id(), correctOptId, null)
						)))))
				.andExpect(status().isOk());

		AssignmentSubmissionEntity subA = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, studentAId)
				.orElseThrow();

		// When: Học sinh B cố mở bài nộp của học sinh A bằng mã direct URL
		mockMvc.perform(get("/api/assignments/submissions/" + subA.getId())
						.header("Authorization", "Bearer " + studentBToken))
				.andExpect(status().isForbidden());

		// Đồng thời nếu học sinh B cố gọi GET /api/assignments/{assignmentId}/result?studentId={studentAId}
		mockMvc.perform(get("/api/assignments/" + assignmentId + "/result")
						.param("studentId", studentAId.toString())
						.header("Authorization", "Bearer " + studentBToken))
				.andExpect(status().isForbidden());
	}
}
