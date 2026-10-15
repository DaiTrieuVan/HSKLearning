package com.hsk.learning;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
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
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.GrammarExampleRepository;
import com.hsk.content.repository.GrammarPointRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.learning.domain.FlashcardResult;
import com.hsk.learning.domain.VocabLearningEntity;
import com.hsk.learning.dto.ReviewFlashcardCommand;
import com.hsk.learning.repository.LessonProgressRepository;
import com.hsk.learning.repository.VocabLearningRepository;
import java.nio.charset.StandardCharsets;
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

/**
 * Integration tests for HTT-04-CN-005: Học từ vựng bằng flashcard
 * Covers TC-01, TC-02, TC-03, TC-04 and TC-05 (QTN-02).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class FlashcardLearningH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String FLASHCARD_URL = "/api/v1/learning/flashcards";
	private static final String STUDENT_A_EMAIL = "student_flashcard_a@test.com";
	private static final String STUDENT_B_EMAIL = "student_flashcard_b@test.com";
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

	private UserEntity studentA;
	private UserEntity studentB;
	private String tokenA;
	private String tokenB;
	private LessonEntity lesson1;
	private List<VocabularyEntity> tenVocabularies;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Register Student A
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh A", STUDENT_A_EMAIL, PASSWORD, PASSWORD));
		studentA = userRepository.findByEmailIgnoreCase(STUDENT_A_EMAIL).orElseThrow();
		tokenA = loginAndGetToken(STUDENT_A_EMAIL, PASSWORD);

		// Register Student B
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh B", STUDENT_B_EMAIL, PASSWORD, PASSWORD));
		studentB = userRepository.findByEmailIgnoreCase(STUDENT_B_EMAIL).orElseThrow();
		tokenB = loginAndGetToken(STUDENT_B_EMAIL, PASSWORD);

		// Prepare HSK 1 level and Lesson 1
		HskLevelEntity hsk1 = hskLevelRepository.findByCode("HSK_1").orElseGet(() ->
				hskLevelRepository.save(new HskLevelEntity("HSK_1", "HSK 1 - Nhập môn", 1, "Mô tả HSK 1", 150)));

		lesson1 = lessonRepository.save(new LessonEntity(hsk1, "Bài 1: Chào hỏi & Làm quen", "Mô tả bài 1", 1, null));

		// Create 10 vocabularies for Lesson 1 (TC-01, TC-03)
		tenVocabularies = new ArrayList<>();
		String[] hanzis = {"你", "好", "我", "他", "她", "们", "不", "很", "是", "吗"};
		String[] pinyins = {"nǐ", "hǎo", "wǒ", "tā", "tā", "men", "bù", "hěn", "shì", "ma"};
		String[] meanings = {"Bạn", "Tốt", "Tôi", "Anh ấy", "Cô ấy", "Các bạn", "Không", "Rất", "Là", "Không (hỏi)"};

		for (int i = 0; i < 10; i++) {
			VocabularyEntity vocab = vocabularyRepository.save(
					new VocabularyEntity(hanzis[i], pinyins[i], meanings[i], "word", null, null, null, null, hsk1, null));
			tenVocabularies.add(vocab);
			lessonVocabularyRepository.save(new LessonVocabularyEntity(lesson1, vocab, i + 1));
		}
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
	@DisplayName("HTT-04-CN-005-TC-01: Bắt đầu học flashcard, hệ thống hiển thị 10 thẻ đầy đủ chữ Hán, pinyin và nghĩa")
	void testTC01_StartFlashcardSession_Returns10Cards() throws Exception {
		mockMvc.perform(get(FLASHCARD_URL)
						.param("lessonId", lesson1.getId().toString())
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(10)))
				.andExpect(jsonPath("$[0].hanzi", is("你")))
				.andExpect(jsonPath("$[0].pinyin", is("nǐ")))
				.andExpect(jsonPath("$[0].meaning", is("Bạn")))
				.andExpect(jsonPath("$[0].lastResult", nullValue()))
				.andExpect(jsonPath("$[9].hanzi", is("吗")));
	}

	@Test
	@DisplayName("HTT-04-CN-005-TC-02: Học sinh đánh dấu đã nhớ từ, hệ thống lưu kết quả và chuyển thẻ")
	void testTC02_MarkRemembered_SavesResult() throws Exception {
		VocabularyEntity vocab = tenVocabularies.get(0); // "你"
		ReviewFlashcardCommand command = new ReviewFlashcardCommand(vocab.getId(), FlashcardResult.REMEMBERED);

		mockMvc.perform(post(FLASHCARD_URL + "/review")
						.header("Authorization", "Bearer " + tokenA)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(command)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vocabularyId", is(vocab.getId().intValue())))
				.andExpect(jsonPath("$.result", is("REMEMBERED")))
				.andExpect(jsonPath("$.repetitionLevel", is(2)))
				.andExpect(jsonPath("$.intervalDays", is(2)));

		VocabLearningEntity saved = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(studentA.getId(), vocab.getId())
				.orElse(null);
		assertNotNull(saved);
		assertEquals(FlashcardResult.REMEMBERED, saved.getLastResult());
	}

	@Test
	@DisplayName("HTT-04-CN-005-TC-03: Đi hết 10 thẻ (8 nhớ, 2 chưa nhớ), tổng kết lượt học và cho phép học lại riêng 2 từ chưa nhớ")
	void testTC03_SessionSummary_8Remembered_2Forgotten_AndRelearnOnlyForgotten() throws Exception {
		// Đánh dấu 8 từ nhớ (từ 0 đến 7)
		for (int i = 0; i < 8; i++) {
			ReviewFlashcardCommand cmd = new ReviewFlashcardCommand(tenVocabularies.get(i).getId(), FlashcardResult.REMEMBERED);
			mockMvc.perform(post(FLASHCARD_URL + "/review")
							.header("Authorization", "Bearer " + tokenA)
							.contentType(MediaType.APPLICATION_JSON)
							.content(objectMapper.writeValueAsString(cmd)))
					.andExpect(status().isOk());
		}

		// Đánh dấu 2 từ chưa nhớ (từ 8 và 9)
		for (int i = 8; i < 10; i++) {
			ReviewFlashcardCommand cmd = new ReviewFlashcardCommand(tenVocabularies.get(i).getId(), FlashcardResult.FORGOTTEN);
			mockMvc.perform(post(FLASHCARD_URL + "/review")
							.header("Authorization", "Bearer " + tokenA)
							.contentType(MediaType.APPLICATION_JSON)
							.content(objectMapper.writeValueAsString(cmd)))
					.andExpect(status().isOk());
		}

		// Kiểm tra Summary lượt học: 8 nhớ, 2 chưa nhớ
		mockMvc.perform(get(FLASHCARD_URL + "/summary")
						.param("lessonId", lesson1.getId().toString())
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalCards", is(10)))
				.andExpect(jsonPath("$.rememberedCount", is(8)))
				.andExpect(jsonPath("$.forgottenCount", is(2)))
				.andExpect(jsonPath("$.unreviewedCount", is(0)))
				.andExpect(jsonPath("$.forgottenVocabularyIds", hasSize(2)));

		// Học lại riêng các từ chưa nhớ (onlyForgotten=true) -> chỉ trả về đúng 2 từ chưa nhớ
		mockMvc.perform(get(FLASHCARD_URL)
						.param("lessonId", lesson1.getId().toString())
						.param("onlyForgotten", "true")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(2)))
				.andExpect(jsonPath("$[0].hanzi", is("是")))
				.andExpect(jsonPath("$[1].hanzi", is("吗")));
	}

	@Test
	@DisplayName("HTT-04-CN-005-TC-04: Bộ từ rỗng không có từ vựng, hệ thống trả về danh sách rỗng để hiển thị báo không có từ để học")
	void testTC04_EmptyVocabSet_ReturnsEmptyList() throws Exception {
		// Tạo 1 bộ từ vựng rỗng (0 từ)
		VocabSetEntity emptySet = vocabSetRepository.save(new VocabSetEntity(studentA.getId(), "Bộ từ rỗng", "Chưa có từ nào"));

		mockMvc.perform(get(FLASHCARD_URL)
						.param("vocabSetId", emptySet.getId().toString())
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));

		mockMvc.perform(get(FLASHCARD_URL + "/summary")
						.param("vocabSetId", emptySet.getId().toString())
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalCards", is(0)))
				.andExpect(jsonPath("$.rememberedCount", is(0)))
				.andExpect(jsonPath("$.forgottenCount", is(0)));
	}

	@Test
	@DisplayName("HTT-04-CN-005-TC-05 & QTN-02: Học sinh A và B cùng học 1 bài, kết quả độc lập, học sinh chỉ xem dữ liệu của chính mình")
	void testTC05_StudentIsolation_QTN02() throws Exception {
		VocabularyEntity vocab = tenVocabularies.get(0);

		// Học sinh A đánh dấu REMEMBERED
		ReviewFlashcardCommand cmdA = new ReviewFlashcardCommand(vocab.getId(), FlashcardResult.REMEMBERED);
		mockMvc.perform(post(FLASHCARD_URL + "/review")
						.header("Authorization", "Bearer " + tokenA)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(cmdA)))
				.andExpect(status().isOk());

		// Học sinh B đánh dấu FORGOTTEN cho cùng từ đó
		ReviewFlashcardCommand cmdB = new ReviewFlashcardCommand(vocab.getId(), FlashcardResult.FORGOTTEN);
		mockMvc.perform(post(FLASHCARD_URL + "/review")
						.header("Authorization", "Bearer " + tokenB)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(cmdB)))
				.andExpect(status().isOk());

		// Học sinh A xem danh sách -> từ đó hiển thị REMEMBERED
		mockMvc.perform(get(FLASHCARD_URL)
						.param("lessonId", lesson1.getId().toString())
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].lastResult", is("REMEMBERED")));

		// Học sinh B xem danh sách -> từ đó hiển thị FORGOTTEN
		mockMvc.perform(get(FLASHCARD_URL)
						.param("lessonId", lesson1.getId().toString())
						.header("Authorization", "Bearer " + tokenB))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].lastResult", is("FORGOTTEN")));

		// Summary của Học sinh A có 1 remembered, 0 forgotten
		mockMvc.perform(get(FLASHCARD_URL + "/summary")
						.param("lessonId", lesson1.getId().toString())
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.rememberedCount", is(1)))
				.andExpect(jsonPath("$.forgottenCount", is(0)));

		// Summary của Học sinh B có 0 remembered, 1 forgotten
		mockMvc.perform(get(FLASHCARD_URL + "/summary")
						.param("lessonId", lesson1.getId().toString())
						.header("Authorization", "Bearer " + tokenB))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.rememberedCount", is(0)))
				.andExpect(jsonPath("$.forgottenCount", is(1)));
	}
}
