package com.hsk.account.web;

import java.security.Principal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hsk.account.domain.UserStatus;
import com.hsk.account.dto.AdminUserResponse;
import com.hsk.account.service.AdminUserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * HTT-01-CN-008: API Quản lý tài khoản người dùng dành cho Quản trị viên (Admin).
 */
@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Quản trị người dùng", description = "Các API tra cứu, khóa/mở khóa tài khoản cho Quản trị viên")
@SecurityRequirement(name = "bearerAuth")
public class AdminUserController {

	private final AdminUserService adminUserService;

	public AdminUserController(AdminUserService adminUserService) {
		this.adminUserService = adminUserService;
	}

	@GetMapping
	@Operation(summary = "Tìm kiếm và phân trang danh sách người dùng", description = "Lọc theo từ khóa (email, họ tên) và trạng thái tài khoản")
	public Page<AdminUserResponse> searchUsers(
			@RequestParam(required = false) String query,
			@RequestParam(required = false) UserStatus status,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "20") int size) {
		Pageable pageable = PageRequest.of(page, Math.min(size, 100));
		return adminUserService.searchUsers(query, status, pageable);
	}

	@PostMapping("/{id}/lock")
	@Operation(summary = "Khóa tài khoản người dùng", description = "Admin không thể tự khóa tài khoản của chính mình")
	public AdminUserResponse lockUser(
			@PathVariable Long id,
			Principal principal) {
		return adminUserService.lockUser(principal.getName(), id);
	}

	@PostMapping("/{id}/unlock")
	@Operation(summary = "Mở khóa tài khoản người dùng", description = "Khôi phục tài khoản về trạng thái ACTIVE và xóa bộ đếm sai mật khẩu")
	public AdminUserResponse unlockUser(
			@PathVariable Long id,
			Principal principal) {
		return adminUserService.unlockUser(principal.getName(), id);
	}
}
