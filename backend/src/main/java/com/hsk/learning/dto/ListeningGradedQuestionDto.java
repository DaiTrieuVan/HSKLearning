package com.hsk.learning.dto;

import java.math.BigDecimal;
import java.util.List;

public record ListeningGradedQuestionDto(
		Long questionId,
		String content,
		String audioUrl,
		String pinyin,
		String explanation,
		Long selectedOptionId,
		Long correctOptionId,
		boolean isCorrect,
		BigDecimal pointsEarned,
		BigDecimal pointsPossible,
		List<ListeningOptionDto> options
) {
}
