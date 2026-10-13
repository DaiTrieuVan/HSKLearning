package com.hsk.account.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Yêu cầu gửi liên kết đặt lại mật khẩu")
public record ForgotPasswordRequest(
	@Schema(description = "Email tài khoản đã đăng ký", example = "an.hs@example.com")
	@NotBlank(message = "Email không được để trống")
	@Email(message = "Email không đúng định dạng")
	String email
) {
}
