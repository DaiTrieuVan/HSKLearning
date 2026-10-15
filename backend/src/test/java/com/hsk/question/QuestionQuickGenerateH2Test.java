package com.hsk.question;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
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
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.domain.VocabSetItemEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionFormat;
import com.hsk.question.dto.BatchCreateQuestionsRequest;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.QuickGeneratePreviewRequest;
import com.hsk.question.repository.QuestionOptionRepository;
import com.hsk.question.repository.QuestionRepository;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
class QuestionQuickGenerateH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String QUICK_GEN_PREVIEW_URL = "/api/questions/quick-generate/preview";
	private static final String BATCH_SAVE_URL = "/api/questions/batch";
	private static final String TEACHER_EMAIL = "teacher_quickgen@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_quickgen@test.com";
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
	private ClassRepository classRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private QuestionRepository questionRepository;

	@Autowired
	private QuestionOptionRepository questionOptionRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private HskLevelRepository hskLevelRepository;

	private UserEntity teacherUser;
	private String teacherToken;

	private UserEntity otherTeacherUser;
	private String otherTeacherToken;

	private HskLevelEntity hsk1;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Teacher registration & role
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo Viên Vương", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacherUser = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacherUser, teacherRole, null));

		// Other Teacher registration & role
		registrationService.registerStudent(
				new RegisterStudentRequest("Giáo Viên Lý", OTHER_TEACHER_EMAIL, PASSWORD, PASSWORD));
		otherTeacherUser = userRepository.findByEmailIgnoreCase(OTHER_TEACHER_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(otherTeacherUser, teacherRole, null));

		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		otherTeacherToken = loginAndGetToken(OTHER_TEACHER_EMAIL, PASSWORD);

		hsk1 = hskLevelRepository.findByCode("HSK_1").orElseGet(() ->
				hskLevelRepository.save(new HskLevelEntity("HSK_1", "HSK 1 - Nhập môn", 1, "Mô tả", 150)));
	}

	@AfterEach
	void tearDown() {
		questionOptionRepository.deleteAll();
		questionRepository.deleteAll();

		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		vocabularyRepository.deleteAll();

		auditLogRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String pwd) throws Exception {
		String body = "{\"email\":\"" + email + "\",\"password\":\"" + pwd + "\"}";
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.get("token").asText();
	}

	private VocabSetEntity createVocabSetWithWords(UserEntity owner, int wordCount) {
		VocabSetEntity set = vocabSetRepository.save(new VocabSetEntity(owner.getId(), "Bộ từ vựng HSK 1 - " + wordCount + " từ", "Mô tả"));

		String[] hanzis = {"你", "好", "我", "他", "她", "们", "不", "很", "是", "吗", "爱", "吃"};
		String[] pinyins = {"nǐ", "hǎo", "wǒ", "tā", "tā", "men", "bù", "hěn", "shì", "ma", "ài", "chī"};
		String[] meanings = {"Bạn", "Tốt", "Tôi", "Anh ấy", "Cô ấy", "Các bạn", "Không", "Rất", "Là", "Không (hỏi)", "Yêu", "Ăn"};

		for (int i = 0; i < wordCount && i < hanzis.length; i++) {
			VocabularyEntity vocab = vocabularyRepository.save(
					new VocabularyEntity(hanzis[i], pinyins[i], meanings[i], "word", null, null, null, null, hsk1, owner.getId()));
			vocabSetItemRepository.save(new VocabSetItemEntity(set, vocab, i + 1));
		}

		return set;
	}

	@Test
	@DisplayName("HTT-05-CN-004-TC-01: Sinh câu hỏi thành công từ bộ 10 từ (mỗi câu 4 lựa chọn, distractor không trùng đáp án)")
	void shouldGenerateQuestionsSuccessfullyFromTenWordSet() throws Exception {
		VocabSetEntity vocabSet = createVocabSetWithWords(teacherUser, 10);

		QuickGeneratePreviewRequest request = new QuickGeneratePreviewRequest(
				vocabSet.getId(),
				QuestionFormat.HANZI_TO_MEANING
		);

		MvcResult result = mockMvc.perform(post(QUICK_GEN_PREVIEW_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(10)))
				.andReturn();

		List<CreateQuestionRequest> drafts = objectMapper.readValue(
				result.getResponse().getContentAsString(),
				new TypeReference<List<CreateQuestionRequest>>() {}
		);

		for (CreateQuestionRequest draft : drafts) {
			assertNotNull(draft.content());
			assertTrue(draft.content().contains("có nghĩa là gì?"));
			assertEquals(4, draft.options().size());

			// Đúng 1 đáp án đúng
			long correctCount = draft.options().stream().filter(opt -> Boolean.TRUE.equals(opt.isCorrect())).count();
			assertEquals(1, correctCount);

			// Không có lựa chọn trùng nhau
			Set<String> uniqueOptions = new HashSet<>();
			for (CreateQuestionOptionRequest opt : draft.options()) {
				assertTrue(uniqueOptions.add(opt.content().trim().toLowerCase()), "Các lựa chọn không được trùng nhau");
			}
		}
	}

	@Test
	@DisplayName("HTT-05-CN-004-TC-02: Sinh 10 câu, giáo viên bỏ bớt 2 câu rồi lưu -> chỉ 8 câu được lưu vào ngân hàng")
	void shouldSaveOnlyRetainedQuestionsWhenTeacherRemovesSome() throws Exception {
		VocabSetEntity vocabSet = createVocabSetWithWords(teacherUser, 10);

		// 1. Preview 10 questions
		QuickGeneratePreviewRequest previewReq = new QuickGeneratePreviewRequest(
				vocabSet.getId(),
				QuestionFormat.HANZI_TO_MEANING
		);

		MvcResult previewResult = mockMvc.perform(post(QUICK_GEN_PREVIEW_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(previewReq)))
				.andExpect(status().isOk())
				.andReturn();

		List<CreateQuestionRequest> allDrafts = objectMapper.readValue(
				previewResult.getResponse().getContentAsString(),
				new TypeReference<List<CreateQuestionRequest>>() {}
		);
		assertEquals(10, allDrafts.size());

		// 2. Teacher keeps 8 questions, discards 2
		List<CreateQuestionRequest> retained = allDrafts.subList(0, 8);

		BatchCreateQuestionsRequest batchReq = new BatchCreateQuestionsRequest(retained);

		mockMvc.perform(post(BATCH_SAVE_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(batchReq)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$", hasSize(8)));

		// Verify database
		List<QuestionEntity> savedInDb = questionRepository.findByOwnerIdAndIsHiddenFalseOrderByCreatedAtDesc(teacherUser.getId());
		assertEquals(8, savedInDb.size());
	}

	@Test
	@DisplayName("HTT-05-CN-004-TC-03: Ngoại lệ - Bộ từ vựng có ít hơn 4 từ -> Báo cần ít nhất 4 từ")
	void shouldRejectWhenVocabSetHasFewerThanFourWords() throws Exception {
		VocabSetEntity vocabSet = createVocabSetWithWords(teacherUser, 3);

		QuickGeneratePreviewRequest request = new QuickGeneratePreviewRequest(
				vocabSet.getId(),
				QuestionFormat.HANZI_TO_MEANING
		);

		mockMvc.perform(post(QUICK_GEN_PREVIEW_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.VOCAB_SET_INSUFFICIENT_WORDS.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-004-TC-04: Dữ liệu rỗng - Bộ từ vựng chưa có từ nào -> Báo bộ từ không có từ")
	void shouldRejectWhenVocabSetIsEmpty() throws Exception {
		VocabSetEntity emptySet = vocabSetRepository.save(
				new VocabSetEntity(teacherUser.getId(), "Bộ từ vựng rỗng", "Chưa có từ nào"));

		QuickGeneratePreviewRequest request = new QuickGeneratePreviewRequest(
				emptySet.getId(),
				QuestionFormat.HANZI_TO_MEANING
		);

		mockMvc.perform(post(QUICK_GEN_PREVIEW_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.VOCAB_SET_EMPTY.name())));
	}

	@Test
	@DisplayName("HTT-05-CN-004-TC-05: Không có quyền - Bộ từ vựng thuộc giáo viên khác -> Bị từ chối (QTN-19)")
	void shouldRejectWhenAccessingVocabSetOfAnotherTeacher() throws Exception {
		// Bộ từ thuộc về Other Teacher
		VocabSetEntity otherSet = createVocabSetWithWords(otherTeacherUser, 5);

		// Teacher A cố tình gọi sinh câu hỏi từ bộ từ của Other Teacher
		QuickGeneratePreviewRequest request = new QuickGeneratePreviewRequest(
				otherSet.getId(),
				QuestionFormat.HANZI_TO_MEANING
		);

		mockMvc.perform(post(QUICK_GEN_PREVIEW_URL)
				.header("Authorization", "Bearer " + teacherToken)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is(ApiErrorCode.ACCESS_DENIED_VOCAB_SET.name())));
	}
}
