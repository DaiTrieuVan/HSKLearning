package com.hsk.aiassistant.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.aiassistant.dto.AiTopicGenerateRequest;
import com.hsk.aiassistant.dto.AiVocabAutofillItemDto;
import com.hsk.aiassistant.dto.AiVocabAutofillRequest;
import com.hsk.aiassistant.service.AiVocabAssistantService;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping({"/api/v1/ai-assistant/vocab", "/api/ai-assistant/vocab"})
@Tag(name = "AI Vocab Assistant", description = "Endpoints tự động điền và sinh từ vựng qua AI")
public class AiVocabAssistantController {

	private final AiVocabAssistantService aiVocabAssistantService;
	private final UserRepository userRepository;

	public AiVocabAssistantController(
			AiVocabAssistantService aiVocabAssistantService,
			UserRepository userRepository
	) {
		this.aiVocabAssistantService = aiVocabAssistantService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@Operation(summary = "Tự động điền đầy đủ pinyin, nghĩa, loại từ, câu ví dụ từ chữ Hán")
	@PostMapping("/autofill")
	public List<AiVocabAutofillItemDto> autofillWords(
			@RequestBody AiVocabAutofillRequest request,
			Principal principal
	) {
		requireUser(principal);
		return aiVocabAssistantService.autofillVocabularies(request != null ? request.words() : List.of());
	}

	@Operation(summary = "Sinh danh sách từ vựng theo chủ đề qua AI")
	@PostMapping("/generate-by-topic")
	public List<AiVocabAutofillItemDto> generateByTopic(
			@Valid @RequestBody AiTopicGenerateRequest request,
			Principal principal
	) {
		requireUser(principal);
		int count = (request.count() != null && request.count() > 0) ? request.count() : 10;
		return aiVocabAssistantService.generateVocabByTopic(request.topic(), count);
	}
}
