package com.hsk.assignment;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
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
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentDetailResponse;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.dto.AssignmentSnapshotQuestionDto;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.service.AssignmentService;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberStatus;
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
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.dto.CreateExerciseQuestionItem;
import com.hsk.exercise.dto.CreateExerciseRequest;
import com.hsk.exercise.dto.ExerciseResponse;
import com.hsk.exercise.dto.UpdateExerciseRequest;
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

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class AssignmentH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String ASSIGNMENTS_URL = "/api/assignments";
	private static final String TEACHER_EMAIL = "teacher_assign@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_assign@test.com";
	private static final String STUDENT_EMAIL = "student_assign@test.com";
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
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private AuditLogRepository auditLogRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private ClassRepository classRepository;

	@Autowired
	private ClassroomService classroomService;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private HskLevelRepository hskLevelRepository;

	@Autowired
	private QuestionOptionRepository questionOptionRepository;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private QuestionService questionService;

	@Autowired
	private ExerciseRepository exerciseRepository;

	@Autowired
	private ExerciseQuestionRepository exerciseQuestionRepository;

	@Autowired
	private ExerciseService exerciseService;

	@Autowired
	private AssignmentRepository assignmentRepository;

	@Autowired
	private AssignmentService assignmentService;

	private String teacherToken;
	private String otherTeacherToken;
	private String studentToken;
	private Long teacherId;
	private Long otherTeacherId;
	private Long studentId;

	private ClassEntity teacherClass;
	private ClassEntity otherTeacherClass;
	private ExerciseResponse validExercise;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Teacher 1
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo viên Giao bài", TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		teacherId = teacher.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// 2. Tạo Teacher 2
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo viên khác", OTHER_TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity otherTeacher = userRepository.findByEmailIgnoreCase(OTHER_TEACHER_EMAIL).orElseThrow();
		otherTeacherId = otherTeacher.getId();
		userRoleRepository.save(UserRoleEntity.of(otherTeacher, teacherRole, null));

		// 3. Tạo Student 1
		registrationService.registerStudent(
				new RegisterStudentRequest("Học sinh Giao bài", STUDENT_EMAIL, PASSWORD, PASSWORD));
		UserEntity student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		studentId = student.getId();

		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		otherTeacherToken = loginAndGetToken(OTHER_TEACHER_EMAIL, PASSWORD);
		studentToken = loginAndGetToken(STUDENT_EMAIL, PASSWORD);

		// 4. Tạo Lớp học cho Teacher 1
		classroomService.createClass(TEACHER_EMAIL, new CreateClassCommand("Lớp HSK 1 Chuyên sâu", "Lớp học mẫu"));
		teacherClass = classRepository.findByTeacher_IdOrderByCreatedAtDesc(teacherId).get(0);

		// Thêm Student vào Lớp của Teacher 1
		classMemberRepository.save(ClassMemberEntity.create(teacherClass, student));

		// 5. Tạo Lớp học cho Teacher 2
		classroomService.createClass(OTHER_TEACHER_EMAIL, new CreateClassCommand("Lớp của Teacher 2", "Mô tả"));
		otherTeacherClass = classRepository.findByTeacher_IdOrderByCreatedAtDesc(otherTeacherId).get(0);

		// 6. Tạo Câu hỏi và Bài tập hợp lệ cho Teacher 1
		QuestionResponse q1 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Thủ đô của Trung Quốc là gì?",
				"Bắc Kinh là thủ đô",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Bắc Kinh", true),
						new CreateQuestionOptionRequest("Thượng Hải", false)
				)
		));

		QuestionResponse q2 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Từ '你好' nghĩa là gì?",
				"Xin chào",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Xin chào", true),
						new CreateQuestionOptionRequest("Tạm biệt", false)
				)
		));

		validExercise = exerciseService.createExercise(teacherId, new CreateExerciseRequest(
				"Bài kiểm tra 15 phút - HSK 1",
				"Làm bài nghiêm túc",
				ExerciseStatus.READY,
				List.of(
						new CreateExerciseQuestionItem(q1.id(), new BigDecimal("5.0"), 1),
						new CreateExerciseQuestionItem(q2.id(), new BigDecimal("5.0"), 2)
				)
		));
	}

	@AfterEach
	void tearDown() {
		cleanDatabase();
	}

	private void cleanDatabase() {
		questionService.clearUsedInExerciseQuestionIds();
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
		auditLogRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String pwd) throws Exception {
		String body = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, pwd);
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.get("token").asText();
	}

	@Test
	@DisplayName("HTT-06-CN-001-TC-01: Giao bài ngay cho lớp đang hoạt động -> Thành công, status ACTIVE (QTN-01, QTN-09, QTN-10)")
	void test_TC01_assignExerciseNowSuccess() throws Exception {
		Instant dueTime = Instant.now().plus(3, ChronoUnit.DAYS);
		AssignExerciseRequest request = new AssignExerciseRequest(
				validExercise.id(),
				teacherClass.getId(),
				null, // startTime = null -> giao ngay
				dueTime
		);

		mockMvc.perform(post(ASSIGNMENTS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.exerciseId").value(validExercise.id()))
				.andExpect(jsonPath("$.classId").value(teacherClass.getId()))
				.andExpect(jsonPath("$.title").value("Bài kiểm tra 15 phút - HSK 1"))
				.andExpect(jsonPath("$.status").value("ACTIVE"))
				.andExpect(jsonPath("$.questionCount").value(2))
				.andExpect(jsonPath("$.totalPoints").value(10.0));

		// Kiểm tra trong DB
		List<AssignmentEntity> list = assignmentRepository.findByClassroom_IdOrderByCreatedAtDesc(teacherClass.getId());
		assertEquals(1, list.size());
		assertEquals("ACTIVE", list.get(0).getStatus().name());

		// Kiểm tra API lấy danh sách bài của lớp cho Giáo viên
		mockMvc.perform(get(ASSIGNMENTS_URL + "/classes/" + teacherClass.getId())
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].title").value("Bài kiểm tra 15 phút - HSK 1"));

		// Kiểm tra API lấy danh sách bài của lớp cho Học sinh
		mockMvc.perform(get(ASSIGNMENTS_URL + "/classes/" + teacherClass.getId())
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)));
	}

	@Test
	@DisplayName("HTT-06-CN-001-TC-02: Đặt thời gian bắt đầu trong tương lai -> Trạng thái SCHEDULED (TC-02)")
	void test_TC02_assignExerciseScheduledFutureSuccess() throws Exception {
		Instant startTime = Instant.now().plus(1, ChronoUnit.DAYS);
		Instant dueTime = Instant.now().plus(4, ChronoUnit.DAYS);

		AssignExerciseRequest request = new AssignExerciseRequest(
				validExercise.id(),
				teacherClass.getId(),
				startTime,
				dueTime
		);

		MvcResult result = mockMvc.perform(post(ASSIGNMENTS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.status").value("SCHEDULED"))
				.andReturn();

		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		Long assignmentId = root.get("id").asLong();

		// Giáo viên thấy bài SCHEDULED trong danh sách
		mockMvc.perform(get(ASSIGNMENTS_URL + "/classes/" + teacherClass.getId())
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].status").value("SCHEDULED"));

		// Học sinh chưa thấy bài SCHEDULED trong danh sách làm bài (vì chưa đến giờ)
		mockMvc.perform(get(ASSIGNMENTS_URL + "/classes/" + teacherClass.getId())
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));

		// Học sinh cố tình truy cập trực tiếp ID đề thi chưa đến giờ -> 403 Forbidden
		mockMvc.perform(get(ASSIGNMENTS_URL + "/" + assignmentId)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("HTT-06-CN-001-TC-03: Hạn nộp không sau thời điểm bắt đầu -> 400 Bad Request (QTN-09)")
	void test_TC03_assignExerciseDueDateBeforeStartTimeFails() throws Exception {
		Instant startTime = Instant.now().plus(2, ChronoUnit.DAYS);
		Instant dueTime = Instant.now().plus(1, ChronoUnit.DAYS); // Hạn nộp trước ngày bắt đầu!

		AssignExerciseRequest request = new AssignExerciseRequest(
				validExercise.id(),
				teacherClass.getId(),
				startTime,
				dueTime
		);

		mockMvc.perform(post(ASSIGNMENTS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("ASSIGNMENT_DUE_DATE_INVALID"));
	}

	@Test
	@DisplayName("HTT-06-CN-001-TC-04: Bài tập chưa có câu hỏi nào -> Chặn giao bài (QTN-09)")
	void test_TC04_assignExerciseEmptyQuestionsFails() throws Exception {
		// Tạo bài tập rỗng 0 câu hỏi
		ExerciseEntity emptyExercise = exerciseRepository.save(new ExerciseEntity(
				teacherId,
				"Bài tập rỗng không câu hỏi",
				"Mô tả",
				ExerciseStatus.DRAFT
		));

		AssignExerciseRequest request = new AssignExerciseRequest(
				emptyExercise.getId(),
				teacherClass.getId(),
				null,
				Instant.now().plus(2, ChronoUnit.DAYS)
		);

		mockMvc.perform(post(ASSIGNMENTS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("ASSIGNMENT_EXERCISE_EMPTY"));
	}

	@Test
	@DisplayName("HTT-06-CN-001-TC-05: Thiếu lớp học hoặc hạn nộp trống -> 400 Bad Request")
	void test_TC05_assignExerciseMissingClassOrDueDateFails() throws Exception {
		// Thiếu lớp
		String noClassJson = String.format("{\"exerciseId\":%d,\"dueTime\":\"%s\"}", validExercise.id(), Instant.now().plus(2, ChronoUnit.DAYS));
		mockMvc.perform(post(ASSIGNMENTS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(noClassJson))
				.andExpect(status().isBadRequest());

		// Thiếu hạn nộp
		String noDueDateJson = String.format("{\"exerciseId\":%d,\"classId\":%d}", validExercise.id(), teacherClass.getId());
		mockMvc.perform(post(ASSIGNMENTS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(noDueDateJson))
				.andExpect(status().isBadRequest());
	}

	@Test
	@DisplayName("HTT-06-CN-001-TC-06: Giao bài cho lớp đã lưu trữ ARCHIVED -> Báo lỗi từ chối")
	void test_TC06_assignExerciseToArchivedClassFails() throws Exception {
		// Lưu trữ lớp
		classroomService.archiveClass(TEACHER_EMAIL, teacherClass.getId());

		AssignExerciseRequest request = new AssignExerciseRequest(
				validExercise.id(),
				teacherClass.getId(),
				null,
				Instant.now().plus(3, ChronoUnit.DAYS)
		);

		mockMvc.perform(post(ASSIGNMENTS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code").value("CLASS_ALREADY_ARCHIVED"));
	}

	@Test
	@DisplayName("HTT-06-CN-001-TC-07: Giao bài cho lớp của giáo viên khác -> 403 Forbidden (QTN-01)")
	void test_TC07_assignExerciseToOtherTeacherClassForbidden() throws Exception {
		AssignExerciseRequest request = new AssignExerciseRequest(
				validExercise.id(),
				otherTeacherClass.getId(), // Lớp của Teacher 2
				null,
				Instant.now().plus(3, ChronoUnit.DAYS)
		);

		mockMvc.perform(post(ASSIGNMENTS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("HTT-06-CN-001-TC-08: Giao bài tập của giáo viên khác -> 403 Forbidden (QTN-19)")
	void test_TC08_assignOtherTeacherExerciseForbidden() throws Exception {
		// Teacher 2 tạo bài tập
		QuestionResponse otherQ = questionService.createMultipleChoiceQuestion(otherTeacherId, new CreateQuestionRequest(
				"Câu hỏi của Giáo viên 2",
				null,
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("A", true),
						new CreateQuestionOptionRequest("B", false)
				)
		));

		ExerciseResponse otherExercise = exerciseService.createExercise(otherTeacherId, new CreateExerciseRequest(
				"Bài tập của Giáo viên 2",
				null,
				ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(otherQ.id(), new BigDecimal("10.0"), 1))
		));

		// Teacher 1 cố tình giao bài tập của Teacher 2 vào lớp của mình
		AssignExerciseRequest request = new AssignExerciseRequest(
				otherExercise.id(),
				teacherClass.getId(),
				null,
				Instant.now().plus(3, ChronoUnit.DAYS)
		);

		mockMvc.perform(post(ASSIGNMENTS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code").value("ACCESS_DENIED_EXERCISE"));
	}

	@Test
	@DisplayName("HTT-06-CN-001-TC-09: Học sinh mới vào lớp sau khi giao bài -> Thấy bài nếu còn hạn nộp")
	void test_TC09_newStudentEnrolledSeesActiveAssignments() throws Exception {
		// 1. Giao bài trước
		AssignExerciseRequest request = new AssignExerciseRequest(
				validExercise.id(),
				teacherClass.getId(),
				null,
				Instant.now().plus(3, ChronoUnit.DAYS)
		);
		assignmentService.assignExercise(teacherId, request);

		// 2. Tạo học sinh mới sau khi giao bài
		String newStudentEmail = "new_student@test.com";
		registrationService.registerStudent(new RegisterStudentRequest("Học sinh Mới", newStudentEmail, PASSWORD, PASSWORD));
		UserEntity newStudent = userRepository.findByEmailIgnoreCase(newStudentEmail).orElseThrow();
		String newStudentToken = loginAndGetToken(newStudentEmail, PASSWORD);

		// Thêm học sinh mới vào lớp
		classMemberRepository.save(ClassMemberEntity.create(teacherClass, newStudent));

		// 3. Học sinh mới mở danh sách bài của lớp -> Thấy bài
		mockMvc.perform(get(ASSIGNMENTS_URL + "/classes/" + teacherClass.getId())
				.header("Authorization", "Bearer " + newStudentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].title").value("Bài kiểm tra 15 phút - HSK 1"));
	}

	@Test
	@DisplayName("HTT-06-CN-001-TC-10: Ghi nhận nhật ký Audit Log đầy đủ thông tin giao bài")
	void test_TC10_assignmentAuditLogRecorded() throws Exception {
		AssignExerciseRequest request = new AssignExerciseRequest(
				validExercise.id(),
				teacherClass.getId(),
				null,
				Instant.now().plus(3, ChronoUnit.DAYS)
		);

		mockMvc.perform(post(ASSIGNMENTS_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated());

		List<AuditLogEntity> logs = auditLogRepository.findAll();
		boolean found = logs.stream().anyMatch(l ->
				"ASSIGN_EXERCISE".equals(l.getAction()) &&
				"ASSIGNMENT".equals(l.getEntityType()) &&
				l.getDetail().contains("Bài kiểm tra 15 phút - HSK 1")
		);
		assertTrue(found);
	}

	@Test
	@DisplayName("HTT-06-CN-001-TC-11: Giao 1 bài tập nhiều lần cho các lớp khác nhau hoặc cùng lớp -> Tạo các lần giao độc lập")
	void test_TC11_multipleAssignmentsFromSameExercise() throws Exception {
		// Tạo thêm lớp thứ 2 cho Teacher 1
		classroomService.createClass(TEACHER_EMAIL, new CreateClassCommand("Lớp HSK 2 Nâng cao", "Mô tả"));
		ClassEntity classB = classRepository.findByTeacher_IdOrderByCreatedAtDesc(teacherId).get(0);

		// Giao lần 1: Lớp A, hạn 2 ngày sau
		assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				validExercise.id(),
				teacherClass.getId(),
				null,
				Instant.now().plus(2, ChronoUnit.DAYS)
		));

		// Giao lần 2: Lớp B, hạn 4 ngày sau
		assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				validExercise.id(),
				classB.getId(),
				null,
				Instant.now().plus(4, ChronoUnit.DAYS)
		));

		// Giao lần 3: Giao lại cho Lớp A, hạn 7 ngày sau
		assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				validExercise.id(),
				teacherClass.getId(),
				null,
				Instant.now().plus(7, ChronoUnit.DAYS)
		));

		// Kiểm tra lớp A có 2 lần giao độc lập
		List<AssignmentEntity> classAAssignments = assignmentRepository.findByClassroom_IdOrderByCreatedAtDesc(teacherClass.getId());
		assertEquals(2, classAAssignments.size());

		// Kiểm tra lớp B có 1 lần giao độc lập
		List<AssignmentEntity> classBAssignments = assignmentRepository.findByClassroom_IdOrderByCreatedAtDesc(classB.getId());
		assertEquals(1, classBAssignments.size());
	}

	@Test
	@DisplayName("HTT-06-CN-001-TC-12: Cố định snapshot (QTN-10) — Sửa bài tập gốc sau khi giao không ảnh hưởng snapshot lần giao đã tạo")
	void test_TC12_originalExerciseModifiedDoesNotAffectSnapshot() throws Exception {
		// 1. Giao bài
		AssignmentResponse createdAssignment = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				validExercise.id(),
				teacherClass.getId(),
				null,
				Instant.now().plus(3, ChronoUnit.DAYS)
		));

		// 2. Giáo viên sửa bài tập gốc (ví dụ: đổi tên bài, đổi điểm câu 1 thành 9.0 điểm, xóa câu 2)
		Long q1Id = validExercise.questions().get(0).questionId();
		exerciseService.updateExercise(teacherId, validExercise.id(), new UpdateExerciseRequest(
				"Tên bài tập đã sửa hoàn toàn",
				"Hướng dẫn mới",
				ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(q1Id, new BigDecimal("9.0"), 1))
		));

		// 3. Kiểm tra chi tiết lần giao bài đã tạo trước đó
		AssignmentDetailResponse detail = assignmentService.getAssignmentDetail(teacherId, createdAssignment.id());

		// Tên lần giao bài và tổng điểm snapshot KHÔNG ĐỔI
		assertEquals("Bài kiểm tra 15 phút - HSK 1", detail.title());
		assertEquals(new BigDecimal("10.00"), detail.totalPoints());
		assertEquals(2, detail.questions().size());

		// Câu 1 vẫn giữ nguyên 5.0 điểm như thời điểm giao bài
		AssignmentSnapshotQuestionDto firstQuestion = detail.questions().get(0);
		assertEquals(new BigDecimal("5.00"), firstQuestion.points());
		assertEquals("Thủ đô của Trung Quốc là gì?", firstQuestion.content());
	}
}
