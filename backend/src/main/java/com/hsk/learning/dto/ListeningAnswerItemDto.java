package com.hsk.learning.dto;

import jakarta.validation.constraints.NotNull;

public record ListeningAnswerItemDto(
		@NotNull Long questionId,
		Long selectedOptionId
) {
}
