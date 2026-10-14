package com.hsk.account;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.RoleEntity;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
import com.hsk.account.domain.UserStatus;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.PasswordResetTokenRepository;
import com.hsk.account.repository.RoleRepository;
import com.hsk.account.repository.TeacherRequestRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.common.audit.AuditLogEntity;
import com.hsk.common.audit.AuditLogRepository;

/**
 * HTT-01-CN-007: Phân quyền vai trò người dùng (STUDENT, TEACHER, ADMIN).
 * Kiểm thử kiểm soát truy cập đa vai trò, chặn truy cập trái phép và chấm dứt phiên khi tài khoản bị khóa.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test-h2")
class RolePermissionsH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String STUDENT_EMAIL = "student_perm@test.com";
	private static final String ADMIN_EMAIL = "admin_perm@test.com";
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
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private AuditLogRepository auditLogRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private RegistrationService registrationService;

	private String studentToken;
	private String adminToken;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Đăng ký học sinh
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Viên Test", STUDENT_EMAIL, PASSWORD, PASSWORD));

		// Tạo tài khoản admin
		UserEntity adminUser = UserEntity.register(ADMIN_EMAIL, passwordEncoder.encode(PASSWORD), "Quản Trị Viên");
		userRepository.save(adminUser);
		RoleEntity adminRole = roleRepository.findByCode(RoleCode.ADMIN).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(adminUser, adminRole, null));

		studentToken = loginAndGetToken(STUDENT_EMAIL, PASSWORD);
		adminToken = loginAndGetToken(ADMIN_EMAIL, PASSWORD);
	}

	@Autowired
	private com.hsk.classroom.repository.ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private com.hsk.classroom.repository.ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private com.hsk.classroom.repository.ClassMemberRepository classMemberRepository;

	@Autowired
	private com.hsk.classroom.repository.ClassRepository classRepository;

	@AfterEach
	void tearDown() {
		classJoinAttemptRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		auditLogRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.get("token").asText();
	}

	@Test
	@DisplayName("TC-01: Admin được phép truy cập tài nguyên của quản trị viên")
	void adminCanAccessAdminEndpoints() throws Exception {
		mockMvc.perform(get("/api/v1/admin/teacher-requests")
				.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk());
	}

	@Test
	@DisplayName("TC-02 & TC-11: Học viên truy cập tài nguyên Admin bị từ chối 403 FORBIDDEN và ghi nhận Audit Log")
	void studentAccessingAdminEndpointReturnsForbiddenAndAudited() throws Exception {
		mockMvc.perform(get("/api/v1/admin/teacher-requests")
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code").value("FORBIDDEN"))
				.andExpect(jsonPath("$.message").value("Bạn không có quyền thực hiện thao tác này"));

		List<AuditLogEntity> logs = auditLogRepository.findAll();
		assertThat(logs).isNotEmpty();
		AuditLogEntity securityLog = logs.stream()
				.filter(l -> "UNAUTHORIZED_ACCESS_ATTEMPT".equals(l.getAction()))
				.findFirst()
				.orElse(null);
		assertThat(securityLog).isNotNull();
		assertThat(securityLog.getEntityId()).isEqualTo("/api/v1/admin/teacher-requests");
		assertThat(securityLog.getDetail()).contains("Truy cập trái phép vào tài nguyên");
	}

	@Test
	@DisplayName("TC-08: Tài khoản bị khóa trong khi đang giữ JWT token thì bị chặn ngay với mã ACCOUNT_LOCKED (403)")
	void lockedAccountRejectedImmediatelyEvenWithValidJwt() throws Exception {
		UserEntity student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		student.lock();
		userRepository.save(student);

		mockMvc.perform(get("/api/v1/profile/me")
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code").value("ACCOUNT_LOCKED"))
				.andExpect(jsonPath("$.message").value("Tài khoản đã bị quản trị viên khóa, vui lòng liên hệ quản trị viên"));
	}

	@Test
	@DisplayName("TC-09: Truy cập không có Bearer token trả về 401 UNAUTHORIZED")
	void unauthenticatedRequestReturnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/v1/profile/me"))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.code").value("UNAUTHORIZED"))
				.andExpect(jsonPath("$.message").value("Bạn chưa đăng nhập hoặc phiên đã hết hạn"));
	}
}
