package com.hsk.content.dto;

import jakarta.validation.constraints.Size;

public record UpdateLessonRequest(
	@Size(max = 150, message = "Tiêu đề không được vượt quá 150 ký tự")
	String title,

	@Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
	String description,

	Integer sortOrder,

	Boolean hidden
) {}
