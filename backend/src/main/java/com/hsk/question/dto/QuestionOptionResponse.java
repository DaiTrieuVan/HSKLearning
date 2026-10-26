package com.hsk.question.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record QuestionOptionResponse(
	@Schema(description = "ID của lựa chọn", example = "1")
	Long id,

	@Schema(description = "Nội dung lựa chọn", example = "Xin chào")
	String content,

	@Schema(description = "Có phải đáp án đúng hay không", example = "true")
	boolean isCorrect,

	@Schema(description = "Thứ tự hiển thị", example = "1")
	int sortOrder,

	@Schema(description = "Hình ảnh minh họa cho lựa chọn", example = "/uploads/images/apple.png")
	String imageUrl
) {
	public QuestionOptionResponse(Long id, String content, boolean isCorrect, int sortOrder) {
		this(id, content, isCorrect, sortOrder, null);
	}
}
