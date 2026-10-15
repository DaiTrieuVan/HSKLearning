package com.hsk.question.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record CreateQuestionOptionRequest(
	@Schema(description = "Nội dung lựa chọn", example = "Xin chào")
	String content,

	@Schema(description = "Là đáp án đúng hay không", example = "true")
	Boolean isCorrect
) {}
