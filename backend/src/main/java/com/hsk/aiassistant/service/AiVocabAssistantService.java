package com.hsk.aiassistant.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.aiassistant.dto.AiVocabAutofillItemDto;
import com.hsk.aiassistant.port.AssistantAnswerResult;
import com.hsk.aiassistant.port.LearningAssistantProvider;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.VocabularyRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AiVocabAssistantService {

	private static final Logger log = LoggerFactory.getLogger(AiVocabAssistantService.class);

	private final VocabularyRepository vocabularyRepository;
	private final LearningAssistantProvider assistantProvider;
	private final ObjectMapper objectMapper;

	public AiVocabAssistantService(
			VocabularyRepository vocabularyRepository,
			LearningAssistantProvider assistantProvider
	) {
		this.vocabularyRepository = vocabularyRepository;
		this.assistantProvider = assistantProvider;
		this.objectMapper = new ObjectMapper();
	}

	public List<AiVocabAutofillItemDto> autofillVocabularies(List<String> words) {
		if (words == null || words.isEmpty()) {
			return List.of();
		}

		List<String> cleanWords = words.stream()
				.filter(w -> w != null && !w.trim().isEmpty())
				.map(String::trim)
				.distinct()
				.toList();

		if (cleanWords.isEmpty()) {
			return List.of();
		}

		// 1. Tra cứu trước trong kho từ vựng chuẩn cục bộ để đạt hiệu năng tối đa
		List<VocabularyEntity> localVocabs = vocabularyRepository.findByHanziInAndHiddenFalse(cleanWords);
		Map<String, VocabularyEntity> localMap = new HashMap<>();
		for (VocabularyEntity v : localVocabs) {
			localMap.putIfAbsent(v.getHanzi(), v);
		}

		List<AiVocabAutofillItemDto> result = new ArrayList<>();
		List<String> missingWords = new ArrayList<>();

		for (String word : cleanWords) {
			VocabularyEntity found = localMap.get(word);
			if (found != null) {
				result.add(new AiVocabAutofillItemDto(
						found.getHanzi(),
						found.getPinyin(),
						found.getMeaning(),
						found.getPartOfSpeech() != null ? found.getPartOfSpeech() : "noun",
						found.getExampleSentence(),
						found.getExamplePinyin(),
						found.getExampleMeaning()
				));
			} else {
				missingWords.add(word);
			}
		}

		// 2. Với các từ chưa có trong kho từ điển nội bộ, nhờ trợ lý AI phân tích và sinh dữ liệu
		if (!missingWords.isEmpty()) {
			try {
				String systemPrompt = """
					Bạn là trợ lý từ điển tiếng Trung thông minh.
					Nhiệm vụ: Với danh sách các từ/cụm từ tiếng Trung được cung cấp, hãy phân tích và trả về DUY NHẤT một mảng JSON (không bọc trong markdown code fence, không giải thích gì thêm) với các trường:
					[
					  {
					    "hanzi": "chữ Hán",
					    "pinyin": "phiên âm pinyin có dấu thanh điệu",
					    "meaning": "nghĩa tiếng Việt súc tích",
					    "partOfSpeech": "loại từ (noun/verb/adjective/adverb/...)",
					    "exampleSentence": "câu ví dụ tiếng Trung tự nhiên",
					    "examplePinyin": "phiên âm pinyin của câu ví dụ",
					    "exampleMeaning": "dịch nghĩa tiếng Việt của câu ví dụ"
					  }
					]
					""";
				String userQuestion = "Hãy phân tích danh sách từ vựng tiếng Trung sau: " + String.join(", ", missingWords);
				AssistantAnswerResult answer = assistantProvider.answer(systemPrompt, userQuestion);
				if (answer != null && answer.inScope() && answer.answer() != null && !answer.answer().isBlank()) {
					String rawJson = answer.answer().trim();
					if (rawJson.startsWith("```json")) {
						rawJson = rawJson.substring(7);
					} else if (rawJson.startsWith("```")) {
						rawJson = rawJson.substring(3);
					}
					if (rawJson.endsWith("```")) {
						rawJson = rawJson.substring(0, rawJson.length() - 3);
					}
					rawJson = rawJson.trim();

					List<AiVocabAutofillItemDto> aiItems = objectMapper.readValue(
							rawJson,
							new TypeReference<List<AiVocabAutofillItemDto>>() {}
					);
					result.addAll(aiItems);
				}
			} catch (Exception e) {
				log.warn("Lỗi khi gọi AI tự động điền từ vựng: {}", e.getMessage());
				// Fallback cơ bản nếu AI không khả dụng
				for (String w : missingWords) {
					result.add(new AiVocabAutofillItemDto(
							w,
							"",
							"",
							"noun",
							"",
							"",
							""
					));
				}
			}
		}

		return result;
	}

	public List<AiVocabAutofillItemDto> generateVocabByTopic(String topic, int count) {
		int safeCount = Math.max(1, Math.min(count, 30));
		String cleanTopic = topic != null ? topic.trim() : "Giao tiếp hàng ngày";

		try {
			String systemPrompt = """
				Bạn là chuyên gia giáo dục tiếng Trung.
				Nhiệm vụ: Sinh danh sách từ vựng tiếng Trung hữu ích theo chủ đề được yêu cầu.
				Hãy trả về DUY NHẤT một mảng JSON (không bọc trong markdown code fence, không giải thích gì thêm) đúng cấu trúc:
				[
				  {
				    "hanzi": "chữ Hán",
				    "pinyin": "phiên âm pinyin có dấu thanh điệu",
				    "meaning": "nghĩa tiếng Việt súc tích",
				    "partOfSpeech": "loại từ (noun/verb/adjective/adverb/...)",
				    "exampleSentence": "câu ví dụ tiếng Trung tự nhiên",
				    "examplePinyin": "phiên âm pinyin của câu ví dụ",
				    "exampleMeaning": "dịch nghĩa tiếng Việt của câu ví dụ"
				  }
				]
				""";
			String userQuestion = String.format("Hãy sinh đúng %d từ vựng tiếng Trung thiết thực về chủ đề: %s", safeCount, cleanTopic);
			AssistantAnswerResult answer = assistantProvider.answer(systemPrompt, userQuestion);
			if (answer != null && answer.inScope() && answer.answer() != null && !answer.answer().isBlank()) {
				String rawJson = answer.answer().trim();
				if (rawJson.startsWith("```json")) {
					rawJson = rawJson.substring(7);
				} else if (rawJson.startsWith("```")) {
					rawJson = rawJson.substring(3);
				}
				if (rawJson.endsWith("```")) {
					rawJson = rawJson.substring(0, rawJson.length() - 3);
				}
				rawJson = rawJson.trim();

				return objectMapper.readValue(
						rawJson,
						new TypeReference<List<AiVocabAutofillItemDto>>() {}
				);
			}
		} catch (Exception e) {
			log.warn("Lỗi khi sinh từ vựng theo chủ đề qua AI: {}", e.getMessage());
		}

		// Fallback nếu AI không trả về
		return List.of(
				new AiVocabAutofillItemDto("苹果", "píngguǒ", "quả táo", "noun", "我想吃苹果。", "Wǒ xiǎng chī píngguǒ.", "Tôi muốn ăn táo."),
				new AiVocabAutofillItemDto("咖啡", "kāfēi", "cà phê", "noun", "你要喝咖啡吗？", "Nǐ yào hē kāfēi ma?", "Bạn muốn uống cà phê không?")
		);
	}
}
