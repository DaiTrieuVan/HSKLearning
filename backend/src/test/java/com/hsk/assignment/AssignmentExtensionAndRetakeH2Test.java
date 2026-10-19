package com.hsk.assignment;

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
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.dto.GrantExtensionRequest;
import com.hsk.assignment.dto.GrantRetakeRequest;
import com.hsk.assignment.dto.StudentAnswerItemDto;
import com.hsk.assignment.dto.SubmitAssignmentRequest;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentStudentOverrideRepository;
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
import com.hsk.question.dto.QuestionOptionResponse;
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
 * Integration Test suite cho User Story HTT-06-CN-008 — Gia hạn nộp bài và cho làm lại bài tập.
 * Bao phủ đầy đủ 8 Acceptance Criteria:
 * - TC-01: Gia hạn cho học sinh chưa nộp / đang làm với hạn nộp mới sau hiện tại -> Thành công, học sinh nộp được đến hạn mới.
 * - TC-02: Đặt hạn mới trước hiện tại -> 400 Bad Request (EXTENSION_DUE_TIME_INVALID).
 * - TC-03: Học sinh đã nộp -> Giáo viên cho làm lại -> Tạo thêm lượt làm mới, điểm hiển thị là điểm cao nhất giữa các lượt.
 * - TC-04: Học sinh tự gọi API gia hạn/cho làm lại -> 403 Forbidden.
 * - TC-05: Học sinh thuộc lớp giáo viên khác -> 403 Forbidden.
 * - TC-06: Ghi nhận Audit Log GRANT_EXTENSION và GRANT_RETAKE.
 * - TC-07: Học sinh làm lượt 1 được 10/10, lượt 2 được 0/10 -> Bảng điểm vẫn giữ 10/10 (effectiveScore cao nhất).
 * - TC-08: Học sinh đã bị AUTO_SUBMITTED do hết hạn -> Gia hạn bị từ chối với CANNOT_EXTEND_AUTO_SUBMITTED.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
public class AssignmentExtensionAndRetakeH2Test {

	private static final String PASSWORD = "Password123@";

	@Autowired private MockMvc mockMvc;
	private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();
	@Autowired private UserRepository userRepository;
	@Autowired private UserRoleRepository userRoleRepository;
	@Autowired private RoleRepository roleRepository;
	@Autowired private RegistrationService registrationService;
	@Autowired private ClassroomService classroomService;
	@Autowired private QuestionService questionService;
	@Autowired private ExerciseService exerciseService;
	@Autowired private AssignmentService assignmentService;
	@Autowired private ClassRepository classRepository;
	@Autowired private ClassMemberRepository classMemberRepository;
	@Autowired private ClassMemberEventRepository classMemberEventRepository;
	@Autowired private ClassJoinAttemptRepository classJoinAttemptRepository;
	@Autowired private QuestionRepository questionRepository;
	@Autowired private QuestionOptionRepository questionOptionRepository;
	@Autowired private ExerciseRepository exerciseRepository;
	@Autowired private ExerciseQuestionRepository exerciseQuestionRepository;
	@Autowired private AssignmentRepository assignmentRepository;
	@Autowired private AssignmentSubmissionRepository submissionRepository;
	@Autowired private AssignmentStudentOverrideRepository overrideRepository;
	@Autowired private TeacherRequestRepository teacherRequestRepository;
	@Autowired private PasswordResetTokenRepository passwordResetTokenRepository;
	@Autowired private AuditLogRepository auditLogRepository;
	@Autowired private VocabSetItemRepository vocabSetItemRepository;
	@Autowired private VocabSetRepository vocabSetRepository;
	@Autowired private VocabularyRepository vocabularyRepository;
	@Autowired private HskLevelRepository hskLevelRepository;

