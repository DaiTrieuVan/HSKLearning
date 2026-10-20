package com.hsk.progress;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
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
import com.hsk.assignment.repository.AssignmentStudentOverrideRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.repository.ExerciseRepository;
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
 * Integration tests for HTT-07-CN-002: Xem lịch sử bài làm và điểm
 * Covers TC-01, TC-02, TC-03, TC-04, TC-05.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class SubmissionHistoryH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String HISTORY_URL = "/api/progress/history";
	private static final String STUDENT_A_EMAIL = "student_a_hist@test.com";
	private static final String STUDENT_B_EMAIL = "student_b_hist@test.com";
	private static final String TEACHER_EMAIL = "teacher_hist@test.com";
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
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private ClassRepository classRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private ExerciseRepository exerciseRepository;

	@Autowired
	private AssignmentRepository assignmentRepository;

	@Autowired
	private AssignmentSubmissionRepository assignmentSubmissionRepository;

	@Autowired
	private AssignmentStudentOverrideRepository overrideRepository;

	private UserEntity studentA;
	private UserEntity studentB;
	private UserEntity teacher;
	private String tokenA;
	private String tokenB;
	private ClassEntity classroom;
	private ExerciseEntity exercise;

	@BeforeEach
	void setUp() throws Exception {
		cleanDatabase();

		registrationService.registerStudent(new RegisterStudentRequest("Student A", STUDENT_A_EMAIL, PASSWORD, PASSWORD));
		studentA = userRepository.findByEmailIgnoreCase(STUDENT_A_EMAIL).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Student B", STUDENT_B_EMAIL, PASSWORD, PASSWORD));
		studentB = userRepository.findByEmailIgnoreCase(STUDENT_B_EMAIL).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Teacher", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();

		tokenA = loginAndGetToken(STUDENT_A_EMAIL, PASSWORD);
		tokenB = loginAndGetToken(STUDENT_B_EMAIL, PASSWORD);

		classroom = classRepository.save(ClassEntity.create(teacher, "Lớp Tiếng Trung HSK 2", "Mô tả lớp", "CLS001"));
		exercise = exerciseRepository.save(new ExerciseEntity(
				teacher.getId(),
				"Bài tập Ngữ pháp HSK 2",
				"Luyện tập ngữ pháp",
				ExerciseStatus.READY
		));
	}

	@AfterEach
	void tearDown() {
		cleanDatabase();
	}

	private void cleanDatabase() {
		assignmentSubmissionRepository.deleteAll();
		overrideRepository.deleteAll();
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

	private String loginAndGetToken(String email, String password) throws Exception {
		String body = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString(StandardCharsets.UTF_8));
		return json.get("token").asText();
	}

	private AssignmentEntity createAssignment(String title, Instant startTime, Instant dueTime, BigDecimal totalPoints) {
		String snapshotData = "[{\"questionId\":1,\"type\":\"SINGLE_CHOICE\",\"content\":\"Câu 1\",\"options\":[{\"id\":101,\"content\":\"A\",\"isCorrect\":true,\"sortOrder\":1}],\"points\":5.0,\"sortOrder\":1}]";
		return assignmentRepository.save(new AssignmentEntity(
				exercise,
				classroom,
				teacher,
				title,
				"Mô tả " + title,
				startTime,
				dueTime,
				totalPoints,
				AssignmentStatus.ACTIVE,
				snapshotData
		));
	}

	@Test
	@DisplayName("HTT-07-CN-002-TC-01: Học sinh đã nộp nhiều bài -> Liệt kê các bài nộp kèm điểm và ngày nộp, bài mới nhất ở trên cùng")
	void testListSubmissionsLatestFirst_TC01() throws Exception {
		Instant now = Instant.now();
		// Tạo 3 bài tập
		AssignmentEntity a1 = createAssignment("Bài tập 1", now.minus(5, ChronoUnit.DAYS), now.plus(1, ChronoUnit.DAYS), BigDecimal.valueOf(10));
		AssignmentEntity a2 = createAssignment("Bài tập 2", now.minus(3, ChronoUnit.DAYS), now.plus(2, ChronoUnit.DAYS), BigDecimal.valueOf(8));
		AssignmentEntity a3 = createAssignment("Bài tập 3", now.minus(1, ChronoUnit.DAYS), now.plus(3, ChronoUnit.DAYS), BigDecimal.valueOf(10));

		// Nộp bài theo các thời điểm khác nhau cách nhau 1 giờ
		AssignmentSubmissionEntity sub1 = AssignmentSubmissionEntity.createAttempt(a1, studentA, 1);
		sub1.submit(BigDecimal.valueOf(8), "[]");
		sub1.setSubmittedAt(now.minus(3, ChronoUnit.HOURS));
		assignmentSubmissionRepository.save(sub1);

		AssignmentSubmissionEntity sub2 = AssignmentSubmissionEntity.createAttempt(a2, studentA, 1);
		sub2.submit(BigDecimal.valueOf(7), "[]");
		sub2.setSubmittedAt(now.minus(2, ChronoUnit.HOURS));
		assignmentSubmissionRepository.save(sub2);

		AssignmentSubmissionEntity sub3 = AssignmentSubmissionEntity.createAttempt(a3, studentA, 1);
		sub3.submit(BigDecimal.valueOf(9), "[]");
		sub3.setSubmittedAt(now.minus(1, ChronoUnit.HOURS));
		assignmentSubmissionRepository.save(sub3);

		mockMvc.perform(get(HISTORY_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalAssignments", is(3)))
				.andExpect(jsonPath("$.totalSubmissions", is(3)))
				.andExpect(jsonPath("$.items", hasSize(3)))
				.andExpect(jsonPath("$.items[0].assignmentTitle", is("Bài tập 3")))
				.andExpect(jsonPath("$.items[0].bestScore", is(9.0)))
				.andExpect(jsonPath("$.items[1].assignmentTitle", is("Bài tập 2")))
				.andExpect(jsonPath("$.items[1].bestScore", is(7.0)))
				.andExpect(jsonPath("$.items[2].assignmentTitle", is("Bài tập 1")))
				.andExpect(jsonPath("$.items[2].bestScore", is(8.0)));
	}

	@Test
	@DisplayName("HTT-07-CN-002-TC-02: Học sinh mở chi tiết một bài nộp -> Hiển thị kết quả chi tiết đúng quy tắc hiển thị đáp án")
	void testViewSubmissionDetail_TC02() throws Exception {
		Instant now = Instant.now();
		// Bài tập đã quá hạn nộp (dueTime trong quá khứ) -> showSolutions = true
		AssignmentEntity pastDueAssignment = createAssignment(
				"Bài tập đã quá hạn",
				now.minus(5, ChronoUnit.DAYS),
				now.minus(1, ChronoUnit.DAYS),
				BigDecimal.valueOf(10)
		);

		AssignmentSubmissionEntity sub = AssignmentSubmissionEntity.createAttempt(pastDueAssignment, studentA, 1);
		sub.submit(BigDecimal.valueOf(10), "[{\"questionId\":1,\"selectedOptionId\":101,\"isCorrect\":true,\"pointsEarned\":5.0}]");
		AssignmentSubmissionEntity savedSub = assignmentSubmissionRepository.save(sub);

		// Gọi endpoint xem chi tiết bài nộp
		mockMvc.perform(get("/api/assignments/submissions/" + savedSub.getId())
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.submissionId", is(savedSub.getId().intValue())))
				.andExpect(jsonPath("$.title", is("Bài tập đã quá hạn")))
				.andExpect(jsonPath("$.score", is(10.0)))
				.andExpect(jsonPath("$.showSolutions", is(true)))
				.andExpect(jsonPath("$.questions", hasSize(1)))
				.andExpect(jsonPath("$.questions[0].isCorrect", is(true)));
	}

	@Test
	@DisplayName("HTT-07-CN-002-TC-03: Bài có nhiều lượt làm lại -> Điểm hiển thị là điểm cao nhất và các lượt khác vẫn xem được")
	void testMultipleAttemptsBestScore_TC03() throws Exception {
		Instant now = Instant.now();
		AssignmentEntity assignment = createAssignment("Bài tập làm lại nhiều lượt", now.minus(2, ChronoUnit.DAYS), now.plus(2, ChronoUnit.DAYS), BigDecimal.valueOf(8));

		// Lượt 1: 5/8 (nộp trước)
		AssignmentSubmissionEntity sub1 = AssignmentSubmissionEntity.createAttempt(assignment, studentA, 1);
		sub1.submit(BigDecimal.valueOf(5), "[]");
		sub1.setSubmittedAt(now.minus(2, ChronoUnit.HOURS));
		assignmentSubmissionRepository.save(sub1);

		// Lượt 2: 7/8 (nộp sau)
		AssignmentSubmissionEntity sub2 = AssignmentSubmissionEntity.createAttempt(assignment, studentA, 2);
		sub2.submit(BigDecimal.valueOf(7), "[]");
		sub2.setSubmittedAt(now.minus(1, ChronoUnit.HOURS));
		assignmentSubmissionRepository.save(sub2);

		mockMvc.perform(get(HISTORY_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalAssignments", is(1)))
				.andExpect(jsonPath("$.totalSubmissions", is(2)))
				.andExpect(jsonPath("$.items", hasSize(1)))
				.andExpect(jsonPath("$.items[0].bestScore", is(7.0)))
				.andExpect(jsonPath("$.items[0].bestScorePercentage", is(87.5)))
				.andExpect(jsonPath("$.items[0].attemptsCount", is(2)))
				.andExpect(jsonPath("$.items[0].attempts", hasSize(2)))
				// Lượt 2 có điểm 7 là isBestScore
				.andExpect(jsonPath("$.items[0].attempts[0].attemptNumber", is(2)))
				.andExpect(jsonPath("$.items[0].attempts[0].score", is(7.0)))
				.andExpect(jsonPath("$.items[0].attempts[0].isBestScore", is(true)))
				// Lượt 1 có điểm 5 vẫn xem được đầy đủ
				.andExpect(jsonPath("$.items[0].attempts[1].attemptNumber", is(1)))
				.andExpect(jsonPath("$.items[0].attempts[1].score", is(5.0)))
				.andExpect(jsonPath("$.items[0].attempts[1].isBestScore", is(false)));
	}

	@Test
	@DisplayName("HTT-07-CN-002-TC-04: Dữ liệu rỗng khi học sinh chưa nộp bài nào")
	void testEmptySubmissionHistory_TC04() throws Exception {
		mockMvc.perform(get(HISTORY_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalAssignments", is(0)))
				.andExpect(jsonPath("$.totalSubmissions", is(0)))
				.andExpect(jsonPath("$.averageScorePercentage", nullValue()))
				.andExpect(jsonPath("$.items", hasSize(0)));
	}

	@Test
	@DisplayName("HTT-07-CN-002-TC-05: QTN-02 - Học sinh A chỉ xem được bài nộp của mình, không xem được bài nộp của học sinh B")
	void testDataIsolationBetweenStudents_TC05() throws Exception {
		Instant now = Instant.now();
		AssignmentEntity assignment = createAssignment("Bài tập chung", now.minus(2, ChronoUnit.DAYS), now.plus(2, ChronoUnit.DAYS), BigDecimal.valueOf(10));

		// Học sinh B nộp bài
		AssignmentSubmissionEntity subB = AssignmentSubmissionEntity.createAttempt(assignment, studentB, 1);
		subB.submit(BigDecimal.valueOf(9.5), "[]");
		AssignmentSubmissionEntity savedSubB = assignmentSubmissionRepository.save(subB);

		// Học sinh A xem lịch sử bài làm -> Danh sách của A hoàn toàn rỗng
		mockMvc.perform(get(HISTORY_URL)
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalAssignments", is(0)))
				.andExpect(jsonPath("$.items", hasSize(0)));

		// Học sinh A cố xem chi tiết bài nộp của Học sinh B qua URL trực tiếp -> Bị từ chối 403 Forbidden (QTN-02)
		mockMvc.perform(get("/api/assignments/submissions/" + savedSubB.getId())
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isForbidden());
	}
}
