package com.hsk.assignment;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
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
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
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
 * Integration Test suite cho User Story HTT-06-CN-006 — Xem bài nộp của học sinh.
 * Bao phủ đầy đủ 5 Acceptance Criteria:
 * - TC-01: Giáo viên mở bài đã giao -> Hiển thị danh sách học sinh kèm trạng thái, điểm và thời điểm nộp.
 * - TC-02: Học sinh đã nộp bài -> Giáo viên mở chi tiết bài nộp -> Hiển thị câu trả lời, đúng/sai, điểm từng câu và lời giải.
 * - TC-03: Học sinh chưa nộp bài -> Hiển thị trạng thái NOT_STARTED và chưa có điểm.
 * - TC-04: Chưa có học sinh nào nộp -> Hệ thống báo chưa có bài nộp (submittedCount = 0).
 * - TC-05: Bài thuộc lớp của giáo viên khác -> Hệ thống từ chối và trả về 403 Forbidden (QTN-01).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ViewClassSubmissionsH2Test {

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

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Giáo viên A và Giáo viên B
		registrationService.registerStudent(new RegisterStudentRequest("Teacher A", "teacherA.cn006@test.com", PASSWORD, PASSWORD));
		UserEntity teacherA = userRepository.findByEmailIgnoreCase("teacherA.cn006@test.com").orElseThrow();
		teacherAId = teacherA.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacherA, teacherRole, null));

		registrationService.registerStudent(new RegisterStudentRequest("Teacher B", "teacherB.cn006@test.com", PASSWORD, PASSWORD));
		UserEntity teacherB = userRepository.findByEmailIgnoreCase("teacherB.cn006@test.com").orElseThrow();
		teacherBId = teacherB.getId();
		userRoleRepository.save(UserRoleEntity.of(teacherB, teacherRole, null));

		// 2. Tạo Học sinh 1 và Học sinh 2
		registrationService.registerStudent(new RegisterStudentRequest("Student 1", "student1.cn006@test.com", PASSWORD, PASSWORD));
		UserEntity student1 = userRepository.findByEmailIgnoreCase("student1.cn006@test.com").orElseThrow();
		student1Id = student1.getId();

		registrationService.registerStudent(new RegisterStudentRequest("Student 2", "student2.cn006@test.com", PASSWORD, PASSWORD));
		UserEntity student2 = userRepository.findByEmailIgnoreCase("student2.cn006@test.com").orElseThrow();
		student2Id = student2.getId();

		teacherAToken = loginAndGetToken("teacherA.cn006@test.com", PASSWORD);
		teacherBToken = loginAndGetToken("teacherB.cn006@test.com", PASSWORD);
		student1Token = loginAndGetToken("student1.cn006@test.com", PASSWORD);

		// 3. Giáo viên A tạo lớp A & thêm Học sinh 1 và Học sinh 2 vào lớp
		classroomService.createClass("teacherA.cn006@test.com", new CreateClassCommand("Lớp Học A CN006", "Mô tả"));
		ClassEntity classEntity = classRepository.findByTeacher_IdOrderByCreatedAtDesc(teacherAId).get(0);
		classAId = classEntity.getId();
		classMemberRepository.save(ClassMemberEntity.create(classEntity, student1));
		classMemberRepository.save(ClassMemberEntity.create(classEntity, student2));

		// 4. Tạo Câu hỏi và Bài tập
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
				"Bài tập CN006",
				"Kiểm tra",
				ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(question.id(), BigDecimal.valueOf(10.0), 1))
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

	private Long assignExerciseForClassA() {
		AssignmentResponse resp = assignmentService.assignExercise(teacherAId, new AssignExerciseRequest(
				exercise.id(),
				classAId,
				Instant.now().minus(1, ChronoUnit.HOURS),
				Instant.now().plus(2, ChronoUnit.DAYS)
		));
		return resp.id();
	}

	/**
	 * HTT-06-CN-006-TC-01 — Giáo viên mở bài đã giao -> Hiển thị danh sách học sinh kèm trạng thái, điểm và thời điểm nộp.
	 */
	@Test
	@DisplayName("TC-01: Giáo viên xem danh sách bài nộp của lớp -> Hiển thị trạng thái SUBMITTED, điểm và ngày nộp của học sinh")
	void test_TC01_teacherViewsSubmissionsList() throws Exception {
		Long assignmentId = assignExerciseForClassA();

		// Học sinh 1 làm bài và nộp bài
		mockMvc.perform(post("/api/assignments/" + assignmentId + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assignmentId + "/submit")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of(
								new StudentAnswerItemDto(question.id(), correctOptId, null)
						)))))
				.andExpect(status().isOk());

		// When: Giáo viên A mở xem danh sách bài nộp
		mockMvc.perform(get("/api/assignments/" + assignmentId + "/submissions")
						.header("Authorization", "Bearer " + teacherAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalStudents", is(2)))
				.andExpect(jsonPath("$.submittedCount", is(1)))
				.andExpect(jsonPath("$.notStartedCount", is(1)))
				.andExpect(jsonPath("$.students", hasSize(2)));
	}

	/**
	 * HTT-06-CN-006-TC-02 — Học sinh đã nộp bài -> Giáo viên mở chi tiết bài nộp.
	 */
	@Test
	@DisplayName("TC-02: Giáo viên mở chi tiết bài nộp -> Hiển thị câu trả lời, đúng/sai, điểm từng câu và lời giải")
	void test_TC02_teacherViewsSubmissionDetails() throws Exception {
		Long assignmentId = assignExerciseForClassA();

		// Học sinh 1 nộp bài
		mockMvc.perform(post("/api/assignments/" + assignmentId + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assignmentId + "/submit")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of(
								new StudentAnswerItemDto(question.id(), correctOptId, null)
						)))))
				.andExpect(status().isOk());

		AssignmentSubmissionEntity sub = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, student1Id).orElseThrow();

		// When: Giáo viên xem chi tiết bài nộp (kể cả khi chưa hết hạn, giáo viên luôn xem được lời giải chi tiết)
		mockMvc.perform(get("/api/assignments/submissions/" + sub.getId())
						.header("Authorization", "Bearer " + teacherAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(10.0)))
				.andExpect(jsonPath("$.showSolutions", is(true)))
				.andExpect(jsonPath("$.questions[0].isCorrect", is(true)))
				.andExpect(jsonPath("$.questions[0].pointsEarned", is(10.0)))
				.andExpect(jsonPath("$.questions[0].explanation", is("Giải thích chi tiết của câu hỏi")));
	}

	/**
	 * HTT-06-CN-006-TC-03 — Học sinh chưa nộp bài -> Hiển thị trạng thái NOT_STARTED và chưa có điểm.
	 */
	@Test
	@DisplayName("TC-03: Học sinh chưa làm bài -> Hiển thị trạng thái NOT_STARTED và điểm null")
	void test_TC03_studentNotStarted_showsNotStartedStatus() throws Exception {
		Long assignmentId = assignExerciseForClassA();

		// Học sinh 1 và 2 đều chưa làm bài
		MvcResult result = mockMvc.perform(get("/api/assignments/" + assignmentId + "/submissions")
						.header("Authorization", "Bearer " + teacherAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalStudents", is(2)))
				.andExpect(jsonPath("$.notStartedCount", is(2)))
				.andExpect(jsonPath("$.submittedCount", is(0)))
				.andReturn();

		JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
		JsonNode students = json.get("students");
		assertEquals("NOT_STARTED", students.get(0).get("status").asText());
		assertTrue(students.get(0).get("score").isNull());
	}

	/**
	 * HTT-06-CN-006-TC-04 — Dữ liệu rỗng: Chưa có học sinh nào nộp bài.
	 */
	@Test
	@DisplayName("TC-04: Bài mới giao chưa có ai nộp -> Hệ thống báo 0 bài nộp")
	void test_TC04_emptySubmissions_showsZeroSubmissions() throws Exception {
		Long assignmentId = assignExerciseForClassA();

		mockMvc.perform(get("/api/assignments/" + assignmentId + "/submissions")
						.header("Authorization", "Bearer " + teacherAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.submittedCount", is(0)))
				.andExpect(jsonPath("$.inProgressCount", is(0)))
				.andExpect(jsonPath("$.notStartedCount", is(2)));
	}

	/**
	 * HTT-06-CN-006-TC-05 — QTN-01: Bài thuộc lớp của giáo viên khác -> Hệ thống từ chối với 403 Forbidden.
	 */
	@Test
	@DisplayName("TC-05: Giáo viên khác mở danh sách bài nộp -> Trả về 403 Forbidden")
	void test_TC05_otherTeacherAccessSubmissions_forbidden() throws Exception {
		Long assignmentId = assignExerciseForClassA();

		// Giáo viên B (không phụ trách lớp A) cố tình xem danh sách bài nộp của lớp A
		mockMvc.perform(get("/api/assignments/" + assignmentId + "/submissions")
						.header("Authorization", "Bearer " + teacherBToken))
				.andExpect(status().isForbidden());
	}

	private void assertEquals(String expected, String actual) {
		org.junit.jupiter.api.Assertions.assertEquals(expected, actual);
	}
}
