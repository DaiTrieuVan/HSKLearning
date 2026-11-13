package com.hsk.aiassistant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.hsk.aiassistant.adapter.ConfiguredLearningAssistantProvider;
import com.hsk.aiassistant.dto.AiVocabAutofillItemDto;
import com.hsk.aiassistant.port.LearningAssistantProvider;
import com.hsk.aiassistant.service.AiVocabAssistantService;
import com.hsk.content.repository.VocabularyRepository;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class AiVocabAssistantServiceTest {

	private VocabularyRepository vocabularyRepository;
	private LearningAssistantProvider assistantProvider;
	private AiVocabAssistantService service;

	@BeforeEach
	void setUp() {
		vocabularyRepository = mock(VocabularyRepository.class);
		when(vocabularyRepository.findByHanziInAndHiddenFalse(any())).thenReturn(List.of());

		assistantProvider = new ConfiguredLearningAssistantProvider(
				"fake",
				"",
				"https://api.openai.com/v1",
				"gpt-4o-mini",
				20000
		);

		service = new AiVocabAssistantService(vocabularyRepository, assistantProvider);
	}

	@Test
	@DisplayName("Sinh từ vựng theo chủ đề Nhà hàng với số lượng 10 từ trả về đúng 10 từ chất lượng")
	void testGenerateVocabRestaurantTenWords() {
		List<AiVocabAutofillItemDto> result = service.generateVocabByTopic("Giao tiếp tại nhà hàng", 10);

		assertNotNull(result);
		assertEquals(10, result.size());
		for (AiVocabAutofillItemDto item : result) {
			assertNotNull(item.hanzi());
			assertFalse(item.hanzi().isBlank());
			assertNotNull(item.pinyin());
			assertFalse(item.pinyin().isBlank());
			assertNotNull(item.meaning());
			assertFalse(item.meaning().isBlank());
			assertNotNull(item.partOfSpeech());
			assertNotNull(item.exampleSentence());
			assertFalse(item.exampleSentence().isBlank());
		}
	}

	@Test
	@DisplayName("Sinh từ vựng với các mức số lượng 5, 15, 20 từ trả về chính xác số lượng yêu cầu")
	void testGenerateVocabVariousCounts() {
		List<AiVocabAutofillItemDto> fiveWords = service.generateVocabByTopic("Khách sạn & Du lịch", 5);
		assertEquals(5, fiveWords.size());

		List<AiVocabAutofillItemDto> fifteenWords = service.generateVocabByTopic("Sân bay & Di chuyển", 15);
		assertEquals(15, fifteenWords.size());

		List<AiVocabAutofillItemDto> twentyWords = service.generateVocabByTopic("Mua sắm & Trả giá", 20);
		assertEquals(20, twentyWords.size());
	}

	@Test
	@DisplayName("Sinh từ vựng fallback chuẩn xác từ Catalog khi AI Provider gặp ngoại lệ")
	void testGenerateVocabFallbackWhenProviderErrors() {
		LearningAssistantProvider failingProvider = mock(LearningAssistantProvider.class);
		when(failingProvider.answer(any(), any())).thenThrow(new RuntimeException("Simulated AI connection error"));

		AiVocabAssistantService fallbackService = new AiVocabAssistantService(vocabularyRepository, failingProvider);
		List<AiVocabAutofillItemDto> fallbackResult = fallbackService.generateVocabByTopic("Bệnh viện & Y tế", 10);

		assertNotNull(fallbackResult);
		assertEquals(10, fallbackResult.size());
		assertTrue(fallbackResult.stream().anyMatch(w -> w.hanzi().contains("医生") || w.meaning().contains("bác sĩ")));
	}

	@Test
	@DisplayName("Tự động điền dữ liệu từ vựng tra cứu từ catalog khi chưa có trong kho DB")
	void testAutofillVocabulariesFromCatalog() {
		List<AiVocabAutofillItemDto> autofilled = service.autofillVocabularies(List.of("服务员", "点菜"));

		assertNotNull(autofilled);
		assertEquals(2, autofilled.size());
		AiVocabAutofillItemDto fuwuyuan = autofilled.stream()
				.filter(it -> "服务员".equals(it.hanzi()))
				.findFirst()
				.orElseThrow();
		assertEquals("fúwùyuán", fuwuyuan.pinyin());
		assertTrue(fuwuyuan.meaning().contains("phục vụ"));
	}
}
