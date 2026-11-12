package com.hsk.learning;

import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.greaterThan;
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
import com.hsk.learning.dto.WritingSubmitRequest;
import com.hsk.learning.repository.UserXpTransactionRepository;
import com.hsk.learning.repository.VocabLearningRepository;
import com.hsk.learning.repository.VocabPracticeSessionRepository;
import com.hsk.writing.domain.HanziStrokeDataEntity;
import com.hsk.writing.repository.HanziStrokeDataRepository;
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

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class VocabWritingH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String PRACTICE_URL = "/api/v1/learning/practice";
	private static final String STUDENT_EMAIL = "student_writing_m4@test.com";
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

	@Autowired
	private HanziStrokeDataRepository hanziStrokeDataRepository;

	private UserEntity student;
	private String token;
	private VocabSetEntity writingSet;
	private List<VocabularyEntity> vocabs;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		if (!hanziStrokeDataRepository.existsByHanzi("你")) {
			hanziStrokeDataRepository.save(new HanziStrokeDataEntity(
					"你", 2,
					"[\"M 100 100 L 200 200 Z\",\"M 200 100 L 300 200 Z\"]",
					"[[[100,100],[200,200]],[[200,100],[300,200]]]",
					"test", "MIT"));
		}
		if (!hanziStrokeDataRepository.existsByHanzi("好")) {
			hanziStrokeDataRepository.save(new HanziStrokeDataEntity(
					"好", 2,
					"[\"M 150 150 L 250 250 Z\",\"M 250 150 L 350 250 Z\"]",
					"[[[150,150],[250,250]],[[250,150],[350,250]]]",
					"test", "MIT"));
		}

		registrationService.registerStudent(
				new RegisterStudentRequest("Writing Student", STUDENT_EMAIL, PASSWORD, PASSWORD));
		student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		token = loginAndGetToken(STUDENT_EMAIL, PASSWORD);

		writingSet = vocabSetRepository.save(new VocabSetEntity(student.getId(), "Bộ Viết Chữ Test", "Test Milestone 4"));
		vocabs = new ArrayList<>();

		String[][] rows = {
				{"你好", "nǐ hǎo", "xin chào", "greeting"},
				{"好吗", "hǎo ma", "khỏe không", "phrase"},
				{"通知", "tōng zhī", "thông báo", "verb"}
		};
		for (int i = 0; i < rows.length; i++) {
			VocabularyEntity v = vocabularyRepository.save(new VocabularyEntity(
					rows[i][0], rows[i][1], rows[i][2], rows[i][3], null,
					null, null, null, null, student.getId()));
			vocabSetItemRepository.save(new VocabSetItemEntity(writingSet, v, i + 1));
			vocabs.add(v);
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
	@DisplayName("Writing M4-01: Chế độ TRACE trả về danh sách từ kèm strokes cho chữ đã cache và fallback an toàn cho chữ chưa có")
	void testGenerateWriting_TraceMode_ReturnsCharacterStrokesWithGracefulFallback() throws Exception {
		mockMvc.perform(get(PRACTICE_URL + "/writing")
						.param("vocabSetId", writingSet.getId().toString())
						.param("mode", "TRACE")
						.param("order", "DEFAULT")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vocabSetTitle", is("Bộ Viết Chữ Test")))
				.andExpect(jsonPath("$.mode", is("TRACE")))
				.andExpect(jsonPath("$.totalWords", is(3)))
				.andExpect(jsonPath("$.words", hasSize(3)))
				.andExpect(jsonPath("$.words[0].hanzi", is("你好")))
				.andExpect(jsonPath("$.words[0].characters", hasSize(2)))
				.andExpect(jsonPath("$.words[0].characters[0].hanzi", is("你")))
				.andExpect(jsonPath("$.words[0].characters[0].supported", is(true)))
				.andExpect(jsonPath("$.words[0].characters[0].strokeCount", greaterThan(0)))
				.andExpect(jsonPath("$.words[0].characters[0].strokes", not(empty())))
				.andExpect(jsonPath("$.words[0].characters[1].hanzi", is("好")))
				.andExpect(jsonPath("$.words[0].characters[1].supported", is(true)))
				.andExpect(jsonPath("$.words[2].characters[0].supported", is(false)));
	}

	@Test
	@DisplayName("Writing M4-02: Chế độ PDF giới hạn tối đa 100 từ kể cả khi không truyền limit")
	void testGenerateWriting_PdfMode_CapsAt100Words() throws Exception {
		VocabSetEntity bigSet = vocabSetRepository.save(new VocabSetEntity(student.getId(), "Bộ 105 Từ", "PDF Cap"));
		for (int i = 0; i < 105; i++) {
			VocabularyEntity v = vocabularyRepository.save(new VocabularyEntity(
					"你好" + i, "nǐ hǎo", "nghĩa " + i, "noun", null,
					null, null, null, null, student.getId()));
			vocabSetItemRepository.save(new VocabSetItemEntity(bigSet, v, i + 1));
		}

		mockMvc.perform(get(PRACTICE_URL + "/writing")
						.param("vocabSetId", bigSet.getId().toString())
						.param("mode", "PDF")
						.param("order", "DEFAULT")
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.mode", is("PDF")))
				.andExpect(jsonPath("$.totalWords", is(100)))
				.andExpect(jsonPath("$.words", hasSize(100)));
	}

	@Test
	@DisplayName("Writing M4-03: Submit RECALL cộng XP (+2/từ +10 bonus), đồng bộ is_mastered và chống double submit")
	void testSubmitWriting_RecallMode_AwardsXpAndSyncsMasteryAndIdempotency() throws Exception {
		WritingSubmitRequest request = new WritingSubmitRequest(
				writingSet.getId(),
				"RECALL",
				48,
				"writing-key-001",
				List.of(
						new WritingSubmitRequest.WritingResultItemRequest(vocabs.get(0).getId(), true, 0, true),
						new WritingSubmitRequest.WritingResultItemRequest(vocabs.get(1).getId(), true, 1, false),
						new WritingSubmitRequest.WritingResultItemRequest(vocabs.get(2).getId(), false, 2, false)
				)
		);

		mockMvc.perform(post(PRACTICE_URL + "/writing/submit")
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

		// Replay with identical idempotencyKey must not double XP
		mockMvc.perform(post(PRACTICE_URL + "/writing/submit")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.duplicateSubmission", is(true)))
				.andExpect(jsonPath("$.xpEarned", is(14)));

		UserEntity reloaded = userRepository.findById(student.getId()).orElseThrow();
		assertEquals(14, reloaded.getTotalXp());

		VocabLearningEntity word0 = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), vocabs.get(0).getId()).orElseThrow();
		VocabLearningEntity word1 = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), vocabs.get(1).getId()).orElseThrow();
		VocabLearningEntity word2 = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(student.getId(), vocabs.get(2).getId()).orElseThrow();

		assertTrue(word0.isMastered());
		assertFalse(word1.isMastered());
		assertFalse(word2.isMastered());
	}

	@Test
	@DisplayName("Writing M4-04: Từ chối submit chế độ PDF và trả lỗi 400 VALIDATION_FAILED")
	void testSubmitWriting_RejectsPdfMode() throws Exception {
		WritingSubmitRequest request = new WritingSubmitRequest(
				writingSet.getId(),
				"PDF",
				10,
				"writing-pdf-invalid",
				List.of(new WritingSubmitRequest.WritingResultItemRequest(vocabs.get(0).getId(), true, 0, true))
		);

		mockMvc.perform(post(PRACTICE_URL + "/writing/submit")
						.header("Authorization", "Bearer " + token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("VALIDATION_FAILED")));
	}
}

