package com.hsk.account;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
import com.hsk.account.domain.UiMode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
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
 * HTT-01-CN-009: Chuyển đổi chế độ làm việc (STUDENT ⇄ TEACHER).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class SwitchModeH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String DUAL_USER_EMAIL = "dual_role@test.com";
	private static final String STUDENT_ONLY_EMAIL = "student_only@test.com";
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

	private String dualUserToken;
	private String studentOnlyToken;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Dual role user (STUDENT + TEACHER)
		registrationService.registerStudent(
				new RegisterStudentRequest("Người Dùng Đa Quyền", DUAL_USER_EMAIL, PASSWORD, PASSWORD));
		UserEntity dualUser = userRepository.findByEmailIgnoreCase(DUAL_USER_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(dualUser, teacherRole, null));

		// Student only user
		registrationService.registerStudent(
				new RegisterStudentRequest("Chỉ Là Học Sinh", STUDENT_ONLY_EMAIL, PASSWORD, PASSWORD));

		dualUserToken = loginAndGetToken(DUAL_USER_EMAIL, PASSWORD);
		studentOnlyToken = loginAndGetToken(STUDENT_ONLY_EMAIL, PASSWORD);
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
	@DisplayName("TC-01: Tài khoản có 2 vai trò chuyển sang TEACHER thành công và ghi nhận Audit Log")
	void dualRoleUserSwitchesToTeacherSuccessfully() throws Exception {
		mockMvc.perform(put("/api/v1/profile/mode")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"mode\":\"TEACHER\"}")
				.header("Authorization", "Bearer " + dualUserToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.lastMode").value("TEACHER"));

		UserEntity reloaded = userRepository.findByEmailIgnoreCase(DUAL_USER_EMAIL).orElseThrow();
		assertThat(reloaded.getLastMode()).isEqualTo(UiMode.TEACHER);

		List<AuditLogEntity> logs = auditLogRepository.findAll();
		AuditLogEntity switchLog = logs.stream()
				.filter(l -> "SWITCH_MODE".equals(l.getAction()))
				.findFirst()
				.orElse(null);
		assertThat(switchLog).isNotNull();
		assertThat(switchLog.getDetail()).contains("TEACHER");
	}

	@Test
	@DisplayName("TC-02: Tài khoản có 2 vai trò chuyển về STUDENT thành công")
	void dualRoleUserSwitchesToStudentSuccessfully() throws Exception {
		mockMvc.perform(put("/api/v1/profile/mode")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"mode\":\"STUDENT\"}")
				.header("Authorization", "Bearer " + dualUserToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.lastMode").value("STUDENT"));

		UserEntity reloaded = userRepository.findByEmailIgnoreCase(DUAL_USER_EMAIL).orElseThrow();
		assertThat(reloaded.getLastMode()).isEqualTo(UiMode.STUDENT);
	}

	@Test
	@DisplayName("TC-03: Tài khoản chỉ có quyền STUDENT bị từ chối khi cố chuyển sang TEACHER (403 TEACHER_ROLE_NOT_GRANTED)")
	void studentOnlyUserCannotSwitchToTeacher() throws Exception {
		mockMvc.perform(put("/api/v1/profile/mode")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"mode\":\"TEACHER\"}")
				.header("Authorization", "Bearer " + studentOnlyToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code").value("TEACHER_ROLE_NOT_GRANTED"))
				.andExpect(jsonPath("$.message").value("Bạn chưa có quyền giáo viên để thực hiện thao tác này"));
	}

	@Test
	@DisplayName("TC-04: Lấy thông tin profile phản ánh đúng lastMode đã chuyển đổi")
	void profileMeReflectsLastMode() throws Exception {
		mockMvc.perform(put("/api/v1/profile/mode")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"mode\":\"TEACHER\"}")
				.header("Authorization", "Bearer " + dualUserToken))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/v1/profile/me")
				.header("Authorization", "Bearer " + dualUserToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.lastMode").value("TEACHER"));
	}
}
