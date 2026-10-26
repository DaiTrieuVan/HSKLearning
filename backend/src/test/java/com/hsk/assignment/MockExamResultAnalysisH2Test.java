package com.hsk.assignment;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
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
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.dto.StudentAnswerItemDto;
import com.hsk.assignment.dto.SubmissionResultResponse;
import com.hsk.assignment.dto.SubmitAssignmentRequest;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentStudentOverrideRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.assignment.service.AssignmentService;
import com.hsk.assignment.service.AssignmentSubmissionService;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.audit.AuditLogRepository;
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.LessonEntity;
import com.hsk.content.domain.LessonVocabularyEntity;
import com.hsk.content.domain.VocabularyEntity;
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
 * Bộ kiểm thử tự động toàn diện cho User Story HTT-09-CN-003: Xem kết quả và phân tích phần yếu.
 * Kiểm tra đầy đủ:
 * - TC-01: Điểm tổng, điểm và tỷ lệ đúng (%) theo từng phần (Nghe, Đọc) và kết quả Đạt/Chưa đạt.
 * - TC-02: Gợi ý các bài học liên quan đến nội dung của câu trả lời sai (sai về từ 谢谢 gợi ý Bài 2).
 * - TC-03: Trả lời đúng 100% câu -> Chúc mừng và không hiển thị gợi ý ôn tập.
 * - TC-04: Chưa hết hạn nộp đề -> Ẩn đáp án đúng và giải thích (chống gian lận), hiển thị phân tích điểm và gợi ý phần yếu.
 * - TC-05: Học sinh khác mở kết quả bài thi qua URL trực tiếp bị từ chối (403 Forbidden).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class MockExamResultAnalysisH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String SUBMISSION_RESULT_URL = "/api/assignments/{id}/result";
	private static final String SUBMISSION_BY_ID_URL = "/api/assignments/submissions/{submissionId}";

	private static final String TEACHER_EMAIL = "teacher_analysis@test.com";
	private static final String STUDENT_1_EMAIL = "student1_analysis@test.com";
	private static final String STUDENT_2_EMAIL = "student2_analysis@test.com";
	private static final String PASSWORD = "Password123@";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private ClassRepository classRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private QuestionService questionService;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private QuestionOptionRepository questionOptionRepository;

	@Autowired
	private ExerciseService exerciseService;

	@Autowired
	private ExerciseRepository exerciseRepository;

	@Autowired
	private ExerciseQuestionRepository exerciseQuestionRepository;

	@Autowired
	private ExerciseSectionRepository exerciseSectionRepository;

	@Autowired
	private AssignmentService assignmentService;

	@Autowired
	private AssignmentRepository assignmentRepository;

	@Autowired
	private AssignmentSubmissionService submissionService;

	@Autowired
	private AssignmentSubmissionRepository submissionRepository;

	@Autowired
	private AssignmentStudentOverrideRepository overrideRepository;

	@Autowired
	private HskLevelRepository hskLevelRepository;

	@Autowired
	private LessonRepository lessonRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private LessonVocabularyRepository lessonVocabularyRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private AuditLogRepository auditLogRepository;

	@Autowired
	private RegistrationService registrationService;

	private Long teacherId;
	private Long student1Id;
	private Long student2Id;
	private ClassEntity classroom;
	private LessonEntity lesson2;
	private VocabularyEntity vocabXiexie;

	private String student1Token;
	private String student2Token;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Giáo viên
		registrationService.registerStudent(new RegisterStudentRequest("Giáo viên Đề thi", TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		teacherId = teacher.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// 2. Tạo Học sinh 1
		registrationService.registerStudent(new RegisterStudentRequest("Học sinh 1", STUDENT_1_EMAIL, PASSWORD, PASSWORD));
		UserEntity student1 = userRepository.findByEmailIgnoreCase(STUDENT_1_EMAIL).orElseThrow();
		student1Id = student1.getId();

		// 3. Tạo Học sinh 2
		registrationService.registerStudent(new RegisterStudentRequest("Học sinh 2", STUDENT_2_EMAIL, PASSWORD, PASSWORD));
		UserEntity student2 = userRepository.findByEmailIgnoreCase(STUDENT_2_EMAIL).orElseThrow();
		student2Id = student2.getId();

		student1Token = loginAndGetToken(STUDENT_1_EMAIL, PASSWORD);
		student2Token = loginAndGetToken(STUDENT_2_EMAIL, PASSWORD);

		// 4. Tạo Lớp học
		classroom = ClassEntity.create(teacher, "Lớp Luyện thi HSK 1 Chuyên sâu", "Lớp thi thử", "ANL001");
		classRepository.save(classroom);

		// 5. Thêm student1 vào lớp
		classMemberRepository.save(ClassMemberEntity.create(classroom, student1));

		// 6. Tạo HskLevel, Lesson 2 và từ vựng 谢谢
		HskLevelEntity hsk1 = hskLevelRepository.findByLevelNumber(1).orElseGet(() -> {
			HskLevelEntity l = new HskLevelEntity("HSK1", "HSK Cấp độ 1", 1, "Mô tả", 150);
			return hskLevelRepository.save(l);
		});

		lesson2 = lessonRepository.findAll().stream()
				.filter(l -> l.getTitle() != null && l.getTitle().contains("Bài 2"))
				.findFirst()
				.orElseGet(() -> {
					LessonEntity l = new LessonEntity(hsk1, "Bài 2: Cảm ơn và tạm biệt", "Học từ vựng cảm ơn", 2, teacherId);
					return lessonRepository.save(l);
				});

		vocabXiexie = vocabularyRepository.findByOwnerKey("SHARED_谢谢_xièxie")
				.orElseGet(() -> {
					VocabularyEntity v = new VocabularyEntity("谢谢", "xièxie", "cảm ơn", "verb", null, null, null, null, hsk1, null);
					return vocabularyRepository.save(v);
				});

		if (lessonVocabularyRepository.findAllByLessonIdOrderBySortOrderAsc(lesson2.getId()).stream()
				.noneMatch(lv -> lv.getVocabulary().getId().equals(vocabXiexie.getId()))) {
			lessonVocabularyRepository.save(new LessonVocabularyEntity(lesson2, vocabXiexie, 1));
		}
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

	/**
	 * HTT-09-CN-003-TC-01: Luồng thành công — Hiển thị điểm tổng, điểm và tỷ lệ đúng (%) theo từng phần (Nghe 70%, Đọc 50%; tổng 60%) và kết quả Đạt hoặc Chưa đạt.
	 */
	@Test
	@DisplayName("TC-01: Hiển thị điểm tổng, điểm và tỷ lệ đúng từng phần (Nghe 70%, Đọc 50%; tổng 60%) và Đạt/Chưa đạt")
	void testTC01_SectionBreakdownAndPassStatus() throws Exception {
		// Tạo 2 câu hỏi cho Phần 1 (Nghe) - tổng 10 điểm
		// Câu 1 (7 điểm) đúng, Câu 2 (3 điểm) sai -> Phần Nghe được 7/10 điểm (70%)
		QuestionResponse qNghe1 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Phần Nghe: Câu 1 nghe hiểu", "Giải thích câu 1", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("A. Đúng", true), new CreateQuestionOptionRequest("B. Sai", false))
		));
		QuestionResponse qNghe2 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Phần Nghe: Câu 2 nghe hiểu", "Giải thích câu 2", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("A. Đúng", true), new CreateQuestionOptionRequest("B. Sai", false))
		));

		// Tạo 2 câu hỏi cho Phần 2 (Đọc) - tổng 10 điểm
		// Câu 3 (5 điểm) đúng, Câu 4 (5 điểm) sai -> Phần Đọc được 5/10 điểm (50%)
		QuestionResponse qDoc1 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Phần Đọc: Câu 1 đọc hiểu", "Giải thích câu 3", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("A. Đúng", true), new CreateQuestionOptionRequest("B. Sai", false))
		));
		QuestionResponse qDoc2 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Phần Đọc: Câu 2 đọc hiểu", "Giải thích câu 4", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("A. Đúng", true), new CreateQuestionOptionRequest("B. Sai", false))
		));

		// Tạo Đề thi thử HSK với 2 phần Nghe và Đọc, passingScore = 12.0 (tổng 20 điểm, 60% đạt)
		MockExamResponse mockExam = exerciseService.createMockExam(teacherId, new CreateMockExamRequest(
				"Đề thi thử HSK 1 - Chuẩn hoá",
				"Đề thi gồm 2 phần Nghe và Đọc",
				1,
				60,
				BigDecimal.valueOf(12.0),
				ExerciseStatus.READY,
				List.of(
						new CreateMockExamSectionItem("Phần 1: Nghe", 1, List.of(
								new CreateExerciseQuestionItem(qNghe1.id(), BigDecimal.valueOf(7.0), 1),
								new CreateExerciseQuestionItem(qNghe2.id(), BigDecimal.valueOf(3.0), 2)
						)),
						new CreateMockExamSectionItem("Phần 2: Đọc", 2, List.of(
								new CreateExerciseQuestionItem(qDoc1.id(), BigDecimal.valueOf(5.0), 1),
								new CreateExerciseQuestionItem(qDoc2.id(), BigDecimal.valueOf(5.0), 2)
						))
				)
		));

		// Giao đề thi thử cho lớp học
		AssignmentResponse assignment = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				mockExam.id(),
				classroom.getId(),
				Instant.now().minus(1, ChronoUnit.HOURS),
				Instant.now().plus(1, ChronoUnit.HOURS)
		));

		// Bắt đầu làm bài
		submissionService.takeAssignment(student1Id, assignment.id());

		// Lấy option đúng cho câu 1 và câu 3
		Long optNghe1Correct = qNghe1.options().stream().filter(o -> o.isCorrect()).findFirst().orElseThrow().id();
		Long optNghe2Wrong = qNghe2.options().stream().filter(o -> !o.isCorrect()).findFirst().orElseThrow().id();
		Long optDoc1Correct = qDoc1.options().stream().filter(o -> o.isCorrect()).findFirst().orElseThrow().id();
		Long optDoc2Wrong = qDoc2.options().stream().filter(o -> !o.isCorrect()).findFirst().orElseThrow().id();

		// Học sinh nộp bài: đúng câu 1 (7đ) và câu 3 (5đ) -> Tổng 12 điểm (60%)
		submissionService.submitAssignment(student1Id, assignment.id(), new SubmitAssignmentRequest(List.of(
				new StudentAnswerItemDto(qNghe1.id(), optNghe1Correct, null),
				new StudentAnswerItemDto(qNghe2.id(), optNghe2Wrong, null),
				new StudentAnswerItemDto(qDoc1.id(), optDoc1Correct, null),
				new StudentAnswerItemDto(qDoc2.id(), optDoc2Wrong, null)
		)));

		// Xem kết quả bài thi qua API
		mockMvc.perform(get(SUBMISSION_RESULT_URL, assignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(12.0)))
				.andExpect(jsonPath("$.maxScore", is(20.0)))
				.andExpect(jsonPath("$.isMockExam", is(true)))
				.andExpect(jsonPath("$.passingScore", is(12.0)))
				.andExpect(jsonPath("$.isPassed", is(true)))
				.andExpect(jsonPath("$.sectionResults", hasSize(2)))
				// Kiểm tra Phần 1: Nghe đạt 70%
				.andExpect(jsonPath("$.sectionResults[0].sectionName", is("Phần 1: Nghe")))
				.andExpect(jsonPath("$.sectionResults[0].score", is(7.0)))
				.andExpect(jsonPath("$.sectionResults[0].maxScore", is(10.0)))
				.andExpect(jsonPath("$.sectionResults[0].percentage", is(70)))
				.andExpect(jsonPath("$.sectionResults[0].correctCount", is(1)))
				.andExpect(jsonPath("$.sectionResults[0].totalQuestions", is(2)))
				// Kiểm tra Phần 2: Đọc đạt 50%
				.andExpect(jsonPath("$.sectionResults[1].sectionName", is("Phần 2: Đọc")))
				.andExpect(jsonPath("$.sectionResults[1].score", is(5.0)))
				.andExpect(jsonPath("$.sectionResults[1].maxScore", is(10.0)))
				.andExpect(jsonPath("$.sectionResults[1].percentage", is(50)))
				.andExpect(jsonPath("$.sectionResults[1].correctCount", is(1)))
				.andExpect(jsonPath("$.sectionResults[1].totalQuestions", is(2)));
	}

	/**
	 * HTT-09-CN-003-TC-02: Luồng thành công — Học sinh có câu trả lời sai về từ 谢谢 -> Gợi ý Bài 2.
	 */
	@Test
	@DisplayName("TC-02: Học sinh sai câu hỏi về từ '谢谢' -> Hệ thống gợi ý 'Bài 2: Cảm ơn và tạm biệt'")
	void testTC02_RecommendLessonForWrongVocabulary() throws Exception {
		// Tạo câu hỏi liên quan đến từ vựng 谢谢
		QuestionResponse qXiexie = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Từ '谢谢' (xièxie) trong tiếng Trung có nghĩa là gì?", "Từ 谢谢 có nghĩa là cảm ơn", QuestionType.MCQ, null,
				List.of(
						new CreateQuestionOptionRequest("Cảm ơn", true),
						new CreateQuestionOptionRequest("Tạm biệt", false)
				)
		));

		MockExamResponse mockExam = exerciseService.createMockExam(teacherId, new CreateMockExamRequest(
				"Đề thi thử từ vựng", "Kiểm tra từ vựng", 1, 30, BigDecimal.valueOf(5.0), ExerciseStatus.READY,
				List.of(new CreateMockExamSectionItem("Phần Từ vựng", 1, List.of(
						new CreateExerciseQuestionItem(qXiexie.id(), BigDecimal.valueOf(10.0), 1)
				)))
		));

		AssignmentResponse assignment = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				mockExam.id(), classroom.getId(), Instant.now().minus(1, ChronoUnit.HOURS), Instant.now().plus(1, ChronoUnit.HOURS)
		));

		submissionService.takeAssignment(student1Id, assignment.id());

		// Học sinh chọn đáp án sai ("Tạm biệt")
		Long wrongOptId = qXiexie.options().stream().filter(o -> !o.isCorrect()).findFirst().orElseThrow().id();
		submissionService.submitAssignment(student1Id, assignment.id(), new SubmitAssignmentRequest(List.of(
				new StudentAnswerItemDto(qXiexie.id(), wrongOptId, null)
		)));

		// Kiểm tra kết quả trả về có gợi ý Bài 2
		MvcResult result = mockMvc.perform(get(SUBMISSION_RESULT_URL, assignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(0.0)))
				.andExpect(jsonPath("$.recommendedLessons", hasSize(1)))
				.andExpect(jsonPath("$.recommendedLessons[0].lessonId", is(lesson2.getId().intValue())))
				.andExpect(jsonPath("$.recommendedLessons[0].lessonTitle", is(lesson2.getTitle())))
				.andExpect(jsonPath("$.recommendedLessons[0].relatedWords[0]", is("谢谢")))
				.andReturn();

		String content = result.getResponse().getContentAsString();
		assertTrue(content.contains("Bài 2"));
		assertTrue(content.contains("谢谢"));
	}

	/**
	 * HTT-09-CN-003-TC-03: Dữ liệu rỗng — Học sinh làm đúng 100% câu -> Hệ thống chúc mừng và không hiển thị gợi ý ôn tập.
	 */
	@Test
	@DisplayName("TC-03: Học sinh làm đúng 100% mọi câu hỏi -> recommendedLessons rỗng (không có gợi ý ôn tập)")
	void testTC03_FullScoreNoRecommendations() throws Exception {
		QuestionResponse q = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Từ '谢谢' nghĩa là gì?", "Giải thích", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("Cảm ơn", true), new CreateQuestionOptionRequest("Sai", false))
		));

		MockExamResponse mockExam = exerciseService.createMockExam(teacherId, new CreateMockExamRequest(
				"Đề thi thử hoàn hảo", "Đề thi thử", 1, 30, BigDecimal.valueOf(5.0), ExerciseStatus.READY,
				List.of(new CreateMockExamSectionItem("Phần 1", 1, List.of(
						new CreateExerciseQuestionItem(q.id(), BigDecimal.valueOf(10.0), 1)
				)))
		));

		AssignmentResponse assignment = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				mockExam.id(), classroom.getId(), Instant.now().minus(1, ChronoUnit.HOURS), Instant.now().plus(1, ChronoUnit.HOURS)
		));

		submissionService.takeAssignment(student1Id, assignment.id());

		// Chọn đáp án ĐÚNG 100%
		Long correctOptId = q.options().stream().filter(o -> o.isCorrect()).findFirst().orElseThrow().id();
		submissionService.submitAssignment(student1Id, assignment.id(), new SubmitAssignmentRequest(List.of(
				new StudentAnswerItemDto(q.id(), correctOptId, null)
		)));

		mockMvc.perform(get(SUBMISSION_RESULT_URL, assignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.score", is(10.0)))
				.andExpect(jsonPath("$.recommendedLessons", hasSize(0)));
	}

	/**
	 * HTT-09-CN-003-TC-04: Sai trạng thái — Chưa hết hạn nộp đề -> Đáp án đúng và giải thích bị ẩn (chống gian lận).
	 */
	@Test
	@DisplayName("TC-04: Chưa hết hạn nộp đề -> Ẩn đáp án đúng và giải thích chi tiết, vẫn trả về điểm và phân tích")
	void testTC04_HideSolutionsBeforeDueDate() throws Exception {
		QuestionResponse q = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Nội dung câu hỏi đề thi", "Lời giải chi tiết câu hỏi này", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("Đáp án đúng bí mật", true), new CreateQuestionOptionRequest("Đáp án sai", false))
		));

		MockExamResponse mockExam = exerciseService.createMockExam(teacherId, new CreateMockExamRequest(
				"Đề thi thử bảo mật", "Đề bảo mật", 1, 60, BigDecimal.valueOf(5.0), ExerciseStatus.READY,
				List.of(new CreateMockExamSectionItem("Phần Trắc nghiệm", 1, List.of(
						new CreateExerciseQuestionItem(q.id(), BigDecimal.valueOf(10.0), 1)
				)))
		));

		// Hạn nộp còn 1 ngày nữa trong tương lai
		AssignmentResponse assignment = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				mockExam.id(), classroom.getId(), Instant.now().minus(1, ChronoUnit.HOURS), Instant.now().plus(1, ChronoUnit.DAYS)
		));

		submissionService.takeAssignment(student1Id, assignment.id());

		Long wrongOptId = q.options().stream().filter(o -> !o.isCorrect()).findFirst().orElseThrow().id();
		submissionService.submitAssignment(student1Id, assignment.id(), new SubmitAssignmentRequest(List.of(
				new StudentAnswerItemDto(q.id(), wrongOptId, null)
		)));

		// Học sinh kiểm tra kết quả khi chưa hết hạn
		MvcResult result = mockMvc.perform(get(SUBMISSION_RESULT_URL, assignment.id())
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.showSolutions", is(false)))
				.andExpect(jsonPath("$.score", is(0.0)))
				.andExpect(jsonPath("$.sectionResults", hasSize(1)))
				.andExpect(jsonPath("$.questions[0].explanation").doesNotExist())
				.andReturn();

		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		JsonNode questionNode = root.get("questions").get(0);
		// Không được lộ lời giải bí mật
		assertNull(questionNode.get("explanation").textValue());
		// Các lựa chọn trong options phải có isCorrect = false để chống xem trộm source
		for (JsonNode opt : questionNode.get("options")) {
			assertFalse(opt.get("isCorrect").asBoolean());
		}
	}

	/**
	 * HTT-09-CN-003-TC-05: Không có quyền — Học sinh khác mở bài thi qua đường dẫn trực tiếp -> Từ chối (403 Forbidden theo QTN-02).
	 */
	@Test
	@DisplayName("TC-05: Học sinh khác mở bài thi của học sinh 1 -> Từ chối 403 Forbidden theo QTN-02")
	void testTC05_AccessDeniedForOtherStudent() throws Exception {
		QuestionResponse q = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu hỏi kiểm tra", "Lời giải", QuestionType.MCQ, null,
				List.of(new CreateQuestionOptionRequest("A", true), new CreateQuestionOptionRequest("B", false))
		));

		MockExamResponse mockExam = exerciseService.createMockExam(teacherId, new CreateMockExamRequest(
				"Đề thi riêng", "Đề", 1, 30, BigDecimal.valueOf(5.0), ExerciseStatus.READY,
				List.of(new CreateMockExamSectionItem("Phần 1", 1, List.of(
						new CreateExerciseQuestionItem(q.id(), BigDecimal.valueOf(10.0), 1)
				)))
		));

		AssignmentResponse assignment = assignmentService.assignExercise(teacherId, new AssignExerciseRequest(
				mockExam.id(), classroom.getId(), Instant.now().minus(1, ChronoUnit.HOURS), Instant.now().plus(1, ChronoUnit.HOURS)
		));

		submissionService.takeAssignment(student1Id, assignment.id());
		Long correctOptId = q.options().stream().filter(o -> o.isCorrect()).findFirst().orElseThrow().id();
		SubmissionResultResponse subRes = submissionService.submitAssignment(student1Id, assignment.id(), new SubmitAssignmentRequest(List.of(
				new StudentAnswerItemDto(q.id(), correctOptId, null)
		)));

		// Học sinh 2 (student2) mở bằng URL trực tiếp /api/assignments/submissions/{submissionId}
		mockMvc.perform(get(SUBMISSION_BY_ID_URL, subRes.submissionId())
						.header("Authorization", "Bearer " + student2Token))
				.andExpect(status().isForbidden());
	}
}
