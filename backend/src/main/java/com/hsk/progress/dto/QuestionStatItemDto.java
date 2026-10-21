package com.hsk.progress.dto;

import java.math.BigDecimal;

/**
 * Thống kê tỷ lệ làm sai của từng câu hỏi trong bài tập (HTT-07-CN-005, TC-02).
 */
public record QuestionStatItemDto(
		Long questionId,
		int sortOrder,
		String type,
		String content,
		BigDecimal points,
		long totalAnswers,
		long correctCount,
		long wrongCount,
		double wrongPercentage
) {}
