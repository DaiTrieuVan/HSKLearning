package com.hsk.progress;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
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
import com.hsk.assignment.domain.AssignmentStudentOverrideEntity;
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
 * Integration Test suite cho User Story HTT-07-CN-004: Xem danh sách học sinh chưa nộp bài
 * Bao phủ đầy đủ 5 Test Cases (TC-01 đến TC-05).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class UnsubmittedStudentsH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String UNSUBMITTED_URL = "/api/progress/assignments/{assignmentId}/unsubmitted";
	private static final String TEACHER_EMAIL = "teacher_unsub@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_unsub@test.com";
	private static final String STUDENT_A_EMAIL = "student_a_unsub@test.com";
	private static final String STUDENT_B_EMAIL = "student_b_unsub@test.com";
	private static final String STUDENT_C_EMAIL = "student_c_unsub@test.com";
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
	private ExerciseEntity exercise;

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

		classroom = classRepository.save(ClassEntity.create(teacher, "Lớp HSK 3 Chuẩn", "Mô tả", "CLS004"));

		// 3 học sinh vào lớp
		classMemberRepository.save(ClassMemberEntity.create(classroom, studentA));
		classMemberRepository.save(ClassMemberEntity.create(classroom, studentB));
		classMemberRepository.save(ClassMemberEntity.create(classroom, studentC));

		exercise = exerciseRepository.save(new ExerciseEntity(teacher.getId(), "Bài tập Ngữ pháp", "Desc", ExerciseStatus.READY));
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

	private AssignmentEntity createAssignment(String title, Instant startTime, Instant dueTime) {
		return assignmentRepository.save(new AssignmentEntity(
				exercise,
				classroom,
				teacher,
				title,
				"Mô tả bài tập",
				startTime,
				dueTime,
				BigDecimal.valueOf(10.0),
				AssignmentStatus.ACTIVE,
				"{}"
		));
	}

	@Test
	@DisplayName("HTT-07-CN-004-TC-01: Luồng thành công — Hiển thị danh sách học sinh chưa nộp và số lượng chưa nộp trên tổng số")
	void testGetUnsubmittedStudents_Success() throws Exception {
		// Bài tập hạn 2 ngày tới
		AssignmentEntity asg = createAssignment(
				"Bài tập 1",
				Instant.now().minus(1, ChronoUnit.DAYS),
				Instant.now().plus(2, ChronoUnit.DAYS)
		);

		// Student A đã nộp bài
		AssignmentSubmissionEntity subA = AssignmentSubmissionEntity.createAttempt(asg, studentA, 1);
		subA.submit(BigDecimal.valueOf(8.0), "{}");
		assignmentSubmissionRepository.save(subA);

		// Student B & C chưa nộp

		mockMvc.perform(get(UNSUBMITTED_URL, asg.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.assignmentId", is(asg.getId().intValue())))
				.andExpect(jsonPath("$.totalStudents", is(3)))
				.andExpect(jsonPath("$.submittedCount", is(1)))
				.andExpect(jsonPath("$.unsubmittedCount", is(2)))
				.andExpect(jsonPath("$.unsubmittedStudents", hasSize(2)))
				.andExpect(jsonPath("$.unsubmittedStudents[?(@.studentId == " + studentB.getId() + ")].fullName").value(org.hamcrest.Matchers.contains("Student B")))
				.andExpect(jsonPath("$.unsubmittedStudents[?(@.studentId == " + studentC.getId() + ")].fullName").value(org.hamcrest.Matchers.contains("Student C")));
	}

	@Test
	@DisplayName("HTT-07-CN-004-TC-02: Luồng thành công — Học sinh được gia hạn nộp sau hạn gốc hiển thị riêng với nhãn nộp trễ")
	void testGetUnsubmittedStudents_LateSubmissionSeparated() throws Exception {
		// Bài tập có hạn gốc là hôm qua (1 ngày trước)
		Instant originalDue = Instant.now().minus(1, ChronoUnit.DAYS);
		AssignmentEntity asg = createAssignment(
				"Bài tập Có Gia Hạn",
				Instant.now().minus(3, ChronoUnit.DAYS),
				originalDue
		);

		// Student A được gia hạn thêm 2 ngày (tức là ngày mai)
		Instant extendedDue = Instant.now().plus(1, ChronoUnit.DAYS);
		overrideRepository.save(AssignmentStudentOverrideEntity.create(asg, studentA, extendedDue, 2, "Xin gia hạn"));

		// Student A nộp bài hôm nay (sau hạn gốc nhưng trước hạn gia hạn)
		AssignmentSubmissionEntity subA = AssignmentSubmissionEntity.createAttempt(asg, studentA, 1);
		subA.submit(BigDecimal.valueOf(9.0), "{}");
		assignmentSubmissionRepository.save(subA);

		// Student B nộp trước hạn gốc (2 ngày trước)
		AssignmentSubmissionEntity subB = AssignmentSubmissionEntity.createAttempt(asg, studentB, 1);
		subB.submit(BigDecimal.valueOf(7.5), "{}");
		subB.setSubmittedAt(Instant.now().minus(2, ChronoUnit.DAYS));
		assignmentSubmissionRepository.save(subB);

		// Student C chưa nộp

		mockMvc.perform(get(UNSUBMITTED_URL, asg.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.submittedCount", is(2)))
				.andExpect(jsonPath("$.unsubmittedCount", is(1)))
				.andExpect(jsonPath("$.lateSubmittedCount", is(1)))
				.andExpect(jsonPath("$.lateSubmissions", hasSize(1)))
				.andExpect(jsonPath("$.lateSubmissions[0].studentId", is(studentA.getId().intValue())))
				.andExpect(jsonPath("$.lateSubmissions[0].isLate", is(true)))
				.andExpect(jsonPath("$.unsubmittedStudents", hasSize(1)))
				.andExpect(jsonPath("$.unsubmittedStudents[0].studentId", is(studentC.getId().intValue())));
	}

	@Test
	@DisplayName("HTT-07-CN-004-TC-03: Sai trạng thái — Bài đã quá hạn gắn nhãn quá hạn, bài chưa đến hạn không gắn nhãn quá hạn")
	void testGetUnsubmittedStudents_OverdueStatus() throws Exception {
		// 1. Bài tập đã quá hạn (hạn 2 ngày trước)
		AssignmentEntity overdueAsg = createAssignment(
				"Bài tập Quá Hạn",
				Instant.now().minus(5, ChronoUnit.DAYS),
				Instant.now().minus(2, ChronoUnit.DAYS)
		);

		mockMvc.perform(get(UNSUBMITTED_URL, overdueAsg.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.isAssignmentOverdue", is(true)))
				.andExpect(jsonPath("$.unsubmittedStudents[0].isOverdue", is(true)));

		// 2. Bài tập chưa đến hạn (hạn 3 ngày tới)
		AssignmentEntity futureAsg = createAssignment(
				"Bài tập Chưa Đến Hạn",
				Instant.now().minus(1, ChronoUnit.DAYS),
				Instant.now().plus(3, ChronoUnit.DAYS)
		);

		mockMvc.perform(get(UNSUBMITTED_URL, futureAsg.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.isAssignmentOverdue", is(false)))
				.andExpect(jsonPath("$.unsubmittedStudents[0].isOverdue", is(false)));
	}

	@Test
	@DisplayName("HTT-07-CN-004-TC-04: Dữ liệu rỗng — Tất cả học sinh đã nộp bài")
	void testGetUnsubmittedStudents_AllSubmitted() throws Exception {
		AssignmentEntity asg = createAssignment(
				"Bài tập Đã Nộp Đủ",
				Instant.now().minus(2, ChronoUnit.DAYS),
				Instant.now().plus(2, ChronoUnit.DAYS)
		);

		// Nộp cho cả 3 học sinh
		for (UserEntity s : new UserEntity[]{studentA, studentB, studentC}) {
			AssignmentSubmissionEntity sub = AssignmentSubmissionEntity.createAttempt(asg, s, 1);
			sub.submit(BigDecimal.valueOf(10.0), "{}");
			assignmentSubmissionRepository.save(sub);
		}

		mockMvc.perform(get(UNSUBMITTED_URL, asg.getId())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalStudents", is(3)))
				.andExpect(jsonPath("$.submittedCount", is(3)))
				.andExpect(jsonPath("$.unsubmittedCount", is(0)))
				.andExpect(jsonPath("$.unsubmittedStudents", hasSize(0)));
	}

	@Test
	@DisplayName("HTT-07-CN-004-TC-05: Không có quyền — Bài thuộc lớp của giáo viên khác hoặc tài khoản học sinh (QTN-01)")
	void testGetUnsubmittedStudents_Forbidden() throws Exception {
		AssignmentEntity asg = createAssignment(
				"Bài tập Bảo Mật",
				Instant.now().minus(1, ChronoUnit.DAYS),
				Instant.now().plus(2, ChronoUnit.DAYS)
		);

		// Giáo viên khác gọi
		mockMvc.perform(get(UNSUBMITTED_URL, asg.getId())
						.header("Authorization", "Bearer " + otherTeacherToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("FORBIDDEN")));

		// Học sinh gọi
		mockMvc.perform(get(UNSUBMITTED_URL, asg.getId())
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("FORBIDDEN")));
	}
}
