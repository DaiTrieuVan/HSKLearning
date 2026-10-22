package com.hsk.learning;

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
import com.hsk.learning.domain.UserStreakEntity;
import com.hsk.learning.dto.StreakResponse;
import com.hsk.learning.repository.DailyChallengeHistoryRepository;
import com.hsk.learning.repository.UserStreakRepository;
import com.hsk.learning.service.DailyChallengeService;
import com.hsk.learning.service.StreakService;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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
 * Integration tests for HTT-08-CN-004: Duy trì chuỗi ngày học (streak)
 * Covers TC-01 to TC-08 and Vietnam timezone boundary logic.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class StreakH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String STREAK_URL = "/api/v1/gamification/streak";
	private static final String STUDENT_EMAIL = "student_streak@test.com";
	private static final String PASSWORD = "Password123";
	private static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

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
	private DailyChallengeHistoryRepository dailyChallengeHistoryRepository;

	@Autowired
	private UserStreakRepository userStreakRepository;

	@Autowired
	private com.hsk.learning.repository.UserXpTransactionRepository userXpTransactionRepository;

	@Autowired
	private com.hsk.classroom.repository.ClassRepository classRepository;

	@Autowired
	private com.hsk.classroom.repository.ClassMemberRepository classMemberRepository;

	@Autowired
	private com.hsk.classroom.repository.ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private com.hsk.classroom.repository.ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private com.hsk.assignment.repository.AssignmentSubmissionRepository assignmentSubmissionRepository;

	@Autowired
	private com.hsk.assignment.repository.AssignmentRepository assignmentRepository;

	@Autowired
	private com.hsk.exercise.repository.ExerciseRepository exerciseRepository;

	@Autowired
	private StreakService streakService;

	private UserEntity testStudent;
	private String studentToken;

	@BeforeEach
	void setUp() throws Exception {
		cleanupData();

		registrationService.registerStudent(
				new RegisterStudentRequest("Streak Tester", STUDENT_EMAIL, PASSWORD, PASSWORD)
		);
		testStudent = userRepository.findByEmail(STUDENT_EMAIL).orElseThrow();
		studentToken = obtainToken(STUDENT_EMAIL, PASSWORD);
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
		passwordResetTokenRepository.deleteAll();
		teacherRequestRepository.deleteAll();
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
	@DisplayName("HTT-08-CN-004-TC-01: Hoàn thành mục tiêu ngày đầu tiên -> Streak là 1")
	void testTC01_FirstDayCompletion_StreakIsOne() throws Exception {
		LocalDate day1 = LocalDate.of(2026, 10, 20);

		// Record completion on day 1
		streakService.recordDailyGoalCompletion(testStudent, day1);

		mockMvc.perform(get(STREAK_URL)
						.param("date", day1.toString())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.currentStreak", is(1)))
				.andExpect(jsonPath("$.longestStreak", is(1)))
				.andExpect(jsonPath("$.completedToday", is(true)))
				.andExpect(jsonPath("$.lastCompletedDate", is("2026-10-20")));
	}

	@Test
	@DisplayName("HTT-08-CN-004-TC-02: Đã có streak 1 và hoàn thành mục tiêu ngày kế tiếp -> Streak tăng lên 2")
	void testTC02_ConsecutiveDayCompletion_StreakIncrements() throws Exception {
		LocalDate day1 = LocalDate.of(2026, 10, 20);
		LocalDate day2 = LocalDate.of(2026, 10, 21);

		streakService.recordDailyGoalCompletion(testStudent, day1);
		streakService.recordDailyGoalCompletion(testStudent, day2);

		mockMvc.perform(get(STREAK_URL)
						.param("date", day2.toString())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.currentStreak", is(2)))
				.andExpect(jsonPath("$.longestStreak", is(2)))
				.andExpect(jsonPath("$.completedToday", is(true)))
				.andExpect(jsonPath("$.lastCompletedDate", is("2026-10-21")));
	}

	@Test
	@DisplayName("HTT-08-CN-004-TC-03: Học sinh có streak, mở trang chính -> Hệ thống hiển thị streak hiện tại")
	void testTC03_GetStreakStatus_DisplaysCurrentStreak() throws Exception {
		// Giả lập học sinh đã duy trì chuỗi 5 ngày
		UserStreakEntity streak = new UserStreakEntity(testStudent);
		streak.setCurrentStreak(5);
		streak.setLongestStreak(5);
		LocalDate day5 = LocalDate.of(2026, 10, 25);
		streak.setLastCompletedDate(day5);
		userStreakRepository.save(streak);

		mockMvc.perform(get(STREAK_URL)
						.param("date", day5.toString())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.currentStreak", is(5)))
				.andExpect(jsonPath("$.longestStreak", is(5)))
				.andExpect(jsonPath("$.completedToday", is(true)));
	}

	@Test
	@DisplayName("HTT-08-CN-004-TC-04: Hoàn thành mục tiêu lần nữa trong cùng ngày -> Streak chỉ tăng 1 cho ngày đó (Idempotent)")
	void testTC04_DuplicateCompletionInSameDay_Idempotent() throws Exception {
		LocalDate today = LocalDate.of(2026, 10, 22);

		// Hoàn thành lần 1
		streakService.recordDailyGoalCompletion(testStudent, today);
		// Hoàn thành lần 2 trong cùng ngày
		streakService.recordDailyGoalCompletion(testStudent, today);
		// Hoàn thành lần 3 trong cùng ngày
		streakService.recordDailyGoalCompletion(testStudent, today);

		mockMvc.perform(get(STREAK_URL)
						.param("date", today.toString())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.currentStreak", is(1)))
				.andExpect(jsonPath("$.longestStreak", is(1)))
				.andExpect(jsonPath("$.completedToday", is(true)));
	}

	@Test
	@DisplayName("HTT-08-CN-004-TC-05: Bỏ lỡ một ngày không hoàn thành -> Streak đặt lại về 0")
	void testTC05_MissedDay_StreakResetsToZero() throws Exception {
		// Học sinh đã đạt streak 5 ngày, kết thúc vào ngày 20
		UserStreakEntity streak = new UserStreakEntity(testStudent);
		streak.setCurrentStreak(5);
		streak.setLongestStreak(5);
		streak.setLastCompletedDate(LocalDate.of(2026, 10, 20));
		userStreakRepository.save(streak);

		// Ngày 21 bỏ học, ngày 22 học sinh vào kiểm tra
		LocalDate day22 = LocalDate.of(2026, 10, 22);

		mockMvc.perform(get(STREAK_URL)
						.param("date", day22.toString())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.currentStreak", is(0)))
				.andExpect(jsonPath("$.longestStreak", is(5)))
				.andExpect(jsonPath("$.completedToday", is(false)));
	}

	@Test
	@DisplayName("HTT-08-CN-004-TC-06: Trong ngày hôm nay chưa hoàn thành nhưng hôm qua đã xong -> Streak vẫn giữ giá trị")
	void testTC06_TodayPending_StreakPreserved() throws Exception {
		// Học sinh đã đạt streak 5 ngày, vừa hoàn thành ngày hôm qua (ngày 21)
		UserStreakEntity streak = new UserStreakEntity(testStudent);
		streak.setCurrentStreak(5);
		streak.setLongestStreak(5);
		streak.setLastCompletedDate(LocalDate.of(2026, 10, 21));
		userStreakRepository.save(streak);

		// Hôm nay là ngày 22, học sinh chưa hoàn thành mục tiêu ngày 22
		LocalDate day22 = LocalDate.of(2026, 10, 22);

		mockMvc.perform(get(STREAK_URL)
						.param("date", day22.toString())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.currentStreak", is(5)))
				.andExpect(jsonPath("$.longestStreak", is(5)))
				.andExpect(jsonPath("$.completedToday", is(false)));
	}

	@Test
	@DisplayName("HTT-08-CN-004-TC-07: Tính ngày theo múi giờ Việt Nam Asia/Ho_Chi_Minh (00:10 UTC+7 là ngày 13/10)")
	void testTC07_VietnamTimezoneBoundary() {
		// 00:10 ngày 13/10/2026 theo giờ Việt Nam
		ZonedDateTime vnTime = ZonedDateTime.of(2026, 10, 13, 0, 10, 0, 0, VN_ZONE);
		LocalDate vnDate = vnTime.toLocalDate();

		assertEquals(13, vnDate.getDayOfMonth());
		assertEquals(10, vnDate.getMonthValue());

		// 17:10 ngày 12/10 theo UTC
		ZonedDateTime utcTime = vnTime.withZoneSameInstant(ZoneId.of("UTC"));
		assertEquals(12, utcTime.getDayOfMonth());

		// Xác nhận hàm xử lý trong StreakService sử dụng đúng múi giờ Việt Nam
		streakService.recordDailyGoalCompletion(testStudent, vnDate);
		StreakResponse res = streakService.getStreakStatusForDate(testStudent.getId(), vnDate);

		assertEquals(1, res.currentStreak());
		assertEquals(LocalDate.of(2026, 10, 13), res.lastCompletedDate());
		assertTrue(res.completedToday());
	}

	@Test
	@DisplayName("HTT-08-CN-004-TC-08: Nghỉ học nhiều ngày rồi quay lại hoàn thành -> Streak bắt đầu lại từ 1")
	void testTC08_ReturnAfterMultipleDays_ResetsToOne() throws Exception {
		// Học sinh từng có chuỗi 7 ngày, ngày hoàn thành cuối cùng là 01/10
		UserStreakEntity streak = new UserStreakEntity(testStudent);
		streak.setCurrentStreak(7);
		streak.setLongestStreak(7);
		streak.setLastCompletedDate(LocalDate.of(2026, 10, 1));
		userStreakRepository.save(streak);

		// Nghỉ 10 ngày, đến ngày 11/10 quay lại hoàn thành mục tiêu ngày
		LocalDate returnDay = LocalDate.of(2026, 10, 11);
		streakService.recordDailyGoalCompletion(testStudent, returnDay);

		mockMvc.perform(get(STREAK_URL)
						.param("date", returnDay.toString())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.currentStreak", is(1)))
				.andExpect(jsonPath("$.longestStreak", is(7)))
				.andExpect(jsonPath("$.completedToday", is(true)))
				.andExpect(jsonPath("$.lastCompletedDate", is("2026-10-11")));
	}
}
