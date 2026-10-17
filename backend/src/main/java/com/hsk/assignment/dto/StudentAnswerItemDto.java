package com.hsk.assignment.dto;

import java.math.BigDecimal;

/**
 * Một câu trả lời của học sinh (dùng cho lưu nháp, nộp bài và lưu trữ).
 */
public record StudentAnswerItemDto(
		Long questionId,
		Long selectedOptionId,
		String textAnswer,
		Boolean isCorrect,
		BigDecimal pointsEarned
) {
	public StudentAnswerItemDto(Long questionId, Long selectedOptionId, String textAnswer) {
		this(questionId, selectedOptionId, textAnswer, null, null);
	}
}
