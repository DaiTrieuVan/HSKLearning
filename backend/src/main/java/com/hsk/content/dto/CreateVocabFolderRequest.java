package com.hsk.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateVocabFolderRequest(
	@NotBlank(message = "Tên thư mục không được để trống")
	@Size(max = 150, message = "Tên thư mục không được vượt quá 150 ký tự")
	String title,

	@Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
	String description,

	String color
) {}
