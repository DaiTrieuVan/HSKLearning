package com.hsk.account.dto;

import com.hsk.account.domain.UiMode;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * HTT-01-CN-004: Request payload for system login.
 */
public record LoginRequest(
		@NotBlank(message = "Email không được để trống")
		@Email(message = "Email không đúng định dạng")
		@Size(max = 190, message = "Email không được vượt quá 190 ký tự")
		@Schema(description = "Địa chỉ email đã đăng ký", example = "an.hs@example.com")
		String email,

		@NotBlank(message = "Mật khẩu không được để trống")
		@Size(max = 72, message = "Mật khẩu không được vượt quá 72 ký tự")
		@Schema(description = "Mật khẩu tài khoản", example = "Hoctot2026")
		String password,

		@Schema(description = "Gợi ý chế độ làm việc mong muốn (STUDENT hoặc TEACHER)", example = "STUDENT")
		UiMode mode
) {
	public String normalizedEmail() {
		return email == null ? "" : email.trim().toLowerCase();
	}
}
