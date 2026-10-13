package com.hsk.account;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.endsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserStatus;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;

/**
 * HTT-01-CN-001 against an in-memory database.
 *
 * <p>RegisterStudentApiTest covers the same criteria against the real MySQL schema but needs a
 * provisioned server; this class keeps the acceptance criteria verified on any machine, including
 * one where {@code database/setup-local.sql} has not been run yet. It also proves the JPA mapping
 * boots against a live database, which {@code ddl-auto=validate} alone does not check.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class RegisterStudentH2Test {

	private static final String URL = "/api/v1/auth/register";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	private static RegisterStudentRequest request(String email, String password, String confirm) {
		return new RegisterStudentRequest("Nguyễn Văn An", email, password, confirm);
	}

	@Test
	@DisplayName("HTT-01-CN-001-TC-01: đăng ký thành công, gán STUDENT, có thể đăng nhập bằng mật khẩu đã lưu")
	void createsUsableStudentAccount() {
		var account = this.registrationService
				.registerStudent(request("tc01@example.com", "Hoctot2026", "Hoctot2026"));

		assertThat(account.id()).isNotNull();
		assertThat(account.email()).isEqualTo("tc01@example.com");
		assertThat(account.fullName()).isEqualTo("Nguyễn Văn An");
		assertThat(account.status()).isEqualTo(UserStatus.ACTIVE);
		assertThat(account.roles()).containsExactly(RoleCode.STUDENT);

		UserEntity stored = this.userRepository.findById(account.id()).orElseThrow();
		// "có thể đăng nhập" (postcondition): the stored hash must verify the typed password.
		assertThat(this.passwordEncoder.matches("Hoctot2026", stored.getPasswordHash())).isTrue();
		assertThat(this.userRoleRepository.existsByUser_IdAndRole_Code(stored.getId(), RoleCode.STUDENT)).isTrue();
	}

	@Test
	@DisplayName("HTT-01-CN-001-TC-02: email trùng bị từ chối, không tạo tài khoản mới")
	void rejectsDuplicateEmail() {
		this.registrationService.registerStudent(request("tc02@example.com", "Hoctot2026", "Hoctot2026"));

		assertThatThrownBy(() -> this.registrationService.registerStudent(
				new RegisterStudentRequest("Đỗ Thị Hoa", "tc02@example.com", "Hoctot2026", "Hoctot2026")))
						.isInstanceOfSatisfying(ApiException.class,
								ex -> assertThat(ex.code()).isEqualTo(ApiErrorCode.EMAIL_ALREADY_IN_USE));

		assertThat(this.userRepository.findByEmail("tc02@example.com").orElseThrow().getFullName())
				.isEqualTo("Nguyễn Văn An");
	}

	@Test
	@DisplayName("HTT-01-CN-001-TC-05: mật khẩu xác nhận không khớp, không tạo tài khoản")
	void rejectsConfirmationMismatch() {
		assertThatThrownBy(() -> this.registrationService
				.registerStudent(request("tc05@example.com", "Hoctot2026", "Hoctot2025")))
						.isInstanceOfSatisfying(ApiException.class, ex -> {
							assertThat(ex.code()).isEqualTo(ApiErrorCode.PASSWORD_CONFIRMATION_MISMATCH);
							assertThat(ex.fieldErrors()).containsKey("confirmPassword");
						});

		assertThat(this.userRepository.findByEmail("tc05@example.com")).isEmpty();
	}

	@Test
	@DisplayName("HTT-01-CN-001: email lưu về dạng chữ thường để kiểm tra trùng nhất quán")
	void normalisesEmailCase() {
		var account = this.registrationService
				.registerStudent(request("  TC07@Example.COM ", "Hoctot2026", "Hoctot2026"));

		assertThat(account.email()).isEqualTo("tc07@example.com");
	}

	@Test
	@DisplayName("Toàn bộ 6 acceptance criteria qua HTTP, với dữ liệu kiểm thử trong workbook")
	void allCriteriaThroughHttp() throws Exception {
		// TC-01 happy path
		this.mockMvc.perform(post(URL).contentType("application/json").content("""
				{"fullName":"Nguyễn Văn An","email":"an.hs@example.com",
				 "password":"Hoctot2026","confirmPassword":"Hoctot2026"}"""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.email").value("an.hs@example.com"))
				.andExpect(jsonPath("$.fullName").value("Nguyễn Văn An"))
				.andExpect(jsonPath("$.roles", contains("STUDENT")))
				.andExpect(jsonPath("$.password").doesNotExist())
				.andExpect(jsonPath("$.passwordHash").doesNotExist())
				// The docs promise UTC ISO-8601; assert the suffix instead of trusting it.
				.andExpect(jsonPath("$.createdAt", endsWith("Z")));

		// TC-02 duplicate
		this.mockMvc.perform(post(URL).contentType("application/json").content("""
				{"fullName":"Người Khác","email":"an.hs@example.com",
				 "password":"Hoctot2026","confirmPassword":"Hoctot2026"}"""))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.code").value("EMAIL_ALREADY_IN_USE"))
				.andExpect(jsonPath("$.message").isNotEmpty());

		// TC-03 short password
		this.mockMvc.perform(post(URL).contentType("application/json").content("""
				{"fullName":"Ngắn Mật Khẩu","email":"short@example.com",
				 "password":"abc123","confirmPassword":"abc123"}"""))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
				.andExpect(jsonPath("$.fields.password").value("Mật khẩu phải có tối thiểu 8 ký tự (tối đa 72 ký tự)"));

		// TC-04 malformed emails from the workbook
		for (String bad : new String[] { "an.hs@", "an.hs.example.com" }) {
			this.mockMvc.perform(post(URL).contentType("application/json").content("""
					{"fullName":"Email Sai","email":"%s",
					 "password":"Hoctot2026","confirmPassword":"Hoctot2026"}""".formatted(bad)))
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.fields.email").value("Email không đúng định dạng"));
		}

		// TC-05 confirmation mismatch
		this.mockMvc.perform(post(URL).contentType("application/json").content("""
				{"fullName":"Xác Nhận Sai","email":"mismatch@example.com",
				 "password":"Hoctot2026","confirmPassword":"Hoctot2025"}"""))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("PASSWORD_CONFIRMATION_MISMATCH"))
				.andExpect(jsonPath("$.fields.confirmPassword").value("Mật khẩu xác nhận không khớp"));

		// TC-06 each required field left blank in turn
		this.mockMvc.perform(post(URL).contentType("application/json")
				.content("{\"email\":\"a@b.co\",\"password\":\"Hoctot2026\",\"confirmPassword\":\"Hoctot2026\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.fields.fullName").value("Họ tên không được để trống"));

		this.mockMvc.perform(post(URL).contentType("application/json")
				.content("{\"fullName\":\"Thiếu Email\",\"password\":\"Hoctot2026\",\"confirmPassword\":\"Hoctot2026\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.fields.email").value("Email không được để trống"));

		this.mockMvc.perform(post(URL).contentType("application/json")
				.content("{\"fullName\":\"Thiếu Mật Khẩu\",\"email\":\"x@y.co\",\"confirmPassword\":\"\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.fields.password").exists())
				.andExpect(jsonPath("$.fields.confirmPassword").value("Mật khẩu xác nhận không được để trống"));

		// QTN-17 boundary: exactly 8 characters is accepted, 7 is rejected.
		this.mockMvc.perform(post(URL).contentType("application/json").content("""
				{"fullName":"Biên 8 Ký Tự","email":"boundary8@example.com",
				 "password":"Hoctot26","confirmPassword":"Hoctot26"}"""))
				.andExpect(status().isCreated());

		this.mockMvc.perform(post(URL).contentType("application/json").content("""
				{"fullName":"Biên 7 Ký Tự","email":"boundary7@example.com",
				 "password":"Hoctot2","confirmPassword":"Hoctot2"}"""))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.fields.password").exists());

		// 400 on a body that is not JSON at all (contract for the frontend)
		this.mockMvc.perform(post(URL).contentType("application/json").content("not-json"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("MALFORMED_REQUEST_BODY"));
	}
}
