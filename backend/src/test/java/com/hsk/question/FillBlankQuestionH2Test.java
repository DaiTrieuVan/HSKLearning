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
import com.hsk.question.dto.BlankAnswerDto;
import com.hsk.question.dto.CreateFillBlankQuestionRequest;
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
class FillBlankQuestionH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String FILL_BLANK_URL = "/api/questions/fill-blank";
	private static final String QUESTIONS_URL = "/api/questions";
	private static final String TEACHER_EMAIL = "teacher_fill_blank@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_fill_blank@test.com";
	private static final String STUDENT_EMAIL = "student_fill_blank@test.com";
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
				new RegisterStudentRequest("Giáo Viên Điền Từ", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacherUser = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacherUser, teacherRole, null));

		// Other Teacher registration & role
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo Viên Khác", OTHER_TEACHER_EMAIL, PASSWORD, PASSWORD));
		otherTeacherUser = userRepository.findByEmailIgnoreCase(OTHER_TEACHER_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(otherTeacherUser, teacherRole, null));

		// Student registration
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh Điền Từ", STUDENT_EMAIL, PASSWORD, PASSWORD));
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
	@DisplayName("HTT-05-CN-002-TC-01: Tạo câu hỏi điền từ thành công với 1 chỗ trống")
	void shouldCreateFillBlankQuestionWithSingleBlankSuccessfully() throws Exception {
		CreateFillBlankQuestionRequest request = new CreateFillBlankQuestionRequest(
				"我___学生",
				"Câu giới thiệu: Tôi là học sinh.",
				List.of(new BlankAnswerDto(0, "是", List.of()))
		);

		MvcResult result = mockMvc.perform(post(FILL_BLANK_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id", notNullValue()))
				.andExpect(jsonPath("$.ownerId", is(teacherUser.getId().intValue())))
				.andExpect(jsonPath("$.content", is("我___学生")))
				.andExpect(jsonPath("$.explanation", is("Câu giới thiệu: Tôi là học sinh.")))
				.andExpect(jsonPath("$.type", is("FILL")))
				.andExpect(jsonPath("$.payload", notNullValue()))
				.andReturn();

		// Verify database
		List<QuestionEntity> questions = questionRepository.findAll();
		assertEquals(1, questions.size());
		QuestionEntity saved = questions.get(0);
		assertEquals("我___学生", saved.getContent());
		assertEquals(QuestionType.FILL, saved.getType());
		assertNotNull(saved.getPayload());

		JsonNode payloadJson = objectMapper.readTree(saved.getPayload());
		assertEquals("是", payloadJson.get("blanks").get(0).get("correctAnswer").asText());
		assertEquals(0, payloadJson.get("blanks").get(0).get("acceptableAnswers").size());
	}

	@Test
	@DisplayName("HTT-05-CN-002-TC-02: Tạo câu hỏi điền từ thành công với nhiều đáp án chấp nhận được")
	void shouldCreateFillBlankQuestionWithMultipleAcceptableAnswers() throws Exception {
		CreateFillBlankQuestionRequest request = new CreateFillBlankQuestionRequest(
				"我___学生",
				"Có thể dùng 是 hoặc 为 trong ngữ cảnh trang trọng.",
				List.of(new BlankAnswerDto(0, "是", List.of("为")))
		);

		mockMvc.perform(post(FILL_BLANK_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id", notNullValue()))
				.andExpect(jsonPath("$.type", is("FILL")))
				.andExpect(jsonPath("$.payload", notNullValue()));

		QuestionEntity saved = questionRepository.findAll().get(0);
		JsonNode payloadJson = objectMapper.readTree(saved.getPayload());
		assertEquals("是", payloadJson.get("blanks").get(0).get("correctAnswer").asText());
		assertEquals(1, payloadJson.get("blanks").get(0).get("acceptableAnswers").size());
		assertEquals("为", payloadJson.get("blanks").get(0).get("acceptableAnswers").get(0).asText());
	}

	@Test
	@DisplayName("HTT-05-CN-002-TC-03: Dữ liệu không hợp lệ - Câu hỏi không có chỗ trống nào")
	void shouldFailWhenContentHasNoBlanks() throws Exception {
		CreateFillBlankQuestionRequest request = new CreateFillBlankQuestionRequest(
				"我是一个学生",
				"Câu này không chứa bất kỳ chỗ trống nào.",
				List.of(new BlankAnswerDto(0, "是", List.of()))
		);

		mockMvc.perform(post(FILL_BLANK_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_NO_BLANKS.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-002-TC-04: Dữ liệu không hợp lệ - Số chỗ trống không khớp số đáp án")
	void shouldFailWhenBlankCountMismatchesAnswers() throws Exception {
		// Câu có 2 chỗ trống nhưng chỉ cung cấp 1 đáp án
		CreateFillBlankQuestionRequest request = new CreateFillBlankQuestionRequest(
				"我___学生，他___老师",
				"Câu có 2 chỗ trống.",
				List.of(new BlankAnswerDto(0, "是", List.of()))
		);

		mockMvc.perform(post(FILL_BLANK_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_BLANK_COUNT_MISMATCH.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-002-TC-05: Thiếu dữ liệu - Đáp án đúng bị bỏ trống")
	void shouldFailWhenCorrectAnswerIsBlank() throws Exception {
		CreateFillBlankQuestionRequest request = new CreateFillBlankQuestionRequest(
				"我___学生",
				"Thiếu đáp án đúng.",
				List.of(new BlankAnswerDto(0, "   ", List.of()))
		);

		mockMvc.perform(post(FILL_BLANK_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_CORRECT_ANSWER_BLANK.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-002-TC-06: Không có quyền - Học sinh gọi API tạo câu hỏi điền từ")
	void shouldFailWhenStudentCreatesFillBlankQuestion() throws Exception {
		CreateFillBlankQuestionRequest request = new CreateFillBlankQuestionRequest(
				"我___学生",
				"Học sinh cố tình tạo câu hỏi.",
				List.of(new BlankAnswerDto(0, "是", List.of()))
		);

		mockMvc.perform(post(FILL_BLANK_URL)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("HTT-05-CN-002: Kiểm tra tính độc lập ngân hàng câu hỏi (QTN-19)")
	void shouldIsolateTeacherQuestionBankForFillBlank() throws Exception {
		CreateFillBlankQuestionRequest request = new CreateFillBlankQuestionRequest(
				"我___学生",
				"Giải thích",
				List.of(new BlankAnswerDto(0, "是", List.of()))
		);

		// Teacher creates question
		mockMvc.perform(post(FILL_BLANK_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated());

		// Teacher gets question bank -> should see 1 question
		mockMvc.perform(get(QUESTIONS_URL + "/my")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].content", is("我___学生")))
				.andExpect(jsonPath("$[0].type", is("FILL")));

		// Other teacher gets question bank -> should see 0 questions
		mockMvc.perform(get(QUESTIONS_URL + "/my")
				.header("Authorization", "Bearer " + otherTeacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}
}
