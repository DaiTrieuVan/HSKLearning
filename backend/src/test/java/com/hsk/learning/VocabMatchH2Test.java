package com.hsk.learning;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
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
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.domain.VocabSetItemEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.learning.domain.VocabLearningEntity;
import com.hsk.learning.dto.MatchSubmitRequest;
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
class VocabMatchH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String PRACTICE_URL = "/api/v1/learning/practice";
	private static final String STUDENT_EMAIL = "student_match_m3@test.com";
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
	private VocabSetEntity tenWordsSet;
	private List<VocabularyEntity> tenVocabs;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		registrationService.registerStudent(
				new RegisterStudentRequest("Match Student", STUDENT_EMAIL, PASSWORD, PASSWORD));
		student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		token = loginAndGetToken(STUDENT_EMAIL, PASSWORD);

		tenWordsSet = vocabSetRepository.save(new VocabSetEntity(student.getId(), "Bộ Nối Từ 10", "Test Milestone 3"));
		tenVocabs = new ArrayList<>();

		String[][] rows = {
				{"通知", "tōng zhī", "thông báo", "verb"},
				{"约时间", "yuē shí jiān", "hẹn thời gian", "phrase"},
				{"改期", "gǎi qī", "đổi lịch", "verb"},
				{"迟到", "chí dào", "đến muộn", "verb"},
				{"顺路", "shùn lù", "tiện đường", "adjective"},
				{"麻烦", "má fan", "phiền, làm phiền", "verb"},
				{"方便", "fāng biàn", "tiện, thuận tiện", "adjective"},
				{"确认", "què rèn", "xác nhận", "verb"},
				{"回复", "huí fù", "trả lời, hồi âm", "verb"},
				{"联系", "lián xì", "liên lạc", "verb"}
		};
		for (int i = 0; i < rows.length; i++) {
			VocabularyEntity v = vocabularyRepository.save(new VocabularyEntity(
					rows[i][0], rows[i][1], rows[i][2], rows[i][3], null,
					null, null, null, null, student.getId()));
			vocabSetItemRepository.save(new VocabSetItemEntity(tenWordsSet, v, i + 1));
			tenVocabs.add(v);
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
	@DisplayName("Match M3-01: Chế độ MATCH_MEANING chia 10 từ thành 2 lượt (8 + 2) và giữ pinyin gợi ý ở cột trái")
	void testMatchMeaning_Splits10WordsInto2Rounds() throws Exception {
		mockMvc.perform(get(PRACTICE_URL + "/match")
						.param("vocabSetId", tenWordsSet.getId().toString())
						.param("mode", "MATCH_MEANING")
						.param("order", "DEFAULT")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vocabSetTitle", is("Bộ Nối Từ 10")))
				.andExpect(jsonPath("$.mode", is("MATCH_MEANING")))
				.andExpect(jsonPath("$.totalPairs", is(10)))
				.andExpect(jsonPath("$.maxHearts", is(5)))
				.andExpect(jsonPath("$.rounds", hasSize(2)))
				.andExpect(jsonPath("$.rounds[0].pairsCount", is(8)))
				.andExpect(jsonPath("$.rounds[0].leftCards", hasSize(8)))
				.andExpect(jsonPath("$.rounds[0].rightCards", hasSize(8)))
				.andExpect(jsonPath("$.rounds[0].leftCards[0].secondaryText", notNullValue()))
				.andExpect(jsonPath("$.rounds[1].pairsCount", is(2)))
				.andExpect(jsonPath("$.rounds[1].leftCards", hasSize(2)))
				.andExpect(jsonPath("$.rounds[1].rightCards", hasSize(2)));
	}

	@Test
	@DisplayName("Match M3-02: Chế độ MATCH_PINYIN ẩn pinyin ở cột trái và tự tách từ đồng âm (他 / 她) sang 2 lượt khác nhau")
	void testMatchPinyin_PreventsCollisionInSameRound() throws Exception {
		VocabSetEntity homophoneSet = vocabSetRepository.save(
				new VocabSetEntity(student.getId(), "Bộ Đồng Âm", "Test trùng pinyin"));

		VocabularyEntity he = vocabularyRepository.save(new VocabularyEntity(
				"他", "tā", "anh ấy", "pronoun", null, null, null, null, null, student.getId()));
		VocabularyEntity she = vocabularyRepository.save(new VocabularyEntity(
				"她", "tā", "cô ấy", "pronoun", null, null, null, null, null, student.getId()));
		VocabularyEntity me = vocabularyRepository.save(new VocabularyEntity(
				"我", "wǒ", "tôi", "pronoun", null, null, null, null, null, student.getId()));

		vocabSetItemRepository.save(new VocabSetItemEntity(homophoneSet, he, 1));
		vocabSetItemRepository.save(new VocabSetItemEntity(homophoneSet, she, 2));
		vocabSetItemRepository.save(new VocabSetItemEntity(homophoneSet, me, 3));

		MvcResult res = mockMvc.perform(get(PRACTICE_URL + "/match")
						.param("vocabSetId", homophoneSet.getId().toString())
						.param("mode", "MATCH_PINYIN")
						.param("order", "DEFAULT")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalPairs", is(3)))
				.andExpect(jsonPath("$.rounds", hasSize(2)))
				.andExpect(jsonPath("$.rounds[0].leftCards[0].secondaryText", nullValue()))
				.andReturn();

		JsonNode root = objectMapper.readTree(res.getResponse().getContentAsString(StandardCharsets.UTF_8));
		for (JsonNode round : root.get("rounds")) {
			Set<String> rightLabels = new HashSet<>();
			for (JsonNode card : round.get("rightCards")) {
				String pinyin = card.get("primaryText").asText().trim().toLowerCase();
				assertTrue(rightLabels.add(pinyin), "Không được có 2 pinyin giống nhau trong cùng 1 bảng");
			}
		}
	}

	@Test
	@DisplayName("Match M3-03: Submit tôn trọng checkbox Đã thuộc, cộng XP, idempotency và ghi lịch sử MATCH")
	void testSubmitMatch_RespectsCheckboxes_AwardsXp_IdempotencyAndHistory() throws Exception {
		String idemKey = "match-idem-abc-01";
		MatchSubmitRequest req = new MatchSubmitRequest(
				tenWordsSet.getId(),
				"MATCH_PINYIN",
				25,
				4,
				false,
				idemKey,
				List.of(
						// Cặp 1: ghép chuẩn & đánh dấu Đã thuộc
						new MatchSubmitRequest.MatchResultItemRequest(tenVocabs.get(0).getId(), true, 0, true),
						// Cặp 2: ghép chuẩn nhưng bỏ tick Đã thuộc trên màn tổng kết
						new MatchSubmitRequest.MatchResultItemRequest(tenVocabs.get(1).getId(), true, 0, false),
						// Cặp 3: có 1 lần ghép nhầm trước khi nối đúng -> tính lỗi, isMastered=false
						new MatchSubmitRequest.MatchResultItemRequest(tenVocabs.get(2).getId(), true, 1, true)
				)
		);

		// 2 sạch * 2 + 10 bonus hoàn thành (remainingHearts=4, !timedOut, all matched) = 14 XP
		mockMvc.perform(post(PRACTICE_URL + "/match/submit")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.correctCount", is(2)))
				.andExpect(jsonPath("$.totalCount", is(3)))
				.andExpect(jsonPath("$.accuracyPercent", is(67)))
				.andExpect(jsonPath("$.baseXp", is(4)))
				.andExpect(jsonPath("$.completionBonusXp", is(10)))
				.andExpect(jsonPath("$.xpEarned", is(14)))
				.andExpect(jsonPath("$.duplicateSubmission", is(false)));

		VocabLearningEntity word0 = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), tenVocabs.get(0).getId()).orElseThrow();
		VocabLearningEntity word1 = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), tenVocabs.get(1).getId()).orElseThrow();
		VocabLearningEntity word2 = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), tenVocabs.get(2).getId()).orElseThrow();

		assertTrue(word0.isMastered());
		assertFalse(word1.isMastered(), "Từ được bỏ chọn trên màn tổng kết phải giữ isMastered = false");
		assertFalse(word2.isMastered(), "Từ bị ghép nhầm phải giữ isMastered = false");

		// Idempotency check
		mockMvc.perform(post(PRACTICE_URL + "/match/submit")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.duplicateSubmission", is(true)))
				.andExpect(jsonPath("$.xpEarned", is(14)))
				.andExpect(jsonPath("$.totalUserXp", is(14)));

		// Kiểm tra lịch sử luyện tập
		mockMvc.perform(get(PRACTICE_URL + "/history")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].gameType", is("MATCH")))
				.andExpect(jsonPath("$[0].gameMode", is("MATCH_PINYIN")))
				.andExpect(jsonPath("$[0].vocabSetTitle", is("Bộ Nối Từ 10")))
				.andExpect(jsonPath("$[0].xpEarned", is(14)));
	}

	@Test
	@DisplayName("Match M3-04: Hết 5 tim (0 hearts) kết thúc sớm không thưởng +10 XP hoàn thành")
	void testSubmitMatch_OutOfHearts_NoCompletionBonus() throws Exception {
		MatchSubmitRequest req = new MatchSubmitRequest(
				tenWordsSet.getId(),
				"MATCH_MEANING",
				18,
				0,
				false,
				"match-fail-hearts",
				List.of(
						new MatchSubmitRequest.MatchResultItemRequest(tenVocabs.get(0).getId(), true, 0, true),
						new MatchSubmitRequest.MatchResultItemRequest(tenVocabs.get(1).getId(), false, 2, false)
				)
		);

		mockMvc.perform(post(PRACTICE_URL + "/match/submit")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.correctCount", is(1)))
				.andExpect(jsonPath("$.baseXp", is(2)))
				.andExpect(jsonPath("$.completionBonusXp", is(0)))
				.andExpect(jsonPath("$.xpEarned", is(2)));

		VocabLearningEntity failedWord = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), tenVocabs.get(1).getId()).orElseThrow();
		assertFalse(failedWord.isMastered());
	}
}
