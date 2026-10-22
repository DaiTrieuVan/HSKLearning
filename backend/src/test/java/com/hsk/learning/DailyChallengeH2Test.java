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
import com.hsk.assignment.domain.AssignmentEntity;
import com.hsk.assignment.domain.AssignmentStatus;
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.classroom.domain.ClassEntity;
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
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.learning.domain.DailyChallengeHistoryEntity;
import com.hsk.learning.domain.FlashcardResult;
import com.hsk.learning.domain.LessonProgressEntity;
import com.hsk.learning.domain.VocabLearningEntity;
import com.hsk.learning.repository.DailyChallengeHistoryRepository;
import com.hsk.learning.repository.LessonProgressRepository;
import com.hsk.learning.repository.VocabLearningRepository;
import com.hsk.learning.service.DailyChallengeService;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
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
 * Integration tests for HTT-08-CN-003: Thử thách hằng ngày (Daily Challenge)
 * Covers TC-01 to TC-07 and QTN-02 isolation.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class DailyChallengeH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String CHALLENGE_URL = "/api/v1/gamification/daily-challenge";
	private static final String STUDENT_A_EMAIL = "student_challenge_a@test.com";
	private static final String STUDENT_B_EMAIL = "student_challenge_b@test.com";
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
	private DailyChallengeHistoryRepository dailyChallengeHistoryRepository;

	@Autowired
	private AssignmentSubmissionRepository assignmentSubmissionRepository;

	@Autowired
	private AssignmentRepository assignmentRepository;

	@Autowired
	private ExerciseRepository exerciseRepository;

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

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private GrammarPointRepository grammarPointRepository;

	@Autowired
	private GrammarExampleRepository grammarExampleRepository;

	@Autowired
	private DailyChallengeService dailyChallengeService;

	private String tokenA;
	private String tokenB;
	private UserEntity userA;
	private UserEntity userB;
	private LessonEntity lesson1;
	private LessonEntity lesson2;
	private LessonEntity lesson3;
	private AssignmentEntity assignment;
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

		lesson1 = lessonRepository.save(new LessonEntity(hsk1, "Lesson 1", "L1", 1, null));
		lesson2 = lessonRepository.save(new LessonEntity(hsk1, "Lesson 2", "L2", 2, null));
		lesson3 = lessonRepository.save(new LessonEntity(hsk1, "Lesson 3", "L3", 3, null));

		vocabs.clear();
		for (int i = 1; i <= 15; i++) {
			VocabularyEntity v = vocabularyRepository.save(new VocabularyEntity(
					"词" + i, "cí" + i, "Meaning " + i, "word",
					null, null, null, null, hsk1, null));
			vocabs.add(v);
		}

		ClassEntity classroom = classRepository.save(ClassEntity.create(userA, "HSK1 Class", "Desc", "HSK101"));
		ExerciseEntity exercise = exerciseRepository.save(new ExerciseEntity(userA.getId(), "Exercise 1", "Desc", ExerciseStatus.READY));
		assignment = assignmentRepository.save(new AssignmentEntity(
				exercise,
				classroom,
				userA,
				"Assignment 1",
				"Desc 1",
				Instant.now().minus(1, ChronoUnit.DAYS),
				Instant.now().plus(2, ChronoUnit.DAYS),
				BigDecimal.valueOf(10.0),
				AssignmentStatus.ACTIVE,
				"{}"
		));
	}

	@AfterEach
	void tearDown() {
		cleanupData();
	}

	private void cleanupData() {
		dailyChallengeHistoryRepository.deleteAll();
		assignmentSubmissionRepository.deleteAll();
		assignmentRepository.deleteAll();
		exerciseRepository.deleteAll();
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
	@DisplayName("HTT-08-CN-003-TC-01: Hiển thị các mục tiêu trong ngày và tiến độ ban đầu (0/2 bài, 0/10 từ, 0/1 bài tập)")
	void testTC01_InitialDailyChallengeState() throws Exception {
		mockMvc.perform(get(CHALLENGE_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.targetLessons", is(2)))
				.andExpect(jsonPath("$.completedLessons", is(0)))
				.andExpect(jsonPath("$.targetVocabs", is(10)))
				.andExpect(jsonPath("$.reviewedVocabs", is(0)))
				.andExpect(jsonPath("$.targetExercises", is(1)))
				.andExpect(jsonPath("$.completedExercises", is(0)))
				.andExpect(jsonPath("$.isCompleted", is(false)))
				.andExpect(jsonPath("$.rewardXp", is(50)))
				.andExpect(jsonPath("$.rewardClaimed", is(false)))
				.andExpect(jsonPath("$.overallProgressPercent", is(0)));
	}

	@Test
	@DisplayName("HTT-08-CN-003-TC-02: Hoàn thành bài học hoặc ôn từ -> Tiến độ mục tiêu tương ứng được cập nhật (1/2 bài, 10/10 từ)")
	void testTC02_ProgressUpdate() throws Exception {
		// Học 1 bài
		LessonProgressEntity lp1 = new LessonProgressEntity(userA, lesson1);
		lp1.setCompletedAt(Instant.now());
		lessonProgressRepository.save(lp1);

		// Ôn 10 từ
		for (int i = 0; i < 10; i++) {
			VocabLearningEntity vl = new VocabLearningEntity(userA, vocabs.get(i), FlashcardResult.REMEMBERED);
			vl.setRepetitionLevel(1);
			vocabLearningRepository.save(vl);
		}

		mockMvc.perform(get(CHALLENGE_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completedLessons", is(1)))
				.andExpect(jsonPath("$.reviewedVocabs", is(10)))
				.andExpect(jsonPath("$.completedExercises", is(0)))
				.andExpect(jsonPath("$.isCompleted", is(false)))
				.andExpect(jsonPath("$.rewardClaimed", is(false)));
	}

	@Test
	@DisplayName("HTT-08-CN-003-TC-03: Hoàn thành đủ 3 mục tiêu trong ngày -> Đánh dấu hoàn thành và cộng thưởng 50 XP")
	void testTC03_CompleteAllTasks_Awards50XP() throws Exception {
		// 1. Hoàn thành 2 bài học
		lessonProgressRepository.save(new LessonProgressEntity(userA, lesson1));
		lessonProgressRepository.save(new LessonProgressEntity(userA, lesson2));

		// 2. Ôn 10 từ vựng
		for (int i = 0; i < 10; i++) {
			VocabLearningEntity vl = new VocabLearningEntity(userA, vocabs.get(i), FlashcardResult.REMEMBERED);
			vocabLearningRepository.save(vl);
		}

		// 3. Hoàn thành 1 bài tập
		AssignmentSubmissionEntity sub = AssignmentSubmissionEntity.createAttempt(assignment, userA, 1);
		sub.submit(BigDecimal.valueOf(10.0), "{}");
		assignmentSubmissionRepository.save(sub);

		// Gọi API lấy thử thách
		mockMvc.perform(get(CHALLENGE_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completedLessons", is(2)))
				.andExpect(jsonPath("$.reviewedVocabs", is(10)))
				.andExpect(jsonPath("$.completedExercises", is(1)))
				.andExpect(jsonPath("$.isCompleted", is(true)))
				.andExpect(jsonPath("$.rewardClaimed", is(true)))
				.andExpect(jsonPath("$.currentTotalXp", is(50)))
				.andExpect(jsonPath("$.overallProgressPercent", is(100)));

		// Kiểm tra trong DB: userA có 50 XP
		UserEntity updatedUser = userRepository.findById(userA.getId()).orElseThrow();
		assertEquals(50, updatedUser.getTotalXp());
	}

	@Test
	@DisplayName("HTT-08-CN-003-TC-04: Thử thách ngày đã hoàn thành, học thêm 3 bài -> Không cộng thưởng thêm lần hai (Idempotent)")
	void testTC04_DuplicateLearning_DoesNotDuplicateXP() throws Exception {
		// Hoàn thành lần đầu
		lessonProgressRepository.save(new LessonProgressEntity(userA, lesson1));
		lessonProgressRepository.save(new LessonProgressEntity(userA, lesson2));
		for (int i = 0; i < 10; i++) {
			vocabLearningRepository.save(new VocabLearningEntity(userA, vocabs.get(i), FlashcardResult.REMEMBERED));
		}
		AssignmentSubmissionEntity sub = AssignmentSubmissionEntity.createAttempt(assignment, userA, 1);
		sub.submit(BigDecimal.valueOf(10.0), "{}");
		assignmentSubmissionRepository.save(sub);

		// Lần 1: Nhận thưởng 50 XP
		mockMvc.perform(get(CHALLENGE_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.currentTotalXp", is(50)));

		// Học tiếp bài 3
		lessonProgressRepository.save(new LessonProgressEntity(userA, lesson3));

		// Lần 2: XP vẫn chỉ là 50
		mockMvc.perform(get(CHALLENGE_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completedLessons", is(3)))
				.andExpect(jsonPath("$.currentTotalXp", is(50)));

		UserEntity updatedUser = userRepository.findById(userA.getId()).orElseThrow();
		assertEquals(50, updatedUser.getTotalXp());
	}

	@Test
	@DisplayName("HTT-08-CN-003-TC-05: Hoàn thành lại 1 bài học 2 lần trong ngày -> Không tính thêm lần 2")
	void testTC05_DuplicateLessonCompletion_CountedOnce() throws Exception {
		// Bài 1 hoàn thành lần đầu
		lessonProgressRepository.save(new LessonProgressEntity(userA, lesson1));

		// Giả sử học lại bài 1 (cùng lesson1)
		lessonProgressRepository.save(new LessonProgressEntity(userA, lesson1));

		mockMvc.perform(get(CHALLENGE_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completedLessons", is(1))); // Vẫn chỉ là 1 bài
	}

	@Test
	@DisplayName("HTT-08-CN-003-TC-06: Chưa hoàn thành đủ mục tiêu (1/2 bài) -> Không hoàn thành và không cộng thưởng")
	void testTC06_IncompleteEndOfDay_NotCompleted() throws Exception {
		lessonProgressRepository.save(new LessonProgressEntity(userA, lesson1));

		mockMvc.perform(get(CHALLENGE_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.isCompleted", is(false)))
				.andExpect(jsonPath("$.rewardClaimed", is(false)))
				.andExpect(jsonPath("$.currentTotalXp", is(0)));

		UserEntity updatedUser = userRepository.findById(userA.getId()).orElseThrow();
		assertEquals(0, updatedUser.getTotalXp());
	}

	@Test
	@DisplayName("HTT-08-CN-003-TC-07: Ngày mới theo giờ Việt Nam bắt đầu với tiến độ về 0")
	void testTC07_NewDay_ResetProgress() throws Exception {
		// Hôm nay hoàn thành bài 1
		lessonProgressRepository.save(new LessonProgressEntity(userA, lesson1));

		// Ngày mai theo giờ Việt Nam bắt đầu thử thách mới với tiến độ về 0
		LocalDate tomorrow = LocalDate.now(DailyChallengeService.VN_ZONE).plusDays(1);

		mockMvc.perform(get(CHALLENGE_URL)
						.param("date", tomorrow.toString())
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.date", is(tomorrow.toString())))
				.andExpect(jsonPath("$.completedLessons", is(0)))
				.andExpect(jsonPath("$.reviewedVocabs", is(0)))
				.andExpect(jsonPath("$.completedExercises", is(0)))
				.andExpect(jsonPath("$.isCompleted", is(false)));
	}

	@Test
	@DisplayName("TC-08 (QTN-02): Học sinh B có tiến độ thử thách độc lập với học sinh A")
	void testTC08_StudentDataIsolation() throws Exception {
		// Học sinh A hoàn thành thử thách
		lessonProgressRepository.save(new LessonProgressEntity(userA, lesson1));
		lessonProgressRepository.save(new LessonProgressEntity(userA, lesson2));
		for (int i = 0; i < 10; i++) {
			vocabLearningRepository.save(new VocabLearningEntity(userA, vocabs.get(i), FlashcardResult.REMEMBERED));
		}
		AssignmentSubmissionEntity sub = AssignmentSubmissionEntity.createAttempt(assignment, userA, 1);
		sub.submit(BigDecimal.valueOf(10.0), "{}");
		assignmentSubmissionRepository.save(sub);

		// Học sinh A đạt 100%
		mockMvc.perform(get(CHALLENGE_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.isCompleted", is(true)))
				.andExpect(jsonPath("$.currentTotalXp", is(50)));

		// Học sinh B hoàn toàn 0% và 0 XP
		mockMvc.perform(get(CHALLENGE_URL)
						.header("Authorization", "Bearer " + tokenB))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.isCompleted", is(false)))
				.andExpect(jsonPath("$.currentTotalXp", is(0)))
				.andExpect(jsonPath("$.completedLessons", is(0)));
	}
}
