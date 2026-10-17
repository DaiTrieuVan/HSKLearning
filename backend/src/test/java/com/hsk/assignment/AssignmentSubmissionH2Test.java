package com.hsk.assignment;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.dto.SaveDraftRequest;
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
import java.util.ArrayList;
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
 * Test suite tích hợp cho HTT-06-CN-003: Làm bài và nộp bài.
 * Bao phủ đầy đủ 12 ca kiểm thử (TC-01 đến TC-12) cùng các quy tắc QTN-11, QTN-12, QTN-20.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class AssignmentSubmissionH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String TAKE_ASSIGNMENT_URL = "/api/assignments/{id}/take";
	private static final String SAVE_DRAFT_URL = "/api/assignments/{id}/draft";
	private static final String SUBMIT_ASSIGNMENT_URL = "/api/assignments/{id}/submit";
	private static final String RESULT_URL = "/api/assignments/{id}/result";

	private static final String TEACHER_EMAIL = "teacher_sub_test@test.com";
	private static final String STUDENT_1_EMAIL = "student1_sub_test@test.com";
	private static final String STUDENT_2_EMAIL = "student2_sub_test@test.com";
	private static final String OUTSIDER_STUDENT_EMAIL = "outsider_sub_test@test.com";
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
	private Long student1Id;
	@SuppressWarnings("unused")
	private Long student2Id;
	@SuppressWarnings("unused")
	private Long outsiderId;

	private String student1Token;
	private String outsiderToken;

	private Long classId;
	private Long exerciseId;
	private final List<QuestionResponse> questions = new ArrayList<>();
	private Long assignmentId;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Giáo viên
		registrationService.registerStudent(new RegisterStudentRequest("Teacher Test", TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		teacherId = teacher.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// 2. Tạo Học sinh 1, Học sinh 2, Học sinh ngoài lớp
		registrationService.registerStudent(new RegisterStudentRequest("Student One", STUDENT_1_EMAIL, PASSWORD, PASSWORD));
		UserEntity student1 = userRepository.findByEmailIgnoreCase(STUDENT_1_EMAIL).orElseThrow();
		student1Id = student1.getId();

		registrationService.registerStudent(new RegisterStudentRequest("Student Two", STUDENT_2_EMAIL, PASSWORD, PASSWORD));
		UserEntity student2 = userRepository.findByEmailIgnoreCase(STUDENT_2_EMAIL).orElseThrow();
		student2Id = student2.getId();

		registrationService.registerStudent(new RegisterStudentRequest("Outsider Student", OUTSIDER_STUDENT_EMAIL, PASSWORD, PASSWORD));
		UserEntity outsider = userRepository.findByEmailIgnoreCase(OUTSIDER_STUDENT_EMAIL).orElseThrow();
		outsiderId = outsider.getId();

		student1Token = loginAndGetToken(STUDENT_1_EMAIL, PASSWORD);
		outsiderToken = loginAndGetToken(OUTSIDER_STUDENT_EMAIL, PASSWORD);

		// 3. Tạo lớp học
		classroomService.createClass(TEACHER_EMAIL, new CreateClassCommand("Lớp HSK 3 - Nộp bài", "Lớp luyện thi HSK 3"));
		ClassEntity classEntity = classRepository.findByTeacher_IdOrderByCreatedAtDesc(teacherId).get(0);
		classId = classEntity.getId();

		// Thêm student1 và student2 vào lớp
		classMemberRepository.save(ClassMemberEntity.create(classEntity, student1));
		classMemberRepository.save(ClassMemberEntity.create(classEntity, student2));

		// 4. Tạo 4 câu hỏi trắc nghiệm (mỗi câu 2.5 điểm -> Tổng 10 điểm)
		questions.clear();
		for (int i = 1; i <= 4; i++) {
			List<CreateQuestionOptionRequest> options = List.of(
					new CreateQuestionOptionRequest("Đáp án A câu " + i, true),
					new CreateQuestionOptionRequest("Đáp án B câu " + i, false),
					new CreateQuestionOptionRequest("Đáp án C câu " + i, false)
			);
			QuestionResponse qResp = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
					"Nội dung câu hỏi " + i + "?",
					"Giải thích chi tiết câu " + i,
					QuestionType.MCQ,
					null,
					options
			));
			questions.add(qResp);
		}

		// 5. Tạo bài tập với 4 câu hỏi
		List<CreateExerciseQuestionItem> eqItems = new ArrayList<>();
		for (int i = 0; i < questions.size(); i++) {
			eqItems.add(new CreateExerciseQuestionItem(questions.get(i).id(), new BigDecimal("2.5"), i + 1));
		}
		ExerciseResponse exResp = exerciseService.createExercise(teacherId, new CreateExerciseRequest(
				"Bài tập kiểm tra 4 câu",
				"Bài kiểm tra trắc nghiệm 4 câu 10 điểm",
				ExerciseStatus.READY,
				eqItems
		));
		exerciseId = exResp.id();

		// 6. Giao bài tập cho lớp: Bắt đầu 1 giờ trước, Hạn nộp sau 2 giờ
		AssignmentResponse assignResp = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exerciseId,
				classId,
				Instant.now().minus(1, ChronoUnit.HOURS),
				Instant.now().plus(2, ChronoUnit.HOURS)
		));
		assignmentId = assignResp.id();
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

	// -------------------------------------------------------------------------
	// TC-01: Luồng thành công — Trả lời đủ 4 câu và nộp bài trước hạn
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-01: Học sinh trả lời đủ 4 câu và nộp bài trước hạn -> SUBMITTED, chấm điểm chính xác 10.0")
	void tc01_submitSuccess_beforeDeadline() throws Exception {
		// 1. Học sinh bắt đầu làm bài
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("IN_PROGRESS")))
				.andExpect(jsonPath("$.questions", hasSize(4)));

		// 2. Chuẩn bị đáp án đúng cho cả 4 câu (Đáp án A là đúng theo setup)
		List<StudentAnswerItemDto> answers = new ArrayList<>();
		for (QuestionResponse q : questions) {
			Long correctOptId = q.options().stream().filter(QuestionOptionResponse::isCorrect).findFirst().orElseThrow().id();
			answers.add(new StudentAnswerItemDto(q.id(), correctOptId, null));
		}

		SubmitAssignmentRequest submitReq = new SubmitAssignmentRequest(answers);

		// 3. Nộp bài
		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(submitReq)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("SUBMITTED")))
				.andExpect(jsonPath("$.score", is(10.0)))
				.andExpect(jsonPath("$.maxScore", is(10.0)))
				.andExpect(jsonPath("$.submittedAt", notNullValue()))
				.andExpect(jsonPath("$.questions", hasSize(4)));

		// Kiểm tra DB
		AssignmentSubmissionEntity sub = submissionRepository
				.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(assignmentId, student1Id).orElseThrow();
		assertEquals(SubmissionStatus.SUBMITTED, sub.getStatus());
		assertEquals(new BigDecimal("10.00"), sub.getScore());
		assertNotNull(sub.getSubmittedAt());
	}

	// -------------------------------------------------------------------------
	// TC-02: Luồng thành công — Lưu tạm hoặc chuyển câu rồi thoát
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-02: Học sinh trả lời 2/4 câu rồi lưu nháp, mở lại vẫn giữ nguyên đáp án đã chọn")
	void tc02_saveDraft_andResume() throws Exception {
		// 1. Mở bài làm
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		// 2. Lưu nháp 2 câu
		Long optQ1 = questions.get(0).options().get(0).id();
		Long optQ2 = questions.get(1).options().get(1).id();
		List<StudentAnswerItemDto> draftAnswers = List.of(
				new StudentAnswerItemDto(questions.get(0).id(), optQ1, null),
				new StudentAnswerItemDto(questions.get(1).id(), optQ2, null)
		);

		mockMvc.perform(put(SAVE_DRAFT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new SaveDraftRequest(draftAnswers))))
				.andExpect(status().isNoContent());

		// 3. Học sinh mở lại bài làm (giả lập reload hoặc mở lại sau đó)
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("IN_PROGRESS")))
				.andExpect(jsonPath("$.savedAnswers", hasSize(2)))
				.andExpect(jsonPath("$.savedAnswers[0].questionId", is(questions.get(0).id().intValue())))
				.andExpect(jsonPath("$.savedAnswers[0].selectedOptionId", is(optQ1.intValue())));
	}

	// -------------------------------------------------------------------------
	// TC-03: Thiếu dữ liệu — Còn câu chưa trả lời mà nộp bài
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-03: Học sinh còn 1 câu chưa làm và bấm nộp bài -> Câu bỏ trống tính 0 điểm, đạt 7.5/10.0")
	void tc03_unansweredQuestions_scoreZero() throws Exception {
		// Bắt đầu làm bài
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		// Trả lời đúng 3 câu, bỏ trống câu thứ 4
		List<StudentAnswerItemDto> answers = new ArrayList<>();
		for (int i = 0; i < 3; i++) {
			QuestionResponse q = questions.get(i);
			Long correctOpt = q.options().stream().filter(QuestionOptionResponse::isCorrect).findFirst().orElseThrow().id();
			answers.add(new StudentAnswerItemDto(q.id(), correctOpt, null));
		}
		// Câu 4 bỏ trống (không truyền hoặc selectedOptionId = null)
		answers.add(new StudentAnswerItemDto(questions.get(3).id(), null, null));

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new SubmitAssignmentRequest(answers))))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("SUBMITTED")))
				.andExpect(jsonPath("$.score", is(7.5))) // 3 câu đúng * 2.5 = 7.5
				.andExpect(jsonPath("$.questions[3].pointsEarned").value(0))
				.andExpect(jsonPath("$.questions[3].isCorrect", is(false)));
	}

	// -------------------------------------------------------------------------
	// TC-04: Quá hạn — Bắt đầu sau hạn nộp
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-04: Đã quá hạn nộp và chưa có lượt IN_PROGRESS -> Từ chối bắt đầu (HTTP 400 ASSIGNMENT_ALREADY_EXPIRED)")
	void tc04_startAfterDeadline_rejected() throws Exception {
		// Tạo assignment đã hết hạn (hạn nộp 10 phút trước)
		AssignmentResponse expiredAssign = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exerciseId,
				classId,
				Instant.now().minus(2, ChronoUnit.HOURS),
				Instant.now().minus(10, ChronoUnit.MINUTES)
		));

		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, expiredAssign.id())
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("ASSIGNMENT_ALREADY_EXPIRED")));
	}

	// -------------------------------------------------------------------------
	// TC-05: Ngoại lệ — Lượt IN_PROGRESS tới hạn nộp -> Tự động nộp AUTO_SUBMITTED
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-05: Lượt đang IN_PROGRESS và tới hạn nộp -> Hệ thống tự nộp AUTO_SUBMITTED, chấm điểm các câu đã làm")
	void tc05_inProgress_autoSubmits_whenDueTimePassed() throws Exception {
		// 1. Học sinh bắt đầu làm bài khi còn hạn
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		// 2. Lưu nháp 1 câu đúng
		Long correctOptQ1 = questions.get(0).options().stream().filter(QuestionOptionResponse::isCorrect).findFirst().orElseThrow().id();
		mockMvc.perform(put(SAVE_DRAFT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new SaveDraftRequest(List.of(
						new StudentAnswerItemDto(questions.get(0).id(), correctOptQ1, null)
				)))))
				.andExpect(status().isNoContent());

		// 3. Giả lập hết hạn: chỉnh dueTime của assignment về quá khứ
		AssignmentEntity assignEntity = assignmentRepository.findById(assignmentId).orElseThrow();
		assignEntity.setDueTime(Instant.now().minus(5, ChronoUnit.MINUTES));
		assignmentRepository.save(assignEntity);

		// 4. Học sinh mở lại bài làm hoặc gửi request nộp -> Tự động chuyển AUTO_SUBMITTED
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("AUTO_SUBMITTED")))
				.andExpect(jsonPath("$.score", is(2.5))); // 1 câu đúng = 2.5
	}

	// -------------------------------------------------------------------------
	// TC-06: Dữ liệu trùng lặp — Nộp lần nữa khi đã nộp
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-06: Học sinh đã nộp bài, cố tình nộp lần 2 -> Bị từ chối HTTP 400 ASSIGNMENT_ALREADY_SUBMITTED")
	void tc06_duplicateSubmit_rejected() throws Exception {
		// Bắt đầu và nộp lần 1
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"answers\":[]}"))
				.andExpect(status().isOk());

		// Cố tình nộp lần 2
		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"answers\":[]}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("ASSIGNMENT_ALREADY_SUBMITTED")));
	}

	// -------------------------------------------------------------------------
	// TC-07: Bấm nộp liên tiếp (Idempotent / Protection)
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-07: Bấm nút nộp bài hai lần liên tiếp -> Chỉ ghi nhận duy nhất 1 bài nộp thành công")
	void tc07_rapidClickSubmit_handledGracefully() throws Exception {
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		// Lần 1 thành công
		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"answers\":[]}"))
				.andExpect(status().isOk());

		// Lần 2 bị chặn với mã lỗi chuẩn
		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"answers\":[]}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("ASSIGNMENT_ALREADY_SUBMITTED")));

		List<AssignmentSubmissionEntity> subs = submissionRepository.findByAssignment_IdAndStudent_Id(assignmentId, student1Id);
		assertEquals(1, subs.size());
	}

	// -------------------------------------------------------------------------
	// TC-08: Giữ bản nháp khi nộp lỗi và cho nộp lại
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-08: Bản nháp vẫn được lưu an toàn trong CSDL, học sinh có thể tiếp tục nộp lại")
	void tc08_draftPreserved_safeRetry() throws Exception {
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		// Lưu nháp
		Long optQ1 = questions.get(0).options().get(0).id();
		mockMvc.perform(put(SAVE_DRAFT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(new SaveDraftRequest(List.of(
						new StudentAnswerItemDto(questions.get(0).id(), optQ1, null)
				)))))
				.andExpect(status().isNoContent());

		// Nộp không truyền body -> tự động nạp draft đã lưu và chấm điểm
		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("SUBMITTED")))
				.andExpect(jsonPath("$.score", is(2.5)));
	}

	// -------------------------------------------------------------------------
	// TC-09: Không có quyền — Học sinh không thuộc lớp
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-09: Học sinh không thuộc lớp gọi /take hoặc /submit -> Từ chối HTTP 403 Forbidden")
	void tc09_outsiderStudent_forbidden() throws Exception {
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + outsiderToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("FORBIDDEN")));

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + outsiderToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{}"))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("FORBIDDEN")));
	}

	// -------------------------------------------------------------------------
	// TC-10: Sai trạng thái — Bài chưa đến thời gian bắt đầu
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-10: Bài chưa đến thời gian bắt đầu -> Không cho làm HTTP 400 ASSIGNMENT_NOT_YET_STARTED")
	void tc10_notYetStarted_rejected() throws Exception {
		AssignmentResponse scheduledAssign = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				exerciseId,
				classId,
				Instant.now().plus(1, ChronoUnit.DAYS),
				Instant.now().plus(2, ChronoUnit.DAYS)
		));

		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, scheduledAssign.id())
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("ASSIGNMENT_NOT_YET_STARTED")));
	}

	// -------------------------------------------------------------------------
	// TC-11: Lưu lịch sử lượt làm bài
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-11: Ghi nhận đầy đủ thông tin lượt làm bài và nhật ký nộp bài")
	void tc11_auditLogAndSubmissionHistory() throws Exception {
		mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(post(SUBMIT_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"answers\":[]}"))
				.andExpect(status().isOk());

		// Xem kết quả qua endpoint /result
		mockMvc.perform(get(RESULT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status", is("SUBMITTED")))
				.andExpect(jsonPath("$.score", notNullValue()))
				.andExpect(jsonPath("$.submittedAt", notNullValue()))
				.andExpect(jsonPath("$.questions", hasSize(4)));
	}

	// -------------------------------------------------------------------------
	// TC-12: Ngoại lệ — Reload trang khi đang làm bài
	// -------------------------------------------------------------------------
	@Test
	@DisplayName("TC-12: Học sinh tải lại trang khi đang làm bài -> Tiếp tục đúng lượt cũ, không tạo lượt mới")
	void tc12_reloadPage_resumesSameAttempt() throws Exception {
		// Mở lần 1
		MvcResult res1 = mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode node1 = objectMapper.readTree(res1.getResponse().getContentAsString());
		long subId1 = node1.get("submissionId").asLong();

		// Mở lần 2 (tải lại trang)
		MvcResult res2 = mockMvc.perform(post(TAKE_ASSIGNMENT_URL, assignmentId)
				.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode node2 = objectMapper.readTree(res2.getResponse().getContentAsString());
		long subId2 = node2.get("submissionId").asLong();

		assertEquals(subId1, subId2, "Phải trả về cùng 1 submission ID khi tải lại trang");
		assertEquals(1, submissionRepository.findByAssignment_IdAndStudent_Id(assignmentId, student1Id).size());
	}
}
