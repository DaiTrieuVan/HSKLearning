package com.hsk.assignment;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.dto.ExtendAssignmentDueDateRequest;
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
 * Test suite tích hợp cho HTT-06-CN-010: Kéo dài hạn nộp lần giao bài.
 * Kiểm tra đầy đủ 100% Acceptance Criteria: TC-01 đến TC-06, QTN-01, QTN-11, QTN-21.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ExtendAssignmentDueDateH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String EXTEND_DUE_DATE_URL = "/api/assignments/{id}/extend-due-date";
	private static final String STUDENT_ASSIGNMENTS_URL = "/api/assignments/classes/{classId}/student";
	private static final String STUDENT_ASSIGNMENT_DETAIL_URL = "/api/assignments/{id}/student";

	private static final String TEACHER_EMAIL = "teacher_extend@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_extend@test.com";
	private static final String STUDENT_EMAIL = "student_extend@test.com";
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
		registrationService.registerStudent(new RegisterStudentRequest("Giáo viên Gia Hạn", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// Tạo Teacher khác
		registrationService.registerStudent(new RegisterStudentRequest("Giáo viên Khác", OTHER_TEACHER_EMAIL, PASSWORD, PASSWORD));
		otherTeacher = userRepository.findByEmailIgnoreCase(OTHER_TEACHER_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(otherTeacher, teacherRole, null));

		// Tạo Student
		registrationService.registerStudent(new RegisterStudentRequest("Học sinh Gia Hạn", STUDENT_EMAIL, PASSWORD, PASSWORD));
		student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();

		// Đăng nhập lấy JWT tokens
		teacherToken = login(TEACHER_EMAIL, PASSWORD);
		otherTeacherToken = login(OTHER_TEACHER_EMAIL, PASSWORD);
		studentToken = login(STUDENT_EMAIL, PASSWORD);

		// Tạo lớp học do teacher quản lý
		classroomService.createClass(TEACHER_EMAIL, new CreateClassCommand("Lớp Gia Hạn Test", "Mô tả lớp gia hạn test"));
		classroom = classRepository.findByTeacher_IdOrderByCreatedAtDesc(teacher.getId()).get(0);

		// Thêm student vào lớp
		classMemberRepository.save(ClassMemberEntity.create(classroom, student));

		// Tạo 1 câu hỏi và 1 bài tập hoàn chỉnh (READY)
		QuestionResponse qResp = questionService.createMultipleChoiceQuestion(teacher.getId(), new CreateQuestionRequest(
				"Chọn đáp án đúng",
				"Giải thích đáp án",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("A. 苹果", true),
						new CreateQuestionOptionRequest("B. 香蕉", false)
				)
		));

		exercise = exerciseService.createExercise(teacher.getId(), new CreateExerciseRequest(
				"Bài tập kiểm tra gia hạn",
				"Mô tả bài tập",
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
	@DisplayName("TC-01: Giáo viên kéo dài hạn nộp thành công khi đặt hạn mới sau hạn cũ (Luồng thành công)")
	void test_TC01_extendDueDateSuccess() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant oldDueTime = Instant.now().plus(1, ChronoUnit.DAYS);
		Instant newDueTime = Instant.now().plus(3, ChronoUnit.DAYS);
		AssignmentResponse assigned = createAssignment(startTime, oldDueTime);

		String requestBody = objectMapper.writeValueAsString(new ExtendAssignmentDueDateRequest(newDueTime));

		mockMvc.perform(patch(EXTEND_DUE_DATE_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id", is(assigned.id().intValue())))
				.andExpect(jsonPath("$.status", is("ACTIVE")));

		// Kiểm tra DB
		AssignmentEntity updated = assignmentRepository.findById(assigned.id()).orElseThrow();
		assertEquals(newDueTime.truncatedTo(ChronoUnit.MILLIS), updated.getDueTime().truncatedTo(ChronoUnit.MILLIS));

		// Học sinh kiểm tra thấy hạn nộp mới
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, classroom.getId())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].studentStatus", is("NOT_STARTED")))
				.andExpect(jsonPath("$[0].canStart", is(true)));
	}

	@Test
	@DisplayName("TC-01b: Bài tập đã hết hạn (CLOSED), giáo viên kéo dài hạn nộp -> Tự động mở lại ACTIVE")
	void test_TC01b_extendDueDateReopensClosedAssignment() throws Exception {
		Instant startTime = Instant.now().minus(2, ChronoUnit.DAYS);
		Instant oldDueTime = Instant.now().minus(1, ChronoUnit.HOURS); // Đã hết hạn -> CLOSED
		AssignmentResponse assigned = createAssignment(startTime, Instant.now().plus(1, ChronoUnit.MINUTES));
		// Set dueTime về quá khứ để chuyển sang CLOSED
		AssignmentEntity entity = assignmentRepository.findById(assigned.id()).orElseThrow();
		entity.setDueTime(oldDueTime);
		entity.setStatus(AssignmentStatus.CLOSED);
		assignmentRepository.save(entity);

		// Học sinh kiểm tra trước khi gia hạn -> bài tập OVERDUE
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, classroom.getId())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].studentStatus", is("OVERDUE")))
				.andExpect(jsonPath("$[0].canStart", is(false)));

		// Giáo viên kéo dài hạn mới thành 2 ngày sau
		Instant newDueTime = Instant.now().plus(2, ChronoUnit.DAYS);
		String requestBody = objectMapper.writeValueAsString(new ExtendAssignmentDueDateRequest(newDueTime));

		mockMvc.perform(patch(EXTEND_DUE_DATE_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("ACTIVE")));

		// Sau khi gia hạn, học sinh kiểm tra lại -> bài tập tự động chuyển sang NOT_STARTED và canStart = true
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, classroom.getId())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].studentStatus", is("NOT_STARTED")))
				.andExpect(jsonPath("$[0].canStart", is(true)));
	}

	@Test
	@DisplayName("TC-02: Dữ liệu không hợp lệ - Hạn mới sớm hơn hoặc bằng hạn cũ -> Báo lỗi 400 ASSIGNMENT_DUE_DATE_MUST_EXTEND")
	void test_TC02_extendDueDateFails_WhenNewDateNotAfterCurrent() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant oldDueTime = Instant.now().plus(2, ChronoUnit.DAYS);
		AssignmentResponse assigned = createAssignment(startTime, oldDueTime);

		// 1. Thử đặt hạn mới sớm hơn hạn cũ
		Instant earlierDate = oldDueTime.minus(1, ChronoUnit.DAYS);
		String reqEarlier = objectMapper.writeValueAsString(new ExtendAssignmentDueDateRequest(earlierDate));

		mockMvc.perform(patch(EXTEND_DUE_DATE_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(reqEarlier))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("ASSIGNMENT_DUE_DATE_MUST_EXTEND")))
				.andExpect(jsonPath("$.message", is(ApiErrorCode.ASSIGNMENT_DUE_DATE_MUST_EXTEND.message())));

		// 2. Thử đặt hạn mới bằng đúng hạn cũ
		AssignmentEntity savedEntity = assignmentRepository.findById(assigned.id()).orElseThrow();
		String reqEqual = objectMapper.writeValueAsString(new ExtendAssignmentDueDateRequest(savedEntity.getDueTime()));

		mockMvc.perform(patch(EXTEND_DUE_DATE_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(reqEqual))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("ASSIGNMENT_DUE_DATE_MUST_EXTEND")));
	}

	@Test
	@DisplayName("TC-03: Học sinh đang có lượt IN_PROGRESS -> Được áp dụng hạn mới và tiếp tục làm bài bình thường")
	void test_TC03_studentInProgressAttemptRemainsValidWithNewDueDate() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant oldDueTime = Instant.now().plus(1, ChronoUnit.HOURS);
		AssignmentResponse assigned = createAssignment(startTime, oldDueTime);
		AssignmentEntity assignmentEntity = assignmentRepository.findById(assigned.id()).orElseThrow();

		// Học sinh đã bắt đầu làm bài (IN_PROGRESS)
		AssignmentSubmissionEntity sub = AssignmentSubmissionEntity.createInitial(assignmentEntity, student);
		submissionRepository.save(sub);

		// Giáo viên kéo dài hạn nộp thêm 3 ngày
		Instant newDueTime = Instant.now().plus(3, ChronoUnit.DAYS);
		String requestBody = objectMapper.writeValueAsString(new ExtendAssignmentDueDateRequest(newDueTime));

		mockMvc.perform(patch(EXTEND_DUE_DATE_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isOk());

		// Học sinh kiểm tra danh sách -> vẫn thấy lượt IN_PROGRESS và canStart = true
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, classroom.getId())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].studentStatus", is("IN_PROGRESS")))
				.andExpect(jsonPath("$[0].canStart", is(true)));
	}

	@Test
	@DisplayName("TC-04: Lượt làm bài đã nộp (SUBMITTED) không bị mở lại khi gia hạn bài tập (QTN-21)")
	void test_TC04_submittedAttemptsRemainSubmitted() throws Exception {
		Instant startTime = Instant.now().minus(2, ChronoUnit.HOURS);
		Instant oldDueTime = Instant.now().plus(1, ChronoUnit.HOURS);
		AssignmentResponse assigned = createAssignment(startTime, oldDueTime);
		AssignmentEntity assignmentEntity = assignmentRepository.findById(assigned.id()).orElseThrow();

		// Học sinh đã nộp bài thành công
		AssignmentSubmissionEntity sub = AssignmentSubmissionEntity.createInitial(assignmentEntity, student);
		sub.submit(new BigDecimal("8.50"), "{\"answers\": []}");
		submissionRepository.save(sub);

		// Giáo viên kéo dài hạn nộp thêm 2 ngày
		Instant newDueTime = Instant.now().plus(2, ChronoUnit.DAYS);
		String requestBody = objectMapper.writeValueAsString(new ExtendAssignmentDueDateRequest(newDueTime));

		mockMvc.perform(patch(EXTEND_DUE_DATE_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isOk());

		// Học sinh kiểm tra lại -> trạng thái vẫn là SUBMITTED, không thể nộp đè
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, classroom.getId())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].studentStatus", is("SUBMITTED")))
				.andExpect(jsonPath("$[0].canStart", is(false)))
				.andExpect(jsonPath("$[0].score", is(8.5)));
	}

	@Test
	@DisplayName("TC-05: QTN-01 - Giáo viên không phụ trách lớp không được phép gia hạn bài (HTTP 403 Forbidden)")
	void test_TC05_otherTeacherCannotExtend_Forbidden() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant oldDueTime = Instant.now().plus(1, ChronoUnit.DAYS);
		AssignmentResponse assigned = createAssignment(startTime, oldDueTime);

		Instant newDueTime = Instant.now().plus(3, ChronoUnit.DAYS);
		String requestBody = objectMapper.writeValueAsString(new ExtendAssignmentDueDateRequest(newDueTime));

		mockMvc.perform(patch(EXTEND_DUE_DATE_URL, assigned.id())
						.header("Authorization", "Bearer " + otherTeacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("FORBIDDEN")));

		// Kiểm tra hạn nộp trong DB không đổi
		AssignmentEntity notChanged = assignmentRepository.findById(assigned.id()).orElseThrow();
		assertEquals(oldDueTime.truncatedTo(ChronoUnit.MILLIS), notChanged.getDueTime().truncatedTo(ChronoUnit.MILLIS));
	}

	@Test
	@DisplayName("TC-06: Hệ thống ghi nhận Audit Log khi gia hạn thành công")
	void test_TC06_extendDueDateAuditLogRecorded() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant oldDueTime = Instant.now().plus(1, ChronoUnit.DAYS);
		Instant newDueTime = Instant.now().plus(4, ChronoUnit.DAYS);
		AssignmentResponse assigned = createAssignment(startTime, oldDueTime);

		String requestBody = objectMapper.writeValueAsString(new ExtendAssignmentDueDateRequest(newDueTime));

		mockMvc.perform(patch(EXTEND_DUE_DATE_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isOk());

		// Kiểm tra Audit Log
		List<AuditLogEntity> logs = auditLogRepository.findAll();
		boolean foundAuditLog = logs.stream()
				.anyMatch(log -> "EXTEND_ASSIGNMENT_DUE_DATE".equals(log.getAction())
						&& "ASSIGNMENT".equals(log.getEntityType())
						&& String.valueOf(assigned.id()).equals(log.getEntityId())
						&& log.getActor() != null && teacher.getId().equals(log.getActor().getId()));
		assertTrue(foundAuditLog, "Bắt buộc phải ghi nhận Audit Log EXTEND_ASSIGNMENT_DUE_DATE");
	}

	@Test
	@DisplayName("TC-07: Không thể gia hạn lần giao bài đã bị hủy CANCELLED (HTTP 400 ASSIGNMENT_CANNOT_EXTEND_CANCELLED)")
	void test_TC07_cannotExtendCancelledAssignment() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant oldDueTime = Instant.now().plus(1, ChronoUnit.DAYS);
		AssignmentResponse assigned = createAssignment(startTime, oldDueTime);

		// Hủy bài trước
		assignmentService.cancelAssignment(teacher.getId(), assigned.id());

		// Cố gắng gia hạn bài đã hủy
		Instant newDueTime = Instant.now().plus(3, ChronoUnit.DAYS);
		String requestBody = objectMapper.writeValueAsString(new ExtendAssignmentDueDateRequest(newDueTime));

		mockMvc.perform(patch(EXTEND_DUE_DATE_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("ASSIGNMENT_CANNOT_EXTEND_CANCELLED")))
				.andExpect(jsonPath("$.message", is(ApiErrorCode.ASSIGNMENT_CANNOT_EXTEND_CANCELLED.message())));
	}

	@Test
	@DisplayName("Test PUT alias: PUT /api/assignments/{id}/extend-due-date gia hạn thành công tương đương PATCH")
	void test_putAlias_success() throws Exception {
		Instant startTime = Instant.now().minus(1, ChronoUnit.HOURS);
		Instant oldDueTime = Instant.now().plus(1, ChronoUnit.DAYS);
		Instant newDueTime = Instant.now().plus(5, ChronoUnit.DAYS);
		AssignmentResponse assigned = createAssignment(startTime, oldDueTime);

		String requestBody = objectMapper.writeValueAsString(new ExtendAssignmentDueDateRequest(newDueTime));

		mockMvc.perform(put(EXTEND_DUE_DATE_URL, assigned.id())
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(requestBody))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id", is(assigned.id().intValue())));

		AssignmentEntity updated = assignmentRepository.findById(assigned.id()).orElseThrow();
		assertEquals(newDueTime.truncatedTo(ChronoUnit.MILLIS), updated.getDueTime().truncatedTo(ChronoUnit.MILLIS));
	}
}