	private Long teacherAId;
	private Long teacherBId;
	private Long student1Id;
	private String teacherAToken;
	private String teacherBToken;
	private String student1Token;
	private Long classAId;
	private QuestionResponse question;
	private Long correctOptId;
	private Long incorrectOptId;
	private ExerciseResponse exercise;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Giáo viên A và Giáo viên B
		registrationService.registerStudent(new RegisterStudentRequest("Teacher A", "teacherA.cn008@test.com", PASSWORD, PASSWORD));
		UserEntity teacherA = userRepository.findByEmailIgnoreCase("teacherA.cn008@test.com").orElseThrow();
		teacherAId = teacherA.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacherA, teacherRole, null));

		registrationService.registerStudent(new RegisterStudentRequest("Teacher B", "teacherB.cn008@test.com", PASSWORD, PASSWORD));
		UserEntity teacherB = userRepository.findByEmailIgnoreCase("teacherB.cn008@test.com").orElseThrow();
		teacherBId = teacherB.getId();
		userRoleRepository.save(UserRoleEntity.of(teacherB, teacherRole, null));

		// 2. Tạo Học sinh 1
		registrationService.registerStudent(new RegisterStudentRequest("Student 1", "student1.cn008@test.com", PASSWORD, PASSWORD));
		UserEntity student1 = userRepository.findByEmailIgnoreCase("student1.cn008@test.com").orElseThrow();
		student1Id = student1.getId();

		teacherAToken = loginAndGetToken("teacherA.cn008@test.com", PASSWORD);
		teacherBToken = loginAndGetToken("teacherB.cn008@test.com", PASSWORD);
		student1Token = loginAndGetToken("student1.cn008@test.com", PASSWORD);

		// 3. Giáo viên A tạo lớp A & thêm Học sinh 1 vào lớp
		classroomService.createClass("teacherA.cn008@test.com", new CreateClassCommand("Lớp Học A CN008", "Mô tả"));
		ClassEntity classEntity = classRepository.findByTeacher_IdOrderByCreatedAtDesc(teacherAId).get(0);
		classAId = classEntity.getId();
		classMemberRepository.save(ClassMemberEntity.create(classEntity, student1));

		// 4. Tạo Câu hỏi (10 điểm) và Bài tập
		question = questionService.createMultipleChoiceQuestion(teacherAId, new CreateQuestionRequest(
				"Câu hỏi trắc nghiệm?",
				"Giải thích chi tiết",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Đáp án đúng", true),
						new CreateQuestionOptionRequest("Đáp án sai", false)
				)
		));
		correctOptId = question.options().stream().filter(QuestionOptionResponse::isCorrect).findFirst().orElseThrow().id();
		incorrectOptId = question.options().stream().filter(o -> !o.isCorrect()).findFirst().orElseThrow().id();

		exercise = exerciseService.createExercise(teacherAId, new CreateExerciseRequest(
				"Bài tập CN008",
				"Kiểm tra gia hạn và làm lại",
				ExerciseStatus.READY,
				List.of(new CreateExerciseQuestionItem(question.id(), BigDecimal.valueOf(10.0), 1))
		));
	}

	@AfterEach
	void tearDown() {
		questionService.clearUsedInExerciseQuestionIds();
		overrideRepository.deleteAll();
		submissionRepository.deleteAll();
		assignmentRepository.deleteAll();
		exerciseQuestionRepository.deleteAll();
		exerciseRepository.deleteAll();
		questionOptionRepository.deleteAll();
		questionRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		auditLogRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		vocabularyRepository.deleteAll();
		hskLevelRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		String body = String.format("{\"email\": \"%s\", \"password\": \"%s\"}", email, password);
		MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.get("token").asText();
	}

	@Test
	@DisplayName("TC-01: Gia hạn cho học sinh chưa nộp/đang làm với hạn mới sau hiện tại -> Nộp được đến hạn mới")
	void tc01_grantExtension_success() throws Exception {
		Instant now = Instant.now();
		AssignmentResponse assign = assignmentService.assignExercise(teacherAId, new AssignExerciseRequest(
				exercise.id(),
				classAId,
				now.minus(1, ChronoUnit.MINUTES),
				now.plus(10, ChronoUnit.SECONDS)
		));

		// Giáo viên gia hạn thêm cho học sinh tới 1 ngày sau
		Instant extendedDue = now.plus(1, ChronoUnit.DAYS);
		mockMvc.perform(post("/api/assignments/" + assign.id() + "/students/" + student1Id + "/extension")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new GrantExtensionRequest(extendedDue, "Học sinh xin thêm thời gian"))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.studentId", is(student1Id.intValue())))
				.andExpect(jsonPath("$.reason", is("Học sinh xin thêm thời gian")));

		// Học sinh kiểm tra chi tiết bài tập -> Thấy hạn nộp đã được cập nhật
		mockMvc.perform(get("/api/assignments/" + assign.id() + "/student")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.canStart", is(true)));

		// Học sinh bắt đầu làm bài và nộp bài thành công
		mockMvc.perform(post("/api/assignments/" + assign.id() + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assign.id() + "/submit")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of(
								new StudentAnswerItemDto(question.id(), correctOptId, null)
						)))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(10.0)));
	}

	@Test
	@DisplayName("TC-02: Đặt hạn mới trước hiện tại -> 400 Bad Request EXTENSION_DUE_TIME_INVALID")
	void tc02_grantExtension_invalidDueTime() throws Exception {
		Instant now = Instant.now();
		AssignmentResponse assign = assignmentService.assignExercise(teacherAId, new AssignExerciseRequest(
				exercise.id(),
				classAId,
				now.minus(1, ChronoUnit.MINUTES),
				now.plus(1, ChronoUnit.HOURS)
		));

		// Đặt hạn mới trong quá khứ
		Instant pastDue = now.minus(5, ChronoUnit.MINUTES);
		mockMvc.perform(post("/api/assignments/" + assign.id() + "/students/" + student1Id + "/extension")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new GrantExtensionRequest(pastDue, "Hạn quá khứ"))))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("EXTENSION_DUE_TIME_INVALID")));
	}

	@Test
	@DisplayName("TC-03: Học sinh đã nộp bài -> Giáo viên cho làm lại -> Tạo thêm lượt làm bài mới, điểm giữ cao nhất")
	void tc03_grantRetake_success() throws Exception {
		Instant now = Instant.now();
		AssignmentResponse assign = assignmentService.assignExercise(teacherAId, new AssignExerciseRequest(
				exercise.id(),
				classAId,
				now.minus(1, ChronoUnit.MINUTES),
				now.plus(1, ChronoUnit.HOURS)
		));

		// Học sinh làm bài lượt 1 (trả lời đúng -> 10 điểm)
		mockMvc.perform(post("/api/assignments/" + assign.id() + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assign.id() + "/submit")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of(
								new StudentAnswerItemDto(question.id(), correctOptId, null)
						)))))
				.andExpect(status().isOk());

		// Giáo viên cấp quyền làm lại cho học sinh
		mockMvc.perform(post("/api/assignments/" + assign.id() + "/students/" + student1Id + "/retake")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new GrantRetakeRequest(null, "Cho phép làm lại cải thiện điểm"))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.allowedAttempts", is(2)));

		// Học sinh vào lại trang chi tiết -> canStart = true
		mockMvc.perform(get("/api/assignments/" + assign.id() + "/student")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.canStart", is(true)));

		// Học sinh bắt đầu lượt 2 thành công
		mockMvc.perform(post("/api/assignments/" + assign.id() + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.attemptNumber", is(2)));
	}

	@Test
	@DisplayName("TC-04: Học sinh tự gọi API gia hạn hoặc cho làm lại -> 403 Forbidden")
	void tc04_studentCannotGrantExtensionOrRetake() throws Exception {
		Instant now = Instant.now();
		AssignmentResponse assign = assignmentService.assignExercise(teacherAId, new AssignExerciseRequest(
				exercise.id(),
				classAId,
				now.minus(1, ChronoUnit.MINUTES),
				now.plus(1, ChronoUnit.HOURS)
		));

		mockMvc.perform(post("/api/assignments/" + assign.id() + "/students/" + student1Id + "/extension")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new GrantExtensionRequest(now.plus(2, ChronoUnit.HOURS), "Tự xin"))))
				.andExpect(status().isForbidden());

		mockMvc.perform(post("/api/assignments/" + assign.id() + "/students/" + student1Id + "/retake")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new GrantRetakeRequest(null, "Tự cho làm lại"))))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("TC-05: Học sinh thuộc lớp của giáo viên khác -> 403 Forbidden")
	void tc05_otherTeacherCannotGrantExtensionOrRetake() throws Exception {
		Instant now = Instant.now();
		AssignmentResponse assign = assignmentService.assignExercise(teacherAId, new AssignExerciseRequest(
				exercise.id(),
				classAId,
				now.minus(1, ChronoUnit.MINUTES),
				now.plus(1, ChronoUnit.HOURS)
		));

		mockMvc.perform(post("/api/assignments/" + assign.id() + "/students/" + student1Id + "/extension")
						.header("Authorization", "Bearer " + teacherBToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new GrantExtensionRequest(now.plus(2, ChronoUnit.HOURS), "Xâm phạm"))))
				.andExpect(status().isForbidden());

		mockMvc.perform(post("/api/assignments/" + assign.id() + "/students/" + student1Id + "/retake")
						.header("Authorization", "Bearer " + teacherBToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new GrantRetakeRequest(null, "Xâm phạm"))))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("TC-06: Ghi nhận Audit Log GRANT_EXTENSION và GRANT_RETAKE")
	void tc06_auditLogsRecorded() throws Exception {
		Instant now = Instant.now();
		AssignmentResponse assign = assignmentService.assignExercise(teacherAId, new AssignExerciseRequest(
				exercise.id(),
				classAId,
				now.minus(1, ChronoUnit.MINUTES),
				now.plus(1, ChronoUnit.HOURS)
		));

		// Gọi gia hạn
		mockMvc.perform(post("/api/assignments/" + assign.id() + "/students/" + student1Id + "/extension")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new GrantExtensionRequest(now.plus(2, ChronoUnit.HOURS), "Lý do gia hạn"))))
				.andExpect(status().isOk());

		// Gọi cho làm lại
		mockMvc.perform(post("/api/assignments/" + assign.id() + "/students/" + student1Id + "/retake")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new GrantRetakeRequest(null, "Lý do làm lại"))))
				.andExpect(status().isOk());

		List<AuditLogEntity> extLogs = auditLogRepository.findAll().stream()
				.filter(l -> "GRANT_EXTENSION".equals(l.getAction()))
				.toList();
		assertEquals(1, extLogs.size());
		assertTrue(extLogs.get(0).getDetail().toLowerCase().contains("gia hạn"));

		List<AuditLogEntity> retakeLogs = auditLogRepository.findAll().stream()
				.filter(l -> "GRANT_RETAKE".equals(l.getAction()))
				.toList();
		assertEquals(1, retakeLogs.size());
		assertTrue(retakeLogs.get(0).getDetail().toLowerCase().contains("làm lại"));
	}

	@Test
	@DisplayName("TC-07: Học sinh làm lượt 1 được 10/10, làm lại lượt 2 được 0/10 -> Bảng điểm vẫn giữ 10/10 (effectiveScore cao nhất)")
	void tc07_highestScoreRetained() throws Exception {
		Instant now = Instant.now();
		AssignmentResponse assign = assignmentService.assignExercise(teacherAId, new AssignExerciseRequest(
				exercise.id(),
				classAId,
				now.minus(1, ChronoUnit.MINUTES),
				now.plus(1, ChronoUnit.HOURS)
		));

		// Lượt 1: Đúng -> 10 điểm
		mockMvc.perform(post("/api/assignments/" + assign.id() + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assign.id() + "/submit")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of(
								new StudentAnswerItemDto(question.id(), correctOptId, null)
						)))))
				.andExpect(status().isOk());

		// Giáo viên cho làm lại
		mockMvc.perform(post("/api/assignments/" + assign.id() + "/students/" + student1Id + "/retake")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new GrantRetakeRequest(null, "Làm lại"))))
				.andExpect(status().isOk());

		// Lượt 2: Sai -> 0 điểm
		mockMvc.perform(post("/api/assignments/" + assign.id() + "/take")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post("/api/assignments/" + assign.id() + "/submit")
						.header("Authorization", "Bearer " + student1Token)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(List.of(
								new StudentAnswerItemDto(question.id(), incorrectOptId, null)
						)))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(0.0)));

		// Xem bảng điểm tổng quan của giáo viên -> effectiveScore vẫn là 10.0
		mockMvc.perform(get("/api/assignments/" + assign.id() + "/submissions")
						.header("Authorization", "Bearer " + teacherAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.students[0].effectiveScore", is(10.0)))
				.andExpect(jsonPath("$.students[0].attemptNumber", is(2)));

		// Xem danh sách bài tập của học sinh -> điểm vẫn hiển thị là 10.0
		mockMvc.perform(get("/api/assignments/classes/" + classAId + "/student")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].score", is(10.0)));
	}

	@Test
	@DisplayName("TC-08: Học sinh đã bị AUTO_SUBMITTED do hết hạn -> Gia hạn bị từ chối với CANNOT_EXTEND_AUTO_SUBMITTED")
	void tc08_cannotExtendAutoSubmitted() throws Exception {
		Instant now = Instant.now();
		AssignmentResponse assign = assignmentService.assignExercise(teacherAId, new AssignExerciseRequest(
				exercise.id(),
				classAId,
				now.minus(2, ChronoUnit.HOURS),
				now.minus(1, ChronoUnit.HOURS)
		));

		AssignmentEntity assignment = assignmentRepository.findById(assign.id()).orElseThrow();
		UserEntity student1 = userRepository.findById(student1Id).orElseThrow();

		// Giả lập học sinh đã có lượt làm và bị auto submit do quá hạn
		AssignmentSubmissionEntity sub = AssignmentSubmissionEntity.createInitial(assignment, student1);
		sub.autoSubmit(BigDecimal.valueOf(5.0), "[]");
		submissionRepository.save(sub);

		// Giáo viên cố tình gia hạn -> Bị từ chối
		mockMvc.perform(post("/api/assignments/" + assign.id() + "/students/" + student1Id + "/extension")
						.header("Authorization", "Bearer " + teacherAToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(new GrantExtensionRequest(now.plus(1, ChronoUnit.DAYS), "Gia hạn bài đã nộp tự động"))))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("CANNOT_EXTEND_AUTO_SUBMITTED")));
	}
}
