package com.hsk.account;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.common.audit.AuditLogRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ProfileH2Test {

	private static final String PROFILE_URL = "/api/v1/profile/me";
	private static final String AVATAR_URL = "/api/v1/profile/avatar";
	private static final String CHANGE_PASSWORD_URL = "/api/v1/profile/change-password";
	private static final String LOGIN_URL = "/api/v1/auth/login";

	private static final String TEST_EMAIL = "profile.user.test@example.com";
	private static final String OLD_PASSWORD = "CurrentPassword2026!";
	private static final String NEW_PASSWORD = "BrandNewPassword2026!";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private AuditLogRepository auditLogRepository;

	@Autowired
	private RegistrationService registrationService;

	private String token;

	@BeforeEach
	void setUp() throws Exception {
		auditLogRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();

		registrationService.registerStudent(
				new RegisterStudentRequest("Nguyễn Văn Hồ Sơ", TEST_EMAIL, OLD_PASSWORD, OLD_PASSWORD));

		MvcResult loginResult = mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"" + TEST_EMAIL + "\",\"password\":\"" + OLD_PASSWORD + "\"}"))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode json = objectMapper.readTree(loginResult.getResponse().getContentAsString());
		token = json.get("token").asText();
	}

	@AfterEach
	void tearDown() {
		auditLogRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	@Test
	@DisplayName("HTT-01-CN-006-TC-01: Cập nhật họ tên mới và ảnh đại diện thành công")
	void updateProfile_success() throws Exception {
		mockMvc.perform(put(PROFILE_URL)
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"fullName\":\"Nguyễn Văn An Mới\",\"avatarUrl\":\"https://cdn.example.com/an.jpg\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.fullName", equalTo("Nguyễn Văn An Mới")))
				.andExpect(jsonPath("$.avatarUrl", equalTo("https://cdn.example.com/an.jpg")));

		// Lấy lại hồ sơ xác thực
		mockMvc.perform(get(PROFILE_URL)
				.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.fullName", equalTo("Nguyễn Văn An Mới")));
	}

	@Test
	@DisplayName("HTT-01-CN-006-TC-02: Đổi mật khẩu thành công với mật khẩu hiện tại chính xác")
	void changePassword_success_canLoginWithNewPassword() throws Exception {
		mockMvc.perform(put(CHANGE_PASSWORD_URL)
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"currentPassword\":\"" + OLD_PASSWORD + "\",\"newPassword\":\"" + NEW_PASSWORD + "\",\"confirmPassword\":\"" + NEW_PASSWORD + "\"}"))
				.andExpect(status().isOk());

		// Đăng nhập bằng mật khẩu cũ phải THẤT BẠI
		mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"" + TEST_EMAIL + "\",\"password\":\"" + OLD_PASSWORD + "\"}"))
				.andExpect(status().isUnauthorized());

		// Đăng nhập bằng mật khẩu mới phải THÀNH CÔNG
		mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"" + TEST_EMAIL + "\",\"password\":\"" + NEW_PASSWORD + "\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token", notNullValue()));
	}

	@Test
	@DisplayName("HTT-01-CN-006-TC-03: Nhập sai mật khẩu hiện tại bị từ chối và giữ nguyên mật khẩu cũ")
	void changePassword_wrongCurrentPassword_rejected() throws Exception {
		mockMvc.perform(put(CHANGE_PASSWORD_URL)
				.header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"currentPassword\":\"SaiMatKhau2026!\",\"newPassword\":\"" + NEW_PASSWORD + "\",\"confirmPassword\":\"" + NEW_PASSWORD + "\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", equalTo("INVALID_CURRENT_PASSWORD")));

		// Vẫn đăng nhập được bằng mật khẩu cũ
		mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"" + TEST_EMAIL + "\",\"password\":\"" + OLD_PASSWORD + "\"}"))
				.andExpect(status().isOk());
	}

	@Test
	@DisplayName("HTT-01-CN-006-TC-04: Tải tệp không phải ảnh bị từ chối INVALID_FILE_FORMAT")
	void uploadAvatar_invalidFormat_rejected() throws Exception {
		MockMultipartFile pdfFile = new MockMultipartFile(
				"file",
				"document.pdf",
				"application/pdf",
				"PDF content sample".getBytes());

		mockMvc.perform(multipart(AVATAR_URL)
				.file(pdfFile)
				.header("Authorization", "Bearer " + token))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", equalTo("INVALID_FILE_FORMAT")));
	}

	@Test
	@DisplayName("HTT-01-CN-006-TC-04: Tải tệp ảnh vượt quá 2 MB bị từ chối FILE_TOO_LARGE")
	void uploadAvatar_fileTooLarge_rejected() throws Exception {
		byte[] largeBytes = new byte[3 * 1024 * 1024]; // 3 MB > 2 MB
		MockMultipartFile largeFile = new MockMultipartFile(
				"file",
				"huge_avatar.png",
				"image/png",
				largeBytes);

		mockMvc.perform(multipart(AVATAR_URL)
				.file(largeFile)
				.header("Authorization", "Bearer " + token))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", equalTo("FILE_TOO_LARGE")));
	}

	@Test
	@DisplayName("HTT-01-CN-006-TC-01: Tải tệp ảnh hợp lệ (.png < 2 MB) thành công")
	void uploadAvatar_validImage_success() throws Exception {
		MockMultipartFile validImage = new MockMultipartFile(
				"file",
				"my_photo.png",
				"image/png",
				new byte[]{1, 2, 3, 4, 5});

		mockMvc.perform(multipart(AVATAR_URL)
				.file(validImage)
				.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.avatarUrl", notNullValue()));
	}
}
