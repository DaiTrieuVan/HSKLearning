package com.hsk.learning.web;

import java.security.Principal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.dto.ClassLeaderboardResponse;
import com.hsk.learning.service.ClassLeaderboardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/classes/{classId}/leaderboard")
@Tag(name = "Bảng xếp hạng lớp học", description = "HTT-08-CN-006 — Xem bảng xếp hạng tích lũy XP trong tuần của lớp")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class ClassLeaderboardController {

	private final ClassLeaderboardService classLeaderboardService;
	private final UserRepository userRepository;

	@GetMapping
	@Operation(
			summary = "HTT-08-CN-006 — Xem bảng xếp hạng tuần của lớp",
			description = "Tính XP tuần theo giờ Việt Nam (00:00 thứ Hai), xử lý đồng hạng và bảo mật thông tin cá nhân"
	)
	public ResponseEntity<ClassLeaderboardResponse> getClassLeaderboard(
			@PathVariable Long classId,
			Principal principal
	) {
		if (principal == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		UserEntity user = userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		ClassLeaderboardResponse response = classLeaderboardService.getClassWeeklyLeaderboard(classId, user.getId());
		return ResponseEntity.ok(response);
	}
}
