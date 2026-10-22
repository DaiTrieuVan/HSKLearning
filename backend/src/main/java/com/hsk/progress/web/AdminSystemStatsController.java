package com.hsk.progress.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.progress.dto.SystemStatisticsResponse;
import com.hsk.progress.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

/**
 * HTT-07-CN-008: Thống kê toàn hệ thống dành cho Quản trị viên nền tảng (Admin).
 */
@RestController
@RequestMapping({"/api/v1/admin/system-stats", "/api/admin/system-stats", "/api/progress/admin/system-stats"})
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin System Statistics", description = "HTT-07-CN-008 — Thống kê toàn hệ thống")
@SecurityRequirement(name = "bearerAuth")
public class AdminSystemStatsController {

	private final ProgressService progressService;
	private final UserRepository userRepository;

	public AdminSystemStatsController(ProgressService progressService, UserRepository userRepository) {
		this.progressService = progressService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null || principal.getName() == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@GetMapping
	@Operation(
			summary = "HTT-07-CN-008 — Lấy số liệu thống kê toàn hệ thống",
			description = "Quản trị viên xem số lượng người dùng theo vai trò, số lớp học, số bài học và số lượt nộp bài theo các mốc thời gian (ALL, 7D, 30D)."
	)
	public ResponseEntity<SystemStatisticsResponse> getSystemStatistics(
			@RequestParam(value = "period", defaultValue = "ALL") String period,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		SystemStatisticsResponse stats = progressService.getSystemStatistics(user.getId(), period);
		return ResponseEntity.ok(stats);
	}
}
