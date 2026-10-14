package com.hsk.content;

import static org.hamcrest.Matchers.empty;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;

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
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.content.domain.GrammarExampleEntity;
import com.hsk.content.domain.GrammarPointEntity;
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.LessonEntity;
import com.hsk.content.domain.LessonVocabularyEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.GrammarPointRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabularyRepository;

/**
 * Kiểm thử cho Story HTT-04-CN-002: Học bài
 * Phủ đủ 4 Test Cases: TC-01, TC-02, TC-03, TC-04 (QTN-14).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class LessonStudyH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String STUDENT_EMAIL = "student_study@test.com";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private HskLevelRepository levelRepository;

	@Autowired
	private LessonRepository lessonRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private LessonVocabularyRepository lessonVocabularyRepository;

	@Autowired
	private GrammarPointRepository grammarPointRepository;

	private final ObjectMapper objectMapper = new ObjectMapper();

	private String studentToken;
	private HskLevelEntity hsk1;

	@BeforeEach
	void setUp() throws Exception {
		// Tạo học sinh và lấy JWT token
		if (userRepository.findByEmail(STUDENT_EMAIL).isEmpty()) {
			registrationService.registerStudent(new RegisterStudentRequest("Học sinh kiểm thử", STUDENT_EMAIL, PASSWORD, PASSWORD));
		}
		studentToken = obtainToken(STUDENT_EMAIL, PASSWORD);

		// Tạo HSK 1 level nếu chưa có
		hsk1 = levelRepository.findByLevelNumber(1).orElseGet(() -> {
			HskLevelEntity level = new HskLevelEntity("HSK1", "HSK Cấp độ 1", 1, "Cấp độ cơ bản", 150);
			return levelRepository.save(level);
		});
	}

	private String obtainToken(String email, String password) throws Exception {
		String body = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString());
		return node.get("token").asText();
	}

	@Test
	@DisplayName("HTT-04-CN-002-TC-01: Luồng thành công - Mở bài học hiển thị từ vựng, ngữ pháp, ví dụ")
	void testGetLessonStudy_SuccessWithVocabAndGrammar() throws Exception {
		// Given
		LessonEntity lesson = lessonRepository.save(new LessonEntity(hsk1, "Bài 1: Chào hỏi", "Bài học chào hỏi cơ bản", 1, null));

		VocabularyEntity v1 = vocabularyRepository.save(new VocabularyEntity("你好", "nǐ hǎo", "xin chào", "đại từ", null, "你好吗？", "Nǐ hǎo ma?", "Bạn khỏe không?", hsk1, null));
		VocabularyEntity v2 = vocabularyRepository.save(new VocabularyEntity("再见", "zàijiàn", "tạm biệt", "động từ", null, null, null, null, hsk1, null));

		lessonVocabularyRepository.save(new LessonVocabularyEntity(lesson, v1, 1));
		lessonVocabularyRepository.save(new LessonVocabularyEntity(lesson, v2, 2));

		GrammarPointEntity gp = new GrammarPointEntity(lesson, "Câu chào hỏi với 你好", "Chủ ngữ + 你好", "Dùng để chào hỏi thông thường", 1);
		gp.addExample(new GrammarExampleEntity("老师好", "lǎoshī hǎo", "Chào thầy/cô", 1));
		grammarPointRepository.save(gp);

		// When & Then
		mockMvc.perform(get("/api/v1/content/lessons/" + lesson.getId() + "/study")
				.header("Authorization", "Bearer " + studentToken)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id", is(lesson.getId().intValue())))
				.andExpect(jsonPath("$.title", is("Bài 1: Chào hỏi")))
				.andExpect(jsonPath("$.vocabularies", hasSize(2)))
				.andExpect(jsonPath("$.vocabularies[0].hanzi", is("你好")))
				.andExpect(jsonPath("$.vocabularies[0].pinyin", is("nǐ hǎo")))
				.andExpect(jsonPath("$.vocabularies[0].meaning", is("xin chào")))
				.andExpect(jsonPath("$.grammarPoints", hasSize(1)))
				.andExpect(jsonPath("$.grammarPoints[0].title", is("Câu chào hỏi với 你好")))
				.andExpect(jsonPath("$.grammarPoints[0].examples", hasSize(1)))
				.andExpect(jsonPath("$.grammarPoints[0].examples[0].hanzi", is("老师好")));
	}

	@Test
	@DisplayName("HTT-04-CN-002-TC-02: Luồng thành công - Chữ Hán và pinyin có dấu thanh hiển thị đúng chuẩn UTF-8")
	void testGetLessonStudy_PinyinTonesAndHanziUtf8Integrity() throws Exception {
		// Given
		LessonEntity lesson = lessonRepository.save(new LessonEntity(hsk1, "Bài 2: Cảm ơn và xin lỗi", "Kiểm tra dấu thanh", 2, null));

		VocabularyEntity v = vocabularyRepository.save(new VocabularyEntity("谢谢", "xièxie", "cảm ơn", "động từ", null, "不客气", "bù kèqi", "Đừng khách sáo", hsk1, null));
		lessonVocabularyRepository.save(new LessonVocabularyEntity(lesson, v, 1));

		// When & Then
		MvcResult result = mockMvc.perform(get("/api/v1/content/lessons/" + lesson.getId() + "/study")
				.header("Authorization", "Bearer " + studentToken)
				.characterEncoding(StandardCharsets.UTF_8.name())
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vocabularies[0].hanzi", is("谢谢")))
				.andExpect(jsonPath("$.vocabularies[0].pinyin", is("xièxie")))
				.andExpect(jsonPath("$.vocabularies[0].exampleSentence", is("不客气")))
				.andExpect(jsonPath("$.vocabularies[0].examplePinyin", is("bù kèqi")))
				.andReturn();

		String content = result.getResponse().getContentAsString(StandardCharsets.UTF_8);
		org.junit.jupiter.api.Assertions.assertTrue(content.contains("谢谢"));
		org.junit.jupiter.api.Assertions.assertTrue(content.contains("xièxie"));
	}

	@Test
	@DisplayName("HTT-04-CN-002-TC-03: Dữ liệu rỗng - Bài học chưa có phần ngữ pháp vẫn hiển thị tốt, grammar rỗng")
	void testGetLessonStudy_EmptyGrammarPoints() throws Exception {
		// Given - bài chỉ có từ vựng, không có ngữ pháp
		LessonEntity lesson = lessonRepository.save(new LessonEntity(hsk1, "Bài 3: Chỉ có từ vựng", "Không có ngữ pháp", 3, null));
		VocabularyEntity v = vocabularyRepository.save(new VocabularyEntity("水", "shuǐ", "nước", "danh từ", null, null, null, null, hsk1, null));
		lessonVocabularyRepository.save(new LessonVocabularyEntity(lesson, v, 1));

		// When & Then
		mockMvc.perform(get("/api/v1/content/lessons/" + lesson.getId() + "/study")
				.header("Authorization", "Bearer " + studentToken)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vocabularies", hasSize(1)))
				.andExpect(jsonPath("$.grammarPoints", is(empty())));
	}

	@Test
	@DisplayName("HTT-04-CN-002-TC-04: Sai trạng thái (QTN-14) - Bài học ẩn bị từ chối 404 với học sinh")
	void testGetLessonStudy_HiddenLessonReturns404ForStudent() throws Exception {
		// Given - bài học có is_hidden = true
		LessonEntity hiddenLesson = new LessonEntity(hsk1, "Bài ẩn nội bộ", "Bài đang biên soạn", 99, null);
		hiddenLesson.setHidden(true);
		LessonEntity saved = lessonRepository.save(hiddenLesson);

		// When & Then - học sinh gọi bài ẩn trực tiếp phải trả về 404 NOT_FOUND
		mockMvc.perform(get("/api/v1/content/lessons/" + saved.getId() + "/study")
				.header("Authorization", "Bearer " + studentToken)
				.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.code", is("LESSON_NOT_FOUND")));
	}
}
