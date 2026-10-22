package com.hsk.learning.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.dto.UserLevelResponse;
import com.hsk.learning.dto.XpTransactionResponse;
import com.hsk.learning.service.XpLevelService;
import java.security.Principal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/gamification")
public class XpLevelController {

	private final XpLevelService xpLevelService;
	private final UserRepository userRepository;

	public XpLevelController(XpLevelService xpLevelService, UserRepository userRepository) {
		this.xpLevelService = xpLevelService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@GetMapping("/level")
	public ResponseEntity<UserLevelResponse> getUserLevel(Principal principal) {
		UserEntity user = requireUser(principal);
		UserLevelResponse response = xpLevelService.getUserLevel(user.getId());
		return ResponseEntity.ok(response);
	}

	@GetMapping("/xp-history")
	public ResponseEntity<Page<XpTransactionResponse>> getXpHistory(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		Pageable pageable = PageRequest.of(page, Math.min(size, 50));
		Page<XpTransactionResponse> history = xpLevelService.getXpHistory(user.getId(), pageable);
		return ResponseEntity.ok(history);
	}

	@GetMapping("/xp-history/recent")
	public ResponseEntity<List<XpTransactionResponse>> getRecentXpHistory(Principal principal) {
		UserEntity user = requireUser(principal);
		List<XpTransactionResponse> recent = xpLevelService.getRecentXpHistory(user.getId());
		return ResponseEntity.ok(recent);
	}
}
