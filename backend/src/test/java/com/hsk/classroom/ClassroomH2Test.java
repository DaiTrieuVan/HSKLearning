package com.hsk.classroom;

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
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.PasswordResetTokenRepository;
import com.hsk.account.repository.RoleRepository;
import com.hsk.account.repository.TeacherRequestRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberEventEntity;
import com.hsk.classroom.domain.ClassMemberEventType;
import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.domain.ClassStatus;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.audit.AuditLogRepository;

/**
 * Kiểm thử toàn diện Epic HTT-02: Quản lý lớp học (HTT-02-CN-001 đến HTT-02-CN-009).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ClassroomH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String TEACHER_EMAIL = "teacher_class@test.com";
	private static final String STUDENT_EMAIL = "student_class@test.com";
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
	private ClassRepository classRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

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

	private String teacherToken;
	private String studentToken;
	private UserEntity teacherUser;
	private UserEntity studentUser;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Teacher registration & role
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo Viên Thử Nghiệm", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacherUser = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacherUser, teacherRole, null));

		// Student registration
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh Thử Nghiệm", STUDENT_EMAIL, PASSWORD, PASSWORD));
		studentUser = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();

		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		studentToken = loginAndGetToken(STUDENT_EMAIL, PASSWORD);
	}

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
	@DisplayName("HTT-02-CN-001: Giáo viên tạo lớp học mới, sinh join_code 6 ký tự duy nhất (QTN-04)")
	void teacherCreatesClassSuccessfully() throws Exception {
		MvcResult result = mockMvc.perform(post("/api/v1/classes")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"title\":\"Lớp HSK 1 Cấp Tốc\",\"description\":\"Khóa học luyện thi HSK 1 trong 4 tuần\"}")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.title").value("Lớp HSK 1 Cấp Tốc"))
				.andExpect(jsonPath("$.status").value("ACTIVE"))
				.andExpect(jsonPath("$.memberCount").value(0))
				.andReturn();

		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		String joinCode = root.get("joinCode").asText();
		assertThat(joinCode).hasSize(6);
		assertThat(joinCode).matches("^[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6}$");
	}

	@Test
	@DisplayName("HTT-02-CN-001: Học sinh không có quyền tạo lớp học (403 FORBIDDEN)")
	void studentCannotCreateClass() throws Exception {
		mockMvc.perform(post("/api/v1/classes")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"title\":\"Lớp Tự Lập\",\"description\":\"Thử tạo lớp\"}")
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("HTT-02-CN-002: Giáo viên cập nhật và lưu trữ lớp học sang ARCHIVED (QTN-01)")
	void teacherUpdatesAndArchivesClass() throws Exception {
		ClassEntity classroom = classRepository.save(
				ClassEntity.create(teacherUser, "Lớp Ban Đầu", "Mô tả ban đầu", "ABC234"));

		// Cập nhật thông tin
		mockMvc.perform(put("/api/v1/classes/" + classroom.getId())
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"title\":\"Lớp Đã Đổi Tên\",\"description\":\"Mô tả mới\"}")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.title").value("Lớp Đã Đổi Tên"));

		// Lưu trữ sang ARCHIVED
		mockMvc.perform(post("/api/v1/classes/" + classroom.getId() + "/archive")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("ARCHIVED"));

		// Thử cập nhật lớp đã lưu trữ -> bị từ chối
		mockMvc.perform(put("/api/v1/classes/" + classroom.getId())
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"title\":\"Cố Đổi Tên Lần Nữa\",\"description\":\"Không được phép\"}")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("CLASS_ALREADY_ARCHIVED"));
	}

	@Test
	@DisplayName("HTT-02-CN-003: Học sinh tham gia lớp học bằng mã, chống dò mã sau 10 lần sai (QTN-05 & QTN-06)")
	void studentJoinsClassAndRateLimitEnforced() throws Exception {
		ClassEntity classroom = classRepository.save(
				ClassEntity.create(teacherUser, "Lớp Tham Gia", "Học cùng nhau", "XYZ890"));

		// Tham gia thành công
		mockMvc.perform(post("/api/v1/classes/join")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"code\":\"XYZ890\"}")
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.title").value("Lớp Tham Gia"))
				.andExpect(jsonPath("$.memberCount").value(1));

		// Thử tham gia lại -> ALREADY_CLASS_MEMBER
		mockMvc.perform(post("/api/v1/classes/join")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"code\":\"XYZ890\"}")
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("ALREADY_CLASS_MEMBER"));

		// Kiểm tra ghi nhận sự kiện thành viên
		List<ClassMemberEventEntity> events = classMemberEventRepository.findAll();
		assertThat(events).isNotEmpty();
		assertThat(events.get(0).getEventType()).isEqualTo(ClassMemberEventType.JOINED);

		// Thử nhập sai mã 10 lần liên tiếp để kiểm tra QTN-05
		for (int i = 0; i < 10; i++) {
			mockMvc.perform(post("/api/v1/classes/join")
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"code\":\"WRONG" + i + "\"}")
					.header("Authorization", "Bearer " + studentToken))
					.andExpect(status().isBadRequest())
					.andExpect(jsonPath("$.code").value("INVALID_JOIN_CODE"));
		}

		// Lần thứ 11 -> bị chặn với mã CLASS_JOIN_RATE_LIMITED (429)
		mockMvc.perform(post("/api/v1/classes/join")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"code\":\"XYZ890\"}")
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isTooManyRequests())
				.andExpect(jsonPath("$.code").value("CLASS_JOIN_RATE_LIMITED"));
	}

	@Test
	@DisplayName("HTT-02-CN-004 & CN-005: Xem danh sách lớp phụ trách (Giáo viên) và đã tham gia (Học sinh)")
	void listTeachingAndEnrolledClasses() throws Exception {
		ClassEntity c1 = classRepository.save(ClassEntity.create(teacherUser, "Lớp Sáng", "Mô tả", "COD001"));
		classRepository.save(ClassEntity.create(teacherUser, "Lớp Chiều", "Mô tả", "COD002"));

		classMemberRepository.save(ClassMemberEntity.create(c1, studentUser));

		// Giáo viên xem danh sách
		mockMvc.perform(get("/api/v1/classes/teaching")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(2));

		// Học sinh xem danh sách lớp đã tham gia
		mockMvc.perform(get("/api/v1/classes/enrolled")
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].title").value("Lớp Sáng"));
	}

	@Test
	@DisplayName("HTT-02-CN-006 đến CN-009: Quản lý thành viên, xóa học sinh, khôi phục và học sinh tự rời lớp")
	void manageMembersRemoveRestoreAndLeave() throws Exception {
		ClassEntity classroom = classRepository.save(
				ClassEntity.create(teacherUser, "Lớp Quản Lý", "Mô tả", "MNG123"));
		ClassMemberEntity member = classMemberRepository.save(ClassMemberEntity.create(classroom, studentUser));

		// Giáo viên xem thành viên
		mockMvc.perform(get("/api/v1/classes/" + classroom.getId() + "/members")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].studentEmail").value(STUDENT_EMAIL));

		// Giáo viên xóa học sinh
		mockMvc.perform(post("/api/v1/classes/" + classroom.getId() + "/members/" + studentUser.getId() + "/remove")
				.param("reason", "Vắng mặt không phép")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk());

		ClassMemberEntity reloaded = classMemberRepository.findById(member.getId()).orElseThrow();
		assertThat(reloaded.getStatus()).isEqualTo(ClassMemberStatus.REMOVED);

		// Giáo viên khôi phục học sinh
		mockMvc.perform(post("/api/v1/classes/" + classroom.getId() + "/members/" + studentUser.getId() + "/restore")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk());

		reloaded = classMemberRepository.findById(member.getId()).orElseThrow();
		assertThat(reloaded.getStatus()).isEqualTo(ClassMemberStatus.ACTIVE);

		// Học sinh tự rời lớp
		mockMvc.perform(post("/api/v1/classes/" + classroom.getId() + "/leave")
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk());

		reloaded = classMemberRepository.findById(member.getId()).orElseThrow();
		assertThat(reloaded.getStatus()).isEqualTo(ClassMemberStatus.LEFT);
	}
}
