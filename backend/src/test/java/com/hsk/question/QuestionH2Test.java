package com.hsk.question;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
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
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.repository.QuestionOptionRepository;
import com.hsk.question.repository.QuestionRepository;
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
class QuestionH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String QUESTIONS_URL = "/api/questions";
	private static final String TEACHER_EMAIL = "teacher_question@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_question@test.com";
	private static final String STUDENT_EMAIL = "student_question@test.com";
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
	private ClassRepository classRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private QuestionOptionRepository questionOptionRepository;

	private UserEntity teacherUser;
	private String teacherToken;

	private UserEntity otherTeacherUser;
	private String otherTeacherToken;

	private UserEntity studentUser;
	private String studentToken;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Teacher registration & role
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo Viên Vương", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacherUser = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacherUser, teacherRole, null));

		// Other Teacher registration & role (for QTN-19 testing)
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo Viên Lý", OTHER_TEACHER_EMAIL, PASSWORD, PASSWORD));
		otherTeacherUser = userRepository.findByEmailIgnoreCase(OTHER_TEACHER_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(otherTeacherUser, teacherRole, null));

		// Student registration
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh Minh", STUDENT_EMAIL, PASSWORD, PASSWORD));
		studentUser = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();

		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		otherTeacherToken = loginAndGetToken(OTHER_TEACHER_EMAIL, PASSWORD);
		studentToken = loginAndGetToken(STUDENT_EMAIL, PASSWORD);
	}

	@AfterEach
	void tearDown() {
		questionOptionRepository.deleteAll();
		questionRepository.deleteAll();

		auditLogRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String pwd) throws Exception {
		String body = "{\"email\":\"" + email + "\",\"password\":\"" + pwd + "\"}";
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.get("token").asText();
	}

	@Test
	@DisplayName("HTT-05-CN-001-TC-01: Tạo câu hỏi trắc nghiệm thành công (4 lựa chọn, 1 đúng, hiển thị đúng chữ Hán và dấu thanh)")
	void shouldCreateMultipleChoiceQuestionSuccessfully() throws Exception {
		CreateQuestionRequest request = new CreateQuestionRequest(
				"你好 nghĩa là gì?",
				"你好 (nǐ hǎo) là lời chào hỏi thông dụng nhất trong tiếng Trung.",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Xin chào", true),
						new CreateQuestionOptionRequest("Tạm biệt", false),
						new CreateQuestionOptionRequest("Cảm ơn", false),
						new CreateQuestionOptionRequest("Xin lỗi", false)
				)
		);

		mockMvc.perform(post(QUESTIONS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id", notNullValue()))
				.andExpect(jsonPath("$.ownerId", is(teacherUser.getId().intValue())))
				.andExpect(jsonPath("$.content", is("你好 nghĩa là gì?")))
				.andExpect(jsonPath("$.explanation", is("你好 (nǐ hǎo) là lời chào hỏi thông dụng nhất trong tiếng Trung.")))
				.andExpect(jsonPath("$.type", is("MCQ")))
				.andExpect(jsonPath("$.options", hasSize(4)))
				.andExpect(jsonPath("$.options[0].content", is("Xin chào")))
				.andExpect(jsonPath("$.options[0].isCorrect", is(true)))
				.andExpect(jsonPath("$.options[1].content", is("Tạm biệt")))
				.andExpect(jsonPath("$.options[1].isCorrect", is(false)));

		List<QuestionEntity> savedQuestions = questionRepository.findByOwnerIdAndIsHiddenFalseOrderByCreatedAtDesc(teacherUser.getId());
		assertEquals(1, savedQuestions.size());
		QuestionEntity saved = questionRepository.findWithOptionsById(savedQuestions.get(0).getId()).orElseThrow();
		assertEquals("你好 nghĩa là gì?", saved.getContent());
		assertNotNull(saved.getOptions());
		assertEquals(4, saved.getOptions().size());
	}

	@Test
	@DisplayName("HTT-05-CN-001-TC-02: Dữ liệu không hợp lệ - Câu hỏi chỉ có 1 lựa chọn -> Báo cần ít nhất 2 lựa chọn")
	void shouldRejectWhenOnlyOneOptionProvided() throws Exception {
		CreateQuestionRequest request = new CreateQuestionRequest(
				"你好 nghĩa là gì?",
				"Giải thích",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Xin chào", true)
				)
		);

		mockMvc.perform(post(QUESTIONS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_MIN_OPTIONS.name())));

		assertEquals(0, questionRepository.count());
	}

	@Test
	@DisplayName("HTT-05-CN-001-TC-03: Dữ liệu không hợp lệ - 0 đáp án đúng hoặc nhiều hơn 1 đáp án đúng -> Báo phải có đúng 1 đáp án đúng")
	void shouldRejectWhenZeroOrMultipleCorrectAnswersProvided() throws Exception {
		// Trường hợp 1: 0 đáp án đúng
		CreateQuestionRequest zeroCorrectRequest = new CreateQuestionRequest(
				"你好 nghĩa là gì?",
				"Giải thích",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Xin chào", false),
						new CreateQuestionOptionRequest("Tạm biệt", false)
				)
		);

		mockMvc.perform(post(QUESTIONS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(zeroCorrectRequest)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_EXACTLY_ONE_CORRECT.name())));

		// Trường hợp 2: 2 đáp án đúng
		CreateQuestionRequest twoCorrectRequest = new CreateQuestionRequest(
				"你好 nghĩa là gì?",
				"Giải thích",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Xin chào", true),
						new CreateQuestionOptionRequest("Chào bạn", true)
				)
		);

		mockMvc.perform(post(QUESTIONS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(twoCorrectRequest)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_EXACTLY_ONE_CORRECT.name())));

		assertEquals(0, questionRepository.count());
	}

	@Test
	@DisplayName("HTT-05-CN-001-TC-04: Thiếu dữ liệu - Nội dung câu hỏi hoặc một lựa chọn bị bỏ trống -> Báo lỗi")
	void shouldRejectWhenQuestionOrOptionContentIsBlank() throws Exception {
		// Trường hợp 1: Nội dung câu hỏi bỏ trống
		CreateQuestionRequest emptyContentRequest = new CreateQuestionRequest(
				"   ",
				"Giải thích",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Xin chào", true),
						new CreateQuestionOptionRequest("Tạm biệt", false)
				)
		);

		mockMvc.perform(post(QUESTIONS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(emptyContentRequest)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_CONTENT_BLANK.name())));

		// Trường hợp 2: Lựa chọn C bị bỏ trống
		CreateQuestionRequest emptyOptionRequest = new CreateQuestionRequest(
				"你好 nghĩa là gì?",
				"Giải thích",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Xin chào", true),
						new CreateQuestionOptionRequest("Tạm biệt", false),
						new CreateQuestionOptionRequest("   ", false)
				)
		);

		mockMvc.perform(post(QUESTIONS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(emptyOptionRequest)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_OPTION_CONTENT_BLANK.name())));

		assertEquals(0, questionRepository.count());
	}

	@Test
	@DisplayName("HTT-05-CN-001-TC-05: Dữ liệu trùng lặp - Hai lựa chọn có nội dung giống nhau -> Báo lựa chọn trùng")
	void shouldRejectWhenDuplicateOptionsProvided() throws Exception {
		CreateQuestionRequest duplicateRequest = new CreateQuestionRequest(
				"你好 nghĩa là gì?",
				"Giải thích",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Xin chào", true),
						new CreateQuestionOptionRequest("Xin chào", false)
				)
		);

		mockMvc.perform(post(QUESTIONS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(duplicateRequest)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_DUPLICATE_OPTIONS.name())));

		assertEquals(0, questionRepository.count());
	}

	@Test
	@DisplayName("HTT-05-CN-001-TC-06: Không có quyền - Người dùng là học sinh gọi chức năng tạo câu hỏi -> Bị từ chối")
	void shouldRejectWhenStudentTriesToCreateQuestion() throws Exception {
		CreateQuestionRequest request = new CreateQuestionRequest(
				"你好 nghĩa là gì?",
				"Giải thích",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Xin chào", true),
						new CreateQuestionOptionRequest("Tạm biệt", false)
				)
		);

		mockMvc.perform(post(QUESTIONS_URL)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());

		assertEquals(0, questionRepository.count());
	}

	@Test
	@DisplayName("QTN-19: Giáo viên chỉ xem được ngân hàng câu hỏi do chính mình tạo ra")
	void shouldOnlyReturnQuestionsCreatedByOwner() throws Exception {
		// Teacher 1 creates question
		CreateQuestionRequest request1 = new CreateQuestionRequest(
				"谢谢 nghĩa là gì?",
				"Cảm ơn",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Cảm ơn", true),
						new CreateQuestionOptionRequest("Xin chào", false)
				)
		);

		mockMvc.perform(post(QUESTIONS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request1)))
				.andExpect(status().isCreated());

		// Teacher 1 gets my questions -> has 1
		mockMvc.perform(get(QUESTIONS_URL + "/my")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].content", is("谢谢 nghĩa là gì?")));

		// Teacher 2 gets my questions -> has 0
		mockMvc.perform(get(QUESTIONS_URL + "/my")
				.header("Authorization", "Bearer " + otherTeacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}
}
