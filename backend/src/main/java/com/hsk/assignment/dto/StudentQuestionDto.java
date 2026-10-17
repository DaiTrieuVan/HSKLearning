package com.hsk.assignment.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Câu hỏi bài tập gửi về cho học sinh khi đang làm bài.
 * Tuyệt đối không chứa explanation và đáp án đúng để chống gian lận.
 */
public record StudentQuestionDto(
		Long questionId,
		String type,
		String content,
		String payload,
		BigDecimal points,
		Integer sortOrder,
		List<StudentQuestionOptionDto> options
) {}
