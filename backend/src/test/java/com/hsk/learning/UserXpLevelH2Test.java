package com.hsk.learning;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
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
import com.hsk.account.repository.PasswordResetTokenRepository;
import com.hsk.account.repository.TeacherRequestRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.assignment.domain.AssignmentEntity;
import com.hsk.assignment.domain.AssignmentStatus;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.assignment.service.AssignmentSubmissionService;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.LessonEntity;
import com.hsk.content.repository.GrammarPointRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.learning.domain.DailyChallengeHistoryEntity;
import com.hsk.learning.domain.UserXpTransactionEntity;
import com.hsk.learning.dto.UserLevelResponse;
import com.hsk.learning.repository.DailyChallengeHistoryRepository;
import com.hsk.learning.repository.LessonProgressRepository;
import com.hsk.learning.repository.UserStreakRepository;
import com.hsk.learning.repository.UserXpTransactionRepository;
import com.hsk.learning.service.DailyChallengeService;
import com.hsk.learning.service.RoadmapService;
import com.hsk.learning.service.XpLevelService;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
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
 * Integration tests for HTT-08-CN-005: Tích lũy XP và lên cấp (Level Progression)
 * Covers TC-01 to TC-05.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class UserXpLevelH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String LEVEL_URL = "/api/v1/gamification/level";
	private static final String XP_HISTORY_URL = "/api/v1/gamification/xp-history";
	private static final String STUDENT_EMAIL = "student_xp_level@test.com";
	private static final String TEACHER_EMAIL = "teacher_xp_level@test.com";
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
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private HskLevelRepository hskLevelRepository;

	@Autowired
	private LessonRepository lessonRepository;

	@Autowired
	private LessonVocabularyRepository lessonVocabularyRepository;

	@Autowired
	private GrammarPointRepository grammarPointRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private LessonProgressRepository lessonProgressRepository;

	@Autowired
	private DailyChallengeHistoryRepository dailyChallengeHistoryRepository;

	@Autowired
	private UserStreakRepository userStreakRepository;

	@Autowired
	private UserXpTransactionRepository userXpTransactionRepository;

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
	private ExerciseRepository exerciseRepository;

	@Autowired
	private com.hsk.common.audit.AuditLogRepository auditLogRepository;

	@Autowired
	private RoadmapService roadmapService;

	@Autowired
	private AssignmentSubmissionService assignmentSubmissionService;

	@Autowired
	private XpLevelService xpLevelService;

	private UserEntity testStudent;
	private UserEntity testTeacher;
	private String studentToken;
	private LessonEntity testLesson1;
	private LessonEntity testLesson2;
	private AssignmentEntity testAssignment;

	@BeforeEach
	void setUp() throws Exception {
		cleanupData();

		registrationService.registerStudent(
				new RegisterStudentRequest("XP Tester", STUDENT_EMAIL, PASSWORD, PASSWORD)
		);
		testStudent = userRepository.findByEmail(STUDENT_EMAIL).orElseThrow();
		studentToken = obtainToken(STUDENT_EMAIL, PASSWORD);

		// Tạo Teacher & Level & Lesson
		registrationService.registerStudent(
				new RegisterStudentRequest("Teacher Tester", TEACHER_EMAIL, PASSWORD, PASSWORD)
		);
		testTeacher = userRepository.findByEmail(TEACHER_EMAIL).orElseThrow();

		HskLevelEntity level1 = hskLevelRepository.save(new HskLevelEntity("HSK1_XP", "HSK 1", 1, "Level 1", 150));
		testLesson1 = lessonRepository.save(new LessonEntity(level1, "Bài 1 XP", "Mô tả 1", 1, null));
		testLesson2 = lessonRepository.save(new LessonEntity(level1, "Bài 2 XP", "Mô tả 2", 2, null));

		// Tạo Classroom & Assignment
		ClassEntity classroom = classRepository.save(ClassEntity.create(testTeacher, "XP Class", "Desc", "XP101"));
		classMemberRepository.save(ClassMemberEntity.create(classroom, testStudent));

		ExerciseEntity exercise = exerciseRepository.save(new ExerciseEntity(testTeacher.getId(), "Ex XP", "Desc", ExerciseStatus.READY));
		testAssignment = assignmentRepository.save(new AssignmentEntity(
				exercise,
				classroom,
				testTeacher,
				"Bài tập XP",
				"Desc",
				Instant.now().minus(1, ChronoUnit.HOURS),
				Instant.now().plus(2, ChronoUnit.DAYS),
				BigDecimal.valueOf(10.0),
				AssignmentStatus.ACTIVE,
				"[]"
		));
	}

	@AfterEach
	void tearDown() {
		cleanupData();
	}

	private void cleanupData() {
		userXpTransactionRepository.deleteAll();
		userStreakRepository.deleteAll();
		dailyChallengeHistoryRepository.deleteAll();
		assignmentSubmissionRepository.deleteAll();
		assignmentRepository.deleteAll();
		exerciseRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		lessonProgressRepository.deleteAll();
		lessonVocabularyRepository.deleteAll();
		grammarPointRepository.deleteAll();
		lessonRepository.deleteAll();
		vocabularyRepository.deleteAll();
		hskLevelRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		auditLogRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String obtainToken(String email, String password) throws Exception {
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString(StandardCharsets.UTF_8));
		return json.get("token").asText();
	}

	@Test
	@DisplayName("HTT-08-CN-005-TC-01: Học sinh hoàn thành một bài học -> XP tăng +10 XP")
	void testTC01_LessonCompletion_Awards10XP() throws Exception {
		// Lúc đầu: 0 XP, Level 1
		mockMvc.perform(get(LEVEL_URL).header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalXp", is(0)))
				.andExpect(jsonPath("$.currentLevel", is(1)))
				.andExpect(jsonPath("$.title", is("Tân thủ")));

		// Hoàn thành Bài 1
		roadmapService.markLessonCompleted(testStudent.getId(), testLesson1.getId());

		// Kiểm tra XP và Level sau khi hoàn thành bài
		mockMvc.perform(get(LEVEL_URL).header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalXp", is(10)))
				.andExpect(jsonPath("$.currentLevel", is(1)))
				.andExpect(jsonPath("$.progressPercent", is(10))); // 10/100 = 10%
	}

	@Test
	@DisplayName("HTT-08-CN-005-TC-02: Nộp bài tập được cộng +20 XP")
	void testTC02_AssignmentSubmission_Awards20XP() throws Exception {
		// Bắt đầu làm bài và nộp bài
		assignmentSubmissionService.takeAssignment(testStudent.getId(), testAssignment.getId());
		assignmentSubmissionService.submitAssignment(
				testStudent.getId(),
				testAssignment.getId(),
				new com.hsk.assignment.dto.SubmitAssignmentRequest(Collections.emptyList())
		);

		// Kiểm tra cộng 20 XP
		mockMvc.perform(get(LEVEL_URL).header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalXp", is(20)))
				.andExpect(jsonPath("$.currentLevel", is(1)));
	}

	@Test
	@DisplayName("HTT-08-CN-005-TC-03: Tổng XP chạm ngưỡng 100 XP -> Học sinh lên Cấp 2 ('Tập sự')")
	void testTC03_Reach100XP_LevelsUpToLevel2() throws Exception {
		// Cộng 90 XP
		xpLevelService.awardXp(testStudent, 90, "BONUS", "bonus:1", "Thưởng tích lũy 90 XP");

		UserLevelResponse before = xpLevelService.getUserLevel(testStudent.getId());
		assertEquals(1, before.currentLevel());
		assertEquals(90, before.totalXp());

		// Hoàn thành Bài 1 -> Thưởng tiếp +10 XP -> Đủ 100 XP
		roadmapService.markLessonCompleted(testStudent.getId(), testLesson1.getId());

		mockMvc.perform(get(LEVEL_URL).header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalXp", is(100)))
				.andExpect(jsonPath("$.currentLevel", is(2)))
				.andExpect(jsonPath("$.title", is("Tập sự")))
				.andExpect(jsonPath("$.currentLevelThreshold", is(100)))
				.andExpect(jsonPath("$.nextLevelThreshold", is(250)));
	}

	@Test
	@DisplayName("HTT-08-CN-005-TC-04: Dữ liệu trùng lặp -> Hoàn thành lại cùng bài học không cộng XP lần hai")
	void testTC04_DuplicateActivity_DoesNotDuplicateXP() throws Exception {
		// Hoàn thành Bài 1 lần đầu -> +10 XP
		roadmapService.markLessonCompleted(testStudent.getId(), testLesson1.getId());

		UserEntity userAfterFirst = userRepository.findById(testStudent.getId()).orElseThrow();
		assertEquals(10, userAfterFirst.getTotalXp());

		// Hoàn thành lại Bài 1 lần hai
		roadmapService.markLessonCompleted(testStudent.getId(), testLesson1.getId());
		// Hoàn thành lại Bài 1 lần ba
		roadmapService.markLessonCompleted(testStudent.getId(), testLesson1.getId());

		// Kiểm tra tổng XP vẫn chỉ là 10 XP
		mockMvc.perform(get(LEVEL_URL).header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalXp", is(10)));

		// Kiểm tra trong bảng transactions chỉ có duy nhất 1 bản ghi cho Bài 1
		List<UserXpTransactionEntity> txs = userXpTransactionRepository.findTop10ByUserIdOrderByCreatedAtDesc(testStudent.getId());
		assertEquals(1, txs.size());
	}

	@Test
	@DisplayName("HTT-08-CN-005-TC-05: Lưu lịch sử giao dịch XP minh bạch và đầy đủ")
	void testTC05_XpAuditHistory_RecordsAccurately() throws Exception {
		// Thực hiện 2 hoạt động: Hoàn thành Bài 1 và Nộp bài tập
		roadmapService.markLessonCompleted(testStudent.getId(), testLesson1.getId());

		assignmentSubmissionService.takeAssignment(testStudent.getId(), testAssignment.getId());
		assignmentSubmissionService.submitAssignment(
				testStudent.getId(),
				testAssignment.getId(),
				new com.hsk.assignment.dto.SubmitAssignmentRequest(Collections.emptyList())
		);

		// Truy vấn API lịch sử XP
		mockMvc.perform(get(XP_HISTORY_URL).header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalElements", is(2)))
				.andExpect(jsonPath("$.content", hasSize(2)))
				.andExpect(jsonPath("$.content[0].sourceType", is("ASSIGNMENT_SUBMISSION")))
				.andExpect(jsonPath("$.content[0].xpAmount", is(20)))
				.andExpect(jsonPath("$.content[1].sourceType", is("LESSON_COMPLETION")))
				.andExpect(jsonPath("$.content[1].xpAmount", is(10)));
	}
}
