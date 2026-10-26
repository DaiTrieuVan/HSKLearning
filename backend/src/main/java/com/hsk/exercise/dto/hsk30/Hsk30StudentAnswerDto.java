package com.hsk.exercise.dto.hsk30;

public record Hsk30StudentAnswerDto(
		Long questionId,
		Long selectedOptionId,
		String selectedKey
) {
}
