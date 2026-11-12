package com.hsk.learning;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.domain.VocabSetItemEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.learning.domain.FlashcardResult;
import com.hsk.learning.domain.VocabLearningEntity;
import com.hsk.learning.dto.TypingSubmitRequest;
import com.hsk.learning.repository.UserXpTransactionRepository;
import com.hsk.learning.repository.VocabLearningRepository;
import com.hsk.learning.repository.VocabPracticeSessionRepository;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
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
class VocabDictationH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String PRACTICE_URL = "/api/v1/learning/practice";
	private static final String STUDENT_EMAIL = "student_dictation_m6@test.com";
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
	private VocabSetEntity dictationSet;
	private List<VocabularyEntity> vocabs;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		registrationService.registerStudent(
				new RegisterStudentRequest("Dictation Student", STUDENT_EMAIL, PASSWORD, PASSWORD));
		student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		token = loginAndGetToken(STUDENT_EMAIL, PASSWORD);

		dictationSet = vocabSetRepository.save(new VocabSetEntity(student.getId(), "Bộ Nghe Viết Test", "Test Milestone 6"));
		vocabs = new ArrayList<>();

		VocabularyEntity v1 = vocabularyRepository.save(new VocabularyEntity(
				"方便", "fāng biàn", "tiện, thuận tiện", "adj", null,
				"你现在方便接电话吗？", "Nǐ xiànzài fāngbiàn jiē diànhuà ma?", "Bây giờ bạn có tiện nghe điện thoại không?", null, student.getId()));
		VocabularyEntity v2 = vocabularyRepository.save(new VocabularyEntity(
				"确认", "què rèn", "xác nhận", "verb", null,
				"我想确认一下晚餐的地点。", "Wǒ xiǎng quèrèn yíxià wǎncān de dìdiǎn.", "Tôi muốn xác nhận lại địa điểm ăn tối.", null, student.getId()));
		VocabularyEntity v3 = vocabularyRepository.save(new VocabularyEntity(
				"通知", "tōng zhī", "thông báo", "verb", null,
				"请及时通知大家。", "Qǐng jíshí tōngzhī dàjiā.", "Vui lòng thông báo kịp thời cho mọi người.", null, student.getId()));

		vocabs.add(v1);
		vocabs.add(v2);
		vocabs.add(v3);

		for (int i = 0; i < vocabs.size(); i++) {
			vocabSetItemRepository.save(new VocabSetItemEntity(dictationSet, vocabs.get(i), i + 1));
		}
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
	@DisplayName("Dictation M6-01: GET /dictation trả về danh sách từ kèm câu ví dụ đã che từ khóa")
	void testGenerateDictation_WordAndPinyinModes_ReturnMaskedExample() throws Exception {
		mockMvc.perform(get(PRACTICE_URL + "/dictation")
						.param("vocabSetId", dictationSet.getId().toString())
						.param("mode", "WORD")
						.param("order", "DEFAULT")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vocabSetTitle", is("Bộ Nghe Viết Test")))
				.andExpect(jsonPath("$.mode", is("WORD")))
				.andExpect(jsonPath("$.totalQuestions", is(3)))
				.andExpect(jsonPath("$.items", hasSize(3)))
				.andExpect(jsonPath("$.items[0].hanzi", is("方便")))
				.andExpect(jsonPath("$.items[0].maskedExampleSentence", is("你现在 ____ 接电话吗？")));

		mockMvc.perform(get(PRACTICE_URL + "/dictation")
						.param("vocabSetId", dictationSet.getId().toString())
						.param("mode", "INVALID")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("Dictation M6-02: POST /dictation/submit cộng +3 XP/câu + 15 XP thưởng hoàn thành và chống gửi trùng")
	void testSubmitDictation_AwardsBoostedXpSyncsSrsAndIsIdempotent() throws Exception {
		TypingSubmitRequest request = new TypingSubmitRequest(
				dictationSet.getId(),
				"PINYIN",
				55,
				"dictation-idem-001",
				List.of(
						new TypingSubmitRequest.TypingResultItemRequest(vocabs.get(0).getId(), true, 1, true),
						new TypingSubmitRequest.TypingResultItemRequest(vocabs.get(1).getId(), true, 0, false),
						new TypingSubmitRequest.TypingResultItemRequest(vocabs.get(2).getId(), false, 3, true)
				)
		);

		// 2/3 đúng (67% >= 50%) -> baseXp = 2 * 3 = 6, bonus = 15, total = 21 XP
		mockMvc.perform(post(PRACTICE_URL + "/dictation/submit")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.correctCount", is(2)))
				.andExpect(jsonPath("$.totalCount", is(3)))
				.andExpect(jsonPath("$.accuracyPercent", is(67)))
				.andExpect(jsonPath("$.baseXp", is(6)))
				.andExpect(jsonPath("$.completionBonusXp", is(15)))
				.andExpect(jsonPath("$.xpEarned", is(21)))
				.andExpect(jsonPath("$.duplicateSubmission", is(false)));

		mockMvc.perform(post(PRACTICE_URL + "/dictation/submit")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.xpEarned", is(21)))
				.andExpect(jsonPath("$.duplicateSubmission", is(true)));

		UserEntity reloaded = userRepository.findById(student.getId()).orElseThrow();
		Assertions.assertEquals(21, reloaded.getTotalXp());

		VocabLearningEntity l0 = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), vocabs.get(0).getId())
				.orElseThrow();
		VocabLearningEntity l2 = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), vocabs.get(2).getId())
				.orElseThrow();
		Assertions.assertTrue(l0.isMastered());
		Assertions.assertEquals(FlashcardResult.FORGOTTEN, l2.getLastResult());

		mockMvc.perform(get(PRACTICE_URL + "/history")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].gameType", is("DICTATION")))
				.andExpect(jsonPath("$[0].gameMode", is("DICTATION_PINYIN")))
				.andExpect(jsonPath("$[0].xpEarned", is(21)));
	}
}

