package com.hsk.learning.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.dto.DailyChallengeResponse;
import com.hsk.learning.service.DailyChallengeService;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gamification/daily-challenge")
public class DailyChallengeController {

	private final DailyChallengeService dailyChallengeService;
	private final UserRepository userRepository;

	public DailyChallengeController(DailyChallengeService dailyChallengeService, UserRepository userRepository) {
		this.dailyChallengeService = dailyChallengeService;
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
	public ResponseEntity<DailyChallengeResponse> getDailyChallenge(
			@org.springframework.web.bind.annotation.RequestParam(required = false)
			@org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE)
			java.time.LocalDate date,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		java.time.LocalDate targetDate = (date != null) ? date : java.time.LocalDate.now(DailyChallengeService.VN_ZONE);
		DailyChallengeResponse response = dailyChallengeService.getDailyChallengeForDate(user.getId(), targetDate);
		return ResponseEntity.ok(response);
	}
}
