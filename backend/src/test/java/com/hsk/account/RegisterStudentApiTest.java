package com.hsk.account;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.contains;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

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
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;

/**
 * HTT-01-CN-001-CV-05: the six acceptance criteria of the student registration story,
 * exercised through the real HTTP layer against the test schema.
 *
 * <p>Test ids in the {@code @DisplayName} match the workbook sheet "Acceptance Criteria",
 * so a failing test points straight at the criterion it belongs to.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RegisterStudentApiTest {

	private static final String URL = "/api/v1/auth/register";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	private String body(String fullName, String email, String password, String confirmPassword) {
		return """
				{"fullName": %s, "email": %s, "password": %s, "confirmPassword": %s}"""
				.formatted(quote(fullName), quote(email), quote(password), quote(confirmPassword));
	}

	private static String quote(String value) {
		return value == null ? "null" : "\"" + value + "\"";
	}

	@Test
	@DisplayName("HTT-01-CN-001-TC-01: đăng ký thành công, tài khoản mang vai trò STUDENT")
	void registersStudentSuccessfully() throws Exception {
		// Test data taken verbatim from the acceptance criteria sheet.
		this.mockMvc.perform(post(URL).contentType("application/json")
				.content(body("Nguyễn Văn An", "an.hs@example.com", "Hoctot2026", "Hoctot2026")))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").isNumber())
				.andExpect(jsonPath("$.email").value("an.hs@example.com"))
				.andExpect(jsonPath("$.fullName").value("Nguyễn Văn An"))
				.andExpect(jsonPath("$.status").value("ACTIVE"))
				.andExpect(jsonPath("$.roles", contains("STUDENT")))
				.andExpect(jsonPath("$.createdAt").isNotEmpty());

		UserEntity saved = this.userRepository.findByEmail("an.hs@example.com").orElseThrow();
		assertThat(saved.getStatus()).isEqualTo(UserStatus.ACTIVE);
		assertThat(this.userRoleRepository.existsByUser_IdAndRole_Code(saved.getId(), RoleCode.STUDENT)).isTrue();
	}

	@Test
	@DisplayName("HTT-01-CN-001-TC-02: email đã dùng thì báo lỗi và không tạo tài khoản mới")
	void rejectsDuplicateEmail() throws Exception {
		registerOnce("Tran Thi Binh", "binh.hs@example.com");

		this.mockMvc.perform(post(URL).contentType("application/json")
				.content(body("Du Thi Ky", "binh.hs@example.com", "Hoctot2026", "Hoctot2026")))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.code").value("EMAIL_ALREADY_IN_USE"))
				.andExpect(jsonPath("$.message").value("Email đã được sử dụng cho một tài khoản khác"))
				.andExpect(jsonPath("$.path").value(URL));

		// Only the first account exists, and it kept the name it was created with.
		assertThat(this.userRepository.findAll().stream().filter(u -> u.getEmail().equals("binh.hs@example.com")).count())
				.isOne();
		Optional<UserEntity> existing = this.userRepository.findByEmail("binh.hs@example.com");
		assertThat(existing).get().extracting(UserEntity::getFullName).isEqualTo("Tran Thi Binh");
	}

	@Test
	@DisplayName("HTT-01-CN-001-TC-02 (phụ): email chỉ khác nhau ở chữ hoa thường cũng bị coi là trùng")
	void duplicateEmailDetectionIgnoresCase() throws Exception {
		registerOnce("Ly Van Nam", "nam.hs@example.com");

		this.mockMvc.perform(post(URL).contentType("application/json")
				.content(body("Ly Van Nam", "NAM.HS@EXAMPLE.COM", "Hoctot2026", "Hoctot2026")))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.code").value("EMAIL_ALREADY_IN_USE"));
	}

	@Test
	@DisplayName("HTT-01-CN-001-TC-03: mật khẩu dưới 8 ký tự bị từ chối (QTN-17)")
	void rejectsShortPassword() throws Exception {
		this.mockMvc.perform(post(URL).contentType("application/json")
				.content(body("Vu Van Minh", "minh.hs@example.com", "abc123", "abc123")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
				.andExpect(jsonPath("$.fields.password").value("Mật khẩu phải có tối thiểu 8 ký tự (tối đa 72 ký tự)"));

		assertThat(this.userRepository.existsByEmail("minh.hs@example.com")).isFalse();
	}

	@Test
	@DisplayName("HTT-01-CN-001-TC-04: email sai định dạng bị từ chối")
	void rejectsMalformedEmail() throws Exception {
		for (String badEmail : new String[] { "an.hs@", "an.hs.example.com", "an hs@example.com", "@" }) {
			this.mockMvc.perform(post(URL).contentType("application/json")
					.content(body("Nguyễn Văn An", badEmail, "Hoctot2026", "Hoctot2026")))
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
					.andExpect(jsonPath("$.fields.email").value("Email không đúng định dạng"));
		}
	}

	@Test
	@DisplayName("HTT-01-CN-001-TC-05: mật khẩu xác nhận không khớp thì báo lỗi gắn vào trường đó")
	void rejectsPasswordConfirmationMismatch() throws Exception {
		this.mockMvc.perform(post(URL).contentType("application/json")
				.content(body("Nguyen Van An", "an.tc05@example.com", "Hoctot2026", "Hoctot2025")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("PASSWORD_CONFIRMATION_MISMATCH"))
				.andExpect(jsonPath("$.message").value("Mật khẩu xác nhận không khớp"))
				// The frontend keeps the typed values, so it needs the field name to re-render them.
				.andExpect(jsonPath("$.fields.confirmPassword").value("Mật khẩu xác nhận không khớp"));

		assertThat(this.userRepository.findByEmail("an.tc05@example.com")).isEmpty();
	}

	@Test
	@DisplayName("HTT-01-CN-001-TC-06: bỏ trống họ tên, email hoặc mật khẩu thì báo rõ trường thiếu")
	void rejectsMissingRequiredFields() throws Exception {
		this.mockMvc.perform(post(URL).contentType("application/json")
				.content(body(null, "empty@example.com", "Hoctot2026", "Hoctot2026")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.fields.fullName").value("Họ tên không được để trống"));

		this.mockMvc.perform(post(URL).contentType("application/json")
				.content(body("Empty Email", null, "Hoctot2026", "Hoctot2026")))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.fields.email").value("Email không được để trống"));

		this.mockMvc.perform(post(URL).contentType("application/json")
				.content(body("Empty Password", "empty@example.com", null, null)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.fields.password").value("Mật khẩu không được để trống"))
				.andExpect(jsonPath("$.fields.confirmPassword").value("Mật khẩu xác nhận không được để trống"));

		// A body with no fields at all must not blow up either.
		this.mockMvc.perform(post(URL).contentType("application/json").content("{}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));

		assertThat(this.userRepository.findByEmail("empty@example.com")).isEmpty();
	}

	@Test
	@DisplayName("HTT-01-CN-001-CV-04: mật khẩu được băm bằng BCrypt, không lưu và không trả về dạng thuần")
	void storesOnlyABcryptHash() throws Exception {
		registerOnce("Hoang Van Thu", "thuy.hs@example.com");

		UserEntity saved = this.userRepository.findByEmail("thuy.hs@example.com").orElseThrow();
		assertThat(saved.getPasswordHash()).isNotEqualTo("Hoctot2026");
		assertThat(saved.getPasswordHash()).startsWith("$2");
		assertThat(this.passwordEncoder.matches("Hoctot2026", saved.getPasswordHash())).isTrue();
	}

	/** Sends a valid registration and asserts it was accepted. */
	private void registerOnce(String fullName, String email) throws Exception {
		this.mockMvc.perform(post(URL).contentType("application/json")
				.content(body(fullName, email, "Hoctot2026", "Hoctot2026")))
				.andExpect(status().isCreated());
	}
}
