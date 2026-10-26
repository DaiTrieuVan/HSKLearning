package com.hsk.learning;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
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
import com.hsk.common.audit.AuditLogRepository;
import com.hsk.account.repository.PasswordResetTokenRepository;
import com.hsk.account.repository.RoleRepository;
import com.hsk.account.repository.TeacherRequestRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseQuestionEntity;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.domain.ExerciseType;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.exercise.repository.ExerciseSectionRepository;
import com.hsk.learning.dto.ListeningAnswerItemDto;
import com.hsk.learning.dto.SubmitListeningPracticeRequest;
import com.hsk.learning.repository.DailyChallengeHistoryRepository;
import com.hsk.learning.repository.LessonProgressRepository;
import com.hsk.learning.repository.UserStreakRepository;
import com.hsk.learning.repository.UserXpTransactionRepository;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionOptionEntity;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.QuestionResponse;
import com.hsk.question.repository.QuestionOptionRepository;
import com.hsk.question.repository.QuestionRepository;
import com.hsk.question.service.QuestionService;
import java.math.BigDecimal;
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
 * Kiểm thử tích hợp tự động toàn diện cho User Story HTT-10-CN-001 (Luyện nghe hiểu).
 * Bao phủ các Acceptance Criteria:
 * - TC-01: Luồng thành công (3 câu hỏi nghe, nộp bài, chấm điểm và lưu kết quả).
 * - TC-02: Ngoại lệ audio (API xử lý ổn định, không ghi nhận submission lỗi).
 * - TC-03: Dữ liệu rỗng (Bài nghe thiếu audio tự động bị ẩn khỏi danh sách học sinh).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ListeningPracticeH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String LISTENING_PRACTICES_URL = "/api/listening-practices";

	private static final String TEACHER_EMAIL = "teacher_listening@test.com";
	private static final String STUDENT_EMAIL = "student_listening@test.com";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private AuditLogRepository auditLogRepository;

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
	private AssignmentRepository assignmentRepository;

	@Autowired
	private AssignmentSubmissionRepository assignmentSubmissionRepository;

	@Autowired
	private UserXpTransactionRepository userXpTransactionRepository;

	@Autowired
	private UserStreakRepository userStreakRepository;

	@Autowired
	private DailyChallengeHistoryRepository dailyChallengeHistoryRepository;

	@Autowired
	private LessonProgressRepository lessonProgressRepository;

	private String studentToken;
	private Long teacherId;
	private Long studentId;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Tạo Teacher
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo viên Luyện nghe", TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		teacherId = teacher.getId();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		// Tạo Student
		registrationService.registerStudent(
				new RegisterStudentRequest("Học sinh Luyện nghe", STUDENT_EMAIL, PASSWORD, PASSWORD));
		UserEntity student = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		studentId = student.getId();

		studentToken = loginAndGetToken(STUDENT_EMAIL, PASSWORD);
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
		exerciseSectionRepository.deleteAll();
		exerciseRepository.deleteAll();
		questionOptionRepository.deleteAll();
		questionRepository.deleteAll();
		userXpTransactionRepository.deleteAll();
		userStreakRepository.deleteAll();
		dailyChallengeHistoryRepository.deleteAll();
		lessonProgressRepository.deleteAll();
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
	@DisplayName("TC-01: Luồng thành công - Học sinh nghe audio, trả lời 3 câu hỏi và nộp bài, hệ thống chấm điểm và lưu kết quả")
	void tc01_listeningPracticeSuccessFlow_submit3QuestionsAndVerifyGrading() throws Exception {
		// 1. Tạo 3 câu hỏi nghe kèm audioUrl và transcript
		String audioUrl = "/uploads/audio/listening_hsk1_dialogue1.mp3";
		String transcript = "A: 你好！ B: 你好！很高兴认识你。";
		String pinyin = "A: Nǐ hǎo! B: Nǐ hǎo! Hěn gāoxìng rènshí nǐ.";

		QuestionResponse q1 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu 1: Đoạn hội thoại diễn ra trong ngữ cảnh nào?",
				"Chào hỏi lần đầu gặp mặt",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Chào hỏi", true),
						new CreateQuestionOptionRequest("Tạm biệt", false)
				),
				audioUrl,
				transcript,
				pinyin
		));

		QuestionResponse q2 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu 2: Người B cảm thấy thế nào khi gặp người A?",
				"很高兴 nghĩa là rất vui mừng",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Rất vui", true),
						new CreateQuestionOptionRequest("Buồn bã", false)
				),
				audioUrl,
				transcript,
				pinyin
		));

		QuestionResponse q3 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu 3: Từ '认识' trong đoạn hội thoại có nghĩa là gì?",
				"认识 (rènshí) là quen biết",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Quen biết", true),
						new CreateQuestionOptionRequest("Ăn uống", false)
				),
				audioUrl,
				transcript,
				pinyin
		));

		// 2. Tạo bài tập luyện nghe ExerciseType.LISTENING chứa 3 câu hỏi
		ExerciseEntity exercise = new ExerciseEntity();
		exercise.setOwnerId(teacherId);
		exercise.setTitle("Luyện nghe HSK 1 - Bài 1");
		exercise.setDescription("Đoạn hội thoại làm quen chào hỏi cơ bản");
		exercise.setStatus(ExerciseStatus.READY);
		exercise.setExerciseType(ExerciseType.LISTENING);
		exercise.setHskLevel(1);
		exercise.setTotalPoints(BigDecimal.valueOf(30));

		QuestionEntity entity1 = questionRepository.findById(q1.id()).orElseThrow();
		QuestionEntity entity2 = questionRepository.findById(q2.id()).orElseThrow();
		QuestionEntity entity3 = questionRepository.findById(q3.id()).orElseThrow();

		exercise.addQuestion(new ExerciseQuestionEntity(exercise, entity1, BigDecimal.valueOf(10), 1));
		exercise.addQuestion(new ExerciseQuestionEntity(exercise, entity2, BigDecimal.valueOf(10), 2));
		exercise.addQuestion(new ExerciseQuestionEntity(exercise, entity3, BigDecimal.valueOf(10), 3));

		ExerciseEntity savedExercise = exerciseRepository.save(exercise);

		// 3. Học sinh xem chi tiết bài nghe
		MvcResult detailResult = mockMvc.perform(get(LISTENING_PRACTICES_URL + "/" + savedExercise.getId())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id", is(savedExercise.getId().intValue())))
				.andExpect(jsonPath("$.title", is("Luyện nghe HSK 1 - Bài 1")))
				.andExpect(jsonPath("$.primaryAudioUrl", is(audioUrl)))
				.andExpect(jsonPath("$.transcript", is(transcript)))
				.andExpect(jsonPath("$.questions", hasSize(3)))
				.andExpect(jsonPath("$.questions[0].options[0].isCorrect").doesNotExist()) // Bảo mật đáp án trước khi nộp
				.andReturn();

		// 4. Lấy ID lựa chọn để nộp: Câu 1 đúng, Câu 2 đúng, Câu 3 chọn sai
		List<QuestionOptionEntity> opts1 = questionOptionRepository.findByQuestion_IdOrderBySortOrderAsc(q1.id());
		List<QuestionOptionEntity> opts2 = questionOptionRepository.findByQuestion_IdOrderBySortOrderAsc(q2.id());
		List<QuestionOptionEntity> opts3 = questionOptionRepository.findByQuestion_IdOrderBySortOrderAsc(q3.id());

		Long correctOpt1 = opts1.stream().filter(QuestionOptionEntity::isCorrect).findFirst().orElseThrow().getId();
		Long correctOpt2 = opts2.stream().filter(QuestionOptionEntity::isCorrect).findFirst().orElseThrow().getId();
		Long incorrectOpt3 = opts3.stream().filter(o -> !o.isCorrect()).findFirst().orElseThrow().getId();

		SubmitListeningPracticeRequest submitRequest = new SubmitListeningPracticeRequest(List.of(
				new ListeningAnswerItemDto(q1.id(), correctOpt1),
				new ListeningAnswerItemDto(q2.id(), correctOpt2),
				new ListeningAnswerItemDto(q3.id(), incorrectOpt3)
		));

		// 5. Học sinh nộp bài
		MvcResult submitResult = mockMvc.perform(post(LISTENING_PRACTICES_URL + "/" + savedExercise.getId() + "/submit")
						.header("Authorization", "Bearer " + studentToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(submitRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.exerciseId", is(savedExercise.getId().intValue())))
				.andExpect(jsonPath("$.totalQuestions", is(3)))
				.andExpect(jsonPath("$.correctAnswersCount", is(2)))
				.andExpect(jsonPath("$.earnedPoints", is(20.0)))
				.andExpect(jsonPath("$.totalPoints", is(30.0)))
				.andExpect(jsonPath("$.passed", is(true))) // 20/30 >= 60%
				.andExpect(jsonPath("$.transcript", is(transcript)))
				.andExpect(jsonPath("$.gradedQuestions", hasSize(3)))
				.andExpect(jsonPath("$.gradedQuestions[0].isCorrect", is(true)))
				.andExpect(jsonPath("$.gradedQuestions[1].isCorrect", is(true)))
				.andExpect(jsonPath("$.gradedQuestions[2].isCorrect", is(false)))
				.andReturn();

		// 6. Kiểm tra kết quả được lưu: Học sinh được cộng 20 XP vào lịch sử
		long xpCount = userXpTransactionRepository.count();
		assertTrue(xpCount >= 1, "Kết quả bài nghe phải được lưu và cộng XP cho học sinh");
	}

	@Test
	@DisplayName("TC-02: Ngoại lệ audio - API trả về thông tin audioUrl cấu hình mà không crash 500, không ghi nhận submission nếu chưa nộp")
	void tc02_listeningPracticeAudioError_fallbackWithoutCrashingOrErroneousSubmission() throws Exception {
		// Tạo câu hỏi với file audio hỏng / không tồn tại
		String brokenAudioUrl = "/uploads/audio/corrupted_or_missing_audio.mp3";

		QuestionResponse q = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu hỏi test audio lỗi",
				"Giải thích",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Đáp án A", true),
						new CreateQuestionOptionRequest("Đáp án B", false)
				),
				brokenAudioUrl,
				"Transcript mẫu",
				"Pinyin mẫu"
		));

		ExerciseEntity exercise = new ExerciseEntity();
		exercise.setOwnerId(teacherId);
		exercise.setTitle("Bài nghe có file audio lỗi");
		exercise.setStatus(ExerciseStatus.READY);
		exercise.setExerciseType(ExerciseType.LISTENING);
		exercise.setHskLevel(2);

		QuestionEntity entity = questionRepository.findById(q.id()).orElseThrow();
		exercise.addQuestion(new ExerciseQuestionEntity(exercise, entity, BigDecimal.TEN, 1));
		ExerciseEntity savedExercise = exerciseRepository.save(exercise);

		// Học sinh tải bài nghe -> API phản hồi bình thường 200 OK với primaryAudioUrl
		mockMvc.perform(get(LISTENING_PRACTICES_URL + "/" + savedExercise.getId())
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.primaryAudioUrl", is(brokenAudioUrl)));

		// Học sinh gặp lỗi audio và không nộp bài -> Đảm bảo không có transaction/submission nào bị lưu sai
		assertEquals(0, userXpTransactionRepository.count(), "Không được ghi nhận kết quả bài nghe khi audio bị lỗi và chưa nộp");
	}

	@Test
	@DisplayName("TC-03: Dữ liệu rỗng - Bài nghe thiếu audio tự động không hiển thị cho học sinh")
	void tc03_listeningPracticeMissingAudio_exerciseExcludedFromStudentListing() throws Exception {
		// 1. Tạo bài nghe CÓ audio hợp lệ
		QuestionResponse qWithAudio = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu hỏi có audio",
				"Giải thích",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Lựa chọn 1", true),
						new CreateQuestionOptionRequest("Lựa chọn 2", false)
				),
				"/uploads/audio/valid_clip.mp3",
				"Transcript",
				"Pinyin"
		));

		ExerciseEntity exerciseWithAudio = new ExerciseEntity();
		exerciseWithAudio.setOwnerId(teacherId);
		exerciseWithAudio.setTitle("Bài nghe HỢP LỆ (Có Audio)");
		exerciseWithAudio.setStatus(ExerciseStatus.READY);
		exerciseWithAudio.setExerciseType(ExerciseType.LISTENING);
		exerciseWithAudio.setHskLevel(3);

		QuestionEntity entityWithAudio = questionRepository.findById(qWithAudio.id()).orElseThrow();
		exerciseWithAudio.addQuestion(new ExerciseQuestionEntity(exerciseWithAudio, entityWithAudio, BigDecimal.TEN, 1));
		exerciseRepository.save(exerciseWithAudio);

		// 2. Tạo bài nghe KHÔNG CÓ audio (audioUrl = null)
		QuestionResponse qWithoutAudio = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu hỏi KHÔNG CÓ audio",
				"Giải thích",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Lựa chọn A", true),
						new CreateQuestionOptionRequest("Lựa chọn B", false)
				),
				null, // audioUrl null
				null,
				null
		));

		ExerciseEntity exerciseWithoutAudio = new ExerciseEntity();
		exerciseWithoutAudio.setOwnerId(teacherId);
		exerciseWithoutAudio.setTitle("Bài nghe THIẾU AUDIO (Không hợp lệ)");
		exerciseWithoutAudio.setStatus(ExerciseStatus.READY);
		exerciseWithoutAudio.setExerciseType(ExerciseType.LISTENING);
		exerciseWithoutAudio.setHskLevel(3);

		QuestionEntity entityWithoutAudio = questionRepository.findById(qWithoutAudio.id()).orElseThrow();
		exerciseWithoutAudio.addQuestion(new ExerciseQuestionEntity(exerciseWithoutAudio, entityWithoutAudio, BigDecimal.TEN, 1));
		exerciseRepository.save(exerciseWithoutAudio);

		// 3. Học sinh mở danh sách bài nghe
		MvcResult result = mockMvc.perform(get(LISTENING_PRACTICES_URL)
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1))) // Chỉ có 1 bài nghe hợp lệ
				.andExpect(jsonPath("$[0].title", is("Bài nghe HỢP LỆ (Có Audio)")))
				.andReturn();

		// 4. Lọc theo cấp độ HSK 3
		mockMvc.perform(get(LISTENING_PRACTICES_URL)
						.param("hskLevel", "3")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].title", is("Bài nghe HỢP LỆ (Có Audio)")));

		// 5. Lọc theo cấp độ HSK khác (HSK 5) -> Rỗng
		mockMvc.perform(get(LISTENING_PRACTICES_URL)
						.param("hskLevel", "5")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}
}
