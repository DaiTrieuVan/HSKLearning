package com.hsk.learning;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
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
import com.hsk.learning.domain.FlashcardResult;
import com.hsk.learning.domain.VocabLearningEntity;
import com.hsk.learning.dto.SrsReviewRequest;
import com.hsk.learning.repository.LessonProgressRepository;
import com.hsk.learning.repository.VocabLearningRepository;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for HTT-08-CN-001: Ôn từ vựng theo lịch SRS
 * Covers TC-01 to TC-09.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class SrsReviewH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String SRS_URL = "/api/v1/srs";
	private static final String STUDENT_A_EMAIL = "student_srs_a@test.com";
	private static final String STUDENT_B_EMAIL = "student_srs_b@test.com";
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
	private LessonVocabularyRepository lessonVocabularyRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private VocabLearningRepository vocabLearningRepository;

	@Autowired
	private LessonProgressRepository lessonProgressRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

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
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	private String tokenA;
	private String tokenB;
	private UserEntity userA;
	private UserEntity userB;
	private LessonEntity activeLesson;
	private LessonEntity hiddenLesson;
	private final List<VocabularyEntity> vocabs = new ArrayList<>();

	@BeforeEach
	void setUp() {
		cleanupData();

		// Register students
		registrationService.registerStudent(new RegisterStudentRequest(
				"Student A", STUDENT_A_EMAIL, PASSWORD, PASSWORD));
		registrationService.registerStudent(new RegisterStudentRequest(
				"Student B", STUDENT_B_EMAIL, PASSWORD, PASSWORD));

		userA = userRepository.findByEmailIgnoreCase(STUDENT_A_EMAIL).orElseThrow();
		userB = userRepository.findByEmailIgnoreCase(STUDENT_B_EMAIL).orElseThrow();

		tokenA = loginAndGetToken(STUDENT_A_EMAIL, PASSWORD);
		tokenB = loginAndGetToken(STUDENT_B_EMAIL, PASSWORD);

		// Create HskLevel
		HskLevelEntity hsk1 = hskLevelRepository.findByCode("HSK_1")
				.orElseGet(() -> hskLevelRepository.save(new HskLevelEntity("HSK_1", "HSK 1 - Nhập môn", 1, "Mô tả HSK 1", 150)));

		// Create active lesson & hidden lesson
		activeLesson = lessonRepository.save(new LessonEntity(hsk1, "Lesson 1", "L1", 1, null));
		
		LessonEntity hl = new LessonEntity(hsk1, "Lesson Hidden", "LH", 2, null);
		hl.setHidden(true);
		hiddenLesson = lessonRepository.save(hl);

		// Create vocabularies
		vocabs.clear();
		for (int i = 1; i <= 5; i++) {
			VocabularyEntity v = vocabularyRepository.save(new VocabularyEntity(
					"词" + i, "cí" + i, "Meaning " + i, "word",
					null, "例句" + i, "lìjù" + i, "Ví dụ " + i, hsk1, null));
			vocabs.add(v);

			if (i <= 4) {
				lessonVocabularyRepository.save(new LessonVocabularyEntity(activeLesson, v, i));
			} else {
				// vocab 5 belongs only to hidden lesson
				lessonVocabularyRepository.save(new LessonVocabularyEntity(hiddenLesson, v, 1));
			}
		}
	}

	@AfterEach
	void tearDown() {
		cleanupData();
	}

	private void cleanupData() {
		vocabLearningRepository.deleteAll();
		lessonVocabularyRepository.deleteAll();
		lessonProgressRepository.deleteAll();
		grammarExampleRepository.deleteAll();
		grammarPointRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		lessonRepository.deleteAll();
		vocabularyRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) {
		try {
			MvcResult result = mockMvc.perform(post(LOGIN_URL)
							.contentType(MediaType.APPLICATION_JSON)
							.content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
					.andExpect(status().isOk())
					.andReturn();
			JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString(StandardCharsets.UTF_8));
			return node.get("token").asText();
		} catch (Exception e) {
			throw new RuntimeException("Login failed for " + email, e);
		}
	}

	@Test
	@DisplayName("TC-01: Lấy danh sách từ cần ôn hôm nay (due cards)")
	void testGetDueCards() throws Exception {
		// Tạo 2 từ đã học: 1 từ đến hạn (nextReviewAt trong quá khứ), 1 từ chưa đến hạn (nextReviewAt trong tương lai)
		VocabularyEntity vocabDue = vocabs.get(0);
		VocabularyEntity vocabFuture = vocabs.get(1);

		VocabLearningEntity learningDue = new VocabLearningEntity(userA, vocabDue, FlashcardResult.REMEMBERED);
		learningDue.setNextReviewAt(Instant.now().minus(2, ChronoUnit.HOURS));
		learningDue.setRepetitionLevel(1);
		learningDue.setIntervalDays(1);
		vocabLearningRepository.save(learningDue);

		VocabLearningEntity learningFuture = new VocabLearningEntity(userA, vocabFuture, FlashcardResult.REMEMBERED);
		learningFuture.setNextReviewAt(Instant.now().plus(2, ChronoUnit.DAYS));
		learningFuture.setRepetitionLevel(2);
		learningFuture.setIntervalDays(6);
		vocabLearningRepository.save(learningFuture);

		// Gọi GET /api/v1/srs/due-cards
		mockMvc.perform(get(SRS_URL + "/due-cards")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].vocabularyId", is(vocabDue.getId().intValue())))
				.andExpect(jsonPath("$[0].hanzi", is(vocabDue.getHanzi())))
				.andExpect(jsonPath("$[0].repetitionLevel", is(1)))
				.andExpect(jsonPath("$[0].intervalDays", is(1)));
	}

	@Test
	@DisplayName("TC-02 & TC-03 & TC-04: Đánh giá nhớ lần 1, lần 2, lần 3 tính đúng khoảng cách SM-2")
	void testSrsSm2ProgressiveReview() throws Exception {
		VocabularyEntity vocab = vocabs.get(0);

		// Lần 1: Nhớ -> level 1, interval 1 ngày
		SrsReviewRequest req1 = new SrsReviewRequest(vocab.getId(), FlashcardResult.REMEMBERED);
		mockMvc.perform(post(SRS_URL + "/review")
						.header("Authorization", "Bearer " + tokenA)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req1)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vocabularyId", is(vocab.getId().intValue())))
				.andExpect(jsonPath("$.repetitionLevel", is(1)))
				.andExpect(jsonPath("$.intervalDays", is(1)));

		// Lần 2: Nhớ -> level 2, interval 6 ngày
		mockMvc.perform(post(SRS_URL + "/review")
						.header("Authorization", "Bearer " + tokenA)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req1)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.repetitionLevel", is(2)))
				.andExpect(jsonPath("$.intervalDays", is(6)));

		// Lần 3: Nhớ -> level 3, interval 15 ngày (6 * 2.5)
		mockMvc.perform(post(SRS_URL + "/review")
						.header("Authorization", "Bearer " + tokenA)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req1)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.repetitionLevel", is(3)))
				.andExpect(jsonPath("$.intervalDays", is(15)));

		// Kiểm tra trong DB
		VocabLearningEntity entity = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(userA.getId(), vocab.getId()).orElseThrow();
		assertEquals(3, entity.getRepetitionLevel());
		assertEquals(15, entity.getIntervalDays());
		assertTrue(entity.getNextReviewAt().isAfter(Instant.now().plus(14, ChronoUnit.DAYS)));
	}

	@Test
	@DisplayName("TC-05: Đánh giá Quên (FORGOTTEN) reset về level 0 và interval 1 ngày")
	void testSrsReviewForgottenReset() throws Exception {
		VocabularyEntity vocab = vocabs.get(0);

		// Giả sử thẻ đang ở level 3, interval 15
		VocabLearningEntity learning = new VocabLearningEntity(userA, vocab, FlashcardResult.REMEMBERED);
		learning.setRepetitionLevel(3);
		learning.setIntervalDays(15);
		learning.setNextReviewAt(Instant.now().minus(1, ChronoUnit.HOURS));
		vocabLearningRepository.save(learning);

		// Gửi review FORGOTTEN
		SrsReviewRequest req = new SrsReviewRequest(vocab.getId(), FlashcardResult.FORGOTTEN);
		mockMvc.perform(post(SRS_URL + "/review")
						.header("Authorization", "Bearer " + tokenA)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vocabularyId", is(vocab.getId().intValue())))
				.andExpect(jsonPath("$.repetitionLevel", is(0)))
				.andExpect(jsonPath("$.intervalDays", is(1)));

		// Kiểm tra trong DB
		VocabLearningEntity updated = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(userA.getId(), vocab.getId()).orElseThrow();
		assertEquals(0, updated.getRepetitionLevel());
		assertEquals(1, updated.getIntervalDays());
		assertEquals(FlashcardResult.FORGOTTEN, updated.getLastResult());
	}

	@Test
	@DisplayName("TC-06: Thống kê SRS summary (dueToday, mastered, learning)")
	void testSrsSummary() throws Exception {
		// Từ 1: Due hôm nay, level 1
		VocabLearningEntity l1 = new VocabLearningEntity(userA, vocabs.get(0), FlashcardResult.REMEMBERED);
		l1.setRepetitionLevel(1);
		l1.setIntervalDays(1);
		l1.setNextReviewAt(Instant.now().minus(1, ChronoUnit.HOURS));
		vocabLearningRepository.save(l1);

		// Từ 2: Mastered (level 3), chưa đến hạn
		VocabLearningEntity l2 = new VocabLearningEntity(userA, vocabs.get(1), FlashcardResult.REMEMBERED);
		l2.setRepetitionLevel(3);
		l2.setIntervalDays(15);
		l2.setNextReviewAt(Instant.now().plus(5, ChronoUnit.DAYS));
		vocabLearningRepository.save(l2);

		// Từ 3: Đang học (level 2), chưa đến hạn
		VocabLearningEntity l3 = new VocabLearningEntity(userA, vocabs.get(2), FlashcardResult.REMEMBERED);
		l3.setRepetitionLevel(2);
		l3.setIntervalDays(6);
		l3.setNextReviewAt(Instant.now().plus(2, ChronoUnit.DAYS));
		vocabLearningRepository.save(l3);

		mockMvc.perform(get(SRS_URL + "/summary")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.dueTodayCount", is(1)))
				.andExpect(jsonPath("$.masteredCount", is(1)))
				.andExpect(jsonPath("$.learningCount", is(2))); // l1 and l3
	}

	@Test
	@DisplayName("TC-07: Loại trừ từ vựng thuộc bài học bị ẩn")
	void testExcludeHiddenLessonVocabularies() throws Exception {
		// Vocab 5 thuộc hiddenLesson
		VocabularyEntity vocabHidden = vocabs.get(4);

		VocabLearningEntity learningHidden = new VocabLearningEntity(userA, vocabHidden, FlashcardResult.REMEMBERED);
		learningHidden.setRepetitionLevel(1);
		learningHidden.setIntervalDays(1);
		learningHidden.setNextReviewAt(Instant.now().minus(1, ChronoUnit.HOURS));
		vocabLearningRepository.save(learningHidden);

		// Kiểm tra GET /due-cards không chứa vocabHidden
		mockMvc.perform(get(SRS_URL + "/due-cards")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}

	@Test
	@DisplayName("TC-08: Thoát giữa chừng - các từ đã đánh giá được lưu lịch mới độc lập")
	void testMidSessionExitPreservesProgress() throws Exception {
		VocabularyEntity v1 = vocabs.get(0);
		VocabularyEntity v2 = vocabs.get(1);

		// Cả 2 từ đều đến hạn
		VocabLearningEntity l1 = new VocabLearningEntity(userA, v1, FlashcardResult.REMEMBERED);
		l1.setRepetitionLevel(0);
		l1.setNextReviewAt(Instant.now().minus(1, ChronoUnit.HOURS));
		vocabLearningRepository.save(l1);

		VocabLearningEntity l2 = new VocabLearningEntity(userA, v2, FlashcardResult.REMEMBERED);
		l2.setRepetitionLevel(0);
		l2.setNextReviewAt(Instant.now().minus(1, ChronoUnit.HOURS));
		vocabLearningRepository.save(l2);

		// Học sinh chỉ ôn từ 1 rồi tắt trình duyệt
		SrsReviewRequest req = new SrsReviewRequest(v1.getId(), FlashcardResult.REMEMBERED);
		mockMvc.perform(post(SRS_URL + "/review")
						.header("Authorization", "Bearer " + tokenA)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(req)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.repetitionLevel", is(1)))
				.andExpect(jsonPath("$.remainingDueCount", is(1))); // còn v2

		// Khi học sinh quay lại xem due cards, chỉ còn v2
		mockMvc.perform(get(SRS_URL + "/due-cards")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].vocabularyId", is(v2.getId().intValue())));
	}

	@Test
	@DisplayName("TC-09 (QTN-02): Học sinh B không thấy từ vựng của học sinh A")
	void testStudentDataIsolation() throws Exception {
		// Học sinh A có 1 từ đến hạn
		VocabularyEntity v1 = vocabs.get(0);
		VocabLearningEntity l1 = new VocabLearningEntity(userA, v1, FlashcardResult.REMEMBERED);
		l1.setRepetitionLevel(1);
		l1.setNextReviewAt(Instant.now().minus(1, ChronoUnit.HOURS));
		vocabLearningRepository.save(l1);

		// Học sinh B chưa học từ nào -> due cards của B phải rỗng
		mockMvc.perform(get(SRS_URL + "/due-cards")
						.header("Authorization", "Bearer " + tokenB))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));

		// Summary của B phải là 0, 0, 0
		mockMvc.perform(get(SRS_URL + "/summary")
						.header("Authorization", "Bearer " + tokenB))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.dueTodayCount", is(0)))
				.andExpect(jsonPath("$.masteredCount", is(0)))
				.andExpect(jsonPath("$.learningCount", is(0)));
	}
}
