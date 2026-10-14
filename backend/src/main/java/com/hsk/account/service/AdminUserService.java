package com.hsk.account.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
import com.hsk.account.domain.UserStatus;
import com.hsk.account.dto.AdminUserResponse;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.common.audit.AuditLogService;

/**
 * HTT-01-CN-008: Nghiệp vụ quản lý tài khoản người dùng dành cho Quản trị viên (Admin).
 */
@Service
public class AdminUserService {

	private final UserRepository userRepository;
	private final UserRoleRepository userRoleRepository;
	private final AuditLogService auditLogService;

	public AdminUserService(
			UserRepository userRepository,
			UserRoleRepository userRoleRepository,
			AuditLogService auditLogService) {
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
		this.auditLogService = auditLogService;
	}

	@Transactional(readOnly = true)
	public Page<AdminUserResponse> searchUsers(String query, UserStatus status, Pageable pageable) {
		String cleanQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
		Page<UserEntity> userPage = userRepository.searchUsers(cleanQuery, status, pageable);

		if (userPage.isEmpty()) {
			return Page.empty(pageable);
		}

		List<Long> userIds = userPage.getContent().stream()
				.map(UserEntity::getId)
				.toList();

		// N+1 Avoidance: batch load roles for all page users
		List<UserRoleEntity> userRoles = userRoleRepository.findByUserIdInWithRoles(userIds);
		Map<Long, List<RoleCode>> roleMap = userRoles.stream()
				.collect(Collectors.groupingBy(
						ur -> ur.getUser().getId(),
						Collectors.mapping(ur -> ur.getRole().getCode(), Collectors.toList())
				));

		List<AdminUserResponse> responses = userPage.getContent().stream()
				.map(u -> AdminUserResponse.of(u, roleMap.getOrDefault(u.getId(), List.of(RoleCode.STUDENT))))
				.toList();

		return new PageImpl<>(responses, pageable, userPage.getTotalElements());
	}

	@Transactional
	public AdminUserResponse lockUser(String adminEmail, Long targetUserId) {
		UserEntity admin = userRepository.findByEmailIgnoreCase(adminEmail)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		if (admin.getId().equals(targetUserId)) {
			throw new ApiException(ApiErrorCode.CANNOT_LOCK_SELF);
		}

		UserEntity targetUser = userRepository.findById(targetUserId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND));

		targetUser.lock();
		userRepository.save(targetUser);

		auditLogService.record(
				admin,
				"LOCK_USER",
				"USER",
				targetUserId.toString(),
				"Admin " + admin.getEmail() + " đã khóa tài khoản " + targetUser.getEmail()
		);

		List<RoleCode> roles = userRoleRepository.findByUser_Id(targetUserId).stream()
				.map(ur -> ur.getRole().getCode())
				.toList();

		return AdminUserResponse.of(targetUser, roles.isEmpty() ? List.of(RoleCode.STUDENT) : roles);
	}

	@Transactional
	public AdminUserResponse unlockUser(String adminEmail, Long targetUserId) {
		UserEntity admin = userRepository.findByEmailIgnoreCase(adminEmail)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		UserEntity targetUser = userRepository.findById(targetUserId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND));

		targetUser.unlock();
		userRepository.save(targetUser);

		auditLogService.record(
				admin,
				"UNLOCK_USER",
				"USER",
				targetUserId.toString(),
				"Admin " + admin.getEmail() + " đã mở khóa tài khoản " + targetUser.getEmail()
		);

		List<RoleCode> roles = userRoleRepository.findByUser_Id(targetUserId).stream()
				.map(ur -> ur.getRole().getCode())
				.toList();

		return AdminUserResponse.of(targetUser, roles.isEmpty() ? List.of(RoleCode.STUDENT) : roles);
	}
}
