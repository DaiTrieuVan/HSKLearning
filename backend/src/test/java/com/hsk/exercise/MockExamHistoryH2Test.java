package com.hsk.exercise;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
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
import com.hsk.assignment.domain.AssignmentStatus;
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentStudentOverrideRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.assignment.service.AssignmentService;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.audit.AuditLogRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.domain.ExerciseType;
import com.hsk.exercise.dto.CreateExerciseQuestionItem;
import com.hsk.exercise.dto.CreateMockExamRequest;
import com.hsk.exercise.dto.CreateMockExamSectionItem;
import com.hsk.exercise.dto.MockExamResponse;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.exercise.repository.ExerciseSectionRepository;
import com.hsk.exercise.service.ExerciseService;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
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
 * Bộ kiểm thử tự động toàn diện cho User Story HTT-09-CN-004:
 * Xem lịch sử các đề thi thử đã làm (TC-01, TC-02, TC-03 & QTN-02).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class MockExamHistoryH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String MOCK_EXAM_HISTORY_URL = "/api/exercises/mock-exams/history";

	private static final String TEACHER_EMAIL = "teacher_mock_history@test.com";
	private static final String STUDENT_A_EMAIL = "student_a_history@test.com";
	private static final String STUDENT_B_EMAIL = "student_b_history@test.com";
	private static final String PASSWORD = "Password123@";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private QuestionOptionRepository questionOptionRepository;

	@Autowired
	private QuestionService questionService;

	@Autowired
	private ExerciseRepository exerciseRepository;

	@Autowired
	private ExerciseQuestionRepository exerciseQuestionRepository;

	@Autowired
	private ExerciseSectionRepository exerciseSectionRepository;

	@Autowired
	private ExerciseService exerciseService;

	@Autowired
	private ClassRepository classRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private AssignmentRepository assignmentRepository;

	@Autowired
	private AssignmentSubmissionRepository submissionRepository;

	@Autowired
	private AssignmentStudentOverrideRepository overrideRepository;

	@Autowired
	private AssignmentService assignmentService;

	@Autowired
	private AuditLogRepository auditLogRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private LessonRepository lessonRepository;

	@Autowired
	private LessonVocabularyRepository lessonVocabularyRepository;

	@Autowired
	private HskLevelRepository hskLevelRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	private Long teacherId;
	private Long studentAId;
	private Long studentBId;
	private String studentAToken;
	private String studentBToken;

	private ClassEntity activeClass;
	private Long questionId;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Giáo viên
		registrationService.registerStudent(new RegisterStudentRequest("Thầy Giáo Lịch Sử", TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		teacherId = teacher.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// 2. Tạo Học sinh A
		registrationService.registerStudent(new RegisterStudentRequest("Học sinh A", STUDENT_A_EMAIL, PASSWORD, PASSWORD));
		UserEntity studentA = userRepository.findByEmailIgnoreCase(STUDENT_A_EMAIL).orElseThrow();
		studentAId = studentA.getId();

		// 3. Tạo Học sinh B
		registrationService.registerStudent(new RegisterStudentRequest("Học sinh B", STUDENT_B_EMAIL, PASSWORD, PASSWORD));
		UserEntity studentB = userRepository.findByEmailIgnoreCase(STUDENT_B_EMAIL).orElseThrow();
		studentBId = studentB.getId();

		studentAToken = loginAndGetToken(STUDENT_A_EMAIL, PASSWORD);
		studentBToken = loginAndGetToken(STUDENT_B_EMAIL, PASSWORD);

		// 4. Tạo Lớp học & thêm cả hai học sinh vào lớp
		activeClass = ClassEntity.create(teacher, "Lớp Luyện Thi HSK Lịch Sử", "Lớp thi thử", "HIST01");
		classRepository.save(activeClass);
		classMemberRepository.save(ClassMemberEntity.create(activeClass, studentA));
		classMemberRepository.save(ClassMemberEntity.create(activeClass, studentB));

		// 5. Tạo Câu hỏi trắc nghiệm
		QuestionResponse q = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu 1: 谢谢 có nghĩa là gì?",
				"Từ cảm ơn",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Cảm ơn", true),
						new CreateQuestionOptionRequest("Xin chào", false)
				)
		));
		questionId = q.id();
	}

	@AfterEach
	void tearDown() {
		cleanDatabase();
	}

	private void cleanDatabase() {
		questionService.clearUsedInExerciseQuestionIds();
		overrideRepository.deleteAll();
		submissionRepository.deleteAll();
		assignmentRepository.deleteAll();
		exerciseQuestionRepository.deleteAll();
		exerciseSectionRepository.deleteAll();
		exerciseRepository.deleteAll();
		questionOptionRepository.deleteAll();
		questionRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classMemberRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		lessonVocabularyRepository.deleteAll();
		lessonRepository.deleteAll();
		vocabularyRepository.deleteAll();
		hskLevelRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		auditLogRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		String json = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(json))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.get("token").asText();
	}

	/**
	 * Helper tạo đề thi thử và giao cho lớp học.
	 */
	private AssignmentEntity createAndAssignMockExam(String title, int hskLevel, int timeLimit, BigDecimal passingScore, BigDecimal totalPoints) {
		MockExamResponse exam = exerciseService.createMockExam(teacherId, new CreateMockExamRequest(
				title,
				"Mô tả đề thi " + title,
				hskLevel,
				timeLimit,
				passingScore,
				ExerciseStatus.READY,
				List.of(
						new CreateMockExamSectionItem(
								"Phần thi chính",
								1,
								List.of(new CreateExerciseQuestionItem(questionId, totalPoints, 1))
						)
				)
		));

		AssignmentResponse assigned = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exam.id(),
				activeClass.getId(),
				Instant.now().minus(1, ChronoUnit.HOURS),
				Instant.now().plus(7, ChronoUnit.DAYS)
		));

		return assignmentRepository.findById(assigned.id()).orElseThrow();
	}

	/**
	 * Helper tạo bài nộp cho học sinh.
	 */
	private AssignmentSubmissionEntity createSubmission(AssignmentEntity assignment, UserEntity student,
	                                                   SubmissionStatus status, BigDecimal score, BigDecimal adjustedScore,
	                                                   Instant startedAt, Instant submittedAt) {
		AssignmentSubmissionEntity sub = AssignmentSubmissionEntity.createInitial(assignment, student);
		sub.setStatus(status);
		sub.setScore(score);
		sub.setAdjustedScore(adjustedScore);
		sub.setStartedAt(startedAt);
		sub.setSubmittedAt(submittedAt);
		return submissionRepository.save(sub);
	}

	@Test
	@DisplayName("HTT-09-CN-004-TC-01: Luồng thành công - Lấy đầy đủ 3 đề thi thử kèm điểm số, ngày làm và trạng thái Đạt/Chưa đạt")
	void testMockExamHistory_SuccessWithMultipleExams() throws Exception {
		// Given: Học sinh A đã hoàn thành 3 đề thi thử:
		// Đề 1: PassingScore = 6.00, Score = 8.50 -> ĐẠT (isPassed = true)
		AssignmentEntity assign1 = createAndAssignMockExam("Đề thi thử HSK 1 - Chuẩn", 1, 60, new BigDecimal("6.00"), new BigDecimal("10.00"));
		Instant now = Instant.now();
		UserEntity studentA = userRepository.findById(studentAId).orElseThrow();
		createSubmission(assign1, studentA, SubmissionStatus.SUBMITTED, new BigDecimal("8.50"), null, now.minus(50, ChronoUnit.MINUTES), now.minus(10, ChronoUnit.MINUTES));

		// Đề 2: PassingScore = 7.00, Score = 4.00 -> CHƯA ĐẠT (isPassed = false)
		AssignmentEntity assign2 = createAndAssignMockExam("Đề thi thử HSK 2 - Chuyên sâu", 2, 90, new BigDecimal("7.00"), new BigDecimal("10.00"));
		createSubmission(assign2, studentA, SubmissionStatus.SUBMITTED, new BigDecimal("4.00"), null, now.minus(2, ChronoUnit.DAYS), now.minus(2, ChronoUnit.DAYS).plus(70, ChronoUnit.MINUTES));

		// Đề 3: PassingScore = null (chuẩn >= 60%), Score = 9.00 / 10.00 = 90% -> ĐẠT (isPassed = true)
		AssignmentEntity assign3 = createAndAssignMockExam("Đề thi thử HSK 3 - Cấp tốc", 3, 100, null, new BigDecimal("10.00"));
		createSubmission(assign3, studentA, SubmissionStatus.AUTO_SUBMITTED, new BigDecimal("9.00"), null, now.minus(5, ChronoUnit.DAYS), now.minus(5, ChronoUnit.DAYS).plus(80, ChronoUnit.MINUTES));

		// Một bài nộp đang làm dở (IN_PROGRESS) -> KHÔNG được xuất hiện trong lịch sử
		AssignmentEntity assign4 = createAndAssignMockExam("Đề thi thử HSK 4 - Đang làm", 4, 100, new BigDecimal("6.00"), new BigDecimal("10.00"));
		createSubmission(assign4, studentA, SubmissionStatus.IN_PROGRESS, null, null, now.minus(10, ChronoUnit.MINUTES), null);

		// When: Học sinh A gọi API lấy lịch sử đề thi thử
		MvcResult result = mockMvc.perform(get(MOCK_EXAM_HISTORY_URL)
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalExamsTaken", is(3)))
				.andExpect(jsonPath("$.totalPassed", is(2)))
				.andExpect(jsonPath("$.averageScore", notNullValue()))
				.andExpect(jsonPath("$.items", hasSize(3)))
				// Kiểm tra item đầu tiên (mới nhất: Đề 1)
				.andExpect(jsonPath("$.items[0].title", is("Đề thi thử HSK 1 - Chuẩn")))
				.andExpect(jsonPath("$.items[0].hskLevel", is(1)))
				.andExpect(jsonPath("$.items[0].effectiveScore", is(8.50)))
				.andExpect(jsonPath("$.items[0].maxScore", is(10.00)))
				.andExpect(jsonPath("$.items[0].percentage", is(85)))
				.andExpect(jsonPath("$.items[0].passingScore", is(6.00)))
				.andExpect(jsonPath("$.items[0].isPassed", is(true)))
				.andExpect(jsonPath("$.items[0].className", is("Lớp Luyện Thi HSK Lịch Sử")))
				.andExpect(jsonPath("$.items[0].timeSpentSeconds", notNullValue()))
				// Kiểm tra item thứ hai (Đề 2 - Chưa đạt)
				.andExpect(jsonPath("$.items[1].title", is("Đề thi thử HSK 2 - Chuyên sâu")))
				.andExpect(jsonPath("$.items[1].effectiveScore", is(4.00)))
				.andExpect(jsonPath("$.items[1].isPassed", is(false)))
				// Kiểm tra item thứ ba (Đề 3 - Đạt theo tỷ lệ >= 60%)
				.andExpect(jsonPath("$.items[2].title", is("Đề thi thử HSK 3 - Cấp tốc")))
				.andExpect(jsonPath("$.items[2].effectiveScore", is(9.00)))
				.andExpect(jsonPath("$.items[2].isPassed", is(true)))
				.andReturn();

		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		// Điểm trung bình: (8.50 + 4.00 + 9.00) / 3 = 21.50 / 3 = 7.17
		assertEquals(7.17, root.get("averageScore").asDouble(), 0.01);
	}

	@Test
	@DisplayName("HTT-09-CN-004-TC-02: Dữ liệu rỗng - Học sinh chưa làm đề nào thì trả về mảng rỗng")
	void testMockExamHistory_EmptyWhenNoExamsTaken() throws Exception {
		// Given: Học sinh B chưa từng làm bất kỳ đề thi nào
		// When: Học sinh B gọi API lấy lịch sử đề thi
		mockMvc.perform(get(MOCK_EXAM_HISTORY_URL)
						.header("Authorization", "Bearer " + studentBToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalExamsTaken", is(0)))
				.andExpect(jsonPath("$.totalPassed", is(0)))
				.andExpect(jsonPath("$.averageScore", is(0)))
				.andExpect(jsonPath("$.items", hasSize(0)));
	}

	@Test
	@DisplayName("HTT-09-CN-004-TC-03: QTN-02 - Học sinh A chỉ thấy bài của chính mình, không thấy bài của Học sinh B")
	void testMockExamHistory_StudentOnlySeesOwnExams_QTN02() throws Exception {
		UserEntity studentA = userRepository.findById(studentAId).orElseThrow();
		UserEntity studentB = userRepository.findById(studentBId).orElseThrow();
		Instant now = Instant.now();

		// Given: Học sinh A làm Đề A, Học sinh B làm Đề B
		AssignmentEntity assignA = createAndAssignMockExam("Đề Thi Của Riêng Học Sinh A", 1, 60, new BigDecimal("6.00"), new BigDecimal("10.00"));
		createSubmission(assignA, studentA, SubmissionStatus.SUBMITTED, new BigDecimal("8.00"), null, now.minus(30, ChronoUnit.MINUTES), now);

		AssignmentEntity assignB = createAndAssignMockExam("Đề Thi Của Riêng Học Sinh B", 2, 60, new BigDecimal("6.00"), new BigDecimal("10.00"));
		createSubmission(assignB, studentB, SubmissionStatus.SUBMITTED, new BigDecimal("9.50"), null, now.minus(30, ChronoUnit.MINUTES), now);

		// When Học sinh A gọi API:
		mockMvc.perform(get(MOCK_EXAM_HISTORY_URL)
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalExamsTaken", is(1)))
				.andExpect(jsonPath("$.items", hasSize(1)))
				.andExpect(jsonPath("$.items[0].title", is("Đề Thi Của Riêng Học Sinh A")))
				.andExpect(jsonPath("$.items[0].effectiveScore", is(8.00)));

		// When Học sinh B gọi API:
		mockMvc.perform(get(MOCK_EXAM_HISTORY_URL)
						.header("Authorization", "Bearer " + studentBToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalExamsTaken", is(1)))
				.andExpect(jsonPath("$.items", hasSize(1)))
				.andExpect(jsonPath("$.items[0].title", is("Đề Thi Của Riêng Học Sinh B")))
				.andExpect(jsonPath("$.items[0].effectiveScore", is(9.50)));
	}

	@Test
	@DisplayName("Bảo mật - Chặn 401 khi không có JWT Token")
	void testMockExamHistory_UnauthorizedWhenNoToken() throws Exception {
		mockMvc.perform(get(MOCK_EXAM_HISTORY_URL))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@DisplayName("Ưu tiên điểm đã điều chỉnh (adjustedScore) khi tính toán hiệu lực và kết quả Đạt")
	void testMockExamHistory_UsesAdjustedScoreWhenPresent() throws Exception {
		UserEntity studentA = userRepository.findById(studentAId).orElseThrow();
		Instant now = Instant.now();

		// Điểm gốc 5.00 (< passingScore 6.00), nhưng được giáo viên cộng lên 7.00 -> Trở thành ĐẠT
		AssignmentEntity assign = createAndAssignMockExam("Đề thi thử được phúc khảo điểm", 1, 60, new BigDecimal("6.00"), new BigDecimal("10.00"));
		createSubmission(assign, studentA, SubmissionStatus.SUBMITTED, new BigDecimal("5.00"), new BigDecimal("7.00"), now.minus(60, ChronoUnit.MINUTES), now);

		mockMvc.perform(get(MOCK_EXAM_HISTORY_URL)
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalExamsTaken", is(1)))
				.andExpect(jsonPath("$.totalPassed", is(1)))
				.andExpect(jsonPath("$.items[0].score", is(5.00)))
				.andExpect(jsonPath("$.items[0].adjustedScore", is(7.00)))
				.andExpect(jsonPath("$.items[0].effectiveScore", is(7.00)))
				.andExpect(jsonPath("$.items[0].percentage", is(70)))
				.andExpect(jsonPath("$.items[0].isPassed", is(true)));
	}
}
