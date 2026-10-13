package com.hsk.account;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.RoleRepository;
import com.hsk.account.repository.TeacherRequestRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class TeacherRequestH2Test {

	private static final String SUBMIT_URL = "/api/v1/teacher-requests";
	private static final String ME_URL = "/api/v1/teacher-requests/me";
	private static final String ADMIN_LIST_URL = "/api/v1/admin/teacher-requests";
	private static final String LOGIN_URL = "/api/v1/auth/login";

	private static final String STUDENT_EMAIL = "student.teacherreq@example.com";
	private static final String ADMIN_EMAIL = "admin.teacherreq@example.com";
	private static final String PASSWORD = "Password2026!";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private RegistrationService registrationService;

	private String studentToken;
	private String adminToken;

	@BeforeEach
	void setUp() throws Exception {
		teacherRequestRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();

		// Register student
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh Xin Dạy", STUDENT_EMAIL, PASSWORD, PASSWORD));

		// Create Admin account
		UserEntity adminUser = UserEntity.register(ADMIN_EMAIL, passwordEncoder.encode(PASSWORD), "Quản Trị Viên");
		userRepository.save(adminUser);
		RoleEntity adminRole = roleRepository.findByCode(RoleCode.ADMIN).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(adminUser, adminRole, null));

		// Login student to get JWT
		studentToken = loginAndGetToken(STUDENT_EMAIL, PASSWORD);
		// Login admin to get JWT
		adminToken = loginAndGetToken(ADMIN_EMAIL, PASSWORD);
	}

	@AfterEach
	void tearDown() {
		teacherRequestRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
				.andExpect(status().isOk())
				.andReturn();

		JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
		return json.get("token").asText();
	}

	@Test
	@DisplayName("HTT-01-CN-002-TC-01: Gửi yêu cầu nâng quyền giáo viên thành công (trạng thái PENDING)")
	void submitRequest_success() throws Exception {
		mockMvc.perform(post(SUBMIT_URL)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"teachingInfo\":\"Nơi dạy: Trung tâm Hoài Ngô, HSK 6, kinh nghiệm 3 năm\"}"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id", notNullValue()))
				.andExpect(jsonPath("$.userEmail", equalTo(STUDENT_EMAIL)))
				.andExpect(jsonPath("$.status", equalTo("PENDING")))
				.andExpect(jsonPath("$.teachingInfo", equalTo("Nơi dạy: Trung tâm Hoài Ngô, HSK 6, kinh nghiệm 3 năm")));

		// View my request
		mockMvc.perform(get(ME_URL)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", equalTo("PENDING")));
	}

	@Test
	@DisplayName("HTT-01-CN-002-TC-04: Từ chối khi đã có một yêu cầu PENDING đang chờ duyệt")
	void submitRequest_alreadyPending_conflict() throws Exception {
		// First submit
		mockMvc.perform(post(SUBMIT_URL)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"teachingInfo\":\"Lần gửi thứ nhất\"}"))
				.andExpect(status().isCreated());

		// Second submit
		mockMvc.perform(post(SUBMIT_URL)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"teachingInfo\":\"Lần gửi thứ hai\"}"))
				.andExpect(status().isConflict())
				.andExpect(jsonPath("$.code", equalTo("PENDING_REQUEST_ALREADY_EXISTS")));
	}

	@Test
	@DisplayName("HTT-01-CN-002-TC-05: Thiếu thông tin giảng dạy báo VALIDATION_FAILED")
	void submitRequest_blankInfo_badRequest() throws Exception {
		mockMvc.perform(post(SUBMIT_URL)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"teachingInfo\":\"   \"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", equalTo("VALIDATION_FAILED")));
	}

	@Test
	@DisplayName("HTT-01-CN-002-TC-06: Đã có quyền giáo viên thì không được gửi yêu cầu nâng quyền")
	void submitRequest_alreadyTeacher_badRequest() throws Exception {
		// Grant teacher role to student
		UserEntity student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(student, teacherRole, null));

		mockMvc.perform(post(SUBMIT_URL)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"teachingInfo\":\"Nơi dạy: Hoài Ngô\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", equalTo("ALREADY_TEACHER")));
	}

	@Test
	@DisplayName("HTT-01-CN-003-TC-01..03: Luồng quản trị viên duyệt và từ chối yêu cầu giáo viên (QTN-03)")
	void admin_reviewAndApprove_flow() throws Exception {
		// Student submits
		MvcResult submitResult = mockMvc.perform(post(SUBMIT_URL)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"teachingInfo\":\"Cử nhân tiếng Trung ĐHQG\"}"))
				.andExpect(status().isCreated())
				.andReturn();

		Long requestId = objectMapper.readTree(submitResult.getResponse().getContentAsString()).get("id").asLong();

		// Admin sees pending requests (TC-02)
		mockMvc.perform(get(ADMIN_LIST_URL)
				.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(greaterThan(0))))
				.andExpect(jsonPath("$[0].status", equalTo("PENDING")));

		// Student cannot access admin endpoint (HTT-01-CN-003-TC-04)
		mockMvc.perform(get(ADMIN_LIST_URL)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isForbidden());

		// Admin approves request (HTT-01-CN-003-TC-01)
		mockMvc.perform(post("/api/v1/admin/teacher-requests/" + requestId + "/approve")
				.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", equalTo("APPROVED")));

		// User now has TEACHER role and retains STUDENT role (QTN-03)
		UserEntity student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		boolean hasTeacher = userRoleRepository.existsByUser_IdAndRole_Code(student.getId(), RoleCode.TEACHER);
		boolean hasStudent = userRoleRepository.existsByUser_IdAndRole_Code(student.getId(), RoleCode.STUDENT);
		org.junit.jupiter.api.Assertions.assertTrue(hasTeacher, "User must have TEACHER role");
		org.junit.jupiter.api.Assertions.assertTrue(hasStudent, "User must maintain STUDENT role");

		// Cannot approve again (TC-05)
		mockMvc.perform(post("/api/v1/admin/teacher-requests/" + requestId + "/approve")
				.header("Authorization", "Bearer " + adminToken))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", equalTo("REQUEST_ALREADY_PROCESSED")));
	}
}
