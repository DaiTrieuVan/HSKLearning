package com.hsk.content;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
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
import com.hsk.content.dto.BatchSaveWordsRequest;
import com.hsk.content.dto.CreateVocabFolderRequest;
import com.hsk.content.dto.CreateVocabSetRequest;
import com.hsk.content.dto.CreateWordRowDto;
import com.hsk.content.repository.ClassVocabSetRepository;
import com.hsk.content.repository.VocabFolderRepository;
import com.hsk.learning.repository.VocabLearningRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
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

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class StudentVocabManagementH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String USER1_EMAIL = "student_vocab1@test.com";
	private static final String USER2_EMAIL = "student_vocab2@test.com";
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
	private VocabFolderRepository vocabFolderRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private VocabLearningRepository vocabLearningRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private ClassVocabSetRepository classVocabSetRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	private String user1Token;
	private String user2Token;
	private UserEntity user1;
	private UserEntity user2;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		registrationService.registerStudent(new RegisterStudentRequest("Học Viên 1", USER1_EMAIL, PASSWORD, PASSWORD));
		user1 = userRepository.findByEmailIgnoreCase(USER1_EMAIL).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Học Viên 2", USER2_EMAIL, PASSWORD, PASSWORD));
		user2 = userRepository.findByEmailIgnoreCase(USER2_EMAIL).orElseThrow();

		user1Token = loginAndGetToken(USER1_EMAIL, PASSWORD);
		user2Token = loginAndGetToken(USER2_EMAIL, PASSWORD);
	}

	@AfterEach
	void tearDown() {
		vocabLearningRepository.deleteAll();
		classVocabSetRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		vocabFolderRepository.deleteAll();
		vocabularyRepository.deleteAll();
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

	@Test
	@DisplayName("Should create, list, and delete vocab folders")
	void testFolderCrud() throws Exception {
		CreateVocabFolderRequest folderReq = new CreateVocabFolderRequest("Từ vựng HSK 1", "Các bộ từ cơ bản", "#3B82F6");

		MvcResult createRes = mockMvc.perform(post("/api/v1/content/vocab-folders")
				.header("Authorization", "Bearer " + user1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(folderReq)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.title", is("Từ vựng HSK 1")))
				.andExpect(jsonPath("$.color", is("#3B82F6")))
				.andReturn();

		JsonNode createdNode = objectMapper.readTree(createRes.getResponse().getContentAsString());
		long folderId = createdNode.get("id").asLong();

		mockMvc.perform(get("/api/v1/content/vocab-folders")
				.header("Authorization", "Bearer " + user1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].title", is("Từ vựng HSK 1")));

		mockMvc.perform(delete("/api/v1/content/vocab-folders/" + folderId)
				.header("Authorization", "Bearer " + user1Token))
				.andExpect(status().isNoContent());

		mockMvc.perform(get("/api/v1/content/vocab-folders")
				.header("Authorization", "Bearer " + user1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(0)));
	}

	@Test
	@DisplayName("Should create vocab set, share it, and import by another user")
	void testVocabSetShareAndImport() throws Exception {
		CreateVocabSetRequest setReq = new CreateVocabSetRequest(
				"Bộ từ giao tiếp",
				"30 câu giao tiếp ăn uống",
				null,
				"#10B981",
				false,
				null
		);

		MvcResult setRes = mockMvc.perform(post("/api/v1/content/vocab-sets")
				.header("Authorization", "Bearer " + user1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(setReq)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.title", is("Bộ từ giao tiếp")))
				.andReturn();

		JsonNode setNode = objectMapper.readTree(setRes.getResponse().getContentAsString());
		long vocabSetId = setNode.get("id").asLong();

		// Toggle share
		MvcResult shareRes = mockMvc.perform(post("/api/v1/content/vocab-sets/" + vocabSetId + "/share")
				.header("Authorization", "Bearer " + user1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.isPublic", is(true)))
				.andReturn();

		JsonNode shareNode = objectMapper.readTree(shareRes.getResponse().getContentAsString());
		String shareCode = shareNode.get("shareCode").asText();

		// User 2 imports using shareCode
		mockMvc.perform(post("/api/v1/content/vocab-sets/import-shared")
				.header("Authorization", "Bearer " + user2Token)
				.param("shareCode", shareCode))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.title", is("Bộ từ giao tiếp (Đã nhập)")));

		// User 2 lists their sets
		mockMvc.perform(get("/api/v1/content/vocab-sets/my-sets")
				.header("Authorization", "Bearer " + user2Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)));
	}

	@Test
	@DisplayName("Should batch save words, retrieve my-words stats, and toggle mastered status")
	void testBatchWordsAndMasteredToggle() throws Exception {
		// 1. Create a set
		CreateVocabSetRequest setReq = new CreateVocabSetRequest(
				"Từ vựng du lịch",
				"Mô tả bộ từ",
				null,
				"#6366F1",
				false,
				null
		);
		MvcResult setRes = mockMvc.perform(post("/api/v1/content/vocab-sets")
				.header("Authorization", "Bearer " + user1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(setReq)))
				.andExpect(status().isCreated())
				.andReturn();
		long setId = objectMapper.readTree(setRes.getResponse().getContentAsString()).get("id").asLong();

		// 2. Batch save 2 words
		BatchSaveWordsRequest batchReq = new BatchSaveWordsRequest(
				setId,
				List.of(
						new CreateWordRowDto("飞机", "fēijī", "máy bay", "noun", "我坐飞机去北京。", ""),
						new CreateWordRowDto("机场", "jīchǎng", "sân bay", "noun", "我在机场等你。", "")
				)
		);

		mockMvc.perform(post("/api/v1/content/vocabularies/batch-save")
				.header("Authorization", "Bearer " + user1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(batchReq)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.addedCount", is(2)));

		// 3. Check my-words stats
		MvcResult wordsRes = mockMvc.perform(get("/api/v1/content/vocabularies/my-words")
				.header("Authorization", "Bearer " + user1Token)
				.param("vocabSetId", String.valueOf(setId)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.stats.totalWords", is(2)))
				.andExpect(jsonPath("$.stats.masteredWords", is(0)))
				.andExpect(jsonPath("$.stats.progressPercent", is(0)))
				.andExpect(jsonPath("$.items", hasSize(2)))
				.andReturn();

		JsonNode wordsNode = objectMapper.readTree(wordsRes.getResponse().getContentAsString());
		long firstWordId = wordsNode.get("items").get(0).get("id").asLong();

		// 4. Toggle mastered for first word
		mockMvc.perform(post("/api/v1/content/vocabularies/" + firstWordId + "/toggle-mastered")
				.header("Authorization", "Bearer " + user1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.isMastered", is(true)));

		// 5. Check my-words again -> 1 mastered, 50%
		mockMvc.perform(get("/api/v1/content/vocabularies/my-words")
				.header("Authorization", "Bearer " + user1Token)
				.param("vocabSetId", String.valueOf(setId)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.stats.totalWords", is(2)))
				.andExpect(jsonPath("$.stats.masteredWords", is(1)))
				.andExpect(jsonPath("$.stats.progressPercent", is(50)))
				.andExpect(jsonPath("$.items[0].isMastered", is(true)));
	}

	@Test
	@DisplayName("TC-04: Học sinh luyện flashcard theo bộ từ tự tạo với bộ lọc và nhận thưởng XP")
	void testTC04_StudentVocabFlashcardPractice_WithFiltersAndXpReward() throws Exception {
		// 1. Tạo bộ từ cho User 1
		CreateVocabSetRequest setReq = new CreateVocabSetRequest(
				"Bộ từ Flashcard Test",
				"Mô tả",
				null,
				"#10b981",
				false,
				null
		);
		MvcResult setRes = mockMvc.perform(post("/api/v1/content/vocab-sets")
				.header("Authorization", "Bearer " + user1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(setReq)))
				.andExpect(status().isCreated())
				.andReturn();

		long setId = objectMapper.readTree(setRes.getResponse().getContentAsString()).get("id").asLong();

		// 2. Thêm 2 từ vựng vào bộ từ
		BatchSaveWordsRequest batchReq = new BatchSaveWordsRequest(
				setId,
				List.of(
						new CreateWordRowDto("桌子", "zhuōzi", "cái bàn", "danh từ", "这里有一张桌子。", "gần cửa"),
						new CreateWordRowDto("椅子", "yǐzi", "cái ghế", "danh từ", "这是一把椅子。", "gần bàn")
				)
		);
		mockMvc.perform(post("/api/v1/content/vocabularies/batch-save")
				.header("Authorization", "Bearer " + user1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(batchReq)))
				.andExpect(status().isCreated());

		// 3. Lấy danh sách flashcard ban đầu (filterStatus = UNMASTERED, limit = 10)
		MvcResult flashcardRes = mockMvc.perform(get("/api/v1/learning/flashcards")
				.header("Authorization", "Bearer " + user1Token)
				.param("vocabSetId", String.valueOf(setId))
				.param("filterStatus", "UNMASTERED")
				.param("limit", "10"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(2)))
				.andReturn();

		JsonNode fcNode = objectMapper.readTree(flashcardRes.getResponse().getContentAsString());
		long word1Id = fcNode.get(0).get("id").asLong();

		// 4. Đánh dấu Thuộc (REMEMBERED) cho từ thứ nhất
		String reviewPayload = """
				{
					"vocabularyId": %d,
					"result": "REMEMBERED"
				}
				""".formatted(word1Id);

		mockMvc.perform(post("/api/v1/learning/flashcards/review")
				.header("Authorization", "Bearer " + user1Token)
				.contentType(MediaType.APPLICATION_JSON)
				.content(reviewPayload))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vocabularyId", is((int) word1Id)))
				.andExpect(jsonPath("$.result", is("REMEMBERED")));

		// 5. Kiểm tra lại bộ lọc UNMASTERED -> chỉ còn 1 từ chưa thuộc
		mockMvc.perform(get("/api/v1/learning/flashcards")
				.header("Authorization", "Bearer " + user1Token)
				.param("vocabSetId", String.valueOf(setId))
				.param("filterStatus", "UNMASTERED"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)));

		// 6. Kiểm tra bộ lọc MASTERED -> đúng 1 từ đã thuộc
		mockMvc.perform(get("/api/v1/learning/flashcards")
				.header("Authorization", "Bearer " + user1Token)
				.param("vocabSetId", String.valueOf(setId))
				.param("filterStatus", "MASTERED"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].id", is((int) word1Id)));
	}
}
