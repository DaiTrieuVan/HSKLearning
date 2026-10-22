package com.hsk.learning;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.TemporalAdjusters;

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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.PasswordResetTokenRepository;
import com.hsk.account.repository.TeacherRequestRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.audit.AuditLogRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.learning.domain.DailyChallengeHistoryEntity;
import com.hsk.learning.domain.UserXpTransactionEntity;
import com.hsk.learning.repository.DailyChallengeHistoryRepository;
import com.hsk.learning.repository.LessonProgressRepository;
import com.hsk.learning.repository.UserStreakRepository;
import com.hsk.learning.repository.UserXpTransactionRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ClassLeaderboardH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String LEADERBOARD_URL = "/api/v1/classes/%d/leaderboard";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

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
	private LessonProgressRepository lessonProgressRepository;

	@Autowired
	private AuditLogRepository auditLogRepository;

	private UserEntity teacher;
	private UserEntity studentA;
	private UserEntity studentB;
	private UserEntity studentC;
	private UserEntity outsiderStudent;

	private String tokenStudentA;
	private String tokenStudentB;
	private String tokenStudentC;
	private String tokenOutsider;
	private String tokenTeacher;

	private ClassEntity classroom;

	@BeforeEach
	void setUp() throws Exception {
		cleanupData();

		// Tạo Teacher
		registrationService.registerStudent(new RegisterStudentRequest("Teacher One", "teacher_lb@test.com", PASSWORD, PASSWORD));
		teacher = userRepository.findByEmail("teacher_lb@test.com").orElseThrow();
		tokenTeacher = obtainToken("teacher_lb@test.com", PASSWORD);

		// Tạo Students
		registrationService.registerStudent(new RegisterStudentRequest("Nguyen Van A", "student_a_lb@test.com", PASSWORD, PASSWORD));
		studentA = userRepository.findByEmail("student_a_lb@test.com").orElseThrow();
		tokenStudentA = obtainToken("student_a_lb@test.com", PASSWORD);

		registrationService.registerStudent(new RegisterStudentRequest("Tran Thi B", "student_b_lb@test.com", PASSWORD, PASSWORD));
		studentB = userRepository.findByEmail("student_b_lb@test.com").orElseThrow();
		tokenStudentB = obtainToken("student_b_lb@test.com", PASSWORD);

		registrationService.registerStudent(new RegisterStudentRequest("Le Van C", "student_c_lb@test.com", PASSWORD, PASSWORD));
		studentC = userRepository.findByEmail("student_c_lb@test.com").orElseThrow();
		tokenStudentC = obtainToken("student_c_lb@test.com", PASSWORD);

		registrationService.registerStudent(new RegisterStudentRequest("Outsider X", "outsider_lb@test.com", PASSWORD, PASSWORD));
		outsiderStudent = userRepository.findByEmail("outsider_lb@test.com").orElseThrow();
		tokenOutsider = obtainToken("outsider_lb@test.com", PASSWORD);

		// Tạo Class và thêm A, B, C vào lớp
		classroom = classRepository.save(ClassEntity.create(teacher, "Lớp Tiếng Trung HSK 1", "Mô tả lớp", "HSK101"));

		classMemberRepository.save(ClassMemberEntity.create(classroom, studentA));
		classMemberRepository.save(ClassMemberEntity.create(classroom, studentB));
		classMemberRepository.save(ClassMemberEntity.create(classroom, studentC));
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

		JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
		return json.get("token").asText();
	}

	@Test
	@DisplayName("TC-01: Học sinh xem được bảng xếp hạng tuần của lớp mình")
	void testGetClassLeaderboard_Success() throws Exception {
		// Thêm XP tuần cho học sinh: A=50, B=100, C=20
		userXpTransactionRepository.save(new UserXpTransactionEntity(studentA, 50, "LESSON", "1", "Học bài 1"));
		studentA.addXp(50);
		userRepository.save(studentA);

		userXpTransactionRepository.save(new UserXpTransactionEntity(studentB, 100, "LESSON", "2", "Học bài 2"));
		studentB.addXp(100);
		userRepository.save(studentB);

		userXpTransactionRepository.save(new UserXpTransactionEntity(studentC, 20, "DAILY_CHALLENGE", "1", "Thử thách"));
		studentC.addXp(20);
		userRepository.save(studentC);

		// Student A gọi API
		mockMvc.perform(get(String.format(LEADERBOARD_URL, classroom.getId()))
						.header("Authorization", "Bearer " + tokenStudentA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.classId", is(classroom.getId().intValue())))
				.andExpect(jsonPath("$.className", is("Lớp Tiếng Trung HSK 1")))
				.andExpect(jsonPath("$.totalStudents", is(3)))
				.andExpect(jsonPath("$.currentUserRank", is(2)))
				.andExpect(jsonPath("$.currentUserWeeklyXp", is(50)))
				.andExpect(jsonPath("$.leaderboard", hasSize(3)))
				// Rank 1: Student B (100 XP)
				.andExpect(jsonPath("$.leaderboard[0].rank", is(1)))
				.andExpect(jsonPath("$.leaderboard[0].studentName", is("Tran Thi B")))
				.andExpect(jsonPath("$.leaderboard[0].weeklyXp", is(100)))
				.andExpect(jsonPath("$.leaderboard[0].isCurrentUser", is(false)))
				// Rank 2: Student A (50 XP)
				.andExpect(jsonPath("$.leaderboard[1].rank", is(2)))
				.andExpect(jsonPath("$.leaderboard[1].studentName", is("Nguyen Van A")))
				.andExpect(jsonPath("$.leaderboard[1].weeklyXp", is(50)))
				.andExpect(jsonPath("$.leaderboard[1].isCurrentUser", is(true)))
				// Rank 3: Student C (20 XP)
				.andExpect(jsonPath("$.leaderboard[2].rank", is(3)))
				.andExpect(jsonPath("$.leaderboard[2].studentName", is("Le Van C")))
				.andExpect(jsonPath("$.leaderboard[2].weeklyXp", is(20)))
				.andExpect(jsonPath("$.leaderboard[2].isCurrentUser", is(false)));
	}

	@Test
	@DisplayName("TC-02: Quyền riêng tư - Không lộ email, bài nộp chi tiết của học sinh khác")
	void testLeaderboard_PrivacyGuaranteed() throws Exception {
		userXpTransactionRepository.save(new UserXpTransactionEntity(studentB, 80, "LESSON", "1", "Lesson XP"));

		MvcResult result = mockMvc.perform(get(String.format(LEADERBOARD_URL, classroom.getId()))
						.header("Authorization", "Bearer " + tokenStudentA))
				.andExpect(status().isOk())
				.andReturn();

		String responseBody = result.getResponse().getContentAsString();
		// Kiểm tra response không chứa email của studentB hoặc bất kỳ ai
		assertFalse(responseBody.contains("student_b_lb@test.com"), "Leaderboard response must not leak other students' email");
		assertFalse(responseBody.contains("teacher_lb@test.com"), "Leaderboard response must not leak teacher email");
		assertFalse(responseBody.contains("submission"), "Leaderboard response must not leak submission details");
	}

	@Test
	@DisplayName("TC-03: Xử lý đồng hạng - 2 học sinh cùng XP thì xếp cùng thứ hạng")
	void testLeaderboard_TiedRanks() throws Exception {
		// A = 100, B = 100, C = 30
		userXpTransactionRepository.save(new UserXpTransactionEntity(studentA, 100, "LESSON", "1", "Lesson 1"));
		userXpTransactionRepository.save(new UserXpTransactionEntity(studentB, 100, "LESSON", "2", "Lesson 2"));
		userXpTransactionRepository.save(new UserXpTransactionEntity(studentC, 30, "LESSON", "3", "Lesson 3"));

		mockMvc.perform(get(String.format(LEADERBOARD_URL, classroom.getId()))
						.header("Authorization", "Bearer " + tokenStudentA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.leaderboard[0].rank", is(1)))
				.andExpect(jsonPath("$.leaderboard[1].rank", is(1)))
				.andExpect(jsonPath("$.leaderboard[2].rank", is(3)))
				.andExpect(jsonPath("$.leaderboard[2].weeklyXp", is(30)));
	}

	@Test
	@DisplayName("TC-04: Mốc tuần 00:00 thứ Hai giờ VN - Giao dịch XP ngoài tuần không được tính vào weeklyXp")
	void testLeaderboard_OnlyCountsCurrentWeekXp() throws Exception {
		// Giao dịch 1: Trong tuần hiện tại (+40 XP)
		userXpTransactionRepository.save(new UserXpTransactionEntity(studentA, 40, "LESSON", "10", "Trong tuần"));

		// Giao dịch 2: Tạo thủ công với createdAt từ 14 ngày trước (2 tuần trước)
		ZoneId vnZone = ZoneId.of("Asia/Ho_Chi_Minh");
		ZonedDateTime pastTwoWeeks = ZonedDateTime.now(vnZone).minusWeeks(2);
		Instant pastInstant = pastTwoWeeks.toInstant();

		UserXpTransactionEntity pastTx = new UserXpTransactionEntity(studentA, 500, "LESSON", "99", "2 tuần trước");
		pastTx = userXpTransactionRepository.save(pastTx);
		jdbcTemplate.update("UPDATE user_xp_transactions SET created_at = ? WHERE id = ?",
				java.sql.Timestamp.from(pastInstant), pastTx.getId());

		// Kiểm tra tổng XP trong tuần chỉ là 40, không phải 540
		mockMvc.perform(get(String.format(LEADERBOARD_URL, classroom.getId()))
						.header("Authorization", "Bearer " + tokenStudentA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.currentUserWeeklyXp", is(40)));
	}

	@Test
	@DisplayName("TC-05: Học sinh không thuộc lớp hoặc không ACTIVE nhận 403 FORBIDDEN")
	void testLeaderboard_ForbiddenForOutsider() throws Exception {
		// Outsider không trong class
		mockMvc.perform(get(String.format(LEADERBOARD_URL, classroom.getId()))
						.header("Authorization", "Bearer " + tokenOutsider))
				.andExpect(status().isForbidden());

		// Học sinh C bị REMOVED khỏi lớp
		var memberOpt = classMemberRepository.findByClassroom_IdAndStudent_Id(classroom.getId(), studentC.getId());
		assertTrue(memberOpt.isPresent());
		ClassMemberEntity memberC = memberOpt.get();
		memberC.remove();
		classMemberRepository.save(memberC);

		// Học sinh C gọi API sau khi bị removed
		mockMvc.perform(get(String.format(LEADERBOARD_URL, classroom.getId()))
						.header("Authorization", "Bearer " + tokenStudentC))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("TC-06: Giáo viên của lớp xem bảng xếp hạng lớp thành công")
	void testLeaderboard_TeacherAccess() throws Exception {
		userXpTransactionRepository.save(new UserXpTransactionEntity(studentA, 70, "LESSON", "1", "Học"));

		mockMvc.perform(get(String.format(LEADERBOARD_URL, classroom.getId()))
						.header("Authorization", "Bearer " + tokenTeacher))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.classId", is(classroom.getId().intValue())))
				.andExpect(jsonPath("$.currentUserRank", nullValue()))
				.andExpect(jsonPath("$.currentUserWeeklyXp", nullValue()))
				.andExpect(jsonPath("$.leaderboard", hasSize(3)));
	}
}
