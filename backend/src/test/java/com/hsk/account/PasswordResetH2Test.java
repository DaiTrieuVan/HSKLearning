package com.hsk.account;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.PasswordResetTokenEntity;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.PasswordResetTokenRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.common.audit.AuditLogRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class PasswordResetH2Test {

	private static final String FORGOT_URL = "/api/v1/auth/forgot-password";
	private static final String VALIDATE_URL = "/api/v1/auth/reset-password/validate";
	private static final String RESET_URL = "/api/v1/auth/reset-password";
	private static final String LOGIN_URL = "/api/v1/auth/login";

	private static final String TEST_EMAIL = "reset.test.user@example.com";
	private static final String OLD_PASSWORD = "OldPassword2026!";
	private static final String NEW_PASSWORD = "NewPassword2026!";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private PasswordResetTokenRepository tokenRepository;

	@Autowired
	private AuditLogRepository auditLogRepository;

	@Autowired
	private RegistrationService registrationService;

	@BeforeEach
	void setUp() {
		tokenRepository.deleteAll();
		auditLogRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();

		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh Đổi Mật Khẩu", TEST_EMAIL, OLD_PASSWORD, OLD_PASSWORD));
	}

	@AfterEach
	void tearDown() {
		tokenRepository.deleteAll();
		auditLogRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	@Test
	@DisplayName("HTT-01-CN-005-TC-01..02: Luồng thành công đặt lại mật khẩu và đăng nhập bằng mật khẩu mới")
	void passwordReset_success_flow() throws Exception {
		// 1. Gửi yêu cầu đặt lại mật khẩu (TC-01)
		MvcResult forgotResult = mockMvc.perform(post(FORGOT_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"" + TEST_EMAIL + "\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.message", notNullValue()))
				.andExpect(jsonPath("$.resetToken", notNullValue()))
				.andReturn();

		JsonNode json = objectMapper.readTree(forgotResult.getResponse().getContentAsString());
		String token = json.get("resetToken").asText();

		// 2. Kiểm tra token hợp lệ trước khi render form
		mockMvc.perform(get(VALIDATE_URL)
				.param("token", token))
				.andExpect(status().isOk());

		// 3. Thực hiện đổi mật khẩu (TC-02)
		mockMvc.perform(post(RESET_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"token\":\"" + token + "\",\"newPassword\":\"" + NEW_PASSWORD + "\",\"confirmPassword\":\"" + NEW_PASSWORD + "\"}"))
				.andExpect(status().isOk());

		// 4. Đăng nhập bằng mật khẩu cũ phải THẤT BẠI
		mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"" + TEST_EMAIL + "\",\"password\":\"" + OLD_PASSWORD + "\"}"))
				.andExpect(status().isUnauthorized());

		// 5. Đăng nhập bằng mật khẩu mới phải THÀNH CÔNG
		mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"" + TEST_EMAIL + "\",\"password\":\"" + NEW_PASSWORD + "\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token", notNullValue()));

		// 6. Kiểm tra audit log
		var logs = auditLogRepository.findByActionOrderByCreatedAtDesc("PASSWORD_RESET");
		org.junit.jupiter.api.Assertions.assertFalse(logs.isEmpty(), "Must record audit log for password reset");
	}

	@Test
	@DisplayName("HTT-01-CN-005-TC-03: Email chưa đăng ký trả về thông báo chung, không lộ thông tin")
	void forgotPassword_unregisteredEmail_safeResponse() throws Exception {
		mockMvc.perform(post(FORGOT_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"khongtontai@example.com\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.message", notNullValue()))
				.andExpect(jsonPath("$.resetToken").doesNotExist());
	}

	@Test
	@DisplayName("HTT-01-CN-005-TC-04: Mã liên kết quá hạn 30 phút báo lỗi TOKEN_EXPIRED")
	void resetPassword_expiredToken_badRequest() throws Exception {
		// Tạo token trực tiếp và đặt expires_at lùi về quá khứ 35 phút
		UserEntity user = userRepository.findByEmail(TEST_EMAIL).orElseThrow();
		String rawToken = "expiredtokentest123456789";
		String tokenHash = org.springframework.util.DigestUtils.md5DigestAsHex(rawToken.getBytes()); // for mock
		// Using real hash from service
		java.security.MessageDigest md = java.security.MessageDigest.getInstance("SHA-256");
		tokenHash = java.util.HexFormat.of().formatHex(md.digest(rawToken.getBytes(java.nio.charset.StandardCharsets.UTF_8)));

		PasswordResetTokenEntity entity = PasswordResetTokenEntity.create(user, tokenHash, Instant.now().minus(35, ChronoUnit.MINUTES));
		tokenRepository.save(entity);

		// Validate token báo lỗi TOKEN_EXPIRED
		mockMvc.perform(get(VALIDATE_URL)
				.param("token", rawToken))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", equalTo("TOKEN_EXPIRED")));

		// Submit đổi mật khẩu cũng báo lỗi TOKEN_EXPIRED
		mockMvc.perform(post(RESET_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"token\":\"" + rawToken + "\",\"newPassword\":\"" + NEW_PASSWORD + "\",\"confirmPassword\":\"" + NEW_PASSWORD + "\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", equalTo("TOKEN_EXPIRED")));
	}

	@Test
	@DisplayName("HTT-01-CN-005-TC-05: Liên kết đã sử dụng một lần báo lỗi TOKEN_ALREADY_USED")
	void resetPassword_alreadyUsedToken_badRequest() throws Exception {
		MvcResult forgotResult = mockMvc.perform(post(FORGOT_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"" + TEST_EMAIL + "\"}"))
				.andExpect(status().isOk())
				.andReturn();

		String token = objectMapper.readTree(forgotResult.getResponse().getContentAsString()).get("resetToken").asText();

		// Sử dụng lần 1 -> Thành công
		mockMvc.perform(post(RESET_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"token\":\"" + token + "\",\"newPassword\":\"" + NEW_PASSWORD + "\",\"confirmPassword\":\"" + NEW_PASSWORD + "\"}"))
				.andExpect(status().isOk());

		// Sử dụng lần 2 -> Bị từ chối TOKEN_ALREADY_USED
		mockMvc.perform(post(RESET_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"token\":\"" + token + "\",\"newPassword\":\"LanNua2026!\",\"confirmPassword\":\"LanNua2026!\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", equalTo("TOKEN_ALREADY_USED")));
	}

	@Test
	@DisplayName("HTT-01-CN-005-TC-06: Mật khẩu xác nhận không khớp báo PASSWORD_CONFIRMATION_MISMATCH")
	void resetPassword_mismatchPassword_badRequest() throws Exception {
		MvcResult forgotResult = mockMvc.perform(post(FORGOT_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"" + TEST_EMAIL + "\"}"))
				.andExpect(status().isOk())
				.andReturn();

		String token = objectMapper.readTree(forgotResult.getResponse().getContentAsString()).get("resetToken").asText();

		// Nhập không khớp
		mockMvc.perform(post(RESET_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"token\":\"" + token + "\",\"newPassword\":\"NewPass2026!\",\"confirmPassword\":\"KhongKhop2026!\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", equalTo("PASSWORD_CONFIRMATION_MISMATCH")));

		// Token vẫn còn hiệu lực để nhập lại đúng
		mockMvc.perform(get(VALIDATE_URL)
				.param("token", token))
				.andExpect(status().isOk());
	}
}
