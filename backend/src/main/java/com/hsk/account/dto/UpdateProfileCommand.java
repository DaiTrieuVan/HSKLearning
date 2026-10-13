package com.hsk.account.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Thông tin cập nhật hồ sơ cá nhân")
public record UpdateProfileCommand(
	@Schema(description = "Họ và tên mới", example = "Trần Thị Mai")
	@NotBlank(message = "Họ và tên không được để trống")
	@Size(max = 100, message = "Họ và tên không được vượt quá 100 ký tự")
	String fullName,

	@Schema(description = "Đường dẫn ảnh đại diện", example = "https://example.com/avatar.jpg")
	@Size(max = 500, message = "Đường dẫn ảnh không được vượt quá 500 ký tự")
	String avatarUrl
) {
}
