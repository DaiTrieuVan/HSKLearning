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
import com.hsk.exercise.dto.CopyExerciseRequest;
import com.hsk.exercise.dto.CreateExerciseQuestionItem;
import com.hsk.exercise.dto.CreateExerciseRequest;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.QuestionResponse;
import com.hsk.question.repository.QuestionOptionRepository;
import com.hsk.question.repository.QuestionRepository;
import com.hsk.question.service.QuestionService;
import java.math.BigDecimal;
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

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ExerciseH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String EXERCISES_URL = "/api/exercises";
	private static final String TEACHER_EMAIL = "teacher_exercise@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_exercise@test.com";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

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

	private String teacherToken;
	private String otherTeacherToken;
	private Long teacherId;
	private Long otherTeacherId;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Teacher 1
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo viên Bài tập", TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		teacherId = teacher.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// 2. Tạo Teacher 2
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo viên khác", OTHER_TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity otherTeacher = userRepository.findByEmailIgnoreCase(OTHER_TEACHER_EMAIL).orElseThrow();
		otherTeacherId = otherTeacher.getId();
		userRoleRepository.save(UserRoleEntity.of(otherTeacher, teacherRole, null));

		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		otherTeacherToken = loginAndGetToken(OTHER_TEACHER_EMAIL, PASSWORD);
	}

	@AfterEach
	void tearDown() {
		cleanDatabase();
	}

	private void cleanDatabase() {
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
		auditLogRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String pwd) throws Exception {
		String body = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, pwd);
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content(body))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.get("token").asText();
	}

	private QuestionResponse createSampleQuestion(Long ownerId, String content) {
		return questionService.createMultipleChoiceQuestion(ownerId, new CreateQuestionRequest(
				content,
				"Giải thích mẫu",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Đáp án đúng", true),
						new CreateQuestionOptionRequest("Đáp án sai", false)
				)
		));
	}

	@Test
	@DisplayName("HTT-05-CN-006-TC-01: Tạo bài tập thành công (4 câu, mỗi câu 2 điểm, tổng 8 điểm)")
	void test_TC01_createExerciseSuccess() throws Exception {
		QuestionResponse q1 = createSampleQuestion(teacherId, "Câu hỏi số 1");
		QuestionResponse q2 = createSampleQuestion(teacherId, "Câu hỏi số 2");
		QuestionResponse q3 = createSampleQuestion(teacherId, "Câu hỏi số 3");
		QuestionResponse q4 = createSampleQuestion(teacherId, "Câu hỏi số 4");

		CreateExerciseRequest request = new CreateExerciseRequest(
				"Bài kiểm tra 15 phút ngữ pháp HSK 1",
				"Bài tập tự luyện đầu giờ",
				ExerciseStatus.DRAFT,
				List.of(
						new CreateExerciseQuestionItem(q1.id(), new BigDecimal("2.0"), 1),
						new CreateExerciseQuestionItem(q2.id(), new BigDecimal("2.0"), 2),
						new CreateExerciseQuestionItem(q3.id(), new BigDecimal("2.0"), 3),
						new CreateExerciseQuestionItem(q4.id(), new BigDecimal("2.0"), 4)
				)
		);

		mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.title", is("Bài kiểm tra 15 phút ngữ pháp HSK 1")))
				.andExpect(jsonPath("$.status", is("DRAFT")))
				.andExpect(jsonPath("$.totalPoints", is(8.0)))
				.andExpect(jsonPath("$.questionCount", is(4)))
				.andExpect(jsonPath("$.questions", hasSize(4)))
				.andExpect(jsonPath("$.questions[0].points", is(2.0)));
	}

	@Test
	@DisplayName("HTT-05-CN-006-TC-02: Đổi thứ tự câu hoặc bỏ bớt câu rồi lưu theo danh sách mới")
	void test_TC02_reorderAndRemoveQuestionsSuccess() throws Exception {
		QuestionResponse q1 = createSampleQuestion(teacherId, "Câu 1");
		QuestionResponse q2 = createSampleQuestion(teacherId, "Câu 2");
		QuestionResponse q3 = createSampleQuestion(teacherId, "Câu 3");

		// Đổi chỗ: câu 3 lên đầu (sortOrder=1), câu 1 xuống sau (sortOrder=2), bỏ câu 2
		CreateExerciseRequest request = new CreateExerciseRequest(
				"Bài tập đã đổi thứ tự",
				null,
				ExerciseStatus.READY,
				List.of(
						new CreateExerciseQuestionItem(q3.id(), new BigDecimal("5.0"), 1),
						new CreateExerciseQuestionItem(q1.id(), new BigDecimal("5.0"), 2)
				)
		);

		MvcResult result = mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.totalPoints", is(10.0)))
				.andExpect(jsonPath("$.questionCount", is(2)))
				.andExpect(jsonPath("$.questions[0].questionId", is(q3.id().intValue())))
				.andExpect(jsonPath("$.questions[0].sortOrder", is(1)))
				.andExpect(jsonPath("$.questions[1].questionId", is(q1.id().intValue())))
				.andExpect(jsonPath("$.questions[1].sortOrder", is(2)))
				.andReturn();

		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		Long exerciseId = root.get("id").asLong();

		// Kiểm tra trong DB
		ExerciseEntity entity = exerciseRepository.findWithQuestionsById(exerciseId).orElseThrow();
		assertEquals(2, entity.getQuestions().size());
		assertEquals(q3.id(), entity.getQuestions().get(0).getQuestion().getId());
		assertEquals(q1.id(), entity.getQuestions().get(1).getQuestion().getId());
	}

	@Test
	@DisplayName("HTT-05-CN-006-TC-03: Bỏ trống tên bài tập -> Báo lỗi EXERCISE_TITLE_BLANK (HTTP 400)")
	void test_TC03_emptyTitleValidation() throws Exception {
		QuestionResponse q1 = createSampleQuestion(teacherId, "Câu hỏi 1");

		CreateExerciseRequest request = new CreateExerciseRequest(
				"   ", // Tên bài rỗng
				"Mô tả",
				ExerciseStatus.DRAFT,
				List.of(new CreateExerciseQuestionItem(q1.id(), new BigDecimal("5.0"), 1))
		);

		mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("HTT-05-CN-006-TC-04: Điểm câu bằng 0 hoặc âm -> Báo lỗi EXERCISE_QUESTION_POINTS_INVALID (HTTP 400)")
	void test_TC04_invalidPointsValidation() throws Exception {
		QuestionResponse q1 = createSampleQuestion(teacherId, "Câu hỏi 1");

		// Điểm = 0
		CreateExerciseRequest zeroPointReq = new CreateExerciseRequest(
				"Bài tập điểm 0",
				null,
				ExerciseStatus.DRAFT,
				List.of(new CreateExerciseQuestionItem(q1.id(), BigDecimal.ZERO, 1))
		);

		mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(zeroPointReq)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.EXERCISE_QUESTION_POINTS_INVALID.name())));

		// Điểm âm (-2.0)
		CreateExerciseRequest negativePointReq = new CreateExerciseRequest(
				"Bài tập điểm âm",
				null,
				ExerciseStatus.DRAFT,
				List.of(new CreateExerciseQuestionItem(q1.id(), new BigDecimal("-2.0"), 1))
		);

		mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(negativePointReq)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.EXERCISE_QUESTION_POINTS_INVALID.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-006-TC-05: Bài 0 câu chuyển READY bị chặn (QTN-09), nhưng cho phép lưu DRAFT")
	void test_TC05_zeroQuestionsReadyForbiddenButDraftAllowed() throws Exception {
		// 1. Thử lưu READY khi chưa có câu hỏi -> Chặn HTTP 400
		CreateExerciseRequest readyReq = new CreateExerciseRequest(
				"Bài tập chuẩn bị giao",
				"Chưa có câu hỏi nào",
				ExerciseStatus.READY,
				List.of()
		);

		mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(readyReq)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.EXERCISE_READY_REQUIRES_QUESTIONS.name())));

		// 2. Lưu DRAFT khi chưa có câu hỏi -> Thành công HTTP 201
		CreateExerciseRequest draftReq = new CreateExerciseRequest(
				"Bài tập nháp ban đầu",
				"Tạo khung bài tập trước",
				ExerciseStatus.DRAFT,
				List.of()
		);

		mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(draftReq)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.status", is("DRAFT")))
				.andExpect(jsonPath("$.questionCount", is(0)))
				.andExpect(jsonPath("$.totalPoints").value(0));
	}

	@Test
	@DisplayName("HTT-05-CN-006-TC-06: Chọn trùng câu hỏi hai lần -> Báo lỗi EXERCISE_DUPLICATE_QUESTIONS (HTTP 400)")
	void test_TC06_duplicateQuestionsValidation() throws Exception {
		QuestionResponse q1 = createSampleQuestion(teacherId, "Câu hỏi độc nhất");

		CreateExerciseRequest request = new CreateExerciseRequest(
				"Bài tập cố tình chọn trùng",
				null,
				ExerciseStatus.DRAFT,
				List.of(
						new CreateExerciseQuestionItem(q1.id(), new BigDecimal("2.0"), 1),
						new CreateExerciseQuestionItem(q1.id(), new BigDecimal("3.0"), 2) // trùng q1.id()
				)
		);

		mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.EXERCISE_DUPLICATE_QUESTIONS.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-006-TC-07: Chọn câu hỏi thuộc giáo viên khác -> Bị từ chối ACCESS_DENIED_QUESTION (HTTP 403, QTN-19)")
	void test_TC07_questionOfOtherTeacherForbidden() throws Exception {
		// Teacher 2 tạo câu hỏi
		QuestionResponse otherQ = createSampleQuestion(otherTeacherId, "Câu hỏi bí mật của Giáo viên khác");

		// Teacher 1 cố tình đưa câu hỏi của Teacher 2 vào bài tập của mình
		CreateExerciseRequest request = new CreateExerciseRequest(
				"Bài tập của Teacher 1 nhưng mượn câu của Teacher 2",
				null,
				ExerciseStatus.DRAFT,
				List.of(new CreateExerciseQuestionItem(otherQ.id(), new BigDecimal("5.0"), 1))
		);

		mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.ACCESS_DENIED_QUESTION.name())));
	}

	// =========================================================================
	// HTT-05-CN-007: Sao chép bài tập
	// =========================================================================

	@Test
	@DisplayName("HTT-05-CN-007-TC-01: Sao chép bài tập thành công -> Tạo bản sao DRAFT, đủ câu hỏi & điểm, bài gốc không đổi")
	void test_CN007_TC01_copyExercise_success() throws Exception {
		QuestionResponse q1 = createSampleQuestion(teacherId, "Câu 1 của bài gốc");
		QuestionResponse q2 = createSampleQuestion(teacherId, "Câu 2 của bài gốc");

		// Tạo bài tập gốc READY
		CreateExerciseRequest createReq = new CreateExerciseRequest(
				"Kiểm tra bài 1",
				"Mô tả bài kiểm tra 1",
				ExerciseStatus.READY,
				List.of(
						new CreateExerciseQuestionItem(q1.id(), new BigDecimal("2.5"), 1),
						new CreateExerciseQuestionItem(q2.id(), new BigDecimal("2.5"), 2)
				)
		);
		MvcResult createResult = mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(createReq)))
				.andExpect(status().isCreated())
				.andReturn();
		JsonNode createdNode = objectMapper.readTree(createResult.getResponse().getContentAsString());
		long sourceId = createdNode.get("id").asLong();

		// Gọi API sao chép
		MvcResult copyResult = mockMvc.perform(post(EXERCISES_URL + "/" + sourceId + "/copy")
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.title", is("Kiểm tra bài 1 (Bản sao)")))
				.andExpect(jsonPath("$.status", is("DRAFT")))
				.andExpect(jsonPath("$.totalPoints").value(5.0))
				.andExpect(jsonPath("$.questionCount", is(2)))
				.andExpect(jsonPath("$.questions", hasSize(2)))
				.andReturn();

		JsonNode copyNode = objectMapper.readTree(copyResult.getResponse().getContentAsString());
		long copyId = copyNode.get("id").asLong();
		assertNotNull(copyId);
		org.junit.jupiter.api.Assertions.assertNotEquals(sourceId, copyId);

		// Kiểm tra bài gốc hoàn toàn không bị thay đổi
		mockMvc.perform(get(EXERCISES_URL + "/" + sourceId)
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.title", is("Kiểm tra bài 1")))
				.andExpect(jsonPath("$.status", is("READY")))
				.andExpect(jsonPath("$.totalPoints").value(5.0));
	}

	@Test
	@DisplayName("HTT-05-CN-007-TC-02: Bản sao tùy chọn newTitle và tính độc lập của bản sao")
	void test_CN007_TC02_copyExercise_withCustomTitle() throws Exception {
		QuestionResponse q1 = createSampleQuestion(teacherId, "Câu 1");

		CreateExerciseRequest createReq = new CreateExerciseRequest(
				"Đề thi Giữa kỳ",
				"Mô tả giữa kỳ",
				ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(q1.id(), new BigDecimal("10.0"), 1))
		);
		MvcResult createResult = mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(createReq)))
				.andExpect(status().isCreated())
				.andReturn();
		long sourceId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

		// Sao chép với tiêu đề tùy chỉnh
		CopyExerciseRequest copyReq = new CopyExerciseRequest("Đề thi Giữa kỳ (Lớp HSK3-B)");
		mockMvc.perform(post(EXERCISES_URL + "/" + sourceId + "/copy")
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(copyReq)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.title", is("Đề thi Giữa kỳ (Lớp HSK3-B)")))
				.andExpect(jsonPath("$.status", is("DRAFT")))
				.andExpect(jsonPath("$.totalPoints").value(10.0));
	}

	@Test
	@DisplayName("HTT-05-CN-007-TC-03: Sao chép bài tập gốc ở trạng thái READY luôn sinh bản sao ở trạng thái DRAFT")
	void test_CN007_TC03_copyExercise_alwaysDraftStatus() throws Exception {
		QuestionResponse q1 = createSampleQuestion(teacherId, "Câu 1");

		CreateExerciseRequest createReq = new CreateExerciseRequest(
				"Bài tập đã giao",
				"Đã giao cho lớp",
				ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(q1.id(), new BigDecimal("5.0"), 1))
		);
		MvcResult createResult = mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(createReq)))
				.andExpect(status().isCreated())
				.andReturn();
		long sourceId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

		mockMvc.perform(post(EXERCISES_URL + "/" + sourceId + "/copy")
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.status", is("DRAFT")));
	}

	@Test
	@DisplayName("HTT-05-CN-007-TC-04: Thử sao chép bài tập của giáo viên khác -> Báo lỗi ACCESS_DENIED_EXERCISE (HTTP 403, QTN-19)")
	void test_CN007_TC04_copyExercise_ofOtherTeacher_forbidden() throws Exception {
		// Giáo viên khác tạo câu hỏi và bài tập
		QuestionResponse otherQ = createSampleQuestion(otherTeacherId, "Câu của giáo viên khác");
		CreateExerciseRequest createReq = new CreateExerciseRequest(
				"Bài tập riêng của GV khác",
				"Tuyệt mật",
				ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(otherQ.id(), new BigDecimal("10.0"), 1))
		);
		MvcResult createResult = mockMvc.perform(post(EXERCISES_URL)
				.header("Authorization", "Bearer " + otherTeacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(createReq)))
				.andExpect(status().isCreated())
				.andReturn();
		long otherExerciseId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

		// Teacher 1 cố tình sao chép bài của Teacher 2
		mockMvc.perform(post(EXERCISES_URL + "/" + otherExerciseId + "/copy")
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.ACCESS_DENIED_EXERCISE.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-007: Sao chép bài tập không tồn tại -> Báo lỗi EXERCISE_NOT_FOUND (HTTP 404)")
	void test_CN007_copyExercise_notFound() throws Exception {
		mockMvc.perform(post(EXERCISES_URL + "/999999/copy")
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.EXERCISE_NOT_FOUND.name())));
	}
}
