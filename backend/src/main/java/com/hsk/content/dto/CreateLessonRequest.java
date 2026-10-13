package com.hsk.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateLessonRequest(
	@NotNull(message = "Cấp độ HSK không được để trống")
	Long hskLevelId,

	@NotBlank(message = "Tiêu đề bài học không được để trống")
	@Size(max = 150, message = "Tiêu đề không được vượt quá 150 ký tự")
	String title,

	@Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
	String description,

	Integer sortOrder
) {}
