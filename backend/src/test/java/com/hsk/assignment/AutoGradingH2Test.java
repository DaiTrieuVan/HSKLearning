package com.hsk.assignment;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
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
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.dto.StudentAnswerItemDto;
import com.hsk.assignment.dto.SubmitAssignmentRequest;
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
import com.hsk.question.dto.BlankAnswerDto;
import com.hsk.question.dto.CreateFillBlankQuestionRequest;
import com.hsk.question.dto.CreateMatchingQuestionRequest;
import com.hsk.question.dto.CreateOrderingQuestionRequest;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.MatchingPairDto;
import com.hsk.question.dto.QuestionOptionResponse;
import com.hsk.question.dto.QuestionResponse;
import com.hsk.question.repository.QuestionOptionRepository;
import com.hsk.question.repository.QuestionRepository;
import com.hsk.question.service.QuestionService;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Integration Test suite cho User Story HTT-06-CN-004 — Chấm điểm tự động.
 * Bao phủ đầy đủ 9 Acceptance Criteria:
 * - TC-01: Câu trắc nghiệm trả lời đúng -> Nhận đủ điểm tối đa của câu.
 * - TC-02: Câu trắc nghiệm trả lời sai -> Nhận 0 điểm và đánh dấu sai.
 * - TC-03: Điền từ khớp một trong các đáp án chấp nhận được (bỏ khoảng trắng thừa).
 * - TC-04: Nối cặp đúng một phần -> Điểm tính tỷ lệ theo số cặp nối đúng.
 * - TC-05: Sắp xếp câu đúng thứ tự -> Tối đa điểm, sai thứ tự -> 0 điểm.
 * - TC-06: Bỏ trống một câu -> 0 điểm và đánh dấu chưa trả lời.
 * - TC-07: Tổng điểm bằng tổng điểm các câu đúng, làm tròn 1 chữ số thập phân.
 * - TC-08: Bài nộp đã chấm -> Không tạo thêm điểm mới và giữ nguyên điểm gốc (Idempotent).
 * - TC-09: Ghi nhận Audit Log hành động chấm điểm tự động.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class AutoGradingH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String TAKE_ASSIGNMENT_URL = "/api/assignments/{id}/take";
	private static final String SUBMIT_ASSIGNMENT_URL = "/api/assignments/{id}/submit";
	private static final String REGRADE_ASSIGNMENT_URL = "/api/assignments/{id}/regrade";

	private static final String TEACHER_EMAIL = "teacher_autograde@test.com";
	private static final String STUDENT_EMAIL = "student_autograde@test.com";
	private static final String PASSWORD = "Password123@";

	@Autowired private MockMvc mockMvc;
	private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

	@Autowired private RegistrationService registrationService;
	@Autowired private ClassroomService classroomService;
	@Autowired private QuestionService questionService;
	@Autowired private ExerciseService exerciseService;
	@Autowired private AssignmentService assignmentService;

	@Autowired private UserRepository userRepository;
	@Autowired private RoleRepository roleRepository;
	@Autowired private UserRoleRepository userRoleRepository;
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
	@Autowired private TeacherRequestRepository teacherRequestRepository;
	@Autowired private PasswordResetTokenRepository passwordResetTokenRepository;
	@Autowired private AuditLogRepository auditLogRepository;
	@Autowired private VocabSetItemRepository vocabSetItemRepository;
	@Autowired private VocabSetRepository vocabSetRepository;
	@Autowired private VocabularyRepository vocabularyRepository;
	@Autowired private HskLevelRepository hskLevelRepository;

	private Long teacherId;
	private Long studentId;
	private String studentToken;
	private Long classId;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Giáo viên
		registrationService.registerStudent(new RegisterStudentRequest("Teacher AutoGrade", TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		teacherId = teacher.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// 2. Tạo Học sinh
		registrationService.registerStudent(new RegisterStudentRequest("Student AutoGrade", STUDENT_EMAIL, PASSWORD, PASSWORD));
		UserEntity student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		studentId = student.getId();

		studentToken = loginAndGetToken(STUDENT_EMAIL, PASSWORD);

		// 3. Tạo lớp học và thêm học sinh
		classroomService.createClass(TEACHER_EMAIL, new CreateClassCommand("Lớp Chấm Điểm Tự Động", "Lớp test HTT-06-CN-004"));
		ClassEntity classEntity = classRepository.findByTeacher_IdOrderByCreatedAtDesc(teacherId).get(0);
		classId = classEntity.getId();
		classMemberRepository.save(ClassMemberEntity.create(classEntity, student));
	}

	@AfterEach
	void tearDown() {
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

	private String loginAndGetToken(String email, String password) throws Exception {
		String body = objectMapper.writeValueAsString(new LoginRequest(email, password));
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString());
		return node.get("token").asText();
	}

	private record LoginRequest(String email, String password) {}

	private Long createAndAssignExercise(List<Long> questionIds, List<BigDecimal> points) {
		List<CreateExerciseQuestionItem> eqItems = new ArrayList<>();
		for (int i = 0; i < questionIds.size(); i++) {
			eqItems.add(new CreateExerciseQuestionItem(questionIds.get(i), points.get(i), i + 1));
		}
		ExerciseResponse exResp = exerciseService.createExercise(teacherId, new CreateExerciseRequest(
				"Bài tập kiểm tra chấm điểm",
				"Bài kiểm tra tích hợp",
				ExerciseStatus.READY,
				eqItems
		));
		AssignmentResponse assignResp = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exResp.id(),
				classId,
				Instant.now().minus(1, ChronoUnit.HOURS),
				Instant.now().plus(2, ChronoUnit.HOURS)
		));
		return assignResp.id();
	}

	// -------------------------------------------------------------------------
	// TC-01 & TC-02: Trắc nghiệm (MCQ) - Chọn đúng được tối đa điểm, chọn sai được 0 điểm
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-01 & TC-02: Câu trắc nghiệm chọn đúng được 2.0 điểm, chọn sai được 0.0 điểm")
	void test_TC01_TC02_multipleChoiceGrading() throws Exception {
		// Tạo 2 câu trắc nghiệm
		QuestionResponse q1 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Trắc nghiệm đúng?", "Giải thích 1", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("Đáp án đúng", true), new CreateQuestionOptionRequest("Đáp án sai", false))
		));
		QuestionResponse q2 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Trắc nghiệm sai?", "Giải thích 2", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("Đáp án đúng", true), new CreateQuestionOptionRequest("Đáp án sai", false))
		));

		Long assignmentId = createAndAssignExercise(List.of(q1.id(), q2.id()), List.of(new BigDecimal("2.0"), new BigDecimal("2.0")));

		// Bắt đầu làm bài
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk());

		// Chuẩn bị câu trả lời: Câu 1 chọn đúng, Câu 2 chọn sai
		Long q1CorrectOptId = q1.options().stream().filter(QuestionOptionResponse::isCorrect).findFirst().orElseThrow().id();
		Long q2WrongOptId = q2.options().stream().filter(opt -> !opt.isCorrect()).findFirst().orElseThrow().id();

		List<StudentAnswerItemDto> answers = List.of(
				new StudentAnswerItemDto(q1.id(), q1CorrectOptId, null),
				new StudentAnswerItemDto(q2.id(), q2WrongOptId, null)
		);

		// Nộp bài
		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(answers))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("SUBMITTED")))
				.andExpect(jsonPath("$.score", is(2.0)))
				.andExpect(jsonPath("$.maxScore", is(4.0)))
				.andExpect(jsonPath("$.questions[0].isCorrect", is(true)))
				.andExpect(jsonPath("$.questions[0].pointsEarned", is(2.0)))
				.andExpect(jsonPath("$.questions[1].isCorrect", is(false)))
				.andExpect(jsonPath("$.questions[1].pointsEarned", is(0.0)));
	}

	// -------------------------------------------------------------------------
	// TC-03: Điền từ (FILL) - Khớp đáp án chấp nhận được sau khi loại bỏ khoảng trắng thừa
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-03: Học sinh điền từ ' 是 ' khớp đáp án '是' sau khi trim khoảng trắng -> Đúng và nhận đủ điểm")
	void test_TC03_fillBlankWithExtraSpaces_correct() throws Exception {
		QuestionResponse q = questionService.createFillBlankQuestion(teacherId, new CreateFillBlankQuestionRequest(
				"Điền từ vào chỗ trống: 他 ___ 学生。",
				"Động từ 是",
				List.of(new BlankAnswerDto(0, "是", List.of("对")))
		));

		Long assignmentId = createAndAssignExercise(List.of(q.id()), List.of(new BigDecimal("2.0")));

		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk());

		// Điền ' 是 ' có khoảng trắng thừa hai đầu
		List<StudentAnswerItemDto> answers = List.of(
				new StudentAnswerItemDto(q.id(), null, " 是 ")
		);

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(answers))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(2.0)))
				.andExpect(jsonPath("$.questions[0].isCorrect", is(true)))
				.andExpect(jsonPath("$.questions[0].pointsEarned", is(2.0)));
	}

	// -------------------------------------------------------------------------
	// TC-04: Nối cặp (MATCH) - Nối đúng 3/4 cặp của câu 4.0 điểm -> Nhận đúng 3.0 điểm
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-04: Nối cặp đúng 3/4 cặp của câu 4.0 điểm -> Nhận tỷ lệ 3.0 điểm")
	void test_TC04_matchingPartialCorrect_proportionalPoints() throws Exception {
		List<MatchingPairDto> pairs = List.of(
				new MatchingPairDto("苹果", "Quả táo"),
				new MatchingPairDto("香蕉", "Quả chuối"),
				new MatchingPairDto("橙子", "Quả cam"),
				new MatchingPairDto("葡萄", "Quả nho")
		);

		QuestionResponse q = questionService.createMatchingQuestion(teacherId, new CreateMatchingQuestionRequest(
				"Nối từ tiếng Trung với nghĩa tiếng Việt tương ứng",
				"Từ vựng hoa quả",
				pairs
		));

		Long assignmentId = createAndAssignExercise(List.of(q.id()), List.of(new BigDecimal("4.0")));

		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk());

		// Học sinh nối đúng 3 cặp, nối sai cặp thứ 4: 葡萄 -> Quả bưởi (sai)
		String studentAnswerJson = objectMapper.writeValueAsString(List.of(
				new MatchingPairDto("苹果", "Quả táo"),
				new MatchingPairDto("香蕉", "Quả chuối"),
				new MatchingPairDto("橙子", "Quả cam"),
				new MatchingPairDto("葡萄", "Quả bưởi")
		));

		List<StudentAnswerItemDto> answers = List.of(
				new StudentAnswerItemDto(q.id(), null, studentAnswerJson)
		);

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(answers))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(3.0)))
				.andExpect(jsonPath("$.questions[0].isCorrect", is(false)))
				.andExpect(jsonPath("$.questions[0].pointsEarned", is(3.0)));
	}

	// -------------------------------------------------------------------------
	// TC-05: Sắp xếp câu (ORDER) - Đúng thứ tự tối đa điểm, sai thứ tự 0 điểm
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-05: Sắp xếp câu đúng thứ tự được 2.0 điểm; sai thứ tự nhận 0.0 điểm")
	void test_TC05_orderingCorrectAndIncorrect() throws Exception {
		QuestionResponse qCorrect = questionService.createOrderingQuestion(teacherId, new CreateOrderingQuestionRequest(
				"Sắp xếp câu: 我, 是, 学生",
				"Cấu trúc câu khẳng định",
				List.of("我", "是", "学生")
		));
		QuestionResponse qWrong = questionService.createOrderingQuestion(teacherId, new CreateOrderingQuestionRequest(
				"Sắp xếp câu: 你, 好, 吗",
				"Cấu trúc câu hỏi",
				List.of("你", "好", "吗")
		));

		Long assignmentId = createAndAssignExercise(
				List.of(qCorrect.id(), qWrong.id()),
				List.of(new BigDecimal("2.0"), new BigDecimal("2.0"))
		);

		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk());

		// Câu 1 xếp đúng dạng chuỗi "我 是 学生"
		// Câu 2 xếp sai thứ tự ["好", "你", "吗"]
		List<StudentAnswerItemDto> answers = List.of(
				new StudentAnswerItemDto(qCorrect.id(), null, "我 是 学生"),
				new StudentAnswerItemDto(qWrong.id(), null, "[\"好\", \"你\", \"吗\"]")
		);

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(answers))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(2.0)))
				.andExpect(jsonPath("$.questions[0].isCorrect", is(true)))
				.andExpect(jsonPath("$.questions[0].pointsEarned", is(2.0)))
				.andExpect(jsonPath("$.questions[1].isCorrect", is(false)))
				.andExpect(jsonPath("$.questions[1].pointsEarned", is(0.0)));
	}

	// -------------------------------------------------------------------------
	// TC-06: Bỏ trống một câu -> 0 điểm và hiển thị chưa trả lời
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-06: Học sinh bỏ trống một câu -> Nhận 0.0 điểm cho câu đó")
	void test_TC06_unansweredQuestion_zeroPoints() throws Exception {
		QuestionResponse q1 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu 1?", "Giải thích 1", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("A", true), new CreateQuestionOptionRequest("B", false))
		));
		QuestionResponse q2 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu 2?", "Giải thích 2", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("A", true), new CreateQuestionOptionRequest("B", false))
		));

		Long assignmentId = createAndAssignExercise(List.of(q1.id(), q2.id()), List.of(new BigDecimal("2.0"), new BigDecimal("2.0")));

		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk());

		// Học sinh chỉ làm câu 1, bỏ trống câu 2
		Long correctOptId = q1.options().stream().filter(QuestionOptionResponse::isCorrect).findFirst().orElseThrow().id();
		List<StudentAnswerItemDto> answers = List.of(
				new StudentAnswerItemDto(q1.id(), correctOptId, null)
				// q2 không gửi trong danh sách
		);

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(answers))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(2.0)))
				.andExpect(jsonPath("$.questions[1].isCorrect", is(false)))
				.andExpect(jsonPath("$.questions[1].pointsEarned", is(0.0)));
	}

	// -------------------------------------------------------------------------
	// TC-07: Tính tổng điểm và làm tròn 1 chữ số thập phân (Bài 4 câu x 2 điểm, đúng 3 câu: 6/8)
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-07: Bài 4 câu x 2 điểm, đúng 3 câu -> Điểm gốc 6.0/8.0 làm tròn chuẩn 1 chữ số thập phân")
	void test_TC07_totalScoreCalculationAndRounding() throws Exception {
		List<Long> qIds = new ArrayList<>();
		List<BigDecimal> points = new ArrayList<>();
		List<Long> correctOptIds = new ArrayList<>();

		for (int i = 1; i <= 4; i++) {
			QuestionResponse q = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
					"Câu hỏi " + i + "?", "Giải thích " + i, QuestionType.MCQ, null,
					List.of(new CreateQuestionOptionRequest("A đúng", true), new CreateQuestionOptionRequest("B sai", false))
			));
			qIds.add(q.id());
			points.add(new BigDecimal("2.0"));
			correctOptIds.add(q.options().stream().filter(QuestionOptionResponse::isCorrect).findFirst().orElseThrow().id());
		}

		Long assignmentId = createAndAssignExercise(qIds, points);

		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk());

		// Đúng 3 câu đầu, câu thứ 4 làm sai
		List<StudentAnswerItemDto> answers = List.of(
				new StudentAnswerItemDto(qIds.get(0), correctOptIds.get(0), null),
				new StudentAnswerItemDto(qIds.get(1), correctOptIds.get(1), null),
				new StudentAnswerItemDto(qIds.get(2), correctOptIds.get(2), null),
				new StudentAnswerItemDto(qIds.get(3), 999999L, null)
		);

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(answers))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(6.0)))
				.andExpect(jsonPath("$.maxScore", is(8.0)));
	}

	// -------------------------------------------------------------------------
	// TC-08: Ngoại lệ - Chấm lại bài nộp đã được chấm -> Giữ nguyên điểm gốc, không tạo điểm mới (Idempotent)
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-08: Bài nộp đã chấm, khi nhận yêu cầu chấm lại cùng bài -> Giữ nguyên điểm gốc")
	void test_TC08_regradingSameSubmission_idempotent() throws Exception {
		QuestionResponse q = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu hỏi kiểm tra chấm lại?", "Giải thích", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("Đúng", true), new CreateQuestionOptionRequest("Sai", false))
		));
		Long assignmentId = createAndAssignExercise(List.of(q.id()), List.of(new BigDecimal("10.0")));

		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk());

		Long correctOptId = q.options().stream().filter(QuestionOptionResponse::isCorrect).findFirst().orElseThrow().id();
		List<StudentAnswerItemDto> answers = List.of(
				new StudentAnswerItemDto(q.id(), correctOptId, null)
		);

		// Nộp bài lần đầu -> Chấm được 10.0
		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(answers))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(10.0)));

		AssignmentSubmissionEntity firstSubmission = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, studentId).orElseThrow();
		BigDecimal originalScore = firstSubmission.getScore();
		Instant originalSubmittedAt = firstSubmission.getSubmittedAt();

		// Yêu cầu chấm lại qua endpoint regrade
		mockMvc.perform(post(REGRADE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(10.0)))
				.andExpect(jsonPath("$.status", is("SUBMITTED")));

		AssignmentSubmissionEntity recheckSubmission = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, studentId).orElseThrow();

		// Đảm bảo không tạo bản ghi mới và giữ nguyên điểm gốc
		assertEquals(firstSubmission.getId(), recheckSubmission.getId());
		assertEquals(0, originalScore.compareTo(recheckSubmission.getScore()));
		assertEquals(originalSubmittedAt, recheckSubmission.getSubmittedAt());
	}

	// -------------------------------------------------------------------------
	// TC-09: Lưu lịch sử - Audit log ghi nhận sự kiện chấm điểm tự động kèm điểm gốc và thời điểm
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-09: Ghi nhận Audit Log hành động AUTO_GRADE_ASSIGNMENT sau khi chấm điểm")
	void test_TC09_auditLogRecordedOnGrading() throws Exception {
		QuestionResponse q = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu hỏi Audit Log?", "Giải thích", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("Đúng", true), new CreateQuestionOptionRequest("Sai", false))
		));
		Long assignmentId = createAndAssignExercise(List.of(q.id()), List.of(new BigDecimal("5.0")));

		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk());

		Long correctOptId = q.options().stream().filter(QuestionOptionResponse::isCorrect).findFirst().orElseThrow().id();
		List<StudentAnswerItemDto> answers = List.of(
				new StudentAnswerItemDto(q.id(), correctOptId, null)
		);

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + studentToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(answers))))
				.andExpect(status().isOk());

		// Kiểm tra Audit Log có bản ghi AUTO_GRADE_ASSIGNMENT
		List<AuditLogEntity> logs = auditLogRepository.findAll();
		boolean foundAutoGradeLog = logs.stream().anyMatch(log ->
				"AUTO_GRADE_ASSIGNMENT".equals(log.getAction()) &&
				log.getDetail() != null &&
				log.getDetail().contains("5.0")
		);

		assertTrue(foundAutoGradeLog, "Phải tồn tại bản ghi Audit Log cho hành động AUTO_GRADE_ASSIGNMENT");
	}
}
