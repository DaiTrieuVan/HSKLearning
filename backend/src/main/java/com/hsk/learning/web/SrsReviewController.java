package com.hsk.learning.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.dto.SrsCardResponse;
import com.hsk.learning.dto.SrsReviewRequest;
import com.hsk.learning.dto.SrsReviewResultResponse;
import com.hsk.learning.dto.SrsSummaryResponse;
import com.hsk.learning.service.SrsReviewService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/srs")
public class SrsReviewController {

	private final SrsReviewService srsReviewService;
	private final UserRepository userRepository;

	public SrsReviewController(SrsReviewService srsReviewService, UserRepository userRepository) {
		this.srsReviewService = srsReviewService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@GetMapping("/due-cards")
	public ResponseEntity<List<SrsCardResponse>> getDueCards(Principal principal) {
		UserEntity user = requireUser(principal);
		List<SrsCardResponse> cards = srsReviewService.getDueCards(user.getId());
		return ResponseEntity.ok(cards);
	}

	@GetMapping("/summary")
	public ResponseEntity<SrsSummaryResponse> getSummary(Principal principal) {
		UserEntity user = requireUser(principal);
		SrsSummaryResponse summary = srsReviewService.getSummary(user.getId());
		return ResponseEntity.ok(summary);
	}

	@PostMapping("/review")
	public ResponseEntity<SrsReviewResultResponse> submitReview(
			@Valid @RequestBody SrsReviewRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		SrsReviewResultResponse response = srsReviewService.submitReview(user.getId(), request);
		return ResponseEntity.ok(response);
	}
}
