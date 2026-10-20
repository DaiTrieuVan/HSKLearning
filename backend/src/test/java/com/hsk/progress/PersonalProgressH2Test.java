package com.hsk.progress;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
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
import com.hsk.learning.domain.LessonProgressEntity;
import com.hsk.learning.repository.LessonProgressRepository;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for HTT-07-CN-001: Theo dõi tiến độ học cá nhân
 * Covers TC-01, TC-02, TC-03, TC-04, TC-05.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class PersonalProgressH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String PROGRESS_URL = "/api/progress/personal";
	private static final String STUDENT_A_EMAIL = "student_a_prog@test.com";
	private static final String STUDENT_B_EMAIL = "student_b_prog@test.com";
	private static final String TEACHER_EMAIL = "teacher_prog@test.com";
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
	private LessonProgressRepository lessonProgressRepository;

	@Autowired
	private LessonVocabularyRepository lessonVocabularyRepository;

	@Autowired
	private GrammarPointRepository grammarPointRepository;

	@Autowired
	private GrammarExampleRepository grammarExampleRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

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
	private AssignmentRepository assignmentRepository;

	@Autowired
	private AssignmentSubmissionRepository assignmentSubmissionRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	private UserEntity studentA;
	private UserEntity studentB;
	private UserEntity teacher;
	private String tokenA;
	private String tokenB;
	private HskLevelEntity hsk1;
	private HskLevelEntity hsk2;

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

		// Register Teacher
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo Viên", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();

		// Create HSK 1 and HSK 2
		hsk1 = hskLevelRepository.save(new HskLevelEntity("HSK_1", "HSK 1 - Cơ bản", 1, "Mô tả HSK 1", 150));
		hsk2 = hskLevelRepository.save(new HskLevelEntity("HSK_2", "HSK 2 - Sơ cấp", 2, "Mô tả HSK 2", 300));
	}

	@AfterEach
	void tearDown() {
		assignmentSubmissionRepository.deleteAll();
		assignmentRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		exerciseRepository.deleteAll();

		lessonProgressRepository.deleteAll();
		grammarExampleRepository.deleteAll();
		grammarPointRepository.deleteAll();
		lessonVocabularyRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		vocabularyRepository.deleteAll();
		lessonRepository.deleteAll();
		hskLevelRepository.deleteAll();

		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		String body = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
		MvcResult res = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode json = objectMapper.readTree(res.getResponse().getContentAsString(StandardCharsets.UTF_8));
		return json.get("token").asText();
	}

	@Test
	@DisplayName("HTT-07-CN-001-TC-01: Học sinh có tiến độ học tập -> Trả về đầy đủ tiến độ HSK, từ vựng, điểm TB và hoạt động gần đây")
	void testGetPersonalProgress_Success_TC01() throws Exception {
		// 1. Tạo 2 bài học trong HSK 1, 1 bài trong HSK 2
		LessonEntity l1 = lessonRepository.save(new LessonEntity(hsk1, "Bài 1", "Desc 1", 1, null));
		LessonEntity l2 = lessonRepository.save(new LessonEntity(hsk1, "Bài 2", "Desc 2", 2, null));
		LessonEntity l3 = lessonRepository.save(new LessonEntity(hsk2, "Bài 3", "Desc 3", 1, null));

		// 2. Tạo 2 từ vựng cho l1
		VocabularyEntity v1 = vocabularyRepository.save(new VocabularyEntity("你", "nǐ", "bạn", "pronoun", null, null, null, null, hsk1, null));
		VocabularyEntity v2 = vocabularyRepository.save(new VocabularyEntity("好", "hǎo", "tốt", "adj", null, null, null, null, hsk1, null));
		lessonVocabularyRepository.save(new LessonVocabularyEntity(l1, v1, 1));
		lessonVocabularyRepository.save(new LessonVocabularyEntity(l1, v2, 2));

		// 3. Học sinh A hoàn thành l1
		lessonProgressRepository.save(new LessonProgressEntity(studentA, l1));

		// 4. Tạo 1 bài tập và 1 bài nộp điểm 8/10
		ClassEntity clazz = classRepository.save(ClassEntity.create(teacher, "Lớp Tiếng Trung", "Mô tả", "CLS001"));
		ExerciseEntity exercise = exerciseRepository.save(new ExerciseEntity(teacher.getId(), "Bài tập 1", "Mô tả", ExerciseStatus.READY));
		AssignmentEntity assignment = assignmentRepository.save(new AssignmentEntity(
				exercise, clazz, teacher, "Bài tập tuần 1", "Làm bài",
				Instant.now().minus(1, ChronoUnit.DAYS), Instant.now().plus(2, ChronoUnit.DAYS),
				BigDecimal.valueOf(10.0), AssignmentStatus.ACTIVE, "{}"
		));

		AssignmentSubmissionEntity sub = AssignmentSubmissionEntity.createInitial(assignment, studentA);
		sub.submit(BigDecimal.valueOf(8.0), "{}");
		assignmentSubmissionRepository.save(sub);

		// Call API
		mockMvc.perform(get(PROGRESS_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completedLessons", is(1)))
				.andExpect(jsonPath("$.learnedVocabulary", is(2)))
				.andExpect(jsonPath("$.averageScorePercentage", is(80.0)))
				.andExpect(jsonPath("$.hskLevels", hasSize(2)))
				.andExpect(jsonPath("$.hskLevels[0].completedLessons", is(1)))
				.andExpect(jsonPath("$.hskLevels[0].totalLessons", is(2)))
				.andExpect(jsonPath("$.hskLevels[0].progressPercentage", is(50.0)))
				.andExpect(jsonPath("$.recentActivities", hasSize(2)));
	}

	@Test
	@DisplayName("HTT-07-CN-001-TC-02: Tính điểm trung bình phần trăm chính xác (6/8 = 75%, 9/10 = 90% -> TB = 82.5%)")
	void testAverageScoreCalculation_TC02() throws Exception {
		ClassEntity clazz = classRepository.save(ClassEntity.create(teacher, "Lớp 1", "Mô tả", "CLS002"));
		ExerciseEntity ex1 = exerciseRepository.save(new ExerciseEntity(teacher.getId(), "Bài 1", "Desc", ExerciseStatus.READY));
		ExerciseEntity ex2 = exerciseRepository.save(new ExerciseEntity(teacher.getId(), "Bài 2", "Desc", ExerciseStatus.READY));

		AssignmentEntity asg1 = assignmentRepository.save(new AssignmentEntity(
				ex1, clazz, teacher, "Assignment 1 (Max 8)", "Desc",
				Instant.now().minus(2, ChronoUnit.DAYS), Instant.now().plus(1, ChronoUnit.DAYS),
				BigDecimal.valueOf(8.0), AssignmentStatus.ACTIVE, "{}"
		));
		AssignmentEntity asg2 = assignmentRepository.save(new AssignmentEntity(
				ex2, clazz, teacher, "Assignment 2 (Max 10)", "Desc",
				Instant.now().minus(2, ChronoUnit.DAYS), Instant.now().plus(1, ChronoUnit.DAYS),
				BigDecimal.valueOf(10.0), AssignmentStatus.ACTIVE, "{}"
		));

		// Học sinh nộp bài 1: 6 / 8 = 75%
		AssignmentSubmissionEntity sub1 = AssignmentSubmissionEntity.createInitial(asg1, studentA);
		sub1.submit(BigDecimal.valueOf(6.0), "{}");
		assignmentSubmissionRepository.save(sub1);

		// Học sinh nộp bài 2: 9 / 10 = 90%
		AssignmentSubmissionEntity sub2 = AssignmentSubmissionEntity.createInitial(asg2, studentA);
		sub2.submit(BigDecimal.valueOf(9.0), "{}");
		assignmentSubmissionRepository.save(sub2);

		// Điểm trung bình mong đợi: (75 + 90) / 2 = 82.5%
		mockMvc.perform(get(PROGRESS_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.averageScorePercentage", is(82.5)));
	}

	@Test
	@DisplayName("HTT-07-CN-001-TC-03: Dữ liệu rỗng cho học sinh mới -> Các chỉ số là 0, điểm trung bình là null")
	void testNewStudentEmptyData_TC03() throws Exception {
		mockMvc.perform(get(PROGRESS_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completedLessons", is(0)))
				.andExpect(jsonPath("$.totalLessons", is(0)))
				.andExpect(jsonPath("$.learnedVocabulary", is(0)))
				.andExpect(jsonPath("$.averageScorePercentage", nullValue()))
				.andExpect(jsonPath("$.recentActivities", hasSize(0)));
	}

	@Test
	@DisplayName("HTT-07-CN-001-TC-04: Bài học ẩn (hidden = true) không được tính vào tổng số bài học của cấp độ")
	void testHiddenLessonsExcluded_TC04() throws Exception {
		// Tạo 1 bài hiển thị và 1 bài ẩn trong HSK 1
		LessonEntity visibleLesson = lessonRepository.save(new LessonEntity(hsk1, "Bài hiển thị", "Desc", 1, null));
		LessonEntity hiddenLesson = new LessonEntity(hsk1, "Bài ẩn", "Desc ẩn", 2, null);
		hiddenLesson.setHidden(true);
		lessonRepository.save(hiddenLesson);

		mockMvc.perform(get(PROGRESS_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalLessons", is(1)))
				.andExpect(jsonPath("$.hskLevels[0].totalLessons", is(1)));
	}

	@Test
	@DisplayName("HTT-07-CN-001-TC-05: QTN-02 - Cô lập dữ liệu giữa học sinh A và học sinh B")
	void testDataIsolationBetweenStudents_TC05() throws Exception {
		// Học sinh A học 1 bài
		LessonEntity l1 = lessonRepository.save(new LessonEntity(hsk1, "Bài 1", "Desc", 1, null));
		lessonProgressRepository.save(new LessonProgressEntity(studentA, l1));

		// Học sinh A xem tiến độ -> completedLessons = 1
		mockMvc.perform(get(PROGRESS_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completedLessons", is(1)));

		// Học sinh B xem tiến độ -> completedLessons = 0, hoàn toàn độc lập
		mockMvc.perform(get(PROGRESS_URL)
						.header("Authorization", "Bearer " + tokenB))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completedLessons", is(0)))
				.andExpect(jsonPath("$.learnedVocabulary", is(0)))
				.andExpect(jsonPath("$.averageScorePercentage", nullValue()));
	}
}
