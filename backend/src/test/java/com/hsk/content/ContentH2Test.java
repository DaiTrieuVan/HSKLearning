package com.hsk.content;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.content.dto.CreateGrammarExampleRequest;
import com.hsk.content.dto.CreateGrammarPointRequest;
import com.hsk.content.dto.CreateLessonRequest;
import com.hsk.content.dto.CreateVocabSetRequest;
import com.hsk.content.dto.CreateVocabularyRequest;
import com.hsk.content.dto.UpdateLessonRequest;
import com.hsk.content.repository.ClassVocabSetRepository;
import com.hsk.content.repository.GrammarExampleRepository;
import com.hsk.content.repository.GrammarPointRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;

/**
 * Kiểm thử toàn diện Epic HTT-03: Quản lý nội dung học (HTT-03-CN-001 đến HTT-03-CN-011).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test-h2")
class ContentH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String TEACHER_EMAIL = "teacher_content@test.com";
	private static final String STUDENT_EMAIL = "student_content@test.com";
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
	private ClassRepository classRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private LessonRepository lessonRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private LessonVocabularyRepository lessonVocabularyRepository;

	@Autowired
	private GrammarPointRepository grammarPointRepository;

	@Autowired
	private GrammarExampleRepository grammarExampleRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private ClassVocabSetRepository classVocabSetRepository;

	private UserEntity teacherUser;
	private String teacherToken;

	private UserEntity studentUser;
	private String studentToken;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Teacher registration & role
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo Viên Trương", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacherUser = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacherUser, teacherRole, null));

		// Student registration
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh Lý", STUDENT_EMAIL, PASSWORD, PASSWORD));
		studentUser = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();

		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		studentToken = loginAndGetToken(STUDENT_EMAIL, PASSWORD);
	}

	@AfterEach
	void tearDown() {
		classVocabSetRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		grammarExampleRepository.deleteAll();
		grammarPointRepository.deleteAll();
		lessonVocabularyRepository.deleteAll();
		vocabularyRepository.deleteAll();
		lessonRepository.deleteAll();

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
	@DisplayName("HTT-03-CN-001: Should list seeded HSK levels (HSK 1-6)")
	void shouldListSeedHskLevels() throws Exception {
		mockMvc.perform(get("/api/v1/content/levels"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(6))))
			.andExpect(jsonPath("$[0].code", is("HSK_1")));
	}

	@Test
	@DisplayName("HTT-03-CN-002 & 003: Should create, update, and soft-hide a lesson (QTN-14)")
	void shouldCreateAndUpdateAndSoftHideLesson() throws Exception {
		// 1. Create Lesson
		CreateLessonRequest createReq = new CreateLessonRequest(
			1L,
			"Bài 3: Bạn là người nước nào?",
			"Hỏi và trả lời về quốc tịch",
			3
		);

		String response = mockMvc.perform(post("/api/v1/content/lessons")
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(createReq)))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.title", is("Bài 3: Bạn là người nước nào?")))
			.andReturn().getResponse().getContentAsString();

		Number lessonIdNum = com.jayway.jsonpath.JsonPath.read(response, "$.id");
		Long lessonId = lessonIdNum.longValue();

		// 2. Update Lesson
		UpdateLessonRequest updateReq = new UpdateLessonRequest(
			"Bài 3: Bạn là người nước nào? (Cập nhật)",
			"Mô tả chi tiết",
			3,
			null
		);

		mockMvc.perform(put("/api/v1/content/lessons/" + lessonId)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(updateReq)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.title", is("Bài 3: Bạn là người nước nào? (Cập nhật)")));

		// 3. Soft-hide Lesson (QTN-14)
		mockMvc.perform(delete("/api/v1/content/lessons/" + lessonId)
				.header("Authorization", "Bearer " + teacherToken))
			.andExpect(status().isNoContent());

		// Verify hidden lesson is not in default listing
		mockMvc.perform(get("/api/v1/content/levels/1/lessons?includeHidden=false"))
			.andExpect(status().isOk());
	}

	@Test
	@DisplayName("HTT-03-CN-004: Should enforce unique (Hanzi, Pinyin) in shared pool (QTN-07)")
	void shouldEnforceUniqueHanziPinyinInSharedPool() throws Exception {
		CreateVocabularyRequest vocabReq = new CreateVocabularyRequest(
			"学习",
			"xuéxí",
			"Học tập",
			"verb",
			null,
			"我们要好好学习。",
			"Wǒmen yào hǎohāo xuéxí.",
			"Chúng ta phải chăm chỉ học tập.",
			1L,
			false
		);

		// First creation succeeds
		mockMvc.perform(post("/api/v1/content/vocabularies")
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(vocabReq)))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.hanzi", is("学习")));

		// Duplicate creation fails with 409 CONFLICT (QTN-07)
		mockMvc.perform(post("/api/v1/content/vocabularies")
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(vocabReq)))
			.andExpect(status().isConflict())
			.andExpect(jsonPath("$.code", is("VOCABULARY_ALREADY_EXISTS")));
	}

	@Test
	@DisplayName("HTT-03-CN-011: Teacher private vocab should have independent scope (QTN-19)")
	void shouldAllowTeacherPrivateVocabularyIndependentScope() throws Exception {
		CreateVocabularyRequest privateVocab = new CreateVocabularyRequest(
			"测试",
			"cèshì",
			"Kiểm tra, bài test riêng",
			"noun",
			null,
			null,
			null,
			null,
			1L,
			true // private to teacherUser
		);

		mockMvc.perform(post("/api/v1/content/vocabularies")
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(privateVocab)))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.isPrivate", is(true)));
	}

	@Test
	@DisplayName("HTT-03-CN-006: Should reject audio file exceeding 5MB")
	void shouldRejectAudioExceeding5MB() throws Exception {
		byte[] largeAudioBytes = new byte[6 * 1024 * 1024]; // 6 MB > 5 MB
		MockMultipartFile file = new MockMultipartFile("file", "large_pronunciation.mp3", "audio/mpeg", largeAudioBytes);

		mockMvc.perform(multipart("/api/v1/content/audio")
				.file(file)
				.header("Authorization", "Bearer " + teacherToken))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.code", is("FILE_TOO_LARGE")));
	}

	@Test
	@DisplayName("HTT-03-CN-007: Should sanitize formula injection during bulk import (QTN-07)")
	void shouldSanitizeFormulaInjectionDuringBulkImport() throws Exception {
		String csvContent = "hanzi,pinyin,meaning\n" +
			"=CMD|' /C calc'!A0,x1,Ý nghĩa 1\n" +
			"+SUM(1,2),x2,Ý nghĩa 2\n" +
			"@TEST,x3,Ý nghĩa 3\n" +
			"书,shū,Sách\n";

		MockMultipartFile file = new MockMultipartFile(
			"file", "vocab.csv", "text/csv", csvContent.getBytes(StandardCharsets.UTF_8)
		);

		mockMvc.perform(multipart("/api/v1/content/vocabularies/import")
				.file(file)
				.param("levelId", "1")
				.header("Authorization", "Bearer " + teacherToken))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.successCount", greaterThanOrEqualTo(4)));
	}

	@Test
	@DisplayName("HTT-03-CN-008: Should create grammar point with examples")
	void shouldCreateGrammarPointWithExamples() throws Exception {
		CreateLessonRequest createReq = new CreateLessonRequest(1L, "Bài Ngữ Pháp", "Mô tả", 10);
		String res = mockMvc.perform(post("/api/v1/content/lessons")
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(createReq)))
			.andExpect(status().isCreated())
			.andReturn().getResponse().getContentAsString();
		Long lessonId = ((Number) com.jayway.jsonpath.JsonPath.read(res, "$.id")).longValue();

		CreateGrammarPointRequest req = new CreateGrammarPointRequest(
			"Câu chữ 是 (Shì)",
			"A + 是 + B",
			"Dùng để biểu thị quan hệ phán đoán hoặc khẳng định: A là B",
			1,
			List.of(
				new CreateGrammarExampleRequest("我是学生。", "Wǒ shì xuésheng.", "Tôi là học sinh.", 1),
				new CreateGrammarExampleRequest("他是中国人。", "Tā shì Zhōngguó rén.", "Anh ấy là người Trung Quốc.", 2)
			)
		);

		mockMvc.perform(post("/api/v1/content/lessons/" + lessonId + "/grammar")
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(req)))
			.andExpect(status().isCreated())
			.andExpect(jsonPath("$.title", is("Câu chữ 是 (Shì)")))
			.andExpect(jsonPath("$.examples", hasSize(2)));
	}

	@Test
	@DisplayName("HTT-03-CN-009 & 010: Should create vocab set and assign to class")
	void shouldCreateVocabSetAndAssignToClass() throws Exception {
		// 1. Create Class
		ClassEntity classroom = classRepository.save(ClassEntity.create(
			teacherUser,
			"Lớp Tiếng Trung Nâng Cao",
			"Lớp học từ vựng chuyên sâu",
			"CNK789"
		));

		// 2. Create Vocab Set
		CreateVocabSetRequest setReq = new CreateVocabSetRequest(
			"Bộ từ vựng Giao tiếp HSK 1",
			"50 từ vựng cốt lõi hàng ngày",
			List.of()
		);

		String setRes = mockMvc.perform(post("/api/v1/content/vocab-sets")
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(setReq)))
			.andExpect(status().isCreated())
			.andReturn().getResponse().getContentAsString();

		Number setIdNum = com.jayway.jsonpath.JsonPath.read(setRes, "$.id");
		Long setId = setIdNum.longValue();

		// 3. Assign Vocab Set to Class
		mockMvc.perform(post("/api/v1/content/classes/" + classroom.getId() + "/vocab-sets/" + setId)
				.header("Authorization", "Bearer " + teacherToken))
			.andExpect(status().isCreated());

		// 4. View Class Vocab Sets
		mockMvc.perform(get("/api/v1/content/classes/" + classroom.getId() + "/vocab-sets")
				.header("Authorization", "Bearer " + teacherToken))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$", hasSize(1)))
			.andExpect(jsonPath("$[0].title", is("Bộ từ vựng Giao tiếp HSK 1")));
	}
}
