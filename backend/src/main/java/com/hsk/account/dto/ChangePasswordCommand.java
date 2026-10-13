package com.hsk.account.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Yêu cầu đổi mật khẩu tài khoản")
public record ChangePasswordCommand(
	@Schema(description = "Mật khẩu hiện tại", example = "OldPass2026!")
	@NotBlank(message = "Mật khẩu hiện tại không được để trống")
	String currentPassword,

	@Schema(description = "Mật khẩu mới (tối thiểu 8 ký tự)", example = "NewPass2026!")
	@NotBlank(message = "Mật khẩu mới không được để trống")
	@Size(min = 8, max = 100, message = "Mật khẩu mới phải có ít nhất 8 ký tự")
	String newPassword,

	@Schema(description = "Xác nhận mật khẩu mới", example = "NewPass2026!")
	@NotBlank(message = "Xác nhận mật khẩu không được để trống")
	String confirmPassword
) {
}
