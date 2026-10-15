package com.hsk.learning;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.PasswordResetTokenRepository;
import com.hsk.account.repository.TeacherRequestRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.LessonEntity;
import com.hsk.content.domain.LessonVocabularyEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.GrammarExampleRepository;
import com.hsk.content.repository.GrammarPointRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.learning.repository.LessonProgressRepository;
import com.hsk.learning.repository.VocabLearningRepository;
import java.nio.charset.StandardCharsets;
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
 * Integration tests for HTT-04-CN-006: Tra cứu từ vựng
 * Covers TC-01, TC-02, TC-03, TC-04 and TC-05 (CV-04).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class VocabSearchH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String SEARCH_URL = "/api/v1/learning/vocabularies/search";
	private static final String STUDENT_EMAIL = "student_search@test.com";
	private static final String OTHER_TEACHER_EMAIL = "teacher_other@test.com";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private HskLevelRepository hskLevelRepository;

	@Autowired
	private LessonRepository lessonRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private LessonVocabularyRepository lessonVocabularyRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private VocabLearningRepository vocabLearningRepository;

	@Autowired
	private LessonProgressRepository lessonProgressRepository;

	@Autowired
	private GrammarPointRepository grammarPointRepository;

	@Autowired
	private GrammarExampleRepository grammarExampleRepository;

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

	private UserEntity student;
	private String studentToken;
	private LessonEntity visibleLesson;
	private LessonEntity hiddenLesson;
	private VocabularyEntity niHaoVocab;
	private VocabularyEntity hiddenLessonVocab;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Register student
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh Tìm Kiếm", STUDENT_EMAIL, PASSWORD, PASSWORD));
		student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		studentToken = loginAndGetToken(STUDENT_EMAIL, PASSWORD);

		// Prepare HSK 1
		HskLevelEntity hsk1 = hskLevelRepository.findByCode("HSK_1").orElseGet(() ->
				hskLevelRepository.save(new HskLevelEntity("HSK_1", "HSK 1 - Nhập môn", 1, "Mô tả HSK 1", 150)));

		// Visible Lesson 1
		visibleLesson = lessonRepository.save(
				new LessonEntity(hsk1, "Bài 1: Chào hỏi & Làm quen", "Mô tả bài 1", 1, null));

		// Hidden Lesson
		hiddenLesson = new LessonEntity(hsk1, "Bài học ẩn", "Chỉ dành cho nội bộ", 99, null);
		hiddenLesson.setHidden(true);
		hiddenLesson = lessonRepository.save(hiddenLesson);

		// Vocabulary 1: "你好" - "nǐ hǎo" - "Xin chào" (Attached to visible Lesson 1)
		niHaoVocab = vocabularyRepository.save(
				new VocabularyEntity("你好", "nǐ hǎo", "Xin chào", "phrase", null, null, null, null, hsk1, null));
		lessonVocabularyRepository.save(new LessonVocabularyEntity(visibleLesson, niHaoVocab, 1));

		// Vocabulary 2: "秘密" (Bí mật) - Attached ONLY to hidden Lesson
		hiddenLessonVocab = vocabularyRepository.save(
				new VocabularyEntity("秘密", "mìmì", "Bí mật ẩn", "noun", null, null, null, null, hsk1, null));
		lessonVocabularyRepository.save(new LessonVocabularyEntity(hiddenLesson, hiddenLessonVocab, 1));

		// Vocabulary 3: Teacher's private vocabulary (owned by another teacher)
		UserEntity otherTeacher = userRepository.save(UserEntity.register(OTHER_TEACHER_EMAIL, "hash", "Thầy Giáo Khác"));
		vocabularyRepository.save(
				new VocabularyEntity("私词", "sīcí", "Từ riêng tư của giáo viên", "noun", null, null, null, null, hsk1, otherTeacher.getId()));
	}

	@AfterEach
	void tearDown() {
		vocabLearningRepository.deleteAll();
		lessonProgressRepository.deleteAll();
		grammarExampleRepository.deleteAll();
		grammarPointRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
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

	private String loginAndGetToken(String email, String password) throws Exception {
		String loginPayload = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(loginPayload))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString(StandardCharsets.UTF_8));
		return node.get("token").asText();
	}

	@Test
	@DisplayName("HTT-04-CN-006-TC-01: Học sinh tìm theo chữ Hán '你好', hệ thống trả về các từ khớp kèm bài học chứa từ đó")
	void testTC01_SearchByHanzi_ReturnsMatchingVocabsWithLessons() throws Exception {
		mockMvc.perform(get(SEARCH_URL)
						.param("query", "你好")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].hanzi", is("你好")))
				.andExpect(jsonPath("$[0].pinyin", is("nǐ hǎo")))
				.andExpect(jsonPath("$[0].meaning", is("Xin chào")))
				.andExpect(jsonPath("$[0].lessons", hasSize(1)))
				.andExpect(jsonPath("$[0].lessons[0].lessonTitle", is("Bài 1: Chào hỏi & Làm quen")));
	}

	@Test
	@DisplayName("HTT-04-CN-006-TC-02: Học sinh tìm bằng pinyin không dấu 'ni hao', khớp 'nǐ hǎo'")
	void testTC02_SearchByPinyinWithoutTone_ReturnsMatch() throws Exception {
		mockMvc.perform(get(SEARCH_URL)
						.param("query", "ni hao")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].hanzi", is("你好")))
				.andExpect(jsonPath("$[0].pinyin", is("nǐ hǎo")));

		// Thử thêm biến thể viết liền "nihao"
		mockMvc.perform(get(SEARCH_URL)
						.param("query", "nihao")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].hanzi", is("你好")));
	}

	@Test
	@DisplayName("HTT-04-CN-006-TC-03: Học sinh tìm theo nghĩa tiếng Việt 'Xin chào', không phân biệt hoa thường")
	void testTC03_SearchByMeaningIgnoreCase_ReturnsMatch() throws Exception {
		mockMvc.perform(get(SEARCH_URL)
						.param("query", "Xin chào")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].hanzi", is("你好")));

		// Không phân biệt hoa thường: "xin chao" hoặc "xin chào"
		mockMvc.perform(get(SEARCH_URL)
						.param("query", "xin chào")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].hanzi", is("你好")));
	}

	@Test
	@DisplayName("HTT-04-CN-006-TC-04: Không có từ nào khớp, hệ thống trả về danh sách rỗng để hiển thị báo không tìm thấy")
	void testTC04_SearchNoMatch_ReturnsEmptyList() throws Exception {
		mockMvc.perform(get(SEARCH_URL)
						.param("query", "zzzz")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}

	@Test
	@DisplayName("HTT-04-CN-006-TC-05 & CV-04: Từ thuộc bài học đang ẩn hoặc từ riêng của giáo viên khác không xuất hiện trong kết quả")
	void testTC05_HiddenLessonAndPrivateVocab_ExcludedFromSearch() throws Exception {
		// 1. Tìm từ "秘密" (chỉ nằm trong bài học ẩn) -> không xuất hiện
		mockMvc.perform(get(SEARCH_URL)
						.param("query", "秘密")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));

		// 2. Tìm pinyin "mimi" của từ ở bài học ẩn -> không xuất hiện
		mockMvc.perform(get(SEARCH_URL)
						.param("query", "mimi")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));

		// 3. Tìm từ riêng "私词" của giáo viên khác -> không xuất hiện cho học sinh
		mockMvc.perform(get(SEARCH_URL)
						.param("query", "私词")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}
}
