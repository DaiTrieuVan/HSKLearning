package com.hsk.learning.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.dto.FlashcardCardResponse;
import com.hsk.learning.dto.FlashcardReviewResponse;
import com.hsk.learning.dto.FlashcardSessionSummaryResponse;
import com.hsk.learning.dto.ReviewFlashcardCommand;
import com.hsk.learning.service.FlashcardLearningService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/learning/flashcards")
public class FlashcardController {

	private final FlashcardLearningService flashcardLearningService;
	private final UserRepository userRepository;

	public FlashcardController(FlashcardLearningService flashcardLearningService, UserRepository userRepository) {
		this.flashcardLearningService = flashcardLearningService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@GetMapping
	public ResponseEntity<List<FlashcardCardResponse>> getFlashcards(
			@RequestParam(required = false) Long lessonId,
			@RequestParam(required = false) Long vocabSetId,
			@RequestParam(required = false, defaultValue = "false") Boolean onlyForgotten,
			Principal principal) {
		UserEntity user = requireUser(principal);
		List<FlashcardCardResponse> response = flashcardLearningService.getFlashcards(user.getId(), lessonId, vocabSetId, onlyForgotten);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/review")
	public ResponseEntity<FlashcardReviewResponse> reviewCard(
			@Valid @RequestBody ReviewFlashcardCommand command,
			Principal principal) {
		UserEntity user = requireUser(principal);
		FlashcardReviewResponse response = flashcardLearningService.reviewCard(user.getId(), command);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/summary")
	public ResponseEntity<FlashcardSessionSummaryResponse> getSessionSummary(
			@RequestParam(required = false) Long lessonId,
			@RequestParam(required = false) Long vocabSetId,
			Principal principal) {
		UserEntity user = requireUser(principal);
		FlashcardSessionSummaryResponse response = flashcardLearningService.getSessionSummary(user.getId(), lessonId, vocabSetId);
		return ResponseEntity.ok(response);
	}
}
