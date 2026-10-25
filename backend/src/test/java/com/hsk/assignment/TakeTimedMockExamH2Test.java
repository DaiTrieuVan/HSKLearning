package com.hsk.assignment;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
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
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.dto.StudentAnswerItemDto;
import com.hsk.assignment.dto.SubmitAssignmentRequest;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentStudentOverrideRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.assignment.service.AssignmentService;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.audit.AuditLogEntity;
import com.hsk.common.audit.AuditLogRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.dto.CreateExerciseQuestionItem;
import com.hsk.exercise.dto.CreateMockExamRequest;
import com.hsk.exercise.dto.CreateMockExamSectionItem;
import com.hsk.exercise.dto.MockExamResponse;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.exercise.repository.ExerciseSectionRepository;
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
 * Bộ kiểm thử tự động toàn diện cho User Story HTT-09-CN-002: Làm đề thi thử có tính giờ.
 * Bao phủ đầy đủ 10 ca kiểm thử (TC-01 đến TC-10) cùng các quy tắc QTN-11, QTN-12, QTN-20.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class TakeTimedMockExamH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String TAKE_ASSIGNMENT_URL = "/api/assignments/{id}/take";
	private static final String SUBMIT_ASSIGNMENT_URL = "/api/assignments/{id}/submit";

	private static final String TEACHER_EMAIL = "teacher_exam_test@test.com";
	private static final String STUDENT_1_EMAIL = "student1_exam_test@test.com";
	private static final String OUTSIDER_STUDENT_EMAIL = "outsider_exam_test@test.com";
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
	private QuestionRepository questionRepository;

	@Autowired
	private QuestionOptionRepository questionOptionRepository;

	@Autowired
	private QuestionService questionService;

	@Autowired
	private ExerciseRepository exerciseRepository;

	@Autowired
	private ExerciseQuestionRepository exerciseQuestionRepository;

	@Autowired
	private ExerciseSectionRepository exerciseSectionRepository;

	@Autowired
	private ExerciseService exerciseService;

	@Autowired
	private ClassRepository classRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private AssignmentRepository assignmentRepository;

	@Autowired
	private AssignmentSubmissionRepository submissionRepository;

	@Autowired
	private AssignmentStudentOverrideRepository overrideRepository;

	@Autowired
	private AssignmentService assignmentService;

	@Autowired
	private AuditLogRepository auditLogRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private LessonRepository lessonRepository;

	@Autowired
	private LessonVocabularyRepository lessonVocabularyRepository;

	@Autowired
	private HskLevelRepository hskLevelRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	private Long teacherId;
	private Long student1Id;
	private Long outsiderId;
	private String student1Token;
	private String outsiderToken;

	private ClassEntity activeClass;
	private AssignmentResponse timedAssignment;
	private Long question1Id;
	private Long question1CorrectOptionId;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Giáo viên
		registrationService.registerStudent(new RegisterStudentRequest("Thầy Giáo Đề Thi", TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		teacherId = teacher.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// 2. Tạo Học sinh 1 (thành viên lớp)
		registrationService.registerStudent(new RegisterStudentRequest("Học sinh 1", STUDENT_1_EMAIL, PASSWORD, PASSWORD));
		UserEntity student1 = userRepository.findByEmailIgnoreCase(STUDENT_1_EMAIL).orElseThrow();
		student1Id = student1.getId();

		// 3. Tạo Học sinh ngoài lớp (outsider)
		registrationService.registerStudent(new RegisterStudentRequest("Học sinh ngoài", OUTSIDER_STUDENT_EMAIL, PASSWORD, PASSWORD));
		UserEntity outsider = userRepository.findByEmailIgnoreCase(OUTSIDER_STUDENT_EMAIL).orElseThrow();
		outsiderId = outsider.getId();

		student1Token = loginAndGetToken(STUDENT_1_EMAIL, PASSWORD);
		outsiderToken = loginAndGetToken(OUTSIDER_STUDENT_EMAIL, PASSWORD);

		// 4. Tạo Lớp học & thêm Học sinh 1 vào lớp
		activeClass = ClassEntity.create(teacher, "Lớp Luyện Thi HSK 1 - 2026", "Lớp thi thử", "EXAM99");
		classRepository.save(activeClass);
		classMemberRepository.save(ClassMemberEntity.create(activeClass, student1));

		// 5. Tạo Câu hỏi trắc nghiệm
		QuestionResponse q1 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu 1: 你好 nghĩa là gì?",
				"Chào hỏi thông dụng",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Xin chào", true),
						new CreateQuestionOptionRequest("Tạm biệt", false)
				)
		));
		question1Id = q1.id();
		question1CorrectOptionId = q1.options().stream()
				.filter(opt -> "Xin chào".equals(opt.content()))
				.findFirst()
				.orElseThrow()
				.id();

		// 6. Tạo Đề thi thử HSK có thời gian 60 phút, điểm đạt 6.00 / 10.00
		MockExamResponse mockExam = exerciseService.createMockExam(teacherId, new CreateMockExamRequest(
				"Đề thi thử HSK 1 Chuẩn Hanban",
				"Đề thi gồm 2 phần Nghe và Đọc",
				1,
				60, // 60 phút
				new BigDecimal("6.00"),
				ExerciseStatus.READY,
				List.of(
						new CreateMockExamSectionItem(
								"Phần 1: Nghe",
								1,
								List.of(new CreateExerciseQuestionItem(question1Id, new BigDecimal("10.00"), 1))
						)
				)
		));

		// 7. Giao đề thi thử cho lớp (Hạn nộp sau 7 ngày)
		timedAssignment = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				mockExam.id(),
				activeClass.getId(),
				Instant.now().minus(1, ChronoUnit.HOURS),
				Instant.now().plus(7, ChronoUnit.DAYS)
		));
	}

	@AfterEach
	void tearDown() {
		cleanDatabase();
	}

	private void cleanDatabase() {
		questionService.clearUsedInExerciseQuestionIds();
		overrideRepository.deleteAll();
		submissionRepository.deleteAll();
		assignmentRepository.deleteAll();
		exerciseQuestionRepository.deleteAll();
		exerciseSectionRepository.deleteAll();
		exerciseRepository.deleteAll();
		questionOptionRepository.deleteAll();
		questionRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classMemberRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		lessonVocabularyRepository.deleteAll();
		lessonRepository.deleteAll();
		vocabularyRepository.deleteAll();
		hskLevelRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		auditLogRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		String json = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(json))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.get("token").asText();
	}

	@Test
	@DisplayName("HTT-09-CN-002-TC-01: Bắt đầu làm đề thi thử 60 phút -> Ghi nhận startedAt và đếm ngược 60 phút")
	void test_TC01_startMockExamSuccess() throws Exception {
		MvcResult result = mockMvc.perform(post(TAKE_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("IN_PROGRESS")))
				.andExpect(jsonPath("$.timeLimitMinutes", is(60)))
				.andExpect(jsonPath("$.exerciseType", is("MOCK_EXAM")))
				.andExpect(jsonPath("$.passingScore", is(6.00)))
				.andExpect(jsonPath("$.startedAt", notNullValue()))
				.andExpect(jsonPath("$.effectiveDeadline", notNullValue()))
				.andReturn();

		JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
		Instant startedAt = Instant.parse(json.get("startedAt").asText());
		Instant effectiveDeadline = Instant.parse(json.get("effectiveDeadline").asText());

		// Kiểm tra effectiveDeadline bằng startedAt + 60 phút
		long diffMinutes = ChronoUnit.MINUTES.between(startedAt, effectiveDeadline);
		assertEquals(60, diffMinutes);
	}

	@Test
	@DisplayName("HTT-09-CN-002-TC-02: Nộp bài trước khi hết giờ -> Ghi nhận SUBMITTED và chấm điểm")
	void test_TC02_submitBeforeTimeoutSuccess() throws Exception {
		// Bắt đầu làm bài
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		// Nộp bài trước giờ (khi còn 10 phút)
		SubmitAssignmentRequest submitReq = new SubmitAssignmentRequest(List.of(
				new StudentAnswerItemDto(question1Id, question1CorrectOptionId, null)
		));

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(submitReq)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("SUBMITTED")))
				.andExpect(jsonPath("$.score", is(10.00)))
				.andExpect(jsonPath("$.submittedAt", notNullValue()));
	}

	@Test
	@DisplayName("HTT-09-CN-002-TC-03: Đồng hồ về 0 -> Tự nộp các câu đã trả lời (AUTO_SUBMITTED) và chấm điểm")
	void test_TC03_autoSubmitWhenTimeoutExpired() throws Exception {
		// Bắt đầu làm bài
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		// Giả lập thời gian máy chủ đã trôi qua 65 phút (quá giới hạn 60 phút của đề thi)
		AssignmentSubmissionEntity sub = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(timedAssignment.id(), student1Id)
				.orElseThrow();
		sub.setStartedAt(Instant.now().minus(65, ChronoUnit.MINUTES));
		submissionRepository.save(sub);

		// Nộp bài khi đã hết giờ -> Tự động đánh dấu AUTO_SUBMITTED
		SubmitAssignmentRequest submitReq = new SubmitAssignmentRequest(List.of(
				new StudentAnswerItemDto(question1Id, question1CorrectOptionId, null)
		));

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(submitReq)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("AUTO_SUBMITTED")))
				.andExpect(jsonPath("$.score", is(10.00)));
	}

	@Test
	@DisplayName("HTT-09-CN-002-TC-04: Đóng trình duyệt mở lại -> Giữ nguyên startedAt ban đầu, không reset thời gian")
	void test_TC04_closeBrowserAndReopenKeepsOriginalStartedAt() throws Exception {
		// Lần đầu mở đề
		MvcResult firstOpen = mockMvc.perform(post(TAKE_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andReturn();
		Instant initialStartedAt = Instant.parse(objectMapper.readTree(firstOpen.getResponse().getContentAsString()).get("startedAt").asText());

		// Giả lập học sinh thoát ra 20 phút rồi mở lại đề
		AssignmentSubmissionEntity sub = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(timedAssignment.id(), student1Id)
				.orElseThrow();
		Instant simulatedPastStartedAt = Instant.now().minus(20, ChronoUnit.MINUTES);
		sub.setStartedAt(simulatedPastStartedAt);
		submissionRepository.save(sub);

		// Mở lại đề
		MvcResult reopen = mockMvc.perform(post(TAKE_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andReturn();
		Instant reopenedStartedAt = Instant.parse(objectMapper.readTree(reopen.getResponse().getContentAsString()).get("startedAt").asText());

		// startedAt không bị reset về hiện tại, giữ đúng mốc trước đó
		assertEquals(simulatedPastStartedAt.truncatedTo(ChronoUnit.SECONDS), reopenedStartedAt.truncatedTo(ChronoUnit.SECONDS));
	}

	@Test
	@DisplayName("HTT-09-CN-002-TC-05: Server-side time check -> Tính toán dựa trên thời gian máy chủ (serverTimeMillis)")
	void test_TC05_serverTimeBasedCountdownTamperProof() throws Exception {
		MvcResult result = mockMvc.perform(post(TAKE_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.serverTimeMillis", notNullValue()))
				.andReturn();

		long serverTime = objectMapper.readTree(result.getResponse().getContentAsString()).get("serverTimeMillis").asLong();
		long now = System.currentTimeMillis();
		assertTrue(Math.abs(now - serverTime) < 5000, "Server time phải xấp xỉ thời gian thực tế của máy chủ");
	}

	@Test
	@DisplayName("HTT-09-CN-002-TC-06: Hạn nộp chỉ còn 20 phút trong khi đề 60 phút -> effectiveDeadline giới hạn 20 phút")
	void test_TC06_dueTimeShorterThanTimeLimitCapsCountdown() throws Exception {
		// Tạo assignment chỉ còn 20 phút là tới dueTime
		Instant dueIn20Min = Instant.now().plus(20, ChronoUnit.MINUTES);
		AssignmentResponse shortAssignment = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				timedAssignment.exerciseId(),
				activeClass.getId(),
				Instant.now().minus(1, ChronoUnit.HOURS),
				dueIn20Min
		));

		MvcResult result = mockMvc.perform(post(TAKE_ASSIGNMENT_URL, shortAssignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andReturn();

		Instant effectiveDeadline = Instant.parse(objectMapper.readTree(result.getResponse().getContentAsString()).get("effectiveDeadline").asText());
		assertEquals(dueIn20Min.truncatedTo(ChronoUnit.SECONDS), effectiveDeadline.truncatedTo(ChronoUnit.SECONDS));
	}

	@Test
	@DisplayName("HTT-09-CN-002-TC-07: Đã nộp đề và chưa cho làm lại -> Từ chối nộp tiếp (ASSIGNMENT_ALREADY_SUBMITTED)")
	void test_TC07_alreadySubmittedCannotRetakeWithoutPermission() throws Exception {
		// 1. Bắt đầu và nộp bài
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of()))))
				.andExpect(status().isOk());

		// 2. Thử nộp lại lần nữa -> Bị từ chối
		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of()))))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.ASSIGNMENT_ALREADY_SUBMITTED.name())));
	}

	@Test
	@DisplayName("HTT-09-CN-002-TC-08: Đề chưa đến giờ bắt đầu hoặc đã quá hạn -> Báo lỗi không cho làm")
	void test_TC08_assignmentNotYetStartedOrExpiredBlocked() throws Exception {
		// 1. Đề chưa đến thời gian mở (bắt đầu vào ngày mai)
		AssignmentResponse futureAssignment = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				timedAssignment.exerciseId(),
				activeClass.getId(),
				Instant.now().plus(1, ChronoUnit.DAYS),
				Instant.now().plus(2, ChronoUnit.DAYS)
		));

		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, futureAssignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.ASSIGNMENT_NOT_YET_STARTED.name())));

		// 2. Đề đã quá hạn hôm qua
		AssignmentResponse expiredAssignment = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				timedAssignment.exerciseId(),
				activeClass.getId(),
				Instant.now().minus(2, ChronoUnit.DAYS),
				Instant.now().minus(1, ChronoUnit.DAYS)
		));

		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, expiredAssignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.ASSIGNMENT_ALREADY_EXPIRED.name())));
	}

	@Test
	@DisplayName("HTT-09-CN-002-TC-09: Học sinh không thuộc lớp được giao đề -> Bị từ chối truy cập (HTTP 403)")
	void test_TC09_studentNotInClassAccessDenied() throws Exception {
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + outsiderToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.FORBIDDEN.name())));
	}

	@Test
	@DisplayName("HTT-09-CN-002-TC-10: Lưu lịch sử nộp bài trong AuditLog")
	void test_TC10_auditLogRecordsStartedSubmittedAndMethod() throws Exception {
		// 1. Bắt đầu làm đề
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		// 2. Nộp bài
		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, timedAssignment.id())
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of()))))
				.andExpect(status().isOk());

		// Kiểm tra AuditLog ghi nhận START_ASSIGNMENT và SUBMIT_ASSIGNMENT
		List<AuditLogEntity> logs = auditLogRepository.findAll();
		boolean hasStart = logs.stream().anyMatch(l -> "START_ASSIGNMENT".equals(l.getAction()));
		boolean hasSubmit = logs.stream().anyMatch(l -> "SUBMIT_ASSIGNMENT".equals(l.getAction()));

		assertTrue(hasStart, "Phải ghi nhận START_ASSIGNMENT vào AuditLog");
		assertTrue(hasSubmit, "Phải ghi nhận SUBMIT_ASSIGNMENT vào AuditLog");
	}
}
