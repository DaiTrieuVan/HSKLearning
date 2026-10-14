package com.hsk.account.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Lý do từ chối yêu cầu nâng quyền giáo viên")
public record RejectTeacherRequestCommand(
	@Schema(description = "Lý do từ chối cụ thể", example = "Chưa xác minh được thông tin giảng dạy")
	@NotBlank(message = "Lý do từ chối không được để trống")
	@Size(max = 500, message = "Lý do từ chối không được vượt quá 500 ký tự")
	String reason
) {
}
