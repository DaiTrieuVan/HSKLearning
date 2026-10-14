package com.hsk.content;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.VocabularyRepository;

/**
 * Kiểm thử tự động cho Story HTT-04-CN-003: Nghe phát âm từ vựng
 * Phủ đủ các Test Cases: TC-01 (Có audio), TC-02 (Chưa có audio), TC-03 (Tệp không tồn tại/bị lỗi).
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class VocabularyAudioH2Test {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private HskLevelRepository levelRepository;

	private HskLevelEntity hsk1;
	private Path testAudioDir;
	private Path testAudioFile;

	@BeforeEach
	void setUp() throws Exception {
		hsk1 = levelRepository.findByCode("HSK_1").orElseGet(() -> {
			HskLevelEntity level = new HskLevelEntity("HSK_1", "HSK 1 - Nhập môn", 1, "Cấp độ cơ bản", 150);
			return levelRepository.save(level);
		});

		testAudioDir = Paths.get("uploads", "audio");
		if (!Files.exists(testAudioDir)) {
			Files.createDirectories(testAudioDir);
		}
		testAudioFile = testAudioDir.resolve("test_nihao.mp3");
		if (!Files.exists(testAudioFile)) {
			Files.write(testAudioFile, "dummy audio content".getBytes());
		}
	}

	@AfterEach
	void tearDown() throws Exception {
		if (testAudioFile != null && Files.exists(testAudioFile)) {
			Files.deleteIfExists(testAudioFile);
		}
	}

	@Test
	@DisplayName("TC-01: Lấy thông tin audio của từ vựng thành công khi từ có audio và tệp tồn tại")
	void testGetVocabularyAudio_Success() throws Exception {
		String ownerKey = VocabularyEntity.buildOwnerKey(null, "你好", "nǐ hǎo");
		VocabularyEntity vocab = vocabularyRepository.findByOwnerKey(ownerKey).orElseGet(() -> {
			return new VocabularyEntity(
					"你好",
					"nǐ hǎo",
					"Xin chào",
					"thán từ",
					null,
					"你好吗？",
					"Nǐ hǎo ma?",
					"Bạn khỏe không?",
					hsk1,
					null
			);
		});
		vocab.setAudioUrl("/uploads/audio/test_nihao.mp3");
		vocab = vocabularyRepository.save(vocab);

		mockMvc.perform(get("/api/v1/content/vocabularies/" + vocab.getId() + "/audio"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vocabularyId", is(vocab.getId().intValue())))
				.andExpect(jsonPath("$.hanzi", is("你好")))
				.andExpect(jsonPath("$.pinyin", is("nǐ hǎo")))
				.andExpect(jsonPath("$.audioUrl", is("/uploads/audio/test_nihao.mp3")));
	}

	@Test
	@DisplayName("TC-02: Báo lỗi AUDIO_NOT_FOUND (404) khi từ vựng chưa có audio")
	void testGetVocabularyAudio_NoAudio() throws Exception {
		String ownerKey = VocabularyEntity.buildOwnerKey(null, "谢谢", "xièxie");
		VocabularyEntity vocab = vocabularyRepository.findByOwnerKey(ownerKey).orElseGet(() -> {
			return new VocabularyEntity(
					"谢谢",
					"xièxie",
					"Cảm ơn",
					"động từ",
					null,
					null,
					null,
					null,
					hsk1,
					null
			);
		});
		vocab.setAudioUrl(null);
		vocab = vocabularyRepository.save(vocab);

		mockMvc.perform(get("/api/v1/content/vocabularies/" + vocab.getId() + "/audio"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.code", is("AUDIO_NOT_FOUND")))
				.andExpect(jsonPath("$.message", is("Từ vựng chưa có tệp âm thanh phát âm")));
	}

	@Test
	@DisplayName("TC-03: Báo lỗi AUDIO_FILE_NOT_FOUND (404) khi tệp âm thanh không tồn tại trên hệ thống")
	void testGetVocabularyAudio_FileNotFound() throws Exception {
		String ownerKey = VocabularyEntity.buildOwnerKey(null, "再见", "zàijiàn");
		VocabularyEntity vocab = vocabularyRepository.findByOwnerKey(ownerKey).orElseGet(() -> {
			return new VocabularyEntity(
					"再见",
					"zàijiàn",
					"Tạm biệt",
					"động từ",
					null,
					null,
					null,
					null,
					hsk1,
					null
			);
		});
		vocab.setAudioUrl("/uploads/audio/non_existent_audio_file.mp3");
		vocab = vocabularyRepository.save(vocab);

		mockMvc.perform(get("/api/v1/content/vocabularies/" + vocab.getId() + "/audio"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.code", is("AUDIO_FILE_NOT_FOUND")))
				.andExpect(jsonPath("$.message", is("Tệp âm thanh không tồn tại hoặc đã bị xóa")));
	}

	@Test
	@DisplayName("Ngoại lệ: Báo lỗi VOCABULARY_NOT_FOUND (404) khi từ vựng không tồn tại")
	void testGetVocabularyAudio_VocabNotFound() throws Exception {
		mockMvc.perform(get("/api/v1/content/vocabularies/999999/audio"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.code", is("VOCABULARY_NOT_FOUND")));
	}
}
