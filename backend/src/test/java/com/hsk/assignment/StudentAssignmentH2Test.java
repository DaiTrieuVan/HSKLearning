package com.hsk.assignment;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
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
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.domain.StudentAssignmentStatus;
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
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
 * Test suite tích hợp cho HTT-06-CN-002: Xem bài được giao (Học sinh).
 * Bao phủ 100% các Acceptance Criteria: TC-01 đến TC-05 và các quy tắc QTN-02, QTN-18.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class StudentAssignmentH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String STUDENT_ASSIGNMENTS_URL = "/api/assignments/classes/{classId}/student";
	private static final String STUDENT_ASSIGNMENT_DETAIL_URL = "/api/assignments/{id}/student";

	private static final String TEACHER_EMAIL = "teacher_stu_view@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_stu_view@test.com";
	private static final String STUDENT_1_EMAIL = "student1_stu_view@test.com";
	private static final String STUDENT_2_EMAIL = "student2_stu_view@test.com";
	private static final String OUTSIDER_STUDENT_EMAIL = "outsider_stu_view@test.com";
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
	private AssignmentSubmissionRepository assignmentSubmissionRepository;

	@Autowired
	private AssignmentService assignmentService;

	private String teacherToken;
	private String student1Token;
	private String student2Token;
	private String outsiderToken;

	private Long teacherId;
	private Long otherTeacherId;
	private Long student1Id;
	private Long student2Id;
	private Long outsiderId;

	private ClassEntity testClass;
	private ClassEntity otherClass;
	private ExerciseResponse exercise1;
	private ExerciseResponse exercise2;
	private ExerciseResponse exercise3;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Giáo viên
		registrationService.registerStudent(new RegisterStudentRequest("Giáo viên A", TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		teacherId = teacher.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		registrationService.registerStudent(new RegisterStudentRequest("Giáo viên B", OTHER_TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity otherTeacher = userRepository.findByEmailIgnoreCase(OTHER_TEACHER_EMAIL).orElseThrow();
		otherTeacherId = otherTeacher.getId();
		userRoleRepository.save(UserRoleEntity.of(otherTeacher, teacherRole, null));

		// 2. Tạo Học sinh 1, Học sinh 2, Học sinh ngoài lớp
		registrationService.registerStudent(new RegisterStudentRequest("Học sinh 1", STUDENT_1_EMAIL, PASSWORD, PASSWORD));
		UserEntity student1 = userRepository.findByEmailIgnoreCase(STUDENT_1_EMAIL).orElseThrow();
		student1Id = student1.getId();

		registrationService.registerStudent(new RegisterStudentRequest("Học sinh 2", STUDENT_2_EMAIL, PASSWORD, PASSWORD));
		UserEntity student2 = userRepository.findByEmailIgnoreCase(STUDENT_2_EMAIL).orElseThrow();
		student2Id = student2.getId();

		registrationService.registerStudent(new RegisterStudentRequest("Học sinh Ngoài Lớp", OUTSIDER_STUDENT_EMAIL, PASSWORD, PASSWORD));
		UserEntity outsider = userRepository.findByEmailIgnoreCase(OUTSIDER_STUDENT_EMAIL).orElseThrow();
		outsiderId = outsider.getId();

		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		student1Token = loginAndGetToken(STUDENT_1_EMAIL, PASSWORD);
		student2Token = loginAndGetToken(STUDENT_2_EMAIL, PASSWORD);
		outsiderToken = loginAndGetToken(OUTSIDER_STUDENT_EMAIL, PASSWORD);

		// 3. Tạo Lớp học chính và Lớp học khác
		classroomService.createClass(TEACHER_EMAIL, new CreateClassCommand("Lớp Học Tiếng Trung 1", "Lớp chính"));
		testClass = classRepository.findByTeacher_IdOrderByCreatedAtDesc(teacherId).get(0);

		classroomService.createClass(OTHER_TEACHER_EMAIL, new CreateClassCommand("Lớp của Teacher Khác", "Lớp ngoài"));
		otherClass = classRepository.findByTeacher_IdOrderByCreatedAtDesc(otherTeacher.getId()).get(0);

		// Thêm Student 1 và Student 2 vào testClass
		classMemberRepository.save(ClassMemberEntity.create(testClass, student1));
		classMemberRepository.save(ClassMemberEntity.create(testClass, student2));

		// 4. Tạo các bài tập mẫu
		QuestionResponse q1 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu hỏi số 1?", "Giải thích 1", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("Đáp án A", true), new CreateQuestionOptionRequest("Đáp án B", false))
		));
		QuestionResponse q2 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu hỏi số 2?", "Giải thích 2", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("Đáp án C", true), new CreateQuestionOptionRequest("Đáp án D", false))
		));

		exercise1 = exerciseService.createExercise(teacherId, new CreateExerciseRequest(
				"Bài tập số 1 - Ngữ pháp", "Làm trong 15 phút", ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(q1.id(), new BigDecimal("5.0"), 1))
		));

		exercise2 = exerciseService.createExercise(teacherId, new CreateExerciseRequest(
				"Bài tập số 2 - Từ vựng", "Làm trong 20 phút", ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(q2.id(), new BigDecimal("10.0"), 1))
		));

		exercise3 = exerciseService.createExercise(teacherId, new CreateExerciseRequest(
				"Bài tập số 3 - Tổng hợp", "Làm cuối tuần", ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(q1.id(), new BigDecimal("5.0"), 1), new CreateExerciseQuestionItem(q2.id(), new BigDecimal("5.0"), 2))
		));
	}

	@AfterEach
	void tearDown() {
		cleanDatabase();
	}

	private void cleanDatabase() {
		questionService.clearUsedInExerciseQuestionIds();
		assignmentSubmissionRepository.deleteAll();
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

	private String loginAndGetToken(String email, String password) throws Exception {
		String body = objectMapper.writeValueAsString(new LoginRequest(email, password));
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.get("token").asText();
	}

	private record LoginRequest(String email, String password) {}

	// -------------------------------------------------------------------------
	// Acceptance Criteria Tests
	// -------------------------------------------------------------------------

	@Test
	@DisplayName("HTT-06-CN-002-TC-01: Học sinh xem danh sách bài tập được giao thành công khi lớp có 3 bài")
	void test_TC01_studentViewsAssignedExercisesInClassSuccess() throws Exception {
		Instant now = Instant.now();
		// Giao 3 bài cho lớp
		assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exercise1.id(), testClass.getId(),
				now.minus(1, ChronoUnit.HOURS), now.plus(2, ChronoUnit.DAYS)
		));
		assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exercise2.id(), testClass.getId(),
				now.minus(1, ChronoUnit.HOURS), now.plus(3, ChronoUnit.DAYS)
		));
		assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exercise3.id(), testClass.getId(),
				now.minus(1, ChronoUnit.HOURS), now.plus(4, ChronoUnit.DAYS)
		));

		// Học sinh 1 mở xem danh sách bài tập của lớp
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, testClass.getId())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(3)))
				.andExpect(jsonPath("$[0].className", is("Lớp Học Tiếng Trung 1")))
				.andExpect(jsonPath("$[0].studentStatus", is("NOT_STARTED")))
				.andExpect(jsonPath("$[0].canStart", is(true)))
				.andExpect(jsonPath("$[1].studentStatus", is("NOT_STARTED")))
				.andExpect(jsonPath("$[2].studentStatus", is("NOT_STARTED")));
	}

	@Test
	@DisplayName("HTT-06-CN-002-TC-02: Học sinh có 3 bài với 3 trạng thái: chưa làm (NOT_STARTED), đã nộp (SUBMITTED), quá hạn (OVERDUE)")
	void test_TC02_studentViewsCorrectStatuses_NotStarted_Submitted_Overdue() throws Exception {
		Instant now = Instant.now();

		// Bài 1: Đang mở làm bài, chưa làm (now < dueTime)
		AssignmentResponse a1 = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exercise1.id(), testClass.getId(),
				now.minus(1, ChronoUnit.HOURS), now.plus(1, ChronoUnit.DAYS)
		));

		// Bài 2: Đang mở hoặc trong hạn, học sinh đã nộp bài thành công
		AssignmentResponse a2 = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exercise2.id(), testClass.getId(),
				now.minus(2, ChronoUnit.HOURS), now.plus(1, ChronoUnit.DAYS)
		));
		AssignmentEntity assignment2 = assignmentRepository.findById(a2.id()).orElseThrow();
		UserEntity student1 = userRepository.findById(student1Id).orElseThrow();
		AssignmentSubmissionEntity sub2 = AssignmentSubmissionEntity.createInitial(assignment2, student1);
		sub2.submit(new BigDecimal("9.50"), "{\"answers\": []}");
		assignmentSubmissionRepository.save(sub2);

		// Bài 3: Đã hết hạn (dueTime trong quá khứ), học sinh chưa nộp bài
		// Trực tiếp lưu assignment có dueTime trong quá khứ để test kịch bản quá hạn
		AssignmentResponse a3 = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exercise3.id(), testClass.getId(),
				now.minus(3, ChronoUnit.HOURS), now.plus(1, ChronoUnit.MINUTES)
		));
		AssignmentEntity assignment3 = assignmentRepository.findById(a3.id()).orElseThrow();
		assignment3.setDueTime(now.minus(10, ChronoUnit.MINUTES));
		assignmentRepository.save(assignment3);

		// Học sinh gọi API xem danh sách
		MvcResult result = mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, testClass.getId())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(3)))
				.andReturn();

		JsonNode arr = objectMapper.readTree(result.getResponse().getContentAsString());

		// Tìm từng bài theo title của exercise để kiểm tra chính xác trạng thái
		JsonNode item1 = findNodeByTitle(arr, exercise1.title());
		assertNotNull(item1);
		assertEquals("NOT_STARTED", item1.get("studentStatus").asText());
		assertTrue(item1.get("canStart").asBoolean());
		assertTrue(item1.get("submissionId").isNull());
		assertTrue(item1.get("score").isNull());

		JsonNode item2 = findNodeByTitle(arr, exercise2.title());
		assertNotNull(item2);
		assertEquals("SUBMITTED", item2.get("studentStatus").asText());
		assertFalse(item2.get("canStart").asBoolean());
		assertFalse(item2.get("submissionId").isNull());
		assertEquals(0, new BigDecimal("9.50").compareTo(new BigDecimal(item2.get("score").asText())));
		assertNotNull(item2.get("submittedAt").asText());

		JsonNode item3 = findNodeByTitle(arr, exercise3.title());
		assertNotNull(item3);
		assertEquals("OVERDUE", item3.get("studentStatus").asText());
		assertFalse(item3.get("canStart").asBoolean());
		assertTrue(item3.get("submissionId").isNull());
	}

	@Test
	@DisplayName("HTT-06-CN-002-TC-03: Bài tập chưa đến thời gian bắt đầu hiển thị dạng UPCOMING, canStart=false, ẩn câu hỏi")
	void test_TC03_scheduledAssignmentShowsUpcomingCannotStart() throws Exception {
		Instant now = Instant.now();
		// Giao bài hẹn giờ bắt đầu trong tương lai (start_time = now + 1 ngày)
		AssignmentResponse scheduled = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exercise1.id(), testClass.getId(),
				now.plus(1, ChronoUnit.DAYS), now.plus(2, ChronoUnit.DAYS)
		));

		// 1. Kiểm tra trong danh sách bài của học sinh
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, testClass.getId())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].studentStatus", is("UPCOMING")))
				.andExpect(jsonPath("$[0].canStart", is(false)));

		// 2. Kiểm tra xem chi tiết bài qua link trực tiếp
		mockMvc.perform(get(STUDENT_ASSIGNMENT_DETAIL_URL, scheduled.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.studentStatus", is("UPCOMING")))
				.andExpect(jsonPath("$.canStart", is(false)))
				.andExpect(jsonPath("$.questions", hasSize(0))); // Chống rò rỉ đề thi trước giờ
	}

	@Test
	@DisplayName("HTT-06-CN-002-TC-04: Lớp chưa có bài tập nào trả về danh sách rỗng (Empty State)")
	void test_TC04_emptyClassReturnsEmptyList() throws Exception {
		// testClass chưa giao bài nào
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, testClass.getId())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}

	@Test
	@DisplayName("HTT-06-CN-002-TC-05: Học sinh truy cập bài tập của lớp khác không tham gia bị từ chối 403 Forbidden")
	void test_TC05_studentAccessDirectAssignmentOfOtherClassForbidden() throws Exception {
		Instant now = Instant.now();
		// otherTeacher tạo bài tập và giao cho otherClass (lớp mà student1 KHÔNG tham gia)
		QuestionResponse otherQ = questionService.createMultipleChoiceQuestion(otherTeacherId, new CreateQuestionRequest(
				"Câu hỏi lớp khác?", "Giải thích", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("A", true), new CreateQuestionOptionRequest("B", false))
		));
		ExerciseResponse otherExercise = exerciseService.createExercise(otherTeacherId, new CreateExerciseRequest(
				"Bài tập lớp khác", "Mô tả", ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(otherQ.id(), new BigDecimal("5.0"), 1))
		));
		AssignmentResponse otherAssignment = assignmentService.assignExercise(otherTeacherId, new AssignExerciseRequest(
				otherExercise.id(), otherClass.getId(),
				now.minus(1, ChronoUnit.HOURS), now.plus(2, ChronoUnit.DAYS)
		));

		// 1. Học sinh 1 cố gắng lấy danh sách bài của otherClass
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, otherClass.getId())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isForbidden());

		// 2. Học sinh 1 cố gắng mở bài đó bằng đường dẫn trực tiếp (TC-05)
		mockMvc.perform(get(STUDENT_ASSIGNMENT_DETAIL_URL, otherAssignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("HTT-06-CN-002-TC-06: Học sinh đã bị xóa khỏi lớp (REMOVED) cố gắng xem danh sách bài bị từ chối 403 Forbidden")
	void test_TC06_removedStudentCannotViewAssignments() throws Exception {
		Instant now = Instant.now();
		assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exercise1.id(), testClass.getId(),
				now.minus(1, ChronoUnit.HOURS), now.plus(2, ChronoUnit.DAYS)
		));

		// Đổi trạng thái student 1 thành REMOVED
		ClassMemberEntity member = classMemberRepository.findByClassroom_IdAndStudent_Id(testClass.getId(), student1Id).orElseThrow();
		member.remove();
		classMemberRepository.save(member);

		// Học sinh 1 cố gắng xem danh sách bài của lớp
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, testClass.getId())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("HTT-06-CN-002-TC-07: Tuân thủ QTN-02: Học sinh 2 không nhìn thấy bài nộp hoặc điểm của Học sinh 1")
	void test_TC07_studentOnlySeesOwnSubmissionStatus() throws Exception {
		Instant now = Instant.now();
		AssignmentResponse a1 = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exercise1.id(), testClass.getId(),
				now.minus(1, ChronoUnit.HOURS), now.plus(1, ChronoUnit.DAYS)
		));

		// Học sinh 1 đã nộp bài và đạt điểm 10.0
		AssignmentEntity assignment = assignmentRepository.findById(a1.id()).orElseThrow();
		UserEntity student1 = userRepository.findById(student1Id).orElseThrow();
		AssignmentSubmissionEntity sub1 = AssignmentSubmissionEntity.createInitial(assignment, student1);
		sub1.submit(new BigDecimal("10.00"), "{}");
		assignmentSubmissionRepository.save(sub1);

		// Học sinh 2 (chưa làm) mở danh sách bài tập của lớp
		MvcResult result = mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, testClass.getId())
						.header("Authorization", "Bearer " + student2Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].studentStatus", is("NOT_STARTED")))
				.andExpect(jsonPath("$[0].canStart", is(true)))
				.andExpect(jsonPath("$[0].submissionId", nullValue()))
				.andExpect(jsonPath("$[0].score", nullValue()))
				.andReturn();

		// Ngược lại, Học sinh 1 xem thì thấy đúng SUBMITTED và điểm 10.00 của mình
		mockMvc.perform(get(STUDENT_ASSIGNMENTS_URL, testClass.getId())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].studentStatus", is("SUBMITTED")))
				.andExpect(jsonPath("$[0].canStart", is(false)))
				.andExpect(jsonPath("$[0].score", is(10.0)));
	}

	private JsonNode findNodeByTitle(JsonNode arr, String title) {
		for (JsonNode n : arr) {
			if (title.equals(n.get("title").asText())) {
				return n;
			}
		}
		return null;
	}
}
