package com.hsk.assignment.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Chi tiết kết quả của một câu hỏi sau khi nộp bài (kèm đáp án đúng và lời giải).
 */
public record DetailedQuestionResultDto(
		Long questionId,
		String type,
		String content,
		String explanation,
		BigDecimal maxPoints,
		BigDecimal pointsEarned,
		Boolean isCorrect,
		Long selectedOptionId,
		String studentTextAnswer,
		String payload,
		List<AssignmentSnapshotOptionDto> options
) {
	public DetailedQuestionResultDto(
			Long questionId,
			String type,
			String content,
			String explanation,
			BigDecimal maxPoints,
			BigDecimal pointsEarned,
			Boolean isCorrect,
			Long selectedOptionId,
			List<AssignmentSnapshotOptionDto> options
	) {
		this(questionId, type, content, explanation, maxPoints, pointsEarned, isCorrect, selectedOptionId, null, null, options);
	}
}
