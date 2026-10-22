package com.hsk.learning.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.dto.StreakResponse;
import com.hsk.learning.service.StreakService;
import java.security.Principal;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gamification/streak")
public class StreakController {

	private final StreakService streakService;
	private final UserRepository userRepository;

	public StreakController(StreakService streakService, UserRepository userRepository) {
		this.streakService = streakService;
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
	public ResponseEntity<StreakResponse> getStreakStatus(
			@RequestParam(required = false)
			@DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
			LocalDate date,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		LocalDate targetDate = (date != null) ? date : LocalDate.now(StreakService.VN_ZONE);
		StreakResponse response = streakService.getStreakStatusForDate(user.getId(), targetDate);
		return ResponseEntity.ok(response);
	}
}
