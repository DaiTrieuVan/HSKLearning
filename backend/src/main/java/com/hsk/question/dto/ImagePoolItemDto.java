package com.hsk.question.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Mục hình ảnh trong Kho ảnh dùng chung (Image Pool) cho dạng bài ghép tranh HSK 3.0.
 */
public record ImagePoolItemDto(
		@Schema(description = "Nhãn ký tự (A, B, C, D, E, F)", example = "A")
		String label,

		@Schema(description = "Đường dẫn hình ảnh", example = "/uploads/images/hsk_apple.png")
		String imageUrl
) {}
