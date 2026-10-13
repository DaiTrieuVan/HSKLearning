package com.hsk.account.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Payload gửi yêu cầu nâng quyền giáo viên (HTT-01-CN-002).
 */
@Schema(description = "Thông tin đăng ký trở thành giáo viên")
public record SubmitTeacherRequestCommand(
	@Schema(description = "Thông tin nơi dạy, kinh nghiệm, chứng chỉ tiếng Trung", example = "Giáo viên tại Trung tâm Hoài Ngô, HSK 6, kinh nghiệm 3 năm")
	@NotBlank(message = "Thông tin giảng dạy không được để trống")
	@Size(max = 2000, message = "Thông tin giảng dạy không được vượt quá 2000 ký tự")
	String teachingInfo
) {
}
