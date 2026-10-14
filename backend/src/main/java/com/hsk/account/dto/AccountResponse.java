package com.hsk.account.dto;

import java.time.Instant;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserStatus;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * The account as the client may see it. Password material is intentionally absent.
 *
 * <p>{@code roles} tells the frontend which workspace to open after registering; it is always
 * {@code [STUDENT]} for HTT-01-CN-001 (CV-01: every self-service registration is a student).
 */
@Schema(description = "Thông tin tài khoản trả về sau khi đăng ký")
public record AccountResponse(
		@Schema(description = "Định danh tài khoản", example = "1") Long id,
		@Schema(description = "Email đã được chuẩn hóa về chữ thường", example = "an.hs@example.com") String email,
		@Schema(description = "Họ tên", example = "Nguyễn Văn An") String fullName,
		@Schema(description = "Trạng thái tài khoản", example = "ACTIVE") UserStatus status,
		@Schema(description = "Các vai trò đang có", example = "[\"STUDENT\"]") java.util.Set<RoleCode> roles,
		@Schema(description = "Thời điểm tạo (UTC)") Instant createdAt) {

	public static AccountResponse of(UserEntity user, java.util.Set<RoleCode> roles) {
		return new AccountResponse(user.getId(), user.getEmail(), user.getFullName(), user.getStatus(), roles,
				user.getCreatedAt());
	}
}
