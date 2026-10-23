package com.hsk.progress;

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
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.LessonEntity;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
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
 * Integration Test suite cho User Story HTT-07-CN-008: Xem thống kê toàn hệ thống.
 * Bao phủ các test cases: TC-01 đến TC-04.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class AdminSystemStatsH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String STATS_URL = "/api/v1/admin/system-stats";
	private static final String ADMIN_EMAIL = "admin_stat@test.com";
	private static final String TEACHER_EMAIL = "teacher_stat@test.com";
	private static final String STUDENT_EMAIL = "student_stat@test.com";
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
	private AssignmentRepository assignmentRepository;

	@Autowired
	private AssignmentSubmissionRepository assignmentSubmissionRepository;

	@Autowired
	private AssignmentStudentOverrideRepository overrideRepository;

	@Autowired
	private ExerciseRepository exerciseRepository;

	@Autowired
	private LessonRepository lessonRepository;

	@Autowired
	private HskLevelRepository hskLevelRepository;

	@Autowired
	private com.hsk.common.audit.AuditLogRepository auditLogRepository;

	@Autowired
	private com.hsk.content.repository.LessonVocabularyRepository lessonVocabularyRepository;

	private UserEntity admin;
	private UserEntity teacher;
	private UserEntity student;

	private String adminToken;
	private String teacherToken;
	private String studentToken;

	@BeforeEach
	void setUp() throws Exception {
		cleanDatabase();

		RoleEntity adminRole = roleRepository.findByCode(RoleCode.ADMIN).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		RoleEntity studentRole = roleRepository.findByCode(RoleCode.STUDENT).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Admin User", ADMIN_EMAIL, PASSWORD, PASSWORD));
		admin = userRepository.findByEmailIgnoreCase(ADMIN_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(admin, adminRole, null));

		registrationService.registerStudent(new RegisterStudentRequest("Teacher User", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		registrationService.registerStudent(new RegisterStudentRequest("Student User", STUDENT_EMAIL, PASSWORD, PASSWORD));
		student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();

		adminToken = loginAndGetToken(ADMIN_EMAIL, PASSWORD);
		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		studentToken = loginAndGetToken(STUDENT_EMAIL, PASSWORD);
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
		auditLogRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
		lessonVocabularyRepository.deleteAll();
		lessonRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		String body = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
		MvcResult result = mockMvc.perform(
				org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(body)
		).andExpect(status().isOk()).andReturn();

		JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString(StandardCharsets.UTF_8));
		return node.get("token").asText();
	}

	@Test
	@DisplayName("TC-01: Quản trị viên xem số lượng người dùng theo vai trò, số lớp, số bài học và số bài nộp")
	void testGetSystemStatistics_Success() throws Exception {
		// Tạo 1 lớp học
		ClassEntity cls = classRepository.save(ClassEntity.create(teacher, "Lớp Thử Nghiệm", "Desc", "CLS999"));
		classMemberRepository.save(ClassMemberEntity.create(cls, student));

		// Lấy hoặc tạo HSK Level
		HskLevelEntity level = hskLevelRepository.findAll().stream().findFirst()
				.orElseGet(() -> hskLevelRepository.save(new HskLevelEntity("HSK_DEF", "HSK Mặc Định", 99, "Desc", 100)));

		LessonEntity l1 = new LessonEntity(level, "Bài 1: Chào hỏi", "Desc 1", 1, null);
		lessonRepository.save(l1);

		LessonEntity l2 = new LessonEntity(level, "Bài 2: Gia đình", "Desc 2", 2, null);
		lessonRepository.save(l2);

		// Tạo bài tập và 1 bài nộp
		ExerciseEntity exercise = exerciseRepository.save(new ExerciseEntity(teacher.getId(), "BT Thử Nghiệm", "Desc", ExerciseStatus.READY));
		AssignmentEntity assignment = assignmentRepository.save(new AssignmentEntity(
				exercise,
				cls,
				teacher,
				"Bài tập tuần 1",
				"Desc",
				Instant.now().minus(2, ChronoUnit.DAYS),
				Instant.now().plus(5, ChronoUnit.DAYS),
				BigDecimal.valueOf(10.0),
				AssignmentStatus.ACTIVE,
				"{}"
		));

		AssignmentSubmissionEntity sub = AssignmentSubmissionEntity.createAttempt(assignment, student, 1);
		sub.submit(BigDecimal.valueOf(9.0), "{}");
		assignmentSubmissionRepository.save(sub);

		// Admin gọi thống kê
		mockMvc.perform(
				get(STATS_URL)
						.header("Authorization", "Bearer " + adminToken)
		)
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.period", is("ALL")))
				.andExpect(jsonPath("$.totalUsers", is(3)))
				.andExpect(jsonPath("$.totalAdmins", is(1)))
				.andExpect(jsonPath("$.totalTeachers", is(1)))
				.andExpect(jsonPath("$.totalStudents", is(3))) // Mọi người dùng đăng ký đều có role STUDENT mặc định
				.andExpect(jsonPath("$.totalClasses", is(1)))
				.andExpect(jsonPath("$.totalLessons", is(2)))
				.andExpect(jsonPath("$.totalSubmissions", is(1)))
				.andExpect(jsonPath("$.newUsersInPeriod", is(3)))
				.andExpect(jsonPath("$.newClassesInPeriod", is(1)))
				.andExpect(jsonPath("$.newSubmissionsInPeriod", is(1)));
	}

	@Test
	@DisplayName("TC-02: Lọc số liệu theo thời gian 7 ngày và 30 ngày")
	void testGetSystemStatistics_FilterPeriod() throws Exception {
		mockMvc.perform(
				get(STATS_URL)
						.param("period", "7D")
						.header("Authorization", "Bearer " + adminToken)
		)
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.period", is("7D")))
				.andExpect(jsonPath("$.totalUsers", is(3)))
				.andExpect(jsonPath("$.newUsersInPeriod", is(3)));

		mockMvc.perform(
				get(STATS_URL)
						.param("period", "30D")
						.header("Authorization", "Bearer " + adminToken)
		)
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.period", is("30D")))
				.andExpect(jsonPath("$.totalUsers", is(3)))
				.andExpect(jsonPath("$.newUsersInPeriod", is(3)));
	}

	@Test
	@DisplayName("TC-03: Dữ liệu rỗng - Hệ thống chưa có lớp, bài học, bài nộp trả về 0 và không báo lỗi")
	void testGetSystemStatistics_EmptyData() throws Exception {
		mockMvc.perform(
				get(STATS_URL)
						.header("Authorization", "Bearer " + adminToken)
		)
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalClasses", is(0)))
				.andExpect(jsonPath("$.totalLessons", is(0)))
				.andExpect(jsonPath("$.totalSubmissions", is(0)));
	}

	@Test
	@DisplayName("TC-04: Bảo mật phân quyền - Giáo viên hoặc Học sinh truy cập bị từ chối 403 Forbidden")
	void testGetSystemStatistics_ForbiddenForNonAdmin() throws Exception {
		// Giáo viên truy cập -> 403
		mockMvc.perform(
				get(STATS_URL)
						.header("Authorization", "Bearer " + teacherToken)
		)
				.andExpect(status().isForbidden());

		// Học sinh truy cập -> 403
		mockMvc.perform(
				get(STATS_URL)
						.header("Authorization", "Bearer " + studentToken)
		)
				.andExpect(status().isForbidden());
	}
}
