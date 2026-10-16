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
import com.hsk.question.dto.CreateMatchingQuestionRequest;
import com.hsk.question.dto.CreateOrderingQuestionRequest;
import com.hsk.question.dto.MatchingPairDto;
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

/**
 * Bộ kiểm thử tích hợp H2 cho User Story HTT-05-CN-003:
 * Tạo câu hỏi nối từ và sắp xếp câu.
 * Kiểm tra các Acceptance Criteria từ TC-01 đến TC-05 cùng quy tắc QTN-19.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
public class MatchingOrderingQuestionH2Test {

	private static final String MATCHING_URL = "/api/questions/matching";
	private static final String ORDERING_URL = "/api/questions/ordering";
	private static final String QUESTIONS_URL = "/api/questions";
	private static final String LOGIN_URL = "/api/v1/auth/login";

	private static final String TEACHER_EMAIL = "teacher_match@hsk.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_match@hsk.com";
	private static final String STUDENT_EMAIL = "student_match@hsk.com";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

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
				new RegisterStudentRequest("Giáo Viên Nối Từ", TEACHER_EMAIL, PASSWORD, PASSWORD));
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
				new RegisterStudentRequest("Học Sinh Nối Từ", STUDENT_EMAIL, PASSWORD, PASSWORD));
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
	@DisplayName("HTT-05-CN-003-TC-01: Tạo câu hỏi nối từ thành công với ít nhất 2 cặp từ và nghĩa")
	void shouldCreateMatchingQuestionSuccessfully() throws Exception {
		CreateMatchingQuestionRequest request = new CreateMatchingQuestionRequest(
				"Nối các từ chào hỏi sau đây với nghĩa tương ứng",
				"Từ vựng HSK 1 cơ bản.",
				List.of(
						new MatchingPairDto("你好", "xin chào"),
						new MatchingPairDto("谢谢", "cảm ơn")
				)
		);

		MvcResult result = mockMvc.perform(post(MATCHING_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id", notNullValue()))
				.andExpect(jsonPath("$.ownerId", is(teacherUser.getId().intValue())))
				.andExpect(jsonPath("$.type", is("MATCH")))
				.andExpect(jsonPath("$.content", is("Nối các từ chào hỏi sau đây với nghĩa tương ứng")))
				.andExpect(jsonPath("$.payload", notNullValue()))
				.andReturn();

		// Kiểm tra lưu DB
		List<QuestionEntity> questions = questionRepository.findAll();
		assertEquals(1, questions.size());
		QuestionEntity saved = questions.get(0);
		assertEquals(QuestionType.MATCH, saved.getType());

		JsonNode payloadJson = objectMapper.readTree(saved.getPayload());
		assertEquals(2, payloadJson.get("pairs").size());
		assertEquals("你好", payloadJson.get("pairs").get(0).get("left").asText());
		assertEquals("xin chào", payloadJson.get("pairs").get(0).get("right").asText());
		assertEquals("谢谢", payloadJson.get("pairs").get(1).get("left").asText());
		assertEquals("cảm ơn", payloadJson.get("pairs").get(1).get("right").asText());
	}

	@Test
	@DisplayName("HTT-05-CN-003-TC-02: Tạo câu hỏi sắp xếp câu thành công theo thứ tự đúng")
	void shouldCreateOrderingQuestionSuccessfully() throws Exception {
		CreateOrderingQuestionRequest request = new CreateOrderingQuestionRequest(
				"Sắp xếp các từ sau thành câu hoàn chỉnh",
				"Ngữ pháp câu chữ 是.",
				List.of("我", "是", "学生")
		);

		MvcResult result = mockMvc.perform(post(ORDERING_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id", notNullValue()))
				.andExpect(jsonPath("$.ownerId", is(teacherUser.getId().intValue())))
				.andExpect(jsonPath("$.type", is("ORDER")))
				.andExpect(jsonPath("$.content", is("Sắp xếp các từ sau thành câu hoàn chỉnh")))
				.andExpect(jsonPath("$.payload", notNullValue()))
				.andReturn();

		// Kiểm tra lưu DB
		List<QuestionEntity> questions = questionRepository.findAll();
		assertEquals(1, questions.size());
		QuestionEntity saved = questions.get(0);
		assertEquals(QuestionType.ORDER, saved.getType());

		JsonNode payloadJson = objectMapper.readTree(saved.getPayload());
		assertEquals(3, payloadJson.get("correctOrder").size());
		assertEquals("我", payloadJson.get("correctOrder").get(0).asText());
		assertEquals("是", payloadJson.get("correctOrder").get(1).asText());
		assertEquals("学生", payloadJson.get("correctOrder").get(2).asText());
	}

	@Test
	@DisplayName("HTT-05-CN-003-TC-03: Dữ liệu không hợp lệ - Câu hỏi nối từ chỉ có 1 cặp")
	void shouldFailWhenMatchingHasLessThanTwoPairs() throws Exception {
		CreateMatchingQuestionRequest request = new CreateMatchingQuestionRequest(
				"Nối từ",
				"Giải thích",
				List.of(new MatchingPairDto("你好", "xin chào"))
		);

		mockMvc.perform(post(MATCHING_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_MATCH_MIN_PAIRS.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-003-TC-04: Dữ liệu không hợp lệ - Một vế của cặp nối từ bị bỏ trống")
	void shouldFailWhenMatchingPairSideIsBlank() throws Exception {
		CreateMatchingQuestionRequest request = new CreateMatchingQuestionRequest(
				"Nối từ",
				"Giải thích",
				List.of(
						new MatchingPairDto("你好", "   "),
						new MatchingPairDto("谢谢", "cảm ơn")
				)
		);

		mockMvc.perform(post(MATCHING_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_MATCH_PAIR_BLANK.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-003-TC-04: Dữ liệu không hợp lệ - Câu sắp xếp chỉ có 1 thành phần")
	void shouldFailWhenOrderingHasLessThanTwoItems() throws Exception {
		CreateOrderingQuestionRequest request = new CreateOrderingQuestionRequest(
				"Sắp xếp",
				"Giải thích",
				List.of("我")
		);

		mockMvc.perform(post(ORDERING_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_ORDER_MIN_ITEMS.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-003-TC-04: Dữ liệu không hợp lệ - Thành phần sắp xếp bị để trống")
	void shouldFailWhenOrderingItemIsBlank() throws Exception {
		CreateOrderingQuestionRequest request = new CreateOrderingQuestionRequest(
				"Sắp xếp",
				"Giải thích",
				List.of("我", "   ")
		);

		mockMvc.perform(post(ORDERING_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_ORDER_ITEM_BLANK.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-003-TC-05: Dữ liệu trùng lặp - Hai cặp nối từ có vế trái giống nhau")
	void shouldFailWhenMatchingHasDuplicateLeftSides() throws Exception {
		CreateMatchingQuestionRequest request = new CreateMatchingQuestionRequest(
				"Nối từ",
				"Giải thích",
				List.of(
						new MatchingPairDto("你好", "xin chào"),
						new MatchingPairDto("你好", "chào bạn")
				)
		);

		mockMvc.perform(post(MATCHING_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.QUESTION_MATCH_DUPLICATE_LEFT.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-003: Không có quyền - Học sinh gọi API tạo câu hỏi nối từ hoặc sắp xếp")
	void shouldFailWhenStudentAttemptsToCreateMatchingOrOrdering() throws Exception {
		CreateMatchingQuestionRequest matchRequest = new CreateMatchingQuestionRequest(
				"Nối từ",
				"Giải thích",
				List.of(
						new MatchingPairDto("你好", "xin chào"),
						new MatchingPairDto("谢谢", "cảm ơn")
				)
		);

		mockMvc.perform(post(MATCHING_URL)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(matchRequest)))
				.andExpect(status().isForbidden());

		CreateOrderingQuestionRequest orderRequest = new CreateOrderingQuestionRequest(
				"Sắp xếp",
				"Giải thích",
				List.of("我", "是", "学生")
		);

		mockMvc.perform(post(ORDERING_URL)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(orderRequest)))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("HTT-05-CN-003: Kiểm tra tính độc lập ngân hàng câu hỏi (QTN-19)")
	void shouldIsolateTeacherQuestionBankForMatchingAndOrdering() throws Exception {
		CreateMatchingQuestionRequest matchRequest = new CreateMatchingQuestionRequest(
				"Nối từ giáo viên 1",
				"Giải thích",
				List.of(
						new MatchingPairDto("你好", "xin chào"),
						new MatchingPairDto("谢谢", "cảm ơn")
				)
		);

		mockMvc.perform(post(MATCHING_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(matchRequest)))
				.andExpect(status().isCreated());

		// Teacher gets question bank -> should see 1 question of type MATCH
		mockMvc.perform(get(QUESTIONS_URL + "/my")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].type", is("MATCH")))
				.andExpect(jsonPath("$[0].content", is("Nối từ giáo viên 1")));

		// Other teacher gets question bank -> should see 0 questions
		mockMvc.perform(get(QUESTIONS_URL + "/my")
				.header("Authorization", "Bearer " + otherTeacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}
}
