package com.hsk.exercise.dto.hsk30;

import java.math.BigDecimal;

public record Hsk30GradedQuestionDto(
		Long questionId,
		int questionNumber,
		String content,
		String audioUrl,
		String pinyin,
		String selectedKey,
		String correctKey,
		Long selectedOptionId,
		Long correctOptionId,
		boolean correct,
		BigDecimal earnedPoints,
		BigDecimal maxPoints,
		String explanation
) {
}
