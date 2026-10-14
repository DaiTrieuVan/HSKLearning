package com.hsk.account.dto;

import java.time.Instant;
import java.util.List;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.UiMode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserStatus;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * HTT-01-CN-008: DTO thông tin người dùng dành cho quản trị viên.
 */
@Schema(description = "Thông tin quản lý tài khoản người dùng của Quản trị viên")
public record AdminUserResponse(
	Long id,
	String email,
	String fullName,
	String avatarUrl,
	UserStatus status,
	List<RoleCode> roles,
	UiMode lastMode,
	int failedLoginCount,
	Instant lockedUntil,
	Instant createdAt,
	Instant updatedAt
) {
	public static AdminUserResponse of(UserEntity user, List<RoleCode> roles) {
		return new AdminUserResponse(
			user.getId(),
			user.getEmail(),
			user.getFullName(),
			user.getAvatarUrl(),
			user.getStatus(),
			roles,
			user.getLastMode(),
			user.getFailedLoginCount(),
			user.getLockedUntil(),
			user.getCreatedAt(),
			user.getUpdatedAt()
		);
	}
}
