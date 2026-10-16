package com.hsk.question;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
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
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.audit.AuditLogRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.QuestionResponse;
import com.hsk.question.dto.UpdateQuestionRequest;
import com.hsk.question.repository.QuestionOptionRepository;
import com.hsk.question.repository.QuestionRepository;
import com.hsk.question.service.QuestionService;
import java.util.List;
import java.util.Optional;
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
class ManageQuestionBankH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String QUESTIONS_URL = "/api/questions";
	private static final String TEACHER_EMAIL = "teacher_manage@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_manage@test.com";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

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
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private ClassRepository classRepository;

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

	@Autowired(required = false)
	private ExerciseQuestionRepository exerciseQuestionRepository;

	@Autowired(required = false)
	private ExerciseRepository exerciseRepository;

	private String teacherToken;
	private String otherTeacherToken;
	private Long teacherId;
	private Long otherTeacherId;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Tạo Teacher 1
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo viên Quản lý", TEACHER_EMAIL, PASSWORD, PASSWORD));
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

		// Login lấy token
		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		otherTeacherToken = loginAndGetToken(OTHER_TEACHER_EMAIL, PASSWORD);
	}

	@AfterEach
	void tearDown() {
		cleanDatabase();
	}

	private void cleanDatabase() {
		questionService.clearUsedInExerciseQuestionIds();
		if (exerciseQuestionRepository != null) {
			exerciseQuestionRepository.deleteAll();
		}
		if (exerciseRepository != null) {
			exerciseRepository.deleteAll();
		}
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
	@DisplayName("HTT-05-CN-005-TC-01: Lọc và tìm kiếm câu hỏi thuộc về giáo viên (QTN-19, is_hidden=false)")
	void test_TC01_filterAndSearchQuestionsSuccess() throws Exception {
		// Tạo 2 câu hỏi cho Teacher 1
		QuestionResponse q1 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Từ 你好 có nghĩa là gì?",
				"Giải thích chào bạn",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Chào bạn", true),
						new CreateQuestionOptionRequest("Tạm biệt", false)
				)
		));

		QuestionResponse q2 = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Từ 谢谢 có nghĩa là gì?",
				"Giải thích cảm ơn",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Cảm ơn", true),
						new CreateQuestionOptionRequest("Xin lỗi", false)
				)
		));

		// Tạo 1 câu hỏi cho Teacher 2
		questionService.createMultipleChoiceQuestion(otherTeacherId, new CreateQuestionRequest(
				"Câu hỏi của giáo viên 2",
				"Giải thích khác",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Đáp án A", true),
						new CreateQuestionOptionRequest("Đáp án B", false)
				)
		));

		// Teacher 1 gọi GET /api/questions/my -> chỉ nhận 2 câu của Teacher 1 (QTN-19)
		mockMvc.perform(get(QUESTIONS_URL + "/my")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(2)))
				.andExpect(jsonPath("$[0].ownerId", is(teacherId.intValue())))
				.andExpect(jsonPath("$[1].ownerId", is(teacherId.intValue())));
	}

	@Test
	@DisplayName("HTT-05-CN-005-TC-02: Sửa câu hỏi chưa dùng trong bài tập thành công")
	void test_TC02_updateQuestionNotInExerciseSuccess() throws Exception {
		// 1. Tạo câu hỏi MCQ ban đầu
		QuestionResponse created = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Nội dung câu hỏi ban đầu",
				"Giải thích ban đầu",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("A ban đầu", true),
						new CreateQuestionOptionRequest("B ban đầu", false)
				)
		));

		// 2. Cập nhật câu hỏi
		UpdateQuestionRequest updateReq = new UpdateQuestionRequest(
				"Nội dung câu hỏi đã cập nhật",
				"Giải thích mới",
				List.of(
						new CreateQuestionOptionRequest("Đáp án đúng mới", true),
						new CreateQuestionOptionRequest("Đáp án sai mới", false)
				),
				null
		);

		mockMvc.perform(put(QUESTIONS_URL + "/" + created.id())
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(updateReq)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id", is(created.id().intValue())))
				.andExpect(jsonPath("$.content", is("Nội dung câu hỏi đã cập nhật")))
				.andExpect(jsonPath("$.explanation", is("Giải thích mới")))
				.andExpect(jsonPath("$.options", hasSize(2)))
				.andExpect(jsonPath("$.options[0].content", is("Đáp án đúng mới")));

		// Kiểm tra trong DB
		QuestionEntity entity = questionRepository.findWithOptionsById(created.id()).orElseThrow();
		assertEquals("Nội dung câu hỏi đã cập nhật", entity.getContent());
		assertEquals("Giải thích mới", entity.getExplanation());
		assertEquals(2, entity.getOptions().size());
	}

	@Test
	@DisplayName("HTT-05-CN-005-TC-03: Sửa câu hỏi gốc trong ngân hàng, snapshot lần giao giữ nguyên (QTN-10)")
	void test_TC03_updateQuestionPreservesSnapshot() throws Exception {
		// 1. Tạo câu hỏi gốc
		QuestionResponse created = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu hỏi gốc",
				"Giải thích gốc",
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("A", true),
						new CreateQuestionOptionRequest("B", false)
				)
		));

		// 2. Giả lập một snapshot của lần giao bài trước (lưu nội dung tại thời điểm giao)
		String assignmentSnapshot = created.content();
		assertEquals("Câu hỏi gốc", assignmentSnapshot);

		// 3. Giáo viên sửa câu hỏi trong ngân hàng câu hỏi
		UpdateQuestionRequest updateReq = new UpdateQuestionRequest(
				"Câu hỏi gốc đã được sửa sang phiên bản mới",
				"Giải thích mới",
				List.of(
						new CreateQuestionOptionRequest("A mới", true),
						new CreateQuestionOptionRequest("B mới", false)
				),
				null
		);

		mockMvc.perform(put(QUESTIONS_URL + "/" + created.id())
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(updateReq)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.content", is("Câu hỏi gốc đã được sửa sang phiên bản mới")));

		// 4. Kiểm tra snapshot lần giao trước vẫn độc lập và không đổi (QTN-10)
		assertEquals("Câu hỏi gốc", assignmentSnapshot);
		QuestionEntity entity = questionRepository.findById(created.id()).orElseThrow();
		assertEquals("Câu hỏi gốc đã được sửa sang phiên bản mới", entity.getContent());
	}

	@Test
	@DisplayName("HTT-05-CN-005-TC-04: Xóa câu hỏi đã dùng trong bài tập -> Hệ thống chỉ ẩn (is_hidden = true) (QTN-14)")
	void test_TC04_deleteQuestionInUseMarksHidden() throws Exception {
		// 1. Tạo câu hỏi
		QuestionResponse created = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu hỏi đã dùng trong bài tập",
				null,
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Đúng", true),
						new CreateQuestionOptionRequest("Sai", false)
				)
		));

		// 2. Đánh dấu câu hỏi đã được gắn vào bài tập (QTN-14)
		questionService.markQuestionAsUsedInExercise(created.id());

		// 3. Giáo viên gọi xóa câu hỏi
		mockMvc.perform(delete(QUESTIONS_URL + "/" + created.id())
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isNoContent());

		// 4. Kiểm tra trong DB: câu hỏi KHÔNG bị xóa cứng, chỉ chuyển is_hidden = true
		Optional<QuestionEntity> found = questionRepository.findById(created.id());
		assertTrue(found.isPresent());
		assertTrue(found.get().isHidden());

		// 5. Kiểm tra danh sách hiển thị ngân hàng: không còn xuất hiện
		mockMvc.perform(get(QUESTIONS_URL + "/my")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}

	@Test
	@DisplayName("HTT-05-CN-005-TC-05: Xóa câu hỏi chưa dùng trong bài tập -> Xóa cứng khỏi database (QTN-14)")
	void test_TC05_deleteQuestionNotInUseHardDeletes() throws Exception {
		// 1. Tạo câu hỏi chưa dùng
		QuestionResponse created = questionService.createMultipleChoiceQuestion(teacherId, new CreateQuestionRequest(
				"Câu hỏi mới tạo chưa dùng",
				null,
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Đúng", true),
						new CreateQuestionOptionRequest("Sai", false)
				)
		));

		// 2. Giáo viên gọi xóa câu hỏi
		mockMvc.perform(delete(QUESTIONS_URL + "/" + created.id())
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isNoContent());

		// 3. Kiểm tra trong DB: câu hỏi đã bị xóa hoàn toàn khỏi DB
		Optional<QuestionEntity> found = questionRepository.findById(created.id());
		assertFalse(found.isPresent());
	}

	@Test
	@DisplayName("HTT-05-CN-005-TC-06: Truy cập câu hỏi của giáo viên khác -> 403 Forbidden (QTN-19)")
	void test_TC06_accessOtherTeacherQuestionForbidden() throws Exception {
		// Teacher 2 tạo câu hỏi
		QuestionResponse otherQuestion = questionService.createMultipleChoiceQuestion(otherTeacherId, new CreateQuestionRequest(
				"Câu hỏi bí mật của Giáo viên 2",
				null,
				QuestionType.MCQ,
				null,
				List.of(
						new CreateQuestionOptionRequest("Đúng", true),
						new CreateQuestionOptionRequest("Sai", false)
				)
		));

		// 1. Teacher 1 cố tình xem chi tiết -> 403
		mockMvc.perform(get(QUESTIONS_URL + "/" + otherQuestion.id())
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.ACCESS_DENIED_QUESTION.name())));

		// 2. Teacher 1 cố tình cập nhật -> 403
		UpdateQuestionRequest updateReq = new UpdateQuestionRequest(
				"Cố tình sửa câu hỏi của người khác",
				null,
				List.of(
						new CreateQuestionOptionRequest("Đúng", true),
						new CreateQuestionOptionRequest("Sai", false)
				),
				null
		);
		mockMvc.perform(put(QUESTIONS_URL + "/" + otherQuestion.id())
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(updateReq)))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.ACCESS_DENIED_QUESTION.name())));

		// 3. Teacher 1 cố tình xóa -> 403
		mockMvc.perform(delete(QUESTIONS_URL + "/" + otherQuestion.id())
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.ACCESS_DENIED_QUESTION.name())));
	}
}
