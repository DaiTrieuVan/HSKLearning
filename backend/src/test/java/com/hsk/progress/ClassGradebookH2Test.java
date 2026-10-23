package com.hsk.progress;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
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
 * Integration Test suite cho User Story HTT-07-CN-003: Xem bảng điểm lớp
 * Bao phủ toàn diện 9 Test Cases (TC-01 đến TC-09).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ClassGradebookH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String GRADEBOOK_URL = "/api/progress/classes/{classId}/gradebook";
	private static final String TEACHER_EMAIL = "teacher_gb@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_gb@test.com";
	private static final String STUDENT_A_EMAIL = "student_a_gb@test.com";
	private static final String STUDENT_B_EMAIL = "student_b_gb@test.com";
	private static final String STUDENT_C_EMAIL = "student_c_gb@test.com";
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

	private String teacherToken;
	private String otherTeacherToken;
	private String studentAToken;

	private ClassEntity classroom;
	private ExerciseEntity exercise1;
	private ExerciseEntity exercise2;

	@BeforeEach
	void setUp() throws Exception {
		cleanDatabase();

		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Teacher Main", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		registrationService.registerStudent(new RegisterStudentRequest("Other Teacher", OTHER_TEACHER_EMAIL, PASSWORD, PASSWORD));
		otherTeacher = userRepository.findByEmailIgnoreCase(OTHER_TEACHER_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(otherTeacher, teacherRole, null));

		registrationService.registerStudent(new RegisterStudentRequest("Student A", STUDENT_A_EMAIL, PASSWORD, PASSWORD));
		studentA = userRepository.findByEmailIgnoreCase(STUDENT_A_EMAIL).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Student B", STUDENT_B_EMAIL, PASSWORD, PASSWORD));
		studentB = userRepository.findByEmailIgnoreCase(STUDENT_B_EMAIL).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Student C", STUDENT_C_EMAIL, PASSWORD, PASSWORD));
		studentC = userRepository.findByEmailIgnoreCase(STUDENT_C_EMAIL).orElseThrow();

		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		otherTeacherToken = loginAndGetToken(OTHER_TEACHER_EMAIL, PASSWORD);
		studentAToken = loginAndGetToken(STUDENT_A_EMAIL, PASSWORD);

		classroom = classRepository.save(ClassEntity.create(teacher, "Lớp Tiếng Trung HSK 3", "Mô tả lớp", "CLS003"));

		// Thêm học sinh vào lớp
		classMemberRepository.save(ClassMemberEntity.create(classroom, studentA));
		classMemberRepository.save(ClassMemberEntity.create(classroom, studentB));

		exercise1 = exerciseRepository.save(new ExerciseEntity(teacher.getId(), "Bài tập 1: Ngữ pháp HSK 3", "Desc", ExerciseStatus.READY));
		exercise2 = exerciseRepository.save(new ExerciseEntity(teacher.getId(), "Bài tập 2: Từ vựng HSK 3", "Desc", ExerciseStatus.READY));
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

	private AssignmentEntity createAssignment(ExerciseEntity exercise, String title, BigDecimal totalPoints) {
		return assignmentRepository.save(new AssignmentEntity(
				exercise,
				classroom,
				teacher,
				title,
				"Mô tả bài tập",
				Instant.now().minus(2, ChronoUnit.DAYS),
				Instant.now().plus(5, ChronoUnit.DAYS),
				totalPoints,
				AssignmentStatus.ACTIVE,
				"{}"
		));
	}

	@Test
	@DisplayName("HTT-07-CN-003-TC-01: Luồng thành công — Hiển thị ma trận bảng điểm lớp kèm điểm từng bài và điểm trung bình mỗi học sinh")
	void testGetClassGradebook_Success() throws Exception {
		AssignmentEntity asg1 = createAssignment(exercise1, "Bài tập 1", BigDecimal.valueOf(10.0));
		AssignmentEntity asg2 = createAssignment(exercise2, "Bài tập 2", BigDecimal.valueOf(10.0));

		// Student A nộp cả 2 bài: 8.0 và 9.0 -> TB = 8.5
		AssignmentSubmissionEntity subA1 = AssignmentSubmissionEntity.createAttempt(asg1, studentA, 1);
		subA1.submit(BigDecimal.valueOf(8.0), "{}");
		assignmentSubmissionRepository.save(subA1);

		AssignmentSubmissionEntity subA2 = AssignmentSubmissionEntity.createAttempt(asg2, studentA, 1);
		subA2.submit(BigDecimal.valueOf(9.0), "{}");
		assignmentSubmissionRepository.save(subA2);

		// Student B nộp bài 1: 6.0
		AssignmentSubmissionEntity subB1 = AssignmentSubmissionEntity.createAttempt(asg1, studentB, 1);
		subB1.submit(BigDecimal.valueOf(6.0), "{}");
		assignmentSubmissionRepository.save(subB1);

		mockMvc.perform(get(GRADEBOOK_URL, classroom.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.classId", is(classroom.getId().intValue())))
				.andExpect(jsonPath("$.className", is("Lớp Tiếng Trung HSK 3")))
				.andExpect(jsonPath("$.totalAssignments", is(2)))
				.andExpect(jsonPath("$.totalStudents", is(2)))
				.andExpect(jsonPath("$.activeStudentsCount", is(2)))
				.andExpect(jsonPath("$.assignments", hasSize(2)))
				.andExpect(jsonPath("$.assignments[0].title", is("Bài tập 1")))
				.andExpect(jsonPath("$.assignments[0].submittedCount", is(2)))
				.andExpect(jsonPath("$.assignments[0].assignmentAverageScore", is(7.0))) // (8 + 6) / 2 = 7.0
				.andExpect(jsonPath("$.students", hasSize(2)))
				.andExpect(jsonPath("$.students[0].submittedAssignmentsCount", is(2)))
				.andExpect(jsonPath("$.students[0].studentAverageScore", is(8.5)));
	}

	@Test
	@DisplayName("HTT-07-CN-003-TC-02: Sai trạng thái — Ô chưa nộp hiển thị rõ ràng, phân biệt với bài 0 điểm")
	void testGetClassGradebook_DistinguishNotSubmittedFromZeroScore() throws Exception {
		AssignmentEntity asg = createAssignment(exercise1, "Bài tập Trắc nghiệm", BigDecimal.valueOf(10.0));

		// Student A nộp bài và bị 0 điểm
		AssignmentSubmissionEntity subA = AssignmentSubmissionEntity.createAttempt(asg, studentA, 1);
		subA.submit(BigDecimal.valueOf(0.0), "{}");
		assignmentSubmissionRepository.save(subA);

		// Student B chưa nộp bài (không có submission nào)

		mockMvc.perform(get(GRADEBOOK_URL, classroom.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				// Student A: hasSubmitted = true, bestScore = 0.0
				.andExpect(jsonPath("$.students[0].grades[0].hasSubmitted", is(true)))
				.andExpect(jsonPath("$.students[0].grades[0].bestScore", is(0.0)))
				.andExpect(jsonPath("$.students[0].grades[0].status", is("SUBMITTED")))
				// Student B: hasSubmitted = false, bestScore = null, status = "NOT_SUBMITTED"
				.andExpect(jsonPath("$.students[1].grades[0].hasSubmitted", is(false)))
				.andExpect(jsonPath("$.students[1].grades[0].bestScore", nullValue()))
				.andExpect(jsonPath("$.students[1].grades[0].status", is("NOT_SUBMITTED")));
	}

	@Test
	@DisplayName("HTT-07-CN-003-TC-03: Luồng thành công — Điểm sau điều chỉnh được hiển thị và đánh dấu đã điều chỉnh")
	void testGetClassGradebook_AdjustedScoreDisplayedAndMarked() throws Exception {
		AssignmentEntity asg = createAssignment(exercise1, "Bài tập Ôn tập", BigDecimal.valueOf(10.0));

		AssignmentSubmissionEntity subA = AssignmentSubmissionEntity.createAttempt(asg, studentA, 1);
		subA.submit(BigDecimal.valueOf(6.0), "{}");
		subA.adjustScore(BigDecimal.valueOf(7.0), "Cộng điểm phần giải thích phát âm rõ ràng");
		assignmentSubmissionRepository.save(subA);

		mockMvc.perform(get(GRADEBOOK_URL, classroom.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.students[0].grades[0].bestScore", is(7.0)))
				.andExpect(jsonPath("$.students[0].grades[0].isAdjusted", is(true)))
				.andExpect(jsonPath("$.students[0].grades[0].attempts[0].score", is(6.0)))
				.andExpect(jsonPath("$.students[0].grades[0].attempts[0].adjustedScore", is(7.0)))
				.andExpect(jsonPath("$.students[0].grades[0].attempts[0].adjustReason", is("Cộng điểm phần giải thích phát âm rõ ràng")))
				.andExpect(jsonPath("$.students[0].grades[0].attempts[0].adjustedByName", is("Teacher Main")));
	}

	@Test
	@DisplayName("HTT-07-CN-003-TC-04: Luồng thành công — Học sinh bị xóa / rời lớp vẫn hiển thị kết quả cũ và đánh dấu đã rời lớp")
	void testGetClassGradebook_RemovedStudentResultsPreserved() throws Exception {
		AssignmentEntity asg = createAssignment(exercise1, "Bài tập Test", BigDecimal.valueOf(10.0));

		// Thêm Student C và nộp bài
		ClassMemberEntity memberC = classMemberRepository.save(ClassMemberEntity.create(classroom, studentC));
		AssignmentSubmissionEntity subC = AssignmentSubmissionEntity.createAttempt(asg, studentC, 1);
		subC.submit(BigDecimal.valueOf(8.5), "{}");
		assignmentSubmissionRepository.save(subC);

		// Xóa Student C khỏi lớp
		memberC.remove();
		classMemberRepository.save(memberC);

		mockMvc.perform(get(GRADEBOOK_URL, classroom.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalStudents", is(3)))
				.andExpect(jsonPath("$.activeStudentsCount", is(2)))
				// Tìm student C trong danh sách
				.andExpect(jsonPath("$.students[?(@.studentId == " + studentC.getId() + ")].membershipStatus").value(org.hamcrest.Matchers.contains("REMOVED")))
				.andExpect(jsonPath("$.students[?(@.studentId == " + studentC.getId() + ")].isEnrolled").value(org.hamcrest.Matchers.contains(false)))
				.andExpect(jsonPath("$.students[?(@.studentId == " + studentC.getId() + ")].grades[0].bestScore").value(org.hamcrest.Matchers.contains(8.5)));
	}

	@Test
	@DisplayName("HTT-07-CN-003-TC-05: Dữ liệu rỗng — Lớp chưa có bài tập nào")
	void testGetClassGradebook_EmptyAssignments() throws Exception {
		mockMvc.perform(get(GRADEBOOK_URL, classroom.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalAssignments", is(0)))
				.andExpect(jsonPath("$.assignments", hasSize(0)))
				.andExpect(jsonPath("$.totalStudents", is(2)))
				.andExpect(jsonPath("$.students[0].grades", hasSize(0)));
	}

	@Test
	@DisplayName("HTT-07-CN-003-TC-06: Ngoại lệ / Hiệu năng — Lớp nhiều học sinh và bài tập tải nhanh chóng")
	void testGetClassGradebook_PerformanceBatchQuery() throws Exception {
		// Tạo 5 bài tập
		for (int i = 1; i <= 5; i++) {
			createAssignment(exercise1, "Bài tập Perf " + i, BigDecimal.valueOf(10.0));
		}

		long startTime = System.currentTimeMillis();
		mockMvc.perform(get(GRADEBOOK_URL, classroom.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalAssignments", is(5)));
		long duration = System.currentTimeMillis() - startTime;
		// Đảm bảo thời gian phản hồi dưới 3000ms (TC-06 yêu cầu tải dưới 3s)
		org.junit.jupiter.api.Assertions.assertTrue(duration < 3000, "Query took too long: " + duration + "ms");
	}

	@Test
	@DisplayName("HTT-07-CN-003-TC-07: Không có quyền — Lớp thuộc giáo viên khác (QTN-01)")
	void testGetClassGradebook_OtherTeacherForbidden() throws Exception {
		mockMvc.perform(get(GRADEBOOK_URL, classroom.getId())
						.header("Authorization", "Bearer " + otherTeacherToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("FORBIDDEN")));
	}

	@Test
	@DisplayName("HTT-07-CN-003-TC-08: Không có quyền — Học sinh gọi API xem bảng điểm lớp (QTN-01)")
	void testGetClassGradebook_StudentForbidden() throws Exception {
		mockMvc.perform(get(GRADEBOOK_URL, classroom.getId())
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("FORBIDDEN")));
	}

	@Test
	@DisplayName("HTT-07-CN-003-TC-09: Luồng thành công — Học sinh có nhiều lượt: ô hiển thị điểm cao nhất, mở ô thấy các lượt")
	void testGetClassGradebook_MultipleAttemptsHighestScore() throws Exception {
		AssignmentEntity asg = createAssignment(exercise1, "Bài tập Nhiều lượt", BigDecimal.valueOf(10.0));

		// Lượt 1: Điểm 5.0
		AssignmentSubmissionEntity attempt1 = AssignmentSubmissionEntity.createAttempt(asg, studentA, 1);
		attempt1.submit(BigDecimal.valueOf(5.0), "{}");
		assignmentSubmissionRepository.save(attempt1);

		// Lượt 2: Điểm 8.0, sau đó được giáo viên điều chỉnh thành 9.0
		AssignmentSubmissionEntity attempt2 = AssignmentSubmissionEntity.createAttempt(asg, studentA, 2);
		attempt2.submit(BigDecimal.valueOf(8.0), "{}");
		attempt2.adjustScore(BigDecimal.valueOf(9.0), "Cộng điểm khuyến khích");
		assignmentSubmissionRepository.save(attempt2);

		// Lượt 3: Điểm 7.0
		AssignmentSubmissionEntity attempt3 = AssignmentSubmissionEntity.createAttempt(asg, studentA, 3);
		attempt3.submit(BigDecimal.valueOf(7.0), "{}");
		assignmentSubmissionRepository.save(attempt3);

		mockMvc.perform(get(GRADEBOOK_URL, classroom.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				// Điểm hiển thị của ô là điểm cao nhất: 9.0
				.andExpect(jsonPath("$.students[0].grades[0].bestScore", is(9.0)))
				.andExpect(jsonPath("$.students[0].grades[0].totalAttempts", is(3)))
				.andExpect(jsonPath("$.students[0].grades[0].attempts", hasSize(3)))
				// Kiểm tra lượt 2 là best attempt
				.andExpect(jsonPath("$.students[0].grades[0].attempts[1].attemptNumber", is(2)))
				.andExpect(jsonPath("$.students[0].grades[0].attempts[1].isBestAttempt", is(true)))
				.andExpect(jsonPath("$.students[0].grades[0].attempts[1].effectiveScore", is(9.0)))
				.andExpect(jsonPath("$.students[0].grades[0].attempts[1].adjustReason", is("Cộng điểm khuyến khích")));
	}
}
