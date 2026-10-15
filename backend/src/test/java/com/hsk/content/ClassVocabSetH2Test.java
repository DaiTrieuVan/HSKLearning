package com.hsk.content;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
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
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.content.domain.ClassVocabSetEntity;
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.domain.VocabSetItemEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.ClassVocabSetRepository;
import com.hsk.content.repository.GrammarExampleRepository;
import com.hsk.content.repository.GrammarPointRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.learning.repository.LessonProgressRepository;
import com.hsk.learning.repository.VocabLearningRepository;

/**
 * Integration tests for HTT-04-CN-007: Xem bộ từ vựng của lớp (TC-01 -> TC-04).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ClassVocabSetH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String TEACHER_EMAIL = "teacher_class_vocab@test.com";
	private static final String STUDENT_ACTIVE_EMAIL = "student_active@test.com";
	private static final String STUDENT_OUTSIDER_EMAIL = "student_outsider@test.com";
	private static final String STUDENT_DROPPED_EMAIL = "student_dropped@test.com";
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

	@Autowired
	private LessonRepository lessonRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private LessonVocabularyRepository lessonVocabularyRepository;

	@Autowired
	private GrammarPointRepository grammarPointRepository;

	@Autowired
	private GrammarExampleRepository grammarExampleRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private ClassVocabSetRepository classVocabSetRepository;

	@Autowired
	private HskLevelRepository levelRepository;

	@Autowired
	private VocabLearningRepository vocabLearningRepository;

	@Autowired
	private LessonProgressRepository lessonProgressRepository;

	private UserEntity teacherUser;
	private String teacherToken;

	private UserEntity activeStudent;
	private String activeStudentToken;

	private UserEntity outsiderStudent;
	private String outsiderStudentToken;

	private UserEntity droppedStudent;
	private String droppedStudentToken;

	private ClassEntity classroomWithVocab;
	private ClassEntity emptyClassroom;
	private VocabSetEntity vocabSet;
	private VocabularyEntity vocabApple;
	private VocabularyEntity vocabBanana;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();
		seedHskLevelsIfMissing();

		HskLevelEntity hsk1 = levelRepository.findByCode("HSK_1").orElseThrow();

		// Teacher registration & role
		registrationService.registerStudent(
				new RegisterStudentRequest("Cô Vương", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacherUser = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacherUser, teacherRole, null));
		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);

		// Active student
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Viên Minh", STUDENT_ACTIVE_EMAIL, PASSWORD, PASSWORD));
		activeStudent = userRepository.findByEmailIgnoreCase(STUDENT_ACTIVE_EMAIL).orElseThrow();
		activeStudentToken = loginAndGetToken(STUDENT_ACTIVE_EMAIL, PASSWORD);

		// Outsider student
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Viên Ngoài Lớp", STUDENT_OUTSIDER_EMAIL, PASSWORD, PASSWORD));
		outsiderStudent = userRepository.findByEmailIgnoreCase(STUDENT_OUTSIDER_EMAIL).orElseThrow();
		outsiderStudentToken = loginAndGetToken(STUDENT_OUTSIDER_EMAIL, PASSWORD);

		// Dropped student
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Viên Bị Xóa", STUDENT_DROPPED_EMAIL, PASSWORD, PASSWORD));
		droppedStudent = userRepository.findByEmailIgnoreCase(STUDENT_DROPPED_EMAIL).orElseThrow();
		droppedStudentToken = loginAndGetToken(STUDENT_DROPPED_EMAIL, PASSWORD);

		// Create Classroom 1
		classroomWithVocab = ClassEntity.create(
				teacherUser,
				"Lớp Tiếng Trung HSK 1 - Khóa K10",
				"Lớp học từ vựng nền tảng HSK 1",
				"HSK10K"
		);
		classroomWithVocab = classRepository.save(classroomWithVocab);

		// Create Classroom 2 (Empty)
		emptyClassroom = ClassEntity.create(
				teacherUser,
				"Lớp Tiếng Trung HSK 2 - Khóa K11",
				"Lớp học chưa có bài tập hay bộ từ",
				"HSK11K"
		);
		emptyClassroom = classRepository.save(emptyClassroom);

		// Enroll active student into Classroom 1 and Classroom 2
		classMemberRepository.save(ClassMemberEntity.create(classroomWithVocab, activeStudent));
		classMemberRepository.save(ClassMemberEntity.create(emptyClassroom, activeStudent));

		// Enroll dropped student into Classroom 1 with status REMOVED
		ClassMemberEntity droppedMember = ClassMemberEntity.create(classroomWithVocab, droppedStudent);
		droppedMember.remove();
		classMemberRepository.save(droppedMember);

		// Create vocabularies
		vocabApple = vocabularyRepository.save(
				new VocabularyEntity("苹果", "píngguǒ", "Quả táo", "noun", null, "我喜欢吃苹果。", "Wǒ xǐhuan chī píngguǒ.", "Tôi thích ăn táo.", hsk1, teacherUser.getId())
		);
		vocabBanana = vocabularyRepository.save(
				new VocabularyEntity("香蕉", "xiāngjiāo", "Quả chuối", "noun", null, "这是一根香蕉。", "Zhè shì yī gēn xiāngjiāo.", "Đây là một quả chuối.", hsk1, teacherUser.getId())
		);

		// Create VocabSet
		vocabSet = vocabSetRepository.save(
				new VocabSetEntity(teacherUser.getId(), "Từ vựng Trái Cây Tuần 1", "Bộ từ vựng hoa quả giáo viên giao cho lớp")
		);

		// Add items to VocabSet
		vocabSetItemRepository.save(new VocabSetItemEntity(vocabSet, vocabApple, 1));
		vocabSetItemRepository.save(new VocabSetItemEntity(vocabSet, vocabBanana, 2));

		// Assign VocabSet to Classroom 1
		classVocabSetRepository.save(new ClassVocabSetEntity(classroomWithVocab, vocabSet));
	}

	@AfterEach
	void tearDown() {
		vocabLearningRepository.deleteAll();
		lessonProgressRepository.deleteAll();
		grammarExampleRepository.deleteAll();
		grammarPointRepository.deleteAll();
		classVocabSetRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
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

	private void seedHskLevelsIfMissing() {
		if (levelRepository.count() < 6) {
			levelRepository.deleteAll();
			levelRepository.saveAll(List.of(
					new HskLevelEntity("HSK_1", "HSK 1 - Nhập môn", 1, "Lộ trình cho người bắt đầu làm quen tiếng Trung và ngữ âm", 150),
					new HskLevelEntity("HSK_2", "HSK 2 - Sơ cấp cơ bản", 2, "Giao tiếp tình huống hàng ngày đơn giản", 300),
					new HskLevelEntity("HSK_3", "HSK 3 - Sơ trung cấp", 3, "Giao tiếp cơ bản trong công việc, học tập và du lịch", 600),
					new HskLevelEntity("HSK_4", "HSK 4 - Trung cấp", 4, "Thảo luận lưu loát về nhiều chủ đề đa dạng", 1200),
					new HskLevelEntity("HSK_5", "HSK 5 - Cao cấp", 5, "Đọc báo, xem phim và thuyết trình chuyên nghiệp", 2500),
					new HskLevelEntity("HSK_6", "HSK 6 - Tinh thông", 6, "Sử dụng tiếng Trung như người bản xứ", 5000)
			));
		}
	}

	private String loginAndGetToken(String email, String pwd) throws Exception {
		String body = "{\"email\":\"" + email + "\",\"password\":\"" + pwd + "\"}";
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString(StandardCharsets.UTF_8));
		return root.get("token").asText();
	}

	@Test
	@DisplayName("HTT-04-CN-007-TC-01: Học sinh là thành viên ACTIVE có thể xem bộ từ vựng và học bằng danh sách/flashcard")
	void testTC01_ActiveMember_CanViewAndLearnClassVocabSets() throws Exception {
		// 1. View class vocab sets
		mockMvc.perform(get("/api/v1/content/classes/" + classroomWithVocab.getId() + "/vocab-sets")
						.header("Authorization", "Bearer " + activeStudentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].title", is("Từ vựng Trái Cây Tuần 1")))
				.andExpect(jsonPath("$[0].itemCount", is(2)));

		// 2. View vocab set items (list learning)
		mockMvc.perform(get("/api/v1/content/vocab-sets/" + vocabSet.getId() + "/vocabularies")
						.header("Authorization", "Bearer " + activeStudentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(2)))
				.andExpect(jsonPath("$[0].hanzi", is("苹果")))
				.andExpect(jsonPath("$[0].pinyin", is("píngguǒ")))
				.andExpect(jsonPath("$[0].meaning", is("Quả táo")))
				.andExpect(jsonPath("$[1].hanzi", is("香蕉")))
				.andExpect(jsonPath("$[1].pinyin", is("xiāngjiāo")))
				.andExpect(jsonPath("$[1].meaning", is("Quả chuối")));

		// 3. Learn via flashcards
		mockMvc.perform(get("/api/v1/learning/flashcards")
						.param("vocabSetId", vocabSet.getId().toString())
						.header("Authorization", "Bearer " + activeStudentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(2)))
				.andExpect(jsonPath("$[0].hanzi", is("苹果")))
				.andExpect(jsonPath("$[1].hanzi", is("香蕉")));
	}

	@Test
	@DisplayName("HTT-04-CN-007-TC-02: Học sinh không thuộc lớp bị từ chối truy cập (403 Forbidden)")
	void testTC02_NonMember_CannotViewClassVocabSets() throws Exception {
		// 1. Attempt to view class vocab sets
		mockMvc.perform(get("/api/v1/content/classes/" + classroomWithVocab.getId() + "/vocab-sets")
						.header("Authorization", "Bearer " + outsiderStudentToken))
				.andExpect(status().isForbidden());

		// 2. Attempt to view vocab set items directly
		mockMvc.perform(get("/api/v1/content/vocab-sets/" + vocabSet.getId() + "/vocabularies")
						.header("Authorization", "Bearer " + outsiderStudentToken))
				.andExpect(status().isForbidden());

		// 3. Attempt to learn via flashcard
		mockMvc.perform(get("/api/v1/learning/flashcards")
						.param("vocabSetId", vocabSet.getId().toString())
						.header("Authorization", "Bearer " + outsiderStudentToken))
				.andExpect(status().isForbidden());
	}

	@Test
	@DisplayName("HTT-04-CN-007-TC-03: Lớp chưa có bộ từ vựng trả về danh sách rỗng")
	void testTC03_EmptyVocabSets_ReturnsEmptyList() throws Exception {
		mockMvc.perform(get("/api/v1/content/classes/" + emptyClassroom.getId() + "/vocab-sets")
						.header("Authorization", "Bearer " + activeStudentToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}

	@Test
	@DisplayName("HTT-04-CN-007-TC-04: Học sinh bị xóa/rời khỏi lớp bị từ chối truy cập (403 Forbidden)")
	void testTC04_RemovedStudent_CannotViewClassVocabSets() throws Exception {
		// 1. Attempt to view class vocab sets
		mockMvc.perform(get("/api/v1/content/classes/" + classroomWithVocab.getId() + "/vocab-sets")
						.header("Authorization", "Bearer " + droppedStudentToken))
				.andExpect(status().isForbidden());

		// 2. Attempt to view vocab set items
		mockMvc.perform(get("/api/v1/content/vocab-sets/" + vocabSet.getId() + "/vocabularies")
						.header("Authorization", "Bearer " + droppedStudentToken))
				.andExpect(status().isForbidden());

		// 3. Attempt to learn via flashcard
		mockMvc.perform(get("/api/v1/learning/flashcards")
						.param("vocabSetId", vocabSet.getId().toString())
						.header("Authorization", "Bearer " + droppedStudentToken))
				.andExpect(status().isForbidden());
	}
}
