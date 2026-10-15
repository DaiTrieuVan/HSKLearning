package com.hsk.learning;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.PasswordResetTokenRepository;
import com.hsk.account.repository.TeacherRequestRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.LessonEntity;
import com.hsk.content.repository.GrammarExampleRepository;
import com.hsk.content.repository.GrammarPointRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.learning.domain.LessonProgressEntity;
import com.hsk.learning.repository.LessonProgressRepository;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
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
 * Integration tests for HTT-04-CN-004: Đánh dấu hoàn thành bài học
 * Covers TC-01, TC-02, TC-03, TC-04 and QTN-02.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class LessonCompletionH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String STUDENT_A_EMAIL = "student_a@test.com";
	private static final String STUDENT_B_EMAIL = "student_b@test.com";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private HskLevelRepository hskLevelRepository;

	@Autowired
	private LessonRepository lessonRepository;

	@Autowired
	private LessonProgressRepository lessonProgressRepository;

	@Autowired
	private LessonVocabularyRepository lessonVocabularyRepository;

	@Autowired
	private GrammarPointRepository grammarPointRepository;

	@Autowired
	private GrammarExampleRepository grammarExampleRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private ClassRepository classRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	private UserEntity studentA;
	private UserEntity studentB;
	private String tokenA;
	private String tokenB;
	private HskLevelEntity hsk1;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Register Student A
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh A", STUDENT_A_EMAIL, PASSWORD, PASSWORD));
		studentA = userRepository.findByEmailIgnoreCase(STUDENT_A_EMAIL).orElseThrow();
		tokenA = loginAndGetToken(STUDENT_A_EMAIL, PASSWORD);

		// Register Student B
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh B", STUDENT_B_EMAIL, PASSWORD, PASSWORD));
		studentB = userRepository.findByEmailIgnoreCase(STUDENT_B_EMAIL).orElseThrow();
		tokenB = loginAndGetToken(STUDENT_B_EMAIL, PASSWORD);

		// Prepare HSK 1 level
		hsk1 = hskLevelRepository.findByCode("HSK_1").orElseGet(() ->
				hskLevelRepository.save(new HskLevelEntity("HSK_1", "HSK 1 - Nhập môn", 1, "Mô tả HSK 1", 150)));
	}

	@AfterEach
	void tearDown() {
		lessonProgressRepository.deleteAll();
		grammarExampleRepository.deleteAll();
		grammarPointRepository.deleteAll();
		lessonVocabularyRepository.deleteAll();
		vocabularyRepository.deleteAll();
		lessonRepository.deleteAll();

		classJoinAttemptRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		String body = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
		MvcResult res = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode json = objectMapper.readTree(res.getResponse().getContentAsString(StandardCharsets.UTF_8));
		return json.get("token").asText();
	}

	@Test
	@DisplayName("HTT-04-CN-004-TC-01: Học sinh bấm hoàn thành bài học chưa hoàn thành -> Ghi nhận và cập nhật tiến độ cấp độ")
	void testMarkLessonCompleted_Success_TC01() throws Exception {
		// Tạo 2 bài học trong HSK 1
		LessonEntity l1 = lessonRepository.save(new LessonEntity(hsk1, "Bài 1: Chào hỏi", "Desc 1", 1, null));
		lessonRepository.save(new LessonEntity(hsk1, "Bài 2: Cảm ơn", "Desc 2", 2, null));

		// Bấm hoàn thành bài 1
		mockMvc.perform(post("/api/v1/roadmap/lessons/" + l1.getId() + "/complete")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.lessonId", is(l1.getId().intValue())))
				.andExpect(jsonPath("$.hskLevelId", is(hsk1.getId().intValue())))
				.andExpect(jsonPath("$.completed", is(true)))
				.andExpect(jsonPath("$.completedAt", notNullValue()))
				.andExpect(jsonPath("$.completedLessonsInLevel", is(1)))
				.andExpect(jsonPath("$.totalLessonsInLevel", is(2)))
				.andExpect(jsonPath("$.levelProgressPercent", is(50)));

		// Kiểm tra endpoint lấy trạng thái tiến độ bài học
		mockMvc.perform(get("/api/v1/roadmap/lessons/" + l1.getId() + "/progress")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completed", is(true)))
				.andExpect(jsonPath("$.levelProgressPercent", is(50)));
	}

	@Test
	@DisplayName("HTT-04-CN-004-TC-02: Bấm hoàn thành lần hai -> Idempotent, không tăng tiến độ lần thứ hai, giữ trạng thái")
	void testMarkLessonCompleted_Idempotent_TC02() throws Exception {
		LessonEntity l1 = lessonRepository.save(new LessonEntity(hsk1, "Bài 1: Chào hỏi", "Desc 1", 1, null));
		lessonRepository.save(new LessonEntity(hsk1, "Bài 2: Cảm ơn", "Desc 2", 2, null));

		// Lần 1: Hoàn thành bài 1
		MvcResult firstResult = mockMvc.perform(post("/api/v1/roadmap/lessons/" + l1.getId() + "/complete")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completed", is(true)))
				.andExpect(jsonPath("$.levelProgressPercent", is(50)))
				.andReturn();

		String firstResponse = firstResult.getResponse().getContentAsString(StandardCharsets.UTF_8);
		JsonNode firstJson = objectMapper.readTree(firstResponse);
		String firstCompletedAt = firstJson.get("completedAt").asText();

		// Lần 2: Bấm lại lần nữa
		mockMvc.perform(post("/api/v1/roadmap/lessons/" + l1.getId() + "/complete")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completed", is(true)))
				.andExpect(jsonPath("$.completedLessonsInLevel", is(1)))
				.andExpect(jsonPath("$.levelProgressPercent", is(50)))
				.andExpect(jsonPath("$.completedAt", is(firstCompletedAt)));

		// Đảm bảo trong database chỉ có đúng 1 bản ghi
		List<LessonProgressEntity> allProgress = lessonProgressRepository.findByIdUserId(studentA.getId());
		assertEquals(1, allProgress.size());
	}

	@Test
	@DisplayName("HTT-04-CN-004-TC-03 & QTN-02: Cô lập quyền tiến độ - Học sinh A hoàn thành bài không ảnh hưởng học sinh B")
	void testPermissionAndDataIsolation_TC03() throws Exception {
		LessonEntity l1 = lessonRepository.save(new LessonEntity(hsk1, "Bài 1: Chào hỏi", "Desc 1", 1, null));

		// Học sinh A bấm hoàn thành
		mockMvc.perform(post("/api/v1/roadmap/lessons/" + l1.getId() + "/complete")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completed", is(true)));

		// Kiểm tra học sinh B: Bài 1 của B vẫn chưa hoàn thành
		mockMvc.perform(get("/api/v1/roadmap/lessons/" + l1.getId() + "/progress")
						.header("Authorization", "Bearer " + tokenB))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.completed", is(false)))
				.andExpect(jsonPath("$.completedLessonsInLevel", is(0)));

		// Yêu cầu không có JWT Token -> 401 Unauthorized
		mockMvc.perform(post("/api/v1/roadmap/lessons/" + l1.getId() + "/complete"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@DisplayName("HTT-04-CN-004-TC-04: Lưu lịch sử hoàn thành bài học (user_id, lesson_id, completed_at)")
	void testSaveCompletionHistory_TC04() throws Exception {
		LessonEntity l1 = lessonRepository.save(new LessonEntity(hsk1, "Bài 1: Chào hỏi", "Desc 1", 1, null));

		Instant beforeCall = Instant.now().minusSeconds(2);

		mockMvc.perform(post("/api/v1/roadmap/lessons/" + l1.getId() + "/complete")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isOk());

		Instant afterCall = Instant.now().plusSeconds(2);

		// Kiểm tra bản ghi trong CSDL
		LessonProgressEntity progress = lessonProgressRepository
				.findByIdUserIdAndIdLessonId(studentA.getId(), l1.getId())
				.orElseThrow();

		assertEquals(studentA.getId(), progress.getUser().getId());
		assertEquals(l1.getId(), progress.getLesson().getId());
		assertNotNull(progress.getCompletedAt());
		assertTrue(progress.getCompletedAt().isAfter(beforeCall) || progress.getCompletedAt().equals(beforeCall));
		assertTrue(progress.getCompletedAt().isBefore(afterCall) || progress.getCompletedAt().equals(afterCall));
	}

	@Test
	@DisplayName("Edge Case: Bài học không tồn tại hoặc bị ẩn -> 404 NOT_FOUND")
	void testLessonNotFoundOrHidden() throws Exception {
		// Bài học không tồn tại (ID 999999)
		mockMvc.perform(post("/api/v1/roadmap/lessons/999999/complete")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isNotFound());

		// Bài học bị ẩn (is_hidden = true)
		LessonEntity hiddenLesson = lessonRepository.save(new LessonEntity(hsk1, "Bài nháp", "Desc", 99, null));
		hiddenLesson.setHidden(true);
		lessonRepository.save(hiddenLesson);

		mockMvc.perform(post("/api/v1/roadmap/lessons/" + hiddenLesson.getId() + "/complete")
						.header("Authorization", "Bearer " + tokenA))
				.andExpect(status().isNotFound());
	}
}
