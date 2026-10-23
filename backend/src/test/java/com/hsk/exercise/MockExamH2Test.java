package com.hsk.exercise;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentStudentOverrideRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.audit.AuditLogRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.domain.ExerciseType;
import com.hsk.exercise.dto.CreateExerciseQuestionItem;
import com.hsk.exercise.dto.CreateMockExamRequest;
import com.hsk.exercise.dto.CreateMockExamSectionItem;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.exercise.repository.ExerciseSectionRepository;
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
 * Kiểm thử toàn diện các ca kiểm thử nghiệp vụ của User Story HTT-09-CN-001 (Tạo đề thi thử HSK).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class MockExamH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String MOCK_EXAMS_URL = "/api/exercises/mock-exams";
	private static final String ASSIGNMENTS_URL = "/api/assignments";

	private static final String TEACHER_EMAIL = "teacher_mockexam@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_mockexam@test.com";
	private static final String STUDENT_EMAIL = "student_mockexam@test.com";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private AuditLogRepository auditLogRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private ClassRepository classRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private HskLevelRepository hskLevelRepository;

	@Autowired
	private QuestionOptionRepository questionOptionRepository;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private QuestionService questionService;

	@Autowired
	private ExerciseRepository exerciseRepository;

	@Autowired
	private ExerciseQuestionRepository exerciseQuestionRepository;

	@Autowired
	private ExerciseSectionRepository exerciseSectionRepository;

	@Autowired
	private AssignmentRepository assignmentRepository;

	@Autowired
	private AssignmentSubmissionRepository assignmentSubmissionRepository;

	@Autowired
	private AssignmentStudentOverrideRepository assignmentStudentOverrideRepository;

	private String teacherToken;
	private String otherTeacherToken;
	private Long teacherId;
	private Long otherTeacherId;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Tạo Teacher 1
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo viên Đề thi", TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		teacherId = teacher.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// Tạo Teacher 2
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo viên khác", OTHER_TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity otherTeacher = userRepository.findByEmailIgnoreCase(OTHER_TEACHER_EMAIL).orElseThrow();
		otherTeacherId = otherTeacher.getId();
		userRoleRepository.save(UserRoleEntity.of(otherTeacher, teacherRole, null));

		// Tạo Student
		registrationService.registerStudent(
				new RegisterStudentRequest("Học sinh Đề thi", STUDENT_EMAIL, PASSWORD, PASSWORD));

		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		otherTeacherToken = loginAndGetToken(OTHER_TEACHER_EMAIL, PASSWORD);
	}

	@AfterEach
	void tearDown() {
		cleanDatabase();
	}

	private void cleanDatabase() {
		questionService.clearUsedInExerciseQuestionIds();
		assignmentStudentOverrideRepository.deleteAll();
		assignmentSubmissionRepository.deleteAll();
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

	private Long createQuestionForTeacher(Long ownerId, String content) {
		QuestionResponse q = questionService.createMultipleChoiceQuestion(ownerId, new CreateQuestionRequest(
				content,
				"Giải thích cho câu hỏi",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("A", true),
						new CreateQuestionOptionRequest("B", false)
				)
		));
		return q.id();
	}

	@Test
	@DisplayName("HTT-09-CN-001-TC-01: Tạo đề thi thử HSK thành công (HSK 1, 2 phần, 60 phút, điểm đạt 60%)")
	void testCreateMockExamSuccess() throws Exception {
		Long q1 = createQuestionForTeacher(teacherId, "Câu 1 phần Nghe");
		Long q2 = createQuestionForTeacher(teacherId, "Câu 2 phần Đọc");

		CreateMockExamRequest request = new CreateMockExamRequest(
				"Đề thi thử HSK 1 - Kỳ thi tháng 10",
				"Đề chuẩn cấu trúc đề thi chính thức gồm 2 phần Nghe và Đọc",
				1, // HSK 1
				60, // 60 phút
				new BigDecimal("6.00"), // Điểm đạt 60% của 10.00
				ExerciseStatus.READY,
				List.of(
						new CreateMockExamSectionItem(
								"Phần 1: Nghe",
								1,
								List.of(new CreateExerciseQuestionItem(q1, new BigDecimal("5.00"), 1))
						),
						new CreateMockExamSectionItem(
								"Phần 2: Đọc",
								2,
								List.of(new CreateExerciseQuestionItem(q2, new BigDecimal("5.00"), 1))
						)
				)
		);

		MvcResult result = mockMvc.perform(post(MOCK_EXAMS_URL)
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.title", is("Đề thi thử HSK 1 - Kỳ thi tháng 10")))
				.andExpect(jsonPath("$.exerciseType", is("MOCK_EXAM")))
				.andExpect(jsonPath("$.hskLevel", is(1)))
				.andExpect(jsonPath("$.timeLimitMinutes", is(60)))
				.andExpect(jsonPath("$.passingScore", is(6.00)))
				.andExpect(jsonPath("$.totalPoints", is(10.00)))
				.andExpect(jsonPath("$.sectionCount", is(2)))
				.andExpect(jsonPath("$.questionCount", is(2)))
				.andExpect(jsonPath("$.status", is("READY")))
				.andReturn();

		JsonNode res = objectMapper.readTree(result.getResponse().getContentAsString());
		Long mockExamId = res.get("id").asLong();

		// Kiểm tra truy vấn chi tiết
		mockMvc.perform(get(MOCK_EXAMS_URL + "/" + mockExamId)
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.sections", hasSize(2)))
				.andExpect(jsonPath("$.sections[0].name", is("Phần 1: Nghe")))
				.andExpect(jsonPath("$.sections[0].questionCount", is(1)))
				.andExpect(jsonPath("$.sections[1].name", is("Phần 2: Đọc")))
				.andExpect(jsonPath("$.sections[1].questionCount", is(1)));
	}

	@Test
	@DisplayName("HTT-09-CN-001-TC-02: Giao đề thi thử cho lớp bằng chức năng giao bài (Assignment)")
	void testAssignMockExamToClass() throws Exception {
		// 1. Tạo câu hỏi & đề thi thử
		Long q1 = createQuestionForTeacher(teacherId, "Câu hỏi nghe 1");
		CreateMockExamRequest request = new CreateMockExamRequest(
				"Đề thi thử HSK 1 Giao Bài",
				"Đề để giao cho lớp",
				1,
				60,
				new BigDecimal("5.00"),
				ExerciseStatus.READY,
				List.of(new CreateMockExamSectionItem("Nghe", 1, List.of(new CreateExerciseQuestionItem(q1, new BigDecimal("10.00"), 1))))
		);

		MvcResult examRes = mockMvc.perform(post(MOCK_EXAMS_URL)
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andReturn();
		Long mockExamId = objectMapper.readTree(examRes.getResponse().getContentAsString()).get("id").asLong();

		// 2. Tạo một lớp học cho giáo viên
		UserEntity teacher = userRepository.findById(teacherId).orElseThrow();
		ClassEntity classroom = ClassEntity.create(teacher, "Lớp Luyện Thi HSK 1", "Mô tả", "EXAM01");
		classRepository.save(classroom);

		// 3. Giao đề thi cho lớp bằng API Assignment
		Instant dueTime = Instant.now().plus(7, ChronoUnit.DAYS);
		AssignExerciseRequest assignReq = new AssignExerciseRequest(
				mockExamId,
				classroom.getId(),
				Instant.now(),
				dueTime
		);

		mockMvc.perform(post(ASSIGNMENTS_URL)
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(assignReq)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.exerciseId").value(mockExamId))
				.andExpect(jsonPath("$.totalPoints").value(10.00));
	}

	@Test
	@DisplayName("HTT-09-CN-001-TC-03: Bỏ trống thời gian làm bài hoặc cấp độ HSK -> Báo lỗi HTTP 400 và không lưu")
	void testMissingRequiredData() throws Exception {
		Long q1 = createQuestionForTeacher(teacherId, "Câu hỏi 1");

		// Thiếu cấp độ HSK
		CreateMockExamRequest noHskLevel = new CreateMockExamRequest(
				"Đề thiếu cấp độ",
				"Mô tả",
				null,
				60,
				new BigDecimal("5.00"),
				ExerciseStatus.DRAFT,
				List.of(new CreateMockExamSectionItem("Phần 1", 1, List.of(new CreateExerciseQuestionItem(q1, BigDecimal.TEN, 1))))
		);
		mockMvc.perform(post(MOCK_EXAMS_URL)
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(noHskLevel)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.MOCK_EXAM_HSK_LEVEL_REQUIRED.name())));

		// Thiếu thời gian làm bài
		CreateMockExamRequest noTimeLimit = new CreateMockExamRequest(
				"Đề thiếu thời gian",
				"Mô tả",
				1,
				null,
				new BigDecimal("5.00"),
				ExerciseStatus.DRAFT,
				List.of(new CreateMockExamSectionItem("Phần 1", 1, List.of(new CreateExerciseQuestionItem(q1, BigDecimal.TEN, 1))))
		);
		mockMvc.perform(post(MOCK_EXAMS_URL)
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(noTimeLimit)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.MOCK_EXAM_TIME_LIMIT_REQUIRED.name())));
	}

	@Test
	@DisplayName("HTT-09-CN-001-TC-04: Thời gian <= 0 hoặc điểm đạt > tổng điểm -> Báo lỗi HTTP 400 và không lưu")
	void testInvalidDataValues() throws Exception {
		Long q1 = createQuestionForTeacher(teacherId, "Câu hỏi 1");

		// Thời gian làm bài âm (-5 phút)
		CreateMockExamRequest negativeTime = new CreateMockExamRequest(
				"Đề thời gian âm",
				"Mô tả",
				1,
				-5,
				new BigDecimal("5.00"),
				ExerciseStatus.DRAFT,
				List.of(new CreateMockExamSectionItem("Phần 1", 1, List.of(new CreateExerciseQuestionItem(q1, BigDecimal.TEN, 1))))
		);
		mockMvc.perform(post(MOCK_EXAMS_URL)
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(negativeTime)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.MOCK_EXAM_TIME_LIMIT_INVALID.name())));

		// Điểm đạt lớn hơn tổng điểm (12/10)
		CreateMockExamRequest scoreTooHigh = new CreateMockExamRequest(
				"Đề điểm đạt quá cao",
				"Mô tả",
				1,
				60,
				new BigDecimal("12.00"), // Tổng điểm câu hỏi là 10.00
				ExerciseStatus.DRAFT,
				List.of(new CreateMockExamSectionItem("Phần 1", 1, List.of(new CreateExerciseQuestionItem(q1, BigDecimal.TEN, 1))))
		);
		mockMvc.perform(post(MOCK_EXAMS_URL)
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(scoreTooHigh)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.MOCK_EXAM_PASSING_SCORE_INVALID.name())));
	}

	@Test
	@DisplayName("HTT-09-CN-001-TC-05: Phần thi chưa có câu hỏi nào -> Chặn chuyển READY, chỉ cho lưu DRAFT")
	void testEmptySectionBlocksReadyStatus() throws Exception {
		Long q1 = createQuestionForTeacher(teacherId, "Câu hỏi nghe 1");

		// 1. Thử lưu READY khi Phần Đọc có 0 câu hỏi -> Bị chặn
		CreateMockExamRequest readyWithEmptySection = new CreateMockExamRequest(
				"Đề có phần thi trống",
				"Mô tả",
				1,
				60,
				new BigDecimal("5.00"),
				ExerciseStatus.READY,
				List.of(
						new CreateMockExamSectionItem("Phần Nghe", 1, List.of(new CreateExerciseQuestionItem(q1, BigDecimal.TEN, 1))),
						new CreateMockExamSectionItem("Phần Đọc", 2, List.of()) // 0 câu hỏi
				)
		);

		mockMvc.perform(post(MOCK_EXAMS_URL)
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(readyWithEmptySection)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.MOCK_EXAM_SECTION_EMPTY_QUESTIONS.name())));

		// 2. Thử lưu dạng DRAFT với cùng nội dung trên -> Cho phép lưu thành công
		CreateMockExamRequest draftWithEmptySection = new CreateMockExamRequest(
				"Đề có phần thi trống lưu nháp",
				"Mô tả",
				1,
				60,
				new BigDecimal("5.00"),
				ExerciseStatus.DRAFT,
				List.of(
						new CreateMockExamSectionItem("Phần Nghe", 1, List.of(new CreateExerciseQuestionItem(q1, BigDecimal.TEN, 1))),
						new CreateMockExamSectionItem("Phần Đọc", 2, List.of())
				)
		);

		mockMvc.perform(post(MOCK_EXAMS_URL)
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(draftWithEmptySection)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.status", is("DRAFT")))
				.andExpect(jsonPath("$.sectionCount", is(2)));
	}

	@Test
	@DisplayName("HTT-09-CN-001-TC-06: Đưa câu hỏi của giáo viên khác vào đề -> Bị từ chối HTTP 403 (QTN-19)")
	void testAccessDeniedForOtherTeacherQuestion() throws Exception {
		// Teacher 2 tạo câu hỏi
		Long otherQ = createQuestionForTeacher(otherTeacherId, "Câu hỏi bí mật của GV 2");

		// Teacher 1 cố tình đưa câu hỏi của Teacher 2 vào đề thi thử của mình
		CreateMockExamRequest attackRequest = new CreateMockExamRequest(
				"Đề thi gian lận câu hỏi",
				"Mô tả",
				1,
				60,
				new BigDecimal("5.00"),
				ExerciseStatus.DRAFT,
				List.of(new CreateMockExamSectionItem("Phần 1", 1, List.of(new CreateExerciseQuestionItem(otherQ, BigDecimal.TEN, 1))))
		);

		mockMvc.perform(post(MOCK_EXAMS_URL)
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(attackRequest)))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.ACCESS_DENIED_QUESTION.name())));
	}
}
