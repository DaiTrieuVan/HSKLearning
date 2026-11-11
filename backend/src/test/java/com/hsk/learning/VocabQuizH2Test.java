package com.hsk.learning;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.domain.VocabSetItemEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.learning.domain.VocabLearningEntity;
import com.hsk.learning.dto.QuizSubmitRequest;
import com.hsk.learning.repository.UserXpTransactionRepository;
import com.hsk.learning.repository.VocabLearningRepository;
import com.hsk.learning.repository.VocabPracticeSessionRepository;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
class VocabQuizH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String PRACTICE_URL = "/api/v1/learning/practice";
	private static final String STUDENT_EMAIL = "student_quiz_m2@test.com";
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
	private VocabPracticeSessionRepository vocabPracticeSessionRepository;

	@Autowired
	private UserXpTransactionRepository userXpTransactionRepository;

	private UserEntity student;
	private String token;
	private VocabSetEntity smallSet;
	private List<VocabularyEntity> setVocabs;
	private List<VocabularyEntity> publicVocabs;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		registrationService.registerStudent(
				new RegisterStudentRequest("Quiz Student", STUDENT_EMAIL, PASSWORD, PASSWORD));
		student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		token = loginAndGetToken(STUDENT_EMAIL, PASSWORD);

		HskLevelEntity hsk1 = hskLevelRepository.findByCode("HSK_1").orElseGet(() ->
				hskLevelRepository.save(new HskLevelEntity("HSK_1", "HSK 1", 1, "HSK 1", 150)));

		// Seed 4 public shared HSK words so fallback distractors work smoothly
		publicVocabs = new ArrayList<>();
		String[][] sharedData = {
				{"苹果", "píngguǒ", "quả táo", "noun"},
				{"喝茶", "hē chá", "uống trà", "verb"},
				{"快乐", "kuàilè", "vui vẻ", "adjective"},
				{"朋友", "péngyou", "bạn bè", "noun"}
		};
		for (String[] row : sharedData) {
			publicVocabs.add(vocabularyRepository.save(new VocabularyEntity(
					row[0], row[1], row[2], row[3], null, null, null, null, hsk1, null)));
		}

		// Create small custom vocab set with only 2 words (edge case < 4 words + Context test)
		smallSet = vocabSetRepository.save(new VocabSetEntity(student.getId(), "Bộ nhỏ Quiz", "Kiểm thử Quiz"));
		setVocabs = new ArrayList<>();

		VocabularyEntity wordWithCombinedExample = vocabularyRepository.save(new VocabularyEntity(
				"学习", "xuéxí", "học tập", "verb", null,
				"我每天学习中文。(Tôi học tiếng Trung mỗi ngày.)", null, null, null, student.getId()));
		VocabularyEntity wordWithoutExample = vocabularyRepository.save(new VocabularyEntity(
				"工作", "gōngzuò", "công việc", "noun", null,
				null, null, null, null, student.getId()));

		vocabSetItemRepository.save(new VocabSetItemEntity(smallSet, wordWithCombinedExample, 1));
		vocabSetItemRepository.save(new VocabSetItemEntity(smallSet, wordWithoutExample, 2));
		setVocabs.add(wordWithCombinedExample);
		setVocabs.add(wordWithoutExample);
	}

	@AfterEach
	void tearDown() {
		vocabPracticeSessionRepository.deleteAll();
		userXpTransactionRepository.deleteAll();
		vocabLearningRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		lessonVocabularyRepository.deleteAll();
		vocabularyRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		String payload = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
		MvcResult res = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(payload))
				.andExpect(status().isOk())
				.andReturn();
		return objectMapper.readTree(res.getResponse().getContentAsString(StandardCharsets.UTF_8)).get("token").asText();
	}

	@Test
	@DisplayName("Quiz M2-01: Bộ từ < 4 từ vẫn sinh đủ 4 phương án độc nhất lấy bù từ kho chung")
	void testSmallCustomSet_Generates4UniqueOptions() throws Exception {
		MvcResult res = mockMvc.perform(get(PRACTICE_URL + "/quiz")
						.param("vocabSetId", smallSet.getId().toString())
						.param("mode", "HANZI_TO_MEANING")
						.param("order", "DEFAULT")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vocabSetTitle", is("Bộ nhỏ Quiz")))
				.andExpect(jsonPath("$.totalQuestions", is(2)))
				.andExpect(jsonPath("$.questions[0].mode", is("HANZI_TO_MEANING")))
				.andExpect(jsonPath("$.questions[0].options", hasSize(4)))
				.andExpect(jsonPath("$.questions[1].options", hasSize(4)))
				.andReturn();

		JsonNode root = objectMapper.readTree(res.getResponse().getContentAsString(StandardCharsets.UTF_8));
		for (JsonNode q : root.get("questions")) {
			int correctCount = 0;
			Set<String> labels = new HashSet<>();
			for (JsonNode opt : q.get("options")) {
				if (opt.get("correct").asBoolean()) {
					correctCount++;
				}
				labels.add(opt.get("label").asText());
			}
			assertEquals(1, correctCount, "Phải có đúng 1 đáp án đúng");
			assertEquals(4, labels.size(), "4 đáp án không được trùng lặp");
		}
	}

	@Test
	@DisplayName("Quiz M2-02: Chế độ CONTEXT tách đúng câu ví dụ, che hanzi bằng ____ và fallback sang MEANING_TO_HANZI khi thiếu ví dụ")
	void testContextMode_MasksSentenceAndFallbacksMissingExample() throws Exception {
		mockMvc.perform(get(PRACTICE_URL + "/quiz")
						.param("vocabSetId", smallSet.getId().toString())
						.param("mode", "CONTEXT")
						.param("order", "DEFAULT")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.questions", hasSize(2)))
				// Từ thứ 1 ("学习") có ví dụ -> chế độ CONTEXT & maskedSentence chứa ____, không chứa 学习
				.andExpect(jsonPath("$.questions[0].hanzi", is("学习")))
				.andExpect(jsonPath("$.questions[0].mode", is("CONTEXT")))
				.andExpect(jsonPath("$.questions[0].maskedSentence", containsString("____")))
				.andExpect(jsonPath("$.questions[0].maskedSentence", not(containsString("学习"))))
				.andExpect(jsonPath("$.questions[0].exampleMeaning", is("Tôi học tiếng Trung mỗi ngày.")))
				.andExpect(jsonPath("$.questions[0].options", hasSize(4)))
				// Từ thứ 2 ("工作") thiếu ví dụ -> fallback sang MEANING_TO_HANZI
				.andExpect(jsonPath("$.questions[1].hanzi", is("工作")))
				.andExpect(jsonPath("$.questions[1].mode", is("MEANING_TO_HANZI")))
				.andExpect(jsonPath("$.questions[1].options", hasSize(4)));
	}

	@Test
	@DisplayName("Quiz M2-03: Chế độ MIXED trộn cả HANZI_TO_MEANING và MEANING_TO_HANZI")
	void testMixedMode_IncludesBothDirections() throws Exception {
		mockMvc.perform(get(PRACTICE_URL + "/quiz")
						.param("vocabSetId", smallSet.getId().toString())
						.param("mode", "MIXED")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.questions", hasSize(2)))
				.andExpect(jsonPath("$.questions[*].mode", hasItem("HANZI_TO_MEANING")))
				.andExpect(jsonPath("$.questions[*].mode", hasItem("MEANING_TO_HANZI")));
	}

	@Test
	@DisplayName("Quiz M2-04: Submit kết quả đồng bộ isMastered, thưởng XP, chống submit trùng (idempotency) và lưu lịch sử")
	void testSubmitQuiz_UpdatesMastered_AwardsXp_IdempotencyAndHistory() throws Exception {
		String idemKey = "quiz-idem-12345";
		QuizSubmitRequest request = new QuizSubmitRequest(
				smallSet.getId(),
				"HANZI_TO_MEANING",
				42,
				idemKey,
				List.of(
						new QuizSubmitRequest.QuizAnswerItemRequest(setVocabs.get(0).getId(), true),
						new QuizSubmitRequest.QuizAnswerItemRequest(setVocabs.get(1).getId(), false)
				)
		);

		// 1/2 = 50% -> 1 * 2 + 10 = 12 XP
		mockMvc.perform(post(PRACTICE_URL + "/quiz/submit")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.correctCount", is(1)))
				.andExpect(jsonPath("$.totalCount", is(2)))
				.andExpect(jsonPath("$.accuracyPercent", is(50)))
				.andExpect(jsonPath("$.xpEarned", is(12)))
				.andExpect(jsonPath("$.duplicateSubmission", is(false)));

		// Kiểm tra đồng bộ is_mastered trên vocab_learning
		VocabLearningEntity learnedRight = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), setVocabs.get(0).getId())
				.orElseThrow();
		VocabLearningEntity learnedWrong = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), setVocabs.get(1).getId())
				.orElseThrow();
		assertTrue(learnedRight.isMastered());
		assertFalse(learnedWrong.isMastered());

		// Gửi lại với cùng idempotencyKey -> trả về duplicateSubmission=true, không cộng XP lần 2
		mockMvc.perform(post(PRACTICE_URL + "/quiz/submit")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.xpEarned", is(12)))
				.andExpect(jsonPath("$.totalUserXp", is(12)))
				.andExpect(jsonPath("$.duplicateSubmission", is(true)));

		// Kiểm tra lịch sử luyện tập chỉ có đúng 1 phiên
		mockMvc.perform(get(PRACTICE_URL + "/history")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].vocabSetTitle", is("Bộ nhỏ Quiz")))
				.andExpect(jsonPath("$[0].gameType", is("QUIZ")))
				.andExpect(jsonPath("$[0].correctCount", is(1)))
				.andExpect(jsonPath("$[0].totalCount", is(2)))
				.andExpect(jsonPath("$[0].xpEarned", is(12)));
	}
}
