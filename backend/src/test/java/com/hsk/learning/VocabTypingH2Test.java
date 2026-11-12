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
class VocabTypingH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String PRACTICE_URL = "/api/v1/learning/practice";
	private static final String STUDENT_EMAIL = "student_typing_m5@test.com";
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
	private VocabSetEntity typingSet;
	private List<VocabularyEntity> vocabs;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		registrationService.registerStudent(
				new RegisterStudentRequest("Typing Student", STUDENT_EMAIL, PASSWORD, PASSWORD));
		student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		token = loginAndGetToken(STUDENT_EMAIL, PASSWORD);

		typingSet = vocabSetRepository.save(new VocabSetEntity(student.getId(), "Bộ Gõ Từ Test", "Test Milestone 5"));
		vocabs = new ArrayList<>();

		VocabularyEntity v1 = vocabularyRepository.save(new VocabularyEntity(
				"确认", "què rèn", "xác nhận", "verb", null,
				"请确认一下时间。 (Vui lòng xác nhận lại thời gian.)", "Qǐng què rèn yíxià shíjiān.", null, null, student.getId()));
		VocabularyEntity v2 = vocabularyRepository.save(new VocabularyEntity(
				"约时间", "yuē shí jiān", "hẹn thời gian", "phrase", null,
				"我们明天约时间见面吧。", "Wǒmen míngtiān yuē shíjiān jiànmiàn ba.", "Chúng ta ngày mai hẹn thời gian gặp nhé.", null, student.getId()));
		VocabularyEntity v3 = vocabularyRepository.save(new VocabularyEntity(
				"转告", "zhuǎn gào", "nhắn lại, chuyển lời", "verb", null,
				"请帮我转告他。", "Qǐng bāng wǒ zhuǎngào tā.", "Vui lòng giúp tôi nhắn lại với anh ấy.", null, student.getId()));

		vocabs.add(v1);
		vocabs.add(v2);
		vocabs.add(v3);

		for (int i = 0; i < vocabs.size(); i++) {
			vocabSetItemRepository.save(new VocabSetItemEntity(typingSet, vocabs.get(i), i + 1));
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
	@DisplayName("Typing M5-01: GET /typing trả về danh sách từ và che hanzi trong maskedExampleSentence + tách nghĩa gộp")
	void testGenerateTyping_WordMode_ReturnsMaskedExampleAndParsedMeaning() throws Exception {
		mockMvc.perform(get(PRACTICE_URL + "/typing")
						.param("vocabSetId", typingSet.getId().toString())
						.param("mode", "WORD")
						.param("order", "DEFAULT")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vocabSetTitle", is("Bộ Gõ Từ Test")))
				.andExpect(jsonPath("$.mode", is("WORD")))
				.andExpect(jsonPath("$.totalQuestions", is(3)))
				.andExpect(jsonPath("$.items", hasSize(3)))
				.andExpect(jsonPath("$.items[0].hanzi", is("确认")))
				.andExpect(jsonPath("$.items[0].exampleSentence", is("请确认一下时间。")))
				.andExpect(jsonPath("$.items[0].maskedExampleSentence", is("请 ____ 一下时间。")))
				.andExpect(jsonPath("$.items[0].exampleMeaning", is("Vui lòng xác nhận lại thời gian.")))
				.andExpect(jsonPath("$.items[1].maskedExampleSentence", is("我们明天 ____ 见面吧。")));
	}

	@Test
	@DisplayName("Typing M5-02: Hỗ trợ filterStatus=UNMASTERED và từ chối mode không hợp lệ")
	void testGenerateTyping_FilterUnmasteredAndRejectInvalidMode() throws Exception {
		VocabLearningEntity mastered = new VocabLearningEntity(student, vocabs.get(0), FlashcardResult.REMEMBERED);
		mastered.setMastered(true);
		vocabLearningRepository.save(mastered);

		mockMvc.perform(get(PRACTICE_URL + "/typing")
						.param("vocabSetId", typingSet.getId().toString())
						.param("filterStatus", "UNMASTERED")
						.param("mode", "PINYIN")
						.param("order", "DEFAULT")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.mode", is("PINYIN")))
				.andExpect(jsonPath("$.totalQuestions", is(2)))
				.andExpect(jsonPath("$.items[0].hanzi", is("约时间")))
				.andExpect(jsonPath("$.items[1].hanzi", is("转告")));

		mockMvc.perform(get(PRACTICE_URL + "/typing")
						.param("vocabSetId", typingSet.getId().toString())
						.param("mode", "INVALID_MODE")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("Typing M5-03: POST /typing/submit cập nhật SRS, giữ nguyên XP khi dùng gợi ý và chống gửi trùng")
	void testSubmitTyping_UpdatesMasteryAwardsXpAndIsIdempotent() throws Exception {
		TypingSubmitRequest request = new TypingSubmitRequest(
				typingSet.getId(),
				"WORD",
				42,
				"typing-idem-001",
				List.of(
						new TypingSubmitRequest.TypingResultItemRequest(vocabs.get(0).getId(), true, 3, true),
						new TypingSubmitRequest.TypingResultItemRequest(vocabs.get(1).getId(), true, 1, false),
						new TypingSubmitRequest.TypingResultItemRequest(vocabs.get(2).getId(), false, 2, true)
				)
		);

		mockMvc.perform(post(PRACTICE_URL + "/typing/submit")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.correctCount", is(2)))
				.andExpect(jsonPath("$.totalCount", is(3)))
				.andExpect(jsonPath("$.accuracyPercent", is(67)))
				.andExpect(jsonPath("$.baseXp", is(4)))
				.andExpect(jsonPath("$.completionBonusXp", is(10)))
				.andExpect(jsonPath("$.xpEarned", is(14)))
				.andExpect(jsonPath("$.duplicateSubmission", is(false)));

		// Gửi lại cùng idempotencyKey -> không cộng trùng XP
		mockMvc.perform(post(PRACTICE_URL + "/typing/submit")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.xpEarned", is(14)))
				.andExpect(jsonPath("$.duplicateSubmission", is(true)));

		UserEntity reloaded = userRepository.findById(student.getId()).orElseThrow();
		Assertions.assertEquals(14, reloaded.getTotalXp());

		VocabLearningEntity l0 = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), vocabs.get(0).getId())
				.orElseThrow();
		VocabLearningEntity l1 = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), vocabs.get(1).getId())
				.orElseThrow();
		VocabLearningEntity l2 = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), vocabs.get(2).getId())
				.orElseThrow();

		Assertions.assertTrue(l0.isMastered());
		Assertions.assertFalse(l1.isMastered());
		Assertions.assertFalse(l2.isMastered());
		Assertions.assertEquals(FlashcardResult.FORGOTTEN, l2.getLastResult());

		mockMvc.perform(get(PRACTICE_URL + "/history")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].gameType", is("TYPING")))
				.andExpect(jsonPath("$[0].gameMode", is("TYPE_WORD")))
				.andExpect(jsonPath("$[0].xpEarned", is(14)));
	}
}
