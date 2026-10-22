package com.hsk.learning;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
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
import com.hsk.learning.service.SrsReviewService;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
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
 * Integration tests for HTT-08-CN-002: Xem số từ cần ôn hôm nay
 * Covers TC-01, TC-02, TC-03, TC-04 (Múi giờ Việt Nam UTC+7) and QTN-02 isolation.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class SrsTodayDueH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String SRS_URL = "/api/v1/srs";
	private static final String STUDENT_A_EMAIL = "student_srs_due_a@test.com";
	private static final String STUDENT_B_EMAIL = "student_srs_due_b@test.com";
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
	private final List<VocabularyEntity> vocabs = new ArrayList<>();

	@BeforeEach
	void setUp() {
		cleanupData();

		registrationService.registerStudent(new RegisterStudentRequest(
				"Student A", STUDENT_A_EMAIL, PASSWORD, PASSWORD));
		registrationService.registerStudent(new RegisterStudentRequest(
				"Student B", STUDENT_B_EMAIL, PASSWORD, PASSWORD));

		userA = userRepository.findByEmailIgnoreCase(STUDENT_A_EMAIL).orElseThrow();
		userB = userRepository.findByEmailIgnoreCase(STUDENT_B_EMAIL).orElseThrow();

		tokenA = loginAndGetToken(STUDENT_A_EMAIL, PASSWORD);
		tokenB = loginAndGetToken(STUDENT_B_EMAIL, PASSWORD);

		HskLevelEntity hsk1 = hskLevelRepository.findByCode("HSK_1")
				.orElseGet(() -> hskLevelRepository.save(new HskLevelEntity("HSK_1", "HSK 1 - Nhập môn", 1, "Mô tả HSK 1", 150)));

		LessonEntity lesson = lessonRepository.save(new LessonEntity(hsk1, "Lesson 1", "L1", 1, null));

		vocabs.clear();
		for (int i = 1; i <= 15; i++) {
			VocabularyEntity v = vocabularyRepository.save(new VocabularyEntity(
					"词" + i, "cí" + i, "Meaning " + i, "word",
					null, null, null, null, hsk1, null));
			vocabs.add(v);
			lessonVocabularyRepository.save(new LessonVocabularyEntity(lesson, v, i));
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
	@DisplayName("HTT-08-CN-002-TC-01: Học sinh có 12 từ đến hạn ôn -> Trang chính hiển thị đúng 12 từ cần ôn")
	void testTC01_DisplayDueWordsCount_12Words() throws Exception {
		// Tạo 12 từ đến hạn hôm nay
		for (int i = 0; i < 12; i++) {
			VocabLearningEntity vl = new VocabLearningEntity(userA, vocabs.get(i), FlashcardResult.REMEMBERED);
			vl.setNextReviewAt(Instant.now().minus(i + 1, ChronoUnit.HOURS));
			vocabLearningRepository.save(vl);
		}

		mockMvc.perform(get(SRS_URL + "/summary")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.dueTodayCount", is(12)));
	}

	@Test
	@DisplayName("HTT-08-CN-002-TC-02: Học sinh có 12 từ, ôn 5 từ -> Quay lại số từ cần ôn giảm còn đúng 7")
	void testTC02_PartialReview_DecreasesDueCountFrom12To7() throws Exception {
		// 1. Setup 12 từ đến hạn
		for (int i = 0; i < 12; i++) {
			VocabLearningEntity vl = new VocabLearningEntity(userA, vocabs.get(i), FlashcardResult.REMEMBERED);
			vl.setRepetitionLevel(1);
			vl.setNextReviewAt(Instant.now().minus(i + 1, ChronoUnit.HOURS));
			vocabLearningRepository.save(vl);
		}

		// 2. Kiểm tra ban đầu có 12 từ
		mockMvc.perform(get(SRS_URL + "/summary")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.dueTodayCount", is(12)));

		// 3. Học sinh ôn 5 từ (từ 0 đến 4)
		for (int i = 0; i < 5; i++) {
			SrsReviewRequest req = new SrsReviewRequest(vocabs.get(i).getId(), FlashcardResult.REMEMBERED);
			mockMvc.perform(post(SRS_URL + "/review")
							.header("Authorization", "Bearer " + tokenA)
							.contentType(MediaType.APPLICATION_JSON)
							.content(objectMapper.writeValueAsString(req)))
					.andExpect(status().isOk());
		}

		// 4. Quay lại trang chính kiểm tra số từ cần ôn còn lại đúng 7
		mockMvc.perform(get(SRS_URL + "/summary")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.dueTodayCount", is(7)));
	}

	@Test
	@DisplayName("HTT-08-CN-002-TC-03: Dữ liệu rỗng - Không có từ đến hạn trả về dueTodayCount = 0")
	void testTC03_EmptyDueWords_ShowsZero() throws Exception {
		mockMvc.perform(get(SRS_URL + "/summary")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.dueTodayCount", is(0)));
	}

	@Test
	@DisplayName("HTT-08-CN-002-TC-04: Ranh giới múi giờ Việt Nam (UTC+7) - Từ đến hạn lúc 00:01 tính cho ngày mới")
	void testTC04_VietnamTimezoneBoundary() throws Exception {
		ZoneId vnZone = SrsReviewService.VN_ZONE;
		LocalDate todayVn = LocalDate.now(vnZone);

		// Từ 1: Đến hạn lúc 23:55 đêm nay theo giờ Việt Nam -> PHẢI được tính vào hôm nay
		Instant lateTonightVn = todayVn.atTime(LocalTime.of(23, 55)).atZone(vnZone).toInstant();
		VocabLearningEntity v1 = new VocabLearningEntity(userA, vocabs.get(0), FlashcardResult.REMEMBERED);
		v1.setNextReviewAt(lateTonightVn);
		vocabLearningRepository.save(v1);

		// Từ 2: Đến hạn lúc 00:01 sáng mai theo giờ Việt Nam -> KHÔNG được tính vào hôm nay (tính cho ngày mới)
		Instant earlyTomorrowVn = todayVn.plusDays(1).atTime(LocalTime.of(0, 1)).atZone(vnZone).toInstant();
		VocabLearningEntity v2 = new VocabLearningEntity(userA, vocabs.get(1), FlashcardResult.REMEMBERED);
		v2.setNextReviewAt(earlyTomorrowVn);
		vocabLearningRepository.save(v2);

		// Gọi summary hôm nay: chỉ được tính đúng 1 từ (từ 1), từ 2 tính cho ngày mai
		mockMvc.perform(get(SRS_URL + "/summary")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.dueTodayCount", is(1)));
	}

	@Test
	@DisplayName("TC-05 (QTN-02): Bảo mật và cách ly dữ liệu - Số từ cần ôn của A không ảnh hưởng tới B")
	void testTC05_StudentDataIsolation() throws Exception {
		// Học sinh A có 3 từ đến hạn
		for (int i = 0; i < 3; i++) {
			VocabLearningEntity vl = new VocabLearningEntity(userA, vocabs.get(i), FlashcardResult.REMEMBERED);
			vl.setNextReviewAt(Instant.now().minus(1, ChronoUnit.HOURS));
			vocabLearningRepository.save(vl);
		}

		// A thấy 3 từ
		mockMvc.perform(get(SRS_URL + "/summary")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.dueTodayCount", is(3)));

		// B hoàn toàn thấy 0 từ
		mockMvc.perform(get(SRS_URL + "/summary")
						.header("Authorization", "Bearer " + tokenB))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.dueTodayCount", is(0)));
	}
}
