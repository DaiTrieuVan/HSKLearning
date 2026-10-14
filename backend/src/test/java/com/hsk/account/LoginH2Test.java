package com.hsk.account;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserStatus;
import com.hsk.account.dto.AccountResponse;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class LoginH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String LOGOUT_URL = "/api/v1/auth/logout";
	private static final String TEST_EMAIL = "login.test.runner@example.com";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private RegistrationService registrationService;

	private AccountResponse testStudent;

	@BeforeEach
	void setUp() {
		userRoleRepository.deleteAll();
		userRepository.deleteAll();

		testStudent = registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh Test Login", TEST_EMAIL, "Password2026!", "Password2026!"));
	}

	@AfterEach
	void tearDown() {
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	@Test
	@DisplayName("TC-01: Học sinh đăng nhập thành công trả về 200, JWT token và thông tin tài khoản")
	void loginSuccess() throws Exception {
		String body = String.format("""
				{
				  "email": "%s",
				  "password": "Password2026!"
				}
				""", TEST_EMAIL);

		mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content(body))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token", notNullValue()))
				.andExpect(jsonPath("$.email").value(TEST_EMAIL))
				.andExpect(jsonPath("$.fullName").value("Học Sinh Test Login"))
				.andExpect(jsonPath("$.roles", contains("STUDENT")))
				.andExpect(jsonPath("$.activeMode").value("STUDENT"));
	}

	@Test
	@DisplayName("TC-05 & TC-06: Mật khẩu sai hoặc email không tồn tại trả về 401 INVALID_CREDENTIALS")
	void loginInvalidCredentials() throws Exception {
		// Wrong password
		mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content(String.format("""
						{
						  "email": "%s",
						  "password": "WrongPassword!"
						}
						""", TEST_EMAIL)))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));

		// Non-existent email
		mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{
						  "email": "notfound@example.com",
						  "password": "Password2026!"
						}
						"""))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
	}

	@Test
	@DisplayName("TC-08: Tài khoản bị khóa (LOCKED) trả về 403 ACCOUNT_LOCKED")
	void loginLockedAccount() throws Exception {
		UserEntity entity = userRepository.findById(testStudent.id()).orElseThrow();
		entity.setStatus(UserStatus.LOCKED);
		userRepository.saveAndFlush(entity);

		mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content(String.format("""
						{
						  "email": "%s",
						  "password": "Password2026!"
						}
						""", TEST_EMAIL)))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code").value("ACCOUNT_LOCKED"));
	}

	@Test
	@DisplayName("TC-09 & QTN-17: Nhập sai 5 lần liên tiếp khóa tạm 15 phút, trả về 403 ACCOUNT_TEMPORARILY_LOCKED")
	void loginThrottleAfter5Failures() throws Exception {
		String wrongBody = String.format("""
				{
				  "email": "%s",
				  "password": "WrongPassword!"
				}
				""", TEST_EMAIL);

		// Fail 5 times
		for (int i = 0; i < 4; i++) {
			mockMvc.perform(post(LOGIN_URL)
					.contentType(MediaType.APPLICATION_JSON)
					.content(wrongBody))
					.andExpect(status().isUnauthorized());
		}

		// 5th failure -> triggers lock and returns 403
		mockMvc.perform(post(LOGIN_URL)
					.contentType(MediaType.APPLICATION_JSON)
					.content(wrongBody))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code").value("ACCOUNT_TEMPORARILY_LOCKED"));

		// Even with correct password, still locked
		mockMvc.perform(post(LOGIN_URL)
					.contentType(MediaType.APPLICATION_JSON)
					.content(String.format("""
							{
							  "email": "%s",
							  "password": "Password2026!"
							}
							""", TEST_EMAIL)))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code").value("ACCOUNT_TEMPORARILY_LOCKED"));
	}

	@Test
	@DisplayName("TC-11: Đăng xuất trả về 200 OK")
	void logoutSuccess() throws Exception {
		mockMvc.perform(post(LOGOUT_URL))
				.andExpect(status().isOk());
	}
}
