package com.hsk.learning;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
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
import com.hsk.account.repository.RoleRepository;
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
 * Integration tests for HTT-04-CN-001: Xem lộ trình HSK
 * Covers TC-01, TC-02, TC-03, TC-04 and QTN-02, QTN-14.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class RoadmapH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String STUDENT_EMAIL = "student_roadmap@test.com";
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

	private UserEntity studentUser;
	private String studentToken;
	private HskLevelEntity hsk1;
	private HskLevelEntity hsk2;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Register student
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh Minh", STUDENT_EMAIL, PASSWORD, PASSWORD));
		studentUser = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		studentToken = loginAndGetToken(STUDENT_EMAIL, PASSWORD);

		// Use existing or seed standard HSK levels for testing
		hsk1 = hskLevelRepository.findByCode("HSK_1").orElseGet(() ->
				hskLevelRepository.save(new HskLevelEntity("HSK_1", "HSK 1 - Nhập môn", 1, "Mô tả HSK 1", 150)));
		hsk2 = hskLevelRepository.findByCode("HSK_2").orElseGet(() ->
				hskLevelRepository.save(new HskLevelEntity("HSK_2", "HSK 2 - Sơ cấp", 2, "Mô tả HSK 2", 300)));
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
	@DisplayName("HTT-04-CN-001-TC-01: Hiển thị cấp độ và bài học theo đúng thứ tự kèm trạng thái hoàn thành")
	void testRoadmapOrderAndCompletionStatus_TC01() throws Exception {
		LessonEntity l1 = lessonRepository.save(new LessonEntity(hsk1, "Bài 1: Chào hỏi", "Desc 1", 1, null));
		LessonEntity l2 = lessonRepository.save(new LessonEntity(hsk1, "Bài 2: Cảm ơn", "Desc 2", 2, null));

		// Student completed Lesson 1
		lessonProgressRepository.save(new LessonProgressEntity(studentUser, l1));

		mockMvc.perform(get("/api/v1/roadmap")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.levels", hasSize(greaterThanOrEqualTo(2))))
				.andExpect(jsonPath("$.levels[0].code", is("HSK_1")))
				.andExpect(jsonPath("$.levels[0].lessons", hasSize(2)))
				.andExpect(jsonPath("$.levels[0].lessons[0].id", is(l1.getId().intValue())))
				.andExpect(jsonPath("$.levels[0].lessons[0].sortOrder", is(1)))
				.andExpect(jsonPath("$.levels[0].lessons[0].completed", is(true)))
				.andExpect(jsonPath("$.levels[0].lessons[1].id", is(l2.getId().intValue())))
				.andExpect(jsonPath("$.levels[0].lessons[1].sortOrder", is(2)))
				.andExpect(jsonPath("$.levels[0].lessons[1].completed", is(false)));
	}

	@Test
	@DisplayName("HTT-04-CN-001-TC-02: Cấp độ có 10 bài, học sinh hoàn thành 3 bài -> Tiến độ hiển thị 30%")
	void testProgressCalculation_TC02() throws Exception {
		LessonEntity completed1 = null;
		LessonEntity completed2 = null;
		LessonEntity completed3 = null;

		for (int i = 1; i <= 10; i++) {
			LessonEntity lesson = lessonRepository.save(
					new LessonEntity(hsk1, "Bài " + i, "Mô tả bài " + i, i, null));
			if (i == 1) completed1 = lesson;
			if (i == 2) completed2 = lesson;
			if (i == 3) completed3 = lesson;
		}

		// Mark 3 lessons as completed
		lessonProgressRepository.save(new LessonProgressEntity(studentUser, completed1));
		lessonProgressRepository.save(new LessonProgressEntity(studentUser, completed2));
		lessonProgressRepository.save(new LessonProgressEntity(studentUser, completed3));

		mockMvc.perform(get("/api/v1/roadmap")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.levels[0].totalLessons", is(10)))
				.andExpect(jsonPath("$.levels[0].completedLessons", is(3)))
				.andExpect(jsonPath("$.levels[0].progressPercent", is(30)))
				.andExpect(jsonPath("$.levels[0].available", is(true)));
	}

	@Test
	@DisplayName("HTT-04-CN-001-TC-03: Cấp độ và bài học đang ẩn không xuất hiện và không tính vào tiến độ")
	void testHiddenLevelAndHiddenLessonExcluded_TC03() throws Exception {
		// 1 visible lesson
		lessonRepository.save(new LessonEntity(hsk1, "Bài hiển thị", "Desc", 1, null));

		// 1 hidden lesson in HSK 1
		LessonEntity hiddenLesson = new LessonEntity(hsk1, "Bài ẩn HSK 1", "Desc Ẩn", 99, null);
		hiddenLesson.setHidden(true);
		lessonRepository.save(hiddenLesson);

		// 1 hidden level
		HskLevelEntity hiddenLevel = new HskLevelEntity("HSK_HIDDEN", "Cấp độ ẩn", 99, "Desc Ẩn", 100);
		hiddenLevel.setHidden(true);
		hskLevelRepository.save(hiddenLevel);

		mockMvc.perform(get("/api/v1/roadmap")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				// Only visible levels (HSK_HIDDEN is excluded)
				.andExpect(jsonPath("$.levels", hasSize(greaterThanOrEqualTo(2))))
				.andExpect(jsonPath("$.levels[*].code", not(hasItem("HSK_HIDDEN"))))
				.andExpect(jsonPath("$.levels[0].totalLessons", is(1)))
				.andExpect(jsonPath("$.levels[0].lessons", hasSize(1)))
				.andExpect(jsonPath("$.levels[0].lessons[0].title", is("Bài hiển thị")));
	}

	@Test
	@DisplayName("HTT-04-CN-001-TC-04: Cấp độ chưa có bài học nào -> Báo chưa khả dụng (available = false, progress = 0)")
	void testEmptyLevelShowsNotAvailable_TC04() throws Exception {
		// hsk2 currently has 0 lessons
		mockMvc.perform(get("/api/v1/roadmap")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.levels[1].code", is("HSK_2")))
				.andExpect(jsonPath("$.levels[1].totalLessons", is(0)))
				.andExpect(jsonPath("$.levels[1].completedLessons", is(0)))
				.andExpect(jsonPath("$.levels[1].progressPercent", is(0)))
				.andExpect(jsonPath("$.levels[1].available", is(false)))
				.andExpect(jsonPath("$.levels[1].lessons", hasSize(0)));
	}

	@Test
	@DisplayName("QTN-02: Chưa đăng nhập không thể truy cập lộ trình")
	void testUnauthorizedAccessBlocked() throws Exception {
		mockMvc.perform(get("/api/v1/roadmap"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@DisplayName("Đánh dấu hoàn thành bài học qua API")
	void testMarkLessonCompletedEndpoint() throws Exception {
		LessonEntity l1 = lessonRepository.save(new LessonEntity(hsk1, "Bài 1", "Desc", 1, null));

		mockMvc.perform(post("/api/v1/roadmap/lessons/" + l1.getId() + "/complete")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/v1/roadmap")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.levels[0].lessons[0].completed", is(true)))
				.andExpect(jsonPath("$.levels[0].completedLessons", is(1)));

		// Test unmark
		mockMvc.perform(delete("/api/v1/roadmap/lessons/" + l1.getId() + "/complete")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isNoContent());

		mockMvc.perform(get("/api/v1/roadmap")
						.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.levels[0].lessons[0].completed", is(false)))
				.andExpect(jsonPath("$.levels[0].completedLessons", is(0)));
	}
}
