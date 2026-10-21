package com.hsk.progress;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.RoleEntity;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.PasswordResetTokenRepository;
import com.hsk.account.repository.RoleRepository;
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
import com.hsk.classroom.domain.ClassMemberEntity;
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
 * Integration Test suite cho User Story HTT-07-CN-005: Xem thống kê theo bài tập.
 * Bao phủ đầy đủ 5 Test Cases (TC-01 đến TC-05).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class AssignmentStatisticsH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String STATS_URL = "/api/progress/assignments/{assignmentId}/statistics";
	private static final String TEACHER_EMAIL = "teacher_stats@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_stats@test.com";
	private static final String STUDENT_A_EMAIL = "student_a_stats@test.com";
	private static final String STUDENT_B_EMAIL = "student_b_stats@test.com";
	private static final String STUDENT_C_EMAIL = "student_c_stats@test.com";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private RoleRepository roleRepository;

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

	private UserEntity teacher;
	private UserEntity otherTeacher;
	private UserEntity studentA;
	private UserEntity studentB;
	private UserEntity studentC;
	private ClassEntity classroom;
	private ExerciseEntity exercise;

	private String teacherToken;
	private String otherTeacherToken;
	private String studentAToken;

	@BeforeEach
	void setUp() throws Exception {
		cleanDatabase();

		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();

		// 1. Tạo giáo viên phụ trách
		registrationService.registerStudent(new RegisterStudentRequest("GV Thống Kê", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// 2. Tạo giáo viên khác
		registrationService.registerStudent(new RegisterStudentRequest("GV Khác", OTHER_TEACHER_EMAIL, PASSWORD, PASSWORD));
		otherTeacher = userRepository.findByEmailIgnoreCase(OTHER_TEACHER_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(otherTeacher, teacherRole, null));

		// 3. Tạo 3 học sinh
		registrationService.registerStudent(new RegisterStudentRequest("Học sinh A", STUDENT_A_EMAIL, PASSWORD, PASSWORD));
		studentA = userRepository.findByEmailIgnoreCase(STUDENT_A_EMAIL).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Học sinh B", STUDENT_B_EMAIL, PASSWORD, PASSWORD));
		studentB = userRepository.findByEmailIgnoreCase(STUDENT_B_EMAIL).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Học sinh C", STUDENT_C_EMAIL, PASSWORD, PASSWORD));
		studentC = userRepository.findByEmailIgnoreCase(STUDENT_C_EMAIL).orElseThrow();

		// 4. Lấy tokens
		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		otherTeacherToken = loginAndGetToken(OTHER_TEACHER_EMAIL, PASSWORD);
		studentAToken = loginAndGetToken(STUDENT_A_EMAIL, PASSWORD);

		// 5. Tạo lớp học do teacher phụ trách
		classroom = classRepository.save(ClassEntity.create(teacher, "Lớp HSK Thống Kê", "Mô tả", "STAT01"));

		// Thêm 3 học sinh vào lớp
		classMemberRepository.save(ClassMemberEntity.create(classroom, studentA));
		classMemberRepository.save(ClassMemberEntity.create(classroom, studentB));
		classMemberRepository.save(ClassMemberEntity.create(classroom, studentC));

		// 6. Tạo Exercise mẫu
		exercise = exerciseRepository.save(new ExerciseEntity(teacher.getId(), "Bài tập Ngữ pháp mẫu", "Mô tả", ExerciseStatus.READY));
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
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		String body = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
		MvcResult result = mockMvc.perform(
						org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post(LOGIN_URL)
								.contentType(MediaType.APPLICATION_JSON)
								.content(body)
				)
				.andExpect(status().isOk())
				.andReturn();
		JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString(StandardCharsets.UTF_8));
		return node.get("token").asText();
	}

	private String sampleSnapshot3Questions() {
		return """
				[
					{"questionId": 101, "sortOrder": 1, "type": "MCQ", "content": "Câu 1: Chọn từ đúng", "explanation": "Giải thích 1", "points": 3.0, "options": []},
					{"questionId": 102, "sortOrder": 2, "type": "MCQ", "content": "Câu 2: Điền từ vào chỗ trống", "explanation": "Giải thích 2", "points": 3.0, "options": []},
					{"questionId": 103, "sortOrder": 3, "type": "FILL_BLANK", "content": "Câu 3: Sắp xếp câu", "explanation": "Giải thích 3", "points": 4.0, "options": []}
				]
				""";
	}

	private AssignmentEntity createAssignment(String title) {
		AssignmentEntity asg = new AssignmentEntity(
				exercise,
				classroom,
				teacher,
				title,
				"Mô tả bài tập",
				Instant.now().minus(2, ChronoUnit.DAYS),
				Instant.now().plus(2, ChronoUnit.DAYS),
				BigDecimal.valueOf(10.0),
				AssignmentStatus.ACTIVE,
				sampleSnapshot3Questions()
		);
		return assignmentRepository.save(asg);
	}

	@Test
	@DisplayName("HTT-07-CN-005-TC-01: Luồng thành công — Điểm trung bình, max, min và phân bố điểm theo khoảng")
	void testGetAssignmentStatistics_SummaryAndDistribution() throws Exception {
		AssignmentEntity asg = createAssignment("Bài tập Thống Kê 1");

		// Student A: điểm 9.0 (khoảng 8.0 - 10.0)
		AssignmentSubmissionEntity subA = AssignmentSubmissionEntity.createAttempt(asg, studentA, 1);
		subA.submit(BigDecimal.valueOf(9.0), "[]");
		assignmentSubmissionRepository.save(subA);

		// Student B: điểm 7.0 (khoảng 6.5 - 7.9)
		AssignmentSubmissionEntity subB = AssignmentSubmissionEntity.createAttempt(asg, studentB, 1);
		subB.submit(BigDecimal.valueOf(7.0), "[]");
		assignmentSubmissionRepository.save(subB);

		// Student C: điểm 4.5 (khoảng < 5.0)
		AssignmentSubmissionEntity subC = AssignmentSubmissionEntity.createAttempt(asg, studentC, 1);
		subC.submit(BigDecimal.valueOf(4.5), "[]");
		assignmentSubmissionRepository.save(subC);

		// Gọi endpoint thống kê
		mockMvc.perform(get(STATS_URL, asg.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.hasData", is(true)))
				.andExpect(jsonPath("$.totalStudents", is(3)))
				.andExpect(jsonPath("$.submittedCount", is(3)))
				.andExpect(jsonPath("$.averageScore", is(6.8)))
				.andExpect(jsonPath("$.maxScore", is(9.0)))
				.andExpect(jsonPath("$.minScore", is(4.5)))
				.andExpect(jsonPath("$.scoreDistribution", hasSize(4)))
				.andExpect(jsonPath("$.scoreDistribution[0].rangeKey", is("BELOW_5")))
				.andExpect(jsonPath("$.scoreDistribution[0].count", is(1)))
				.andExpect(jsonPath("$.scoreDistribution[0].percentage", is(33.3)))
				.andExpect(jsonPath("$.scoreDistribution[1].rangeKey", is("FROM_5_TO_6_5")))
				.andExpect(jsonPath("$.scoreDistribution[1].count", is(0)))
				.andExpect(jsonPath("$.scoreDistribution[2].rangeKey", is("FROM_6_5_TO_8")))
				.andExpect(jsonPath("$.scoreDistribution[2].count", is(1)))
				.andExpect(jsonPath("$.scoreDistribution[3].rangeKey", is("FROM_8_TO_10")))
				.andExpect(jsonPath("$.scoreDistribution[3].count", is(1)));
	}

	@Test
	@DisplayName("HTT-07-CN-005-TC-02: Luồng thành công — Tỷ lệ sai từng câu và xếp câu sai nhiều nhất lên đầu")
	void testGetAssignmentStatistics_QuestionStatsSortedByWrongRate() throws Exception {
		AssignmentEntity asg = createAssignment("Bài tập Câu Sai Nhiều Nhất");

		// Student A: Q101 đúng, Q102 đúng, Q103 sai
		String answersA = """
				[
					{"questionId": 101, "isCorrect": true, "pointsEarned": 3.0},
					{"questionId": 102, "isCorrect": true, "pointsEarned": 3.0},
					{"questionId": 103, "isCorrect": false, "pointsEarned": 0.0}
				]
				""";
		AssignmentSubmissionEntity subA = AssignmentSubmissionEntity.createAttempt(asg, studentA, 1);
		subA.submit(BigDecimal.valueOf(6.0), answersA);
		assignmentSubmissionRepository.save(subA);

		// Student B: Q101 đúng, Q102 sai, Q103 sai
		String answersB = """
				[
					{"questionId": 101, "isCorrect": true, "pointsEarned": 3.0},
					{"questionId": 102, "isCorrect": false, "pointsEarned": 0.0},
					{"questionId": 103, "isCorrect": false, "pointsEarned": 0.0}
				]
				""";
		AssignmentSubmissionEntity subB = AssignmentSubmissionEntity.createAttempt(asg, studentB, 1);
		subB.submit(BigDecimal.valueOf(3.0), answersB);
		assignmentSubmissionRepository.save(subB);

		// Student C: Q101 đúng, Q102 sai, Q103 sai
		String answersC = """
				[
					{"questionId": 101, "isCorrect": true, "pointsEarned": 3.0},
					{"questionId": 102, "isCorrect": false, "pointsEarned": 0.0},
					{"questionId": 103, "isCorrect": false, "pointsEarned": 0.0}
				]
				""";
		AssignmentSubmissionEntity subC = AssignmentSubmissionEntity.createAttempt(asg, studentC, 1);
		subC.submit(BigDecimal.valueOf(3.0), answersC);
		assignmentSubmissionRepository.save(subC);

		// Tổng kết câu sai:
		// Q103: 3/3 sai -> 100.0%
		// Q102: 2/3 sai -> 66.7%
		// Q101: 0/3 sai -> 0.0%
		mockMvc.perform(get(STATS_URL, asg.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.questionStats", hasSize(3)))
				// Câu đầu tiên phải là Q103 (sai 100.0%)
				.andExpect(jsonPath("$.questionStats[0].questionId", is(103)))
				.andExpect(jsonPath("$.questionStats[0].wrongCount", is(3)))
				.andExpect(jsonPath("$.questionStats[0].wrongPercentage", is(100.0)))
				// Câu thứ hai là Q102 (sai 66.7%)
				.andExpect(jsonPath("$.questionStats[1].questionId", is(102)))
				.andExpect(jsonPath("$.questionStats[1].wrongCount", is(2)))
				.andExpect(jsonPath("$.questionStats[1].wrongPercentage", is(66.7)))
				// Câu thứ ba là Q101 (sai 0.0%)
				.andExpect(jsonPath("$.questionStats[2].questionId", is(101)))
				.andExpect(jsonPath("$.questionStats[2].wrongCount", is(0)))
				.andExpect(jsonPath("$.questionStats[2].wrongPercentage", is(0.0)));
	}

	@Test
	@DisplayName("HTT-07-CN-005-TC-03: Ngoại lệ QTN-13 — Học sinh có nhiều lượt chỉ tính theo lượt điểm cao nhất (Best Attempt)")
	void testGetAssignmentStatistics_MultipleAttemptsOnlyCountsBestAttempt() throws Exception {
		AssignmentEntity asg = createAssignment("Bài tập Làm Lại");

		// Student A lượt 1: điểm 5.0 (Q101 đúng, Q102 sai, Q103 sai)
		String answersA1 = """
				[
					{"questionId": 101, "isCorrect": true, "pointsEarned": 3.0},
					{"questionId": 102, "isCorrect": false, "pointsEarned": 0.0},
					{"questionId": 103, "isCorrect": false, "pointsEarned": 0.0}
				]
				""";
		AssignmentSubmissionEntity subA1 = AssignmentSubmissionEntity.createAttempt(asg, studentA, 1);
		subA1.submit(BigDecimal.valueOf(5.0), answersA1);
		assignmentSubmissionRepository.save(subA1);

		// Student A lượt 2: điểm 8.0 (Q101 đúng, Q102 đúng, Q103 sai)
		String answersA2 = """
				[
					{"questionId": 101, "isCorrect": true, "pointsEarned": 3.0},
					{"questionId": 102, "isCorrect": true, "pointsEarned": 3.0},
					{"questionId": 103, "isCorrect": false, "pointsEarned": 0.0}
				]
				""";
		AssignmentSubmissionEntity subA2 = AssignmentSubmissionEntity.createAttempt(asg, studentA, 2);
		subA2.submit(BigDecimal.valueOf(8.0), answersA2);
		assignmentSubmissionRepository.save(subA2);

		// Student B lượt 1: điểm 6.0 (Q101 đúng, Q102 sai, Q103 sai)
		String answersB1 = """
				[
					{"questionId": 101, "isCorrect": true, "pointsEarned": 3.0},
					{"questionId": 102, "isCorrect": false, "pointsEarned": 0.0},
					{"questionId": 103, "isCorrect": false, "pointsEarned": 0.0}
				]
				""";
		AssignmentSubmissionEntity subB1 = AssignmentSubmissionEntity.createAttempt(asg, studentB, 1);
		subB1.submit(BigDecimal.valueOf(6.0), answersB1);
		assignmentSubmissionRepository.save(subB1);

		// Chỉ có 2 học sinh đã nộp bài (Student A và B).
		// Điểm Student A lấy lượt 2 (8.0).
		// Điểm trung bình = (8.0 + 6.0) / 2 = 7.0
		// Thống kê câu hỏi tính theo Best Attempt (Student A lượt 2 + Student B lượt 1):
		// Q101: 2 đúng, 0 sai (0.0% sai)
		// Q102: Student A đúng, Student B sai -> 1 sai / 2 = 50.0% sai
		// Q103: Cả 2 đều sai -> 2 sai / 2 = 100.0% sai
		mockMvc.perform(get(STATS_URL, asg.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.submittedCount", is(2)))
				.andExpect(jsonPath("$.averageScore", is(7.0)))
				.andExpect(jsonPath("$.maxScore", is(8.0)))
				.andExpect(jsonPath("$.minScore", is(6.0)))
				.andExpect(jsonPath("$.questionStats[0].questionId", is(103)))
				.andExpect(jsonPath("$.questionStats[0].wrongPercentage", is(100.0)))
				.andExpect(jsonPath("$.questionStats[1].questionId", is(102)))
				.andExpect(jsonPath("$.questionStats[1].wrongPercentage", is(50.0)))
				.andExpect(jsonPath("$.questionStats[2].questionId", is(101)))
				.andExpect(jsonPath("$.questionStats[2].wrongPercentage", is(0.0)));
	}

	@Test
	@DisplayName("HTT-07-CN-005-TC-04: Dữ liệu rỗng — Bài tập chưa có bài nộp nào")
	void testGetAssignmentStatistics_EmptySubmissions() throws Exception {
		AssignmentEntity asg = createAssignment("Bài tập Mới Giao Chưa Nộp");

		mockMvc.perform(get(STATS_URL, asg.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.hasData", is(false)))
				.andExpect(jsonPath("$.submittedCount", is(0)))
				.andExpect(jsonPath("$.averageScore", nullValue()))
				.andExpect(jsonPath("$.maxScore", nullValue()))
				.andExpect(jsonPath("$.minScore", nullValue()))
				.andExpect(jsonPath("$.scoreDistribution", hasSize(0)))
				.andExpect(jsonPath("$.questionStats", hasSize(0)));
	}

	@Test
	@DisplayName("HTT-07-CN-005-TC-05: Bảo mật QTN-01 — Không có quyền truy cập (Giáo viên khác hoặc học sinh)")
	void testGetAssignmentStatistics_Forbidden() throws Exception {
		AssignmentEntity asg = createAssignment("Bài tập Bảo Mật");

		// Giáo viên khác gọi
		mockMvc.perform(get(STATS_URL, asg.getId())
						.header("Authorization", "Bearer " + otherTeacherToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("FORBIDDEN")));

		// Học sinh gọi
		mockMvc.perform(get(STATS_URL, asg.getId())
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("FORBIDDEN")));
	}
}
