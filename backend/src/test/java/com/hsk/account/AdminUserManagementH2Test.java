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
 * HTT-01-CN-008: Quản lý tài khoản người dùng bởi Quản trị viên (Admin).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class AdminUserManagementH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String STUDENT_EMAIL = "student_mgmt@test.com";
	private static final String ADMIN_EMAIL = "admin_mgmt@test.com";
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

	private String adminToken;
	private String studentToken;
	private UserEntity studentUser;
	private UserEntity adminUser;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		registrationService.registerStudent(
				new RegisterStudentRequest("Học Viên Quản Lý", STUDENT_EMAIL, PASSWORD, PASSWORD));
		studentUser = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();

		adminUser = UserEntity.register(ADMIN_EMAIL, passwordEncoder.encode(PASSWORD), "Admin Quản Lý");
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
	@DisplayName("TC-01: Admin tìm kiếm người dùng theo từ khóa và trạng thái")
	void adminSearchUsers() throws Exception {
		mockMvc.perform(get("/api/v1/admin/users")
				.param("query", "student_mgmt")
				.param("status", "ACTIVE")
				.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content").isArray())
				.andExpect(jsonPath("$.content[0].email").value(STUDENT_EMAIL))
				.andExpect(jsonPath("$.content[0].status").value("ACTIVE"))
				.andExpect(jsonPath("$.totalElements").value(1));
	}

	@Test
	@DisplayName("TC-02: Admin khóa tài khoản người dùng thành công và ghi nhận Audit Log")
	void adminLockUserSuccessfully() throws Exception {
		mockMvc.perform(post("/api/v1/admin/users/" + studentUser.getId() + "/lock")
				.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("LOCKED"));

		UserEntity reloaded = userRepository.findById(studentUser.getId()).orElseThrow();
		assertThat(reloaded.getStatus()).isEqualTo(UserStatus.LOCKED);

		List<AuditLogEntity> logs = auditLogRepository.findAll();
		AuditLogEntity lockLog = logs.stream()
				.filter(l -> "LOCK_USER".equals(l.getAction()))
				.findFirst()
				.orElse(null);
		assertThat(lockLog).isNotNull();
		assertThat(lockLog.getEntityId()).isEqualTo(studentUser.getId().toString());
	}

	@Test
	@DisplayName("TC-03: Admin mở khóa tài khoản thành công và ghi nhận Audit Log")
	void adminUnlockUserSuccessfully() throws Exception {
		studentUser.lock();
		userRepository.save(studentUser);

		mockMvc.perform(post("/api/v1/admin/users/" + studentUser.getId() + "/unlock")
				.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("ACTIVE"));

		UserEntity reloaded = userRepository.findById(studentUser.getId()).orElseThrow();
		assertThat(reloaded.getStatus()).isEqualTo(UserStatus.ACTIVE);

		List<AuditLogEntity> logs = auditLogRepository.findAll();
		AuditLogEntity unlockLog = logs.stream()
				.filter(l -> "UNLOCK_USER".equals(l.getAction()))
				.findFirst()
				.orElse(null);
		assertThat(unlockLog).isNotNull();
		assertThat(unlockLog.getEntityId()).isEqualTo(studentUser.getId().toString());
	}

	@Test
	@DisplayName("TC-04: Admin không thể tự khóa tài khoản của chính mình")
	void adminCannotLockOwnAccount() throws Exception {
		mockMvc.perform(post("/api/v1/admin/users/" + adminUser.getId() + "/lock")
				.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("CANNOT_LOCK_SELF"))
				.andExpect(jsonPath("$.message").value("Bạn không thể tự khóa tài khoản của chính mình"));
	}

	@Test
	@DisplayName("TC-05: Học viên không có quyền truy cập endpoint quản trị người dùng (403 FORBIDDEN)")
	void studentForbiddenFromAdminEndpoints() throws Exception {
		mockMvc.perform(get("/api/v1/admin/users")
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code").value("FORBIDDEN"));
	}
}
