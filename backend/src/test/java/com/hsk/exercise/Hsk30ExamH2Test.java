package com.hsk.exercise;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
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
import com.hsk.account.repository.RoleRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.exercise.dto.hsk30.Hsk30StudentAnswerDto;
import com.hsk.exercise.dto.hsk30.Hsk30SubmitExamRequest;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.exercise.repository.ExerciseSectionRepository;
import com.hsk.exercise.repository.QuestionGroupRepository;
import com.hsk.question.repository.QuestionOptionRepository;
import com.hsk.question.repository.QuestionRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
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
class Hsk30ExamH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String HSK30_EXAMS_URL = "/api/hsk30/exams";

	private static final String TEACHER_EMAIL = "teacher_hsk30@test.com";
	private static final String STUDENT_EMAIL = "student_hsk30@test.com";
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
	private ExerciseRepository exerciseRepository;

	@Autowired
	private ExerciseSectionRepository exerciseSectionRepository;

	@Autowired
	private QuestionGroupRepository questionGroupRepository;

	@Autowired
	private ExerciseQuestionRepository exerciseQuestionRepository;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private QuestionOptionRepository questionOptionRepository;

	private String teacherToken;
	private String studentToken;
	private Long teacherId;
	private Long studentId;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Tạo Teacher
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo viên HSK30", TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		teacherId = teacher.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// Tạo Student
		registrationService.registerStudent(
				new RegisterStudentRequest("Học sinh HSK30", STUDENT_EMAIL, PASSWORD, PASSWORD));
		UserEntity student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		studentId = student.getId();

		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		studentToken = loginAndGetToken(STUDENT_EMAIL, PASSWORD);
	}

	@AfterEach
	void tearDown() {
		exerciseQuestionRepository.deleteAll();
		questionGroupRepository.deleteAll();
		exerciseSectionRepository.deleteAll();
		exerciseRepository.deleteAll();
		questionOptionRepository.deleteAll();
		questionRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password)))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
		if (json.hasNonNull("token")) {
			return json.get("token").asText();
		}
		return json.get("accessToken").asText();
	}

	@Test
	@DisplayName("HSK 3.0: Tự động seed đề mẫu HSK 1 với 40 câu hỏi, 8 parts, 200 điểm và kiểm tra cấu trúc")
	void testSeedAndGetHsk30Exam() throws Exception {
		// 1. Seed đề thi mẫu
		MvcResult seedResult = mockMvc.perform(post(HSK30_EXAMS_URL + "/seed-sample")
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.title").value("Đề thi thử HSK 1 - Chuẩn HSK 3.0 (Đề Mẫu Số 01)"))
				.andExpect(jsonPath("$.hskStandard").value("HSK_3_0"))
				.andExpect(jsonPath("$.hskLevel").value(1))
				.andExpect(jsonPath("$.timeLimitMinutes").value(40))
				.andExpect(jsonPath("$.totalPoints").value(200.0))
				.andExpect(jsonPath("$.passingScore").value(120.0))
				.andExpect(jsonPath("$.totalQuestions").value(40))
				.andExpect(jsonPath("$.sections", hasSize(2)))
				.andExpect(jsonPath("$.sections[0].name").value("听力 - Phần Nghe"))
				.andExpect(jsonPath("$.sections[0].parts", hasSize(4)))
				.andExpect(jsonPath("$.sections[1].name").value("阅读 - Phần Đọc"))
				.andExpect(jsonPath("$.sections[1].parts", hasSize(4)))
				.andReturn();

		JsonNode examJson = objectMapper.readTree(seedResult.getResponse().getContentAsString());
		Long examId = examJson.get("id").asLong();

		// 2. Lấy danh sách đề thi HSK 3.0
		mockMvc.perform(get(HSK30_EXAMS_URL + "?hskLevel=1")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].id").value(examId))
				.andExpect(jsonPath("$[0].totalQuestions").value(40));

		// 3. Kiểm tra bảo mật khi thí sinh vào phòng thi (/take): Phải ẩn toàn bộ đáp án
		MvcResult takeResult = mockMvc.perform(get(HSK30_EXAMS_URL + "/" + examId + "/take")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode takeJson = objectMapper.readTree(takeResult.getResponse().getContentAsString());
		for (JsonNode sec : takeJson.get("sections")) {
			for (JsonNode part : sec.get("parts")) {
				for (JsonNode q : part.get("questions")) {
					assertTrue(q.get("correctKey").isNull(), "correctKey must be null for take endpoint");
					assertTrue(q.get("correctOptionId").isNull(), "correctOptionId must be null for take endpoint");
					assertTrue(q.get("explanation").isNull(), "explanation must be null for take endpoint");
				}
			}
		}
	}

	@Test
	@DisplayName("HSK 3.0: Chấm điểm nộp bài - Thí sinh trả lời đúng 40/40 câu đạt 200 điểm và đỗ")
	void testSubmitExam_FullScore() throws Exception {
		// 1. Seed đề thi
		MvcResult seedResult = mockMvc.perform(post(HSK30_EXAMS_URL + "/seed-sample")
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode examJson = objectMapper.readTree(seedResult.getResponse().getContentAsString());
		Long examId = examJson.get("id").asLong();

		// Lấy danh sách câu hỏi với đáp án để nộp đúng 40 câu
		List<Hsk30StudentAnswerDto> answers = new ArrayList<>();
		for (JsonNode sec : examJson.get("sections")) {
			for (JsonNode part : sec.get("parts")) {
				for (JsonNode q : part.get("questions")) {
					Long qId = q.get("questionId").asLong();
					String correctKey = q.hasNonNull("correctKey") ? q.get("correctKey").asText() : null;
					Long correctOptId = q.hasNonNull("correctOptionId") ? q.get("correctOptionId").asLong() : null;
					answers.add(new Hsk30StudentAnswerDto(qId, correctOptId, correctKey));
				}
			}
		}

		assertEquals(40, answers.size(), "Phải có đúng 40 câu hỏi");

		Hsk30SubmitExamRequest submitRequest = new Hsk30SubmitExamRequest(answers, 1800);

		// Nộp bài thi
		MvcResult submitResult = mockMvc.perform(post(HSK30_EXAMS_URL + "/" + examId + "/submit")
						.header("Authorization", "Bearer " + studentToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(submitRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.examId").value(examId))
				.andExpect(jsonPath("$.totalScore").value(200.0))
				.andExpect(jsonPath("$.listeningScore").value(100.0))
				.andExpect(jsonPath("$.readingScore").value(100.0))
				.andExpect(jsonPath("$.totalCorrect").value(40))
				.andExpect(jsonPath("$.totalQuestions").value(40))
				.andExpect(jsonPath("$.passed").value(true))
				.andReturn();

		JsonNode resJson = objectMapper.readTree(submitResult.getResponse().getContentAsString());
		assertTrue(resJson.get("passed").asBoolean());
	}

	@Test
	@DisplayName("HSK 3.0: Chấm điểm nộp bài - Thí sinh chỉ trả lời đúng 20 câu đạt 100 điểm (< 120 điểm đạt) và trượt")
	void testSubmitExam_Failed() throws Exception {
		// 1. Seed đề thi
		MvcResult seedResult = mockMvc.perform(post(HSK30_EXAMS_URL + "/seed-sample")
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode examJson = objectMapper.readTree(seedResult.getResponse().getContentAsString());
		Long examId = examJson.get("id").asLong();

		// Thí sinh chỉ trả lời đúng các câu của phần Nghe (20 câu), bỏ trống hoặc sai phần Đọc
		List<Hsk30StudentAnswerDto> answers = new ArrayList<>();
		int count = 0;
		for (JsonNode sec : examJson.get("sections")) {
			for (JsonNode part : sec.get("parts")) {
				for (JsonNode q : part.get("questions")) {
					Long qId = q.get("questionId").asLong();
					if (count < 20) {
						String correctKey = q.hasNonNull("correctKey") ? q.get("correctKey").asText() : null;
						Long correctOptId = q.hasNonNull("correctOptionId") ? q.get("correctOptionId").asLong() : null;
						answers.add(new Hsk30StudentAnswerDto(qId, correctOptId, correctKey));
					} else {
						// Trả lời sai
						answers.add(new Hsk30StudentAnswerDto(qId, null, "Z"));
					}
					count++;
				}
			}
		}

		Hsk30SubmitExamRequest submitRequest = new Hsk30SubmitExamRequest(answers, 2100);

		mockMvc.perform(post(HSK30_EXAMS_URL + "/" + examId + "/submit")
						.header("Authorization", "Bearer " + studentToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(submitRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalScore").value(100.0))
				.andExpect(jsonPath("$.listeningScore").value(100.0))
				.andExpect(jsonPath("$.readingScore").value(0.0))
				.andExpect(jsonPath("$.totalCorrect").value(20))
				.andExpect(jsonPath("$.passed").value(false));
	}
}
