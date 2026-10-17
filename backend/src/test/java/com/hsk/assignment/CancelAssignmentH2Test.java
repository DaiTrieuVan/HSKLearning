package com.hsk.assignment;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import com.hsk.assignment.domain.AssignmentEntity;
import com.hsk.assignment.domain.AssignmentStatus;
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.assignment.service.AssignmentService;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.dto.CreateClassCommand;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.classroom.service.ClassroomService;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.audit.AuditLogEntity;
import com.hsk.common.audit.AuditLogRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.dto.CreateExerciseQuestionItem;
import com.hsk.exercise.dto.CreateExerciseRequest;
import com.hsk.exercise.dto.ExerciseResponse;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.exercise.service.ExerciseService;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.QuestionResponse;
import com.hsk.question.repository.QuestionOptionRepository;
import com.hsk.question.repository.QuestionRepository;
import com.hsk.question.service.QuestionService;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
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

/**
 * Test suite tích hợp cho HTT-06-CN-009: Hủy lần giao bài.
 * Kiểm tra đầy đủ các Acceptance Criteria: TC-01 đến TC-06, QTN-01, QTN-21.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class CancelAssignmentH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String CANCEL_URL = "/api/assignments/{id}/cancel";
	private static final String DELETE_URL = "/api/assignments/{id}";
	private static final String STUDENT_ASSIGNMENTS_URL = "/api/assignments/classes/{classId}/student";
	private static final String STUDENT_ASSIGNMENT_DETAIL_URL = "/api/assignments/{id}/student";

	private static final String TEACHER_EMAIL = "teacher_cancel@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_cancel@test.com";
	private static final String STUDENT_EMAIL = "student_cancel@test.com";
	private static final String PASSWORD = "Password123@";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private ClassroomService classroomService;

	@Autowired
	private ClassRepository classRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private QuestionService questionService;

	@Autowired
	private ExerciseService exerciseService;

	@Autowired
	private ExerciseRepository exerciseRepository;

	@Autowired
	private ExerciseQuestionRepository exerciseQuestionRepository;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private QuestionOptionRepository questionOptionRepository;

	@Autowired
	private AssignmentRepository assignmentRepository;

	@Autowired
	private AssignmentSubmissionRepository submissionRepository;

	@Autowired
	private AssignmentService assignmentService;

	@Autowired
	private AuditLogRepository auditLogRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private HskLevelRepository hskLevelRepository;

	private UserEntity teacher;
	private UserEntity otherTeacher;
	private UserEntity student;
	private ClassEntity classroom;
	private ExerciseResponse exercise;
	private String teacherToken;
	private String otherTeacherToken;
	private String studentToken;

	@BeforeEach
	void setUp() throws Exception {
		cleanDatabase();

		// Tạo Teacher chính
		registrationService.registerStudent(new RegisterStudentRequest("Giáo viên Hủy Bài", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// Tạo Teacher khác
		registrationService.registerStudent(new RegisterStudentRequest("Giáo viên Khác", OTHER_TEACHER_EMAIL, PASSWORD, PASSWORD));
		otherTeacher = userRepository.findByEmailIgnoreCase(OTHER_TEACHER_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(otherTeacher, teacherRole, null));

		// Tạo Student
		registrationService.registerStudent(new RegisterStudentRequest("Học sinh Kiểm tra", STUDENT_EMAIL, PASSWORD, PASSWORD));
		student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();

		// Đăng nhập lấy JWT tokens
		teacherToken = login(TEACHER_EMAIL, PASSWORD);
		otherTeacherToken = login(OTHER_TEACHER_EMAIL, PASSWORD);
		studentToken = login(STUDENT_EMAIL, PASSWORD);

		// Tạo lớp học do teacher quản lý
		classroomService.createClass(TEACHER_EMAIL, new CreateClassCommand("Lớp Hủy Bài Test", "Mô tả lớp hủy bài test"));
		classroom = classRepository.findByTeacher_IdOrderByCreatedAtDesc(teacher.getId()).get(0);

		// Thêm student vào lớp
		classMemberRepository.save(ClassMemberEntity.create(classroom, student));

		// Tạo 1 câu hỏi và 1 bài tập hoàn chỉnh (READY)
		QuestionResponse qResp = questionService.createMultipleChoiceQuestion(teacher.getId(), new CreateQuestionRequest(
				"Chọn từ thích hợp điền vào chỗ trống",
				"Giải thích chi tiết",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("A. 你好", true),
						new CreateQuestionOptionRequest("B. 谢谢", false)
				)
		));

		exercise = exerciseService.createExercise(teacher.getId(), new CreateExerciseRequest(
				"Bài tập kiểm tra HSK",
				"Mô tả bài tập kiểm tra",
				ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(qResp.id(), new BigDecimal("10.0"), 1))
		));
	}

	@AfterEach
	void tearDown() {
		cleanDatabase();
	}

	private void cleanDatabase() {
		questionService.clearUsedInExerciseQuestionIds();
		submissionRepository.deleteAll();
		assignmentRepository.deleteAll();
		exerciseQuestionRepository.deleteAll();
		exerciseRepository.deleteAll();
		questionOptionRepository.deleteAll();
		questionRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		vocabularyRepository.deleteAll();
		hskLevelRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classMemberRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		auditLogRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String login(String email, String password) throws Exception {
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.get("token").asText();
	}

	private AssignmentResponse createAssignment(Instant startTime, Instant dueTime) {
		return assignmentService.assignExercise(teacher.getId(), new AssignExerciseRequest(
				exercise.id(),
				classroom.getId(),
				startTime,
				dueTime
		));
	}

	@Test
	@DisplayName("TC-01: Giáo viên hủy thành công lần giao bài chưa có lượt làm - Trạng thái chuyển CANCELLED và ghi Audit Log")
	void test_TC01_cancelAssignmentSuccess() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant dueTime = Instant.now().plus(2, ChronoUnit.DAYS);
		AssignmentResponse assigned = createAssignment(startTime, dueTime);

		mockMvc.perform(post(CANCEL_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id", is(assigned.id().intValue())))
				.andExpect(jsonPath("$.status", is("CANCELLED")));

		// Kiểm tra trong DB
		AssignmentEntity updated = assignmentRepository.findById(assigned.id()).orElseThrow();
		assertEquals(AssignmentStatus.CANCELLED, updated.getStatus());

		// Kiểm tra Audit Log
		List<AuditLogEntity> logs = auditLogRepository.findAll();
		boolean foundCancelLog = logs.stream()
				.anyMatch(log -> "CANCEL_ASSIGNMENT".equals(log.getAction())
						&& "ASSIGNMENT".equals(log.getEntityType())
						&& String.valueOf(assigned.id()).equals(log.getEntityId())
						&& log.getActor() != null && teacher.getId().equals(log.getActor().getId()));
		assertTrue(foundCancelLog, "Bắt buộc phải ghi nhận Audit Log CANCEL_ASSIGNMENT");
	}

	@Test
	@DisplayName("TC-02: QTN-01 - Giáo viên không phụ trách lớp không được phép hủy bài (HTTP 403 Forbidden)")
	void test_TC02_otherTeacherCannotCancel() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant dueTime = Instant.now().plus(2, ChronoUnit.DAYS);
		AssignmentResponse assigned = createAssignment(startTime, dueTime);

		mockMvc.perform(post(CANCEL_URL, assigned.id())
						.header("Authorization", "Bearer " + otherTeacherToken)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("FORBIDDEN")));

		// Kiểm tra trạng thái DB không đổi
		AssignmentEntity notChanged = assignmentRepository.findById(assigned.id()).orElseThrow();
		assertEquals(AssignmentStatus.ACTIVE, notChanged.getStatus());
	}

	@Test
	@DisplayName("TC-03: QTN-21 - Không thể hủy lần giao bài khi đã có học sinh làm bài hoặc nộp bài (HTTP 400)")
	void test_TC03_cannotCancelWhenSubmissionsExist() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant dueTime = Instant.now().plus(2, ChronoUnit.DAYS);
		AssignmentResponse assigned = createAssignment(startTime, dueTime);
		AssignmentEntity assignmentEntity = assignmentRepository.findById(assigned.id()).orElseThrow();

		// Giả lập học sinh đã bắt đầu làm bài (tồn tại 1 record trong assignment_submissions)
		AssignmentSubmissionEntity submission = AssignmentSubmissionEntity.createInitial(assignmentEntity, student);
		submissionRepository.save(submission);

		// Giáo viên gọi hủy -> phải bị từ chối với lỗi ASSIGNMENT_CANNOT_CANCEL_HAS_SUBMISSIONS
		mockMvc.perform(post(CANCEL_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("ASSIGNMENT_CANNOT_CANCEL_HAS_SUBMISSIONS")))
				.andExpect(jsonPath("$.message", is(ApiErrorCode.ASSIGNMENT_CANNOT_CANCEL_HAS_SUBMISSIONS.message())));

		// Trạng thái assignment vẫn giữ nguyên
		AssignmentEntity notChanged = assignmentRepository.findById(assigned.id()).orElseThrow();
		assertEquals(AssignmentStatus.ACTIVE, notChanged.getStatus());
	}

	@Test
	@DisplayName("TC-04: Sau khi hủy, học sinh không còn thấy bài tập trong danh sách và chi tiết (Ẩn khỏi học sinh)")
	void test_TC04_studentCannotSeeCancelledAssignment() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant dueTime = Instant.now().plus(2, ChronoUnit.DAYS);
		AssignmentResponse assigned = createAssignment(startTime, dueTime);

		// Trước khi hủy, học sinh thấy bài tập trong danh sách lớp
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, classroom.getId())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)));

		// Giáo viên hủy bài
		mockMvc.perform(post(CANCEL_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk());

		// 1. Sau khi hủy: Học sinh lấy danh sách bài tập của lớp -> trống rỗng (không thấy bài đã hủy)
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, classroom.getId())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));

		// 2. Học sinh cố tình truy cập link chi tiết của bài đã hủy -> HTTP 404 ASSIGNMENT_NOT_FOUND
		mockMvc.perform(get(STUDENT_ASSIGNMENT_DETAIL_URL, assigned.id())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.code", is("ASSIGNMENT_NOT_FOUND")));
	}

	@Test
	@DisplayName("TC-05: Lần giao bài không tồn tại -> Trả về HTTP 404 NOT FOUND")
	void test_TC05_cancelNonExistentAssignment() throws Exception {
		mockMvc.perform(post(CANCEL_URL, 999999L)
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.code", is("ASSIGNMENT_NOT_FOUND")));
	}

	@Test
	@DisplayName("TC-06: Hủy lần thứ 2 một bài tập đã CANCELLED -> Trả về HTTP 400 ASSIGNMENT_ALREADY_CANCELLED")
	void test_TC06_cancelAlreadyCancelledAssignment() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant dueTime = Instant.now().plus(2, ChronoUnit.DAYS);
		AssignmentResponse assigned = createAssignment(startTime, dueTime);

		// Hủy lần 1 thành công
		mockMvc.perform(post(CANCEL_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("CANCELLED")));

		// Hủy lần 2 -> báo lỗi bài đã hủy
		mockMvc.perform(post(CANCEL_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("ASSIGNMENT_ALREADY_CANCELLED")))
				.andExpect(jsonPath("$.message", is(ApiErrorCode.ASSIGNMENT_ALREADY_CANCELLED.message())));
	}

	@Test
	@DisplayName("Test DELETE alias: DELETE /api/assignments/{id} hủy thành công tương đương POST cancel")
	void test_deleteAlias_success() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant dueTime = Instant.now().plus(2, ChronoUnit.DAYS);
		AssignmentResponse assigned = createAssignment(startTime, dueTime);

		mockMvc.perform(delete(DELETE_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("CANCELLED")));

		AssignmentEntity updated = assignmentRepository.findById(assigned.id()).orElseThrow();
		assertEquals(AssignmentStatus.CANCELLED, updated.getStatus());
	}
}
