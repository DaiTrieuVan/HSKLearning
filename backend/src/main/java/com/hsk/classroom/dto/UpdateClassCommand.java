package com.hsk.classroom.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * HTT-02-CN-002: Yêu cầu cập nhật thông tin lớp học.
 */
@Schema(description = "Yêu cầu cập nhật thông tin lớp học")
public record UpdateClassCommand(
	@NotBlank(message = "Tên lớp học không được để trống")
	@Size(max = 150, message = "Tên lớp học tối đa 150 ký tự")
	String title,

	@Size(max = 2000, message = "Mô tả tối đa 2000 ký tự")
	String description
) {}
