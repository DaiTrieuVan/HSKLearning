package com.hsk.question.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record CreateQuestionOptionRequest(
	@Schema(description = "Nội dung lựa chọn", example = "Xin chào")
	String content,

	@Schema(description = "Là đáp án đúng hay không", example = "true")
	Boolean isCorrect,

	@Schema(description = "Đường dẫn hình ảnh phương án (nếu có)", example = "/uploads/images/apple.png")
	String imageUrl
) {
	public CreateQuestionOptionRequest(String content, Boolean isCorrect) {
		this(content, isCorrect, null);
	}
}
