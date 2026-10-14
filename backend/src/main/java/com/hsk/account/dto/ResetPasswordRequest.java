package com.hsk.account.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Yêu cầu đổi mật khẩu mới bằng token")
public record ResetPasswordRequest(
	@Schema(description = "Token đặt lại mật khẩu nhận được qua email hoặc link")
	@NotBlank(message = "Mã token không được để trống")
	String token,

	@Schema(description = "Mật khẩu mới (tối thiểu 8 ký tự)", example = "Moi2026ok!")
	@NotBlank(message = "Mật khẩu mới không được để trống")
	@Size(min = 8, max = 100, message = "Mật khẩu mới phải có ít nhất 8 ký tự")
	String newPassword,

	@Schema(description = "Xác nhận mật khẩu mới", example = "Moi2026ok!")
	@NotBlank(message = "Xác nhận mật khẩu không được để trống")
	String confirmPassword
) {
}
