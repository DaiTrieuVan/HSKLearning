package com.hsk.account.dto;

import java.util.Set;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.UiMode;
import com.hsk.account.domain.UserStatus;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * HTT-01-CN-004: Response payload on successful system login.
 */
public record LoginResponse(
		@Schema(description = "JWT Bearer token cho các request tiếp theo")
		String token,

		@Schema(description = "Mã tài khoản", example = "1")
		Long id,

		@Schema(description = "Email đăng nhập", example = "an.hs@example.com")
		String email,

		@Schema(description = "Họ và tên", example = "Nguyễn Văn An")
		String fullName,

		@Schema(description = "URL ảnh đại diện")
		String avatarUrl,

		@Schema(description = "Trạng thái tài khoản", example = "ACTIVE")
		UserStatus status,

		@Schema(description = "Danh sách vai trò", example = "[\"STUDENT\"]")
		Set<RoleCode> roles,

		@Schema(description = "Chế độ làm việc hiển thị (STUDENT hoặc TEACHER)", example = "STUDENT")
		UiMode activeMode,

		@Schema(description = "Có yêu cầu nâng quyền giáo viên đang chờ duyệt hay không", example = "false")
		boolean hasPendingTeacherRequest
) {}
