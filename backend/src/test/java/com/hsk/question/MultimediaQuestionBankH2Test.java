package com.hsk.question;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
import com.hsk.common.audit.AuditLogRepository;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.UpdateQuestionRequest;
import com.hsk.question.repository.QuestionOptionRepository;
import com.hsk.question.repository.QuestionRepository;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class MultimediaQuestionBankH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String QUESTIONS_URL = "/api/questions";
	private static final String UPLOAD_MEDIA_URL = "/api/questions/upload-media";
	private static final String MY_QUESTIONS_URL = "/api/questions/my-questions";
	private static final String TEACHER_EMAIL = "teacher_media_q@test.com";
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
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private QuestionOptionRepository questionOptionRepository;

	private String teacherToken;

	@BeforeEach
	void setUp() throws Exception {
		cleanupData();

		// Tạo tài khoản giáo viên
		registrationService.registerStudent(new RegisterStudentRequest(
				"Cô Lan Media",
				TEACHER_EMAIL,
				PASSWORD,
				PASSWORD
		));

		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		teacherToken = authenticate(TEACHER_EMAIL, PASSWORD);
	}

	@AfterEach
	void tearDown() {
		cleanupData();
	}

	private void cleanupData() {
		questionOptionRepository.deleteAll();
		questionRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		auditLogRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String authenticate(String email, String password) throws Exception {
		String loginBody = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(loginBody))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
		return json.get("token").asText();
	}

	@Test
	@DisplayName("Tải lên tệp media (ảnh và audio) thành công")
	void uploadMedia_Success() throws Exception {
		// 1. Upload ảnh
		MockMultipartFile imageFile = new MockMultipartFile(
				"file", "apple.png", "image/png", "fake-image-content".getBytes(StandardCharsets.UTF_8)
		);
		mockMvc.perform(multipart(UPLOAD_MEDIA_URL)
						.file(imageFile)
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.url", containsString("/uploads/images/img_")))
				.andExpect(jsonPath("$.url", containsString(".png")));

		// 2. Upload audio
		MockMultipartFile audioFile = new MockMultipartFile(
				"file", "listening_1.mp3", "audio/mpeg", "fake-audio-content".getBytes(StandardCharsets.UTF_8)
		);
		mockMvc.perform(multipart(UPLOAD_MEDIA_URL)
						.file(audioFile)
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.url", containsString("/uploads/audio/audio_")))
				.andExpect(jsonPath("$.url", containsString(".mp3")));
	}

	@Test
	@DisplayName("Tạo câu hỏi nghe đa phương tiện với ảnh đáp án A/B/C và lọc tìm kiếm")
	void createMultimediaQuestion_AndSearchWithFilters() throws Exception {
		// Tạo câu hỏi 1: Nghe chọn tranh (HSK 1, có audio, đáp án có ảnh)
		CreateQuestionRequest listeningQ = new CreateQuestionRequest(
				"Nghe và chọn bức tranh tương ứng",
				"Bài nghe về quả táo (苹果)",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Tranh A - Quả táo", true, "/uploads/images/apple.png"),
						new CreateQuestionOptionRequest("Tranh B - Cái bàn", false, "/uploads/images/table.png"),
						new CreateQuestionOptionRequest("Tranh C - Con mèo", false, "/uploads/images/cat.png")
				),
				"/uploads/audio/q1.mp3",
				"píngguǒ",
				"苹果",
				null,
				1,
				null
		);

		MvcResult createResult1 = mockMvc.perform(post(QUESTIONS_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", "Bearer " + teacherToken)
						.content(objectMapper.writeValueAsString(listeningQ)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.audioUrl", is("/uploads/audio/q1.mp3")))
				.andExpect(jsonPath("$.pinyin", is("苹果")))
				.andExpect(jsonPath("$.transcript", is("píngguǒ")))
				.andExpect(jsonPath("$.hskLevel", is(1)))
				.andExpect(jsonPath("$.options", hasSize(3)))
				.andExpect(jsonPath("$.options[0].imageUrl", is("/uploads/images/apple.png")))
				.andReturn();

		JsonNode created1 = objectMapper.readTree(createResult1.getResponse().getContentAsString());
		Long q1Id = created1.get("id").asLong();

		// Tạo câu hỏi 2: Đọc hiểu văn bản (HSK 2, không có audio, có ảnh minh họa câu hỏi)
		CreateQuestionRequest readingQ = new CreateQuestionRequest(
				"Đọc đoạn văn và chọn nhận định đúng",
				"Giải thích chi tiết",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Đáp án đúng", true),
						new CreateQuestionOptionRequest("Đáp án sai 1", false),
						new CreateQuestionOptionRequest("Đáp án sai 2", false)
				),
				null,
				null,
				null,
				"/uploads/images/passage_diagram.png",
				2,
				null
		);

		mockMvc.perform(post(QUESTIONS_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", "Bearer " + teacherToken)
						.content(objectMapper.writeValueAsString(readingQ)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.imageUrl", is("/uploads/images/passage_diagram.png")))
				.andExpect(jsonPath("$.hskLevel", is(2)));

		// 3. Test Search Filter: hasAudio = true -> chỉ ra câu hỏi 1
		mockMvc.perform(get(MY_QUESTIONS_URL)
						.param("hasAudio", "true")
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalElements", is(1)))
				.andExpect(jsonPath("$.content[0].id", is(q1Id.intValue())));

		// 4. Test Search Filter: hskLevel = 2 -> chỉ ra câu hỏi 2
		mockMvc.perform(get(MY_QUESTIONS_URL)
						.param("hskLevel", "2")
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalElements", is(1)))
				.andExpect(jsonPath("$.content[0].imageUrl", is("/uploads/images/passage_diagram.png")));

		// 5. Test Search Filter: hasImage = true -> ra cả 2 câu (câu 1 có ảnh option, câu 2 có ảnh đề)
		mockMvc.perform(get(MY_QUESTIONS_URL)
						.param("hasImage", "true")
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalElements", is(2)));

		// 6. Test Update Question: Cập nhật thêm audio và ảnh cho câu hỏi 2
		UpdateQuestionRequest updateReq = new UpdateQuestionRequest(
				"Nội dung câu hỏi 2 đã sửa",
				"Giải thích mới",
				List.of(
						new CreateQuestionOptionRequest("Đáp án đúng mới", true, "/uploads/images/opt_new.png"),
						new CreateQuestionOptionRequest("Đáp án sai mới", false)
				),
				null,
				"/uploads/images/updated_q2.png",
				"/uploads/audio/updated_q2.mp3",
				"Đoạn văn đọc",
				"pinyin mới",
				3,
				null
		);

		JsonNode created2List = objectMapper.readTree(
				mockMvc.perform(get(MY_QUESTIONS_URL).param("hskLevel", "2").header("Authorization", "Bearer " + teacherToken))
						.andReturn().getResponse().getContentAsString()
		);
		Long q2Id = created2List.get("content").get(0).get("id").asLong();

		mockMvc.perform(put(QUESTIONS_URL + "/" + q2Id)
						.contentType(MediaType.APPLICATION_JSON)
						.header("Authorization", "Bearer " + teacherToken)
						.content(objectMapper.writeValueAsString(updateReq)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content", is("Nội dung câu hỏi 2 đã sửa")))
				.andExpect(jsonPath("$.audioUrl", is("/uploads/audio/updated_q2.mp3")))
				.andExpect(jsonPath("$.imageUrl", is("/uploads/images/updated_q2.png")))
				.andExpect(jsonPath("$.hskLevel", is(3)))
				.andExpect(jsonPath("$.options[0].imageUrl", is("/uploads/images/opt_new.png")));
	}
}
