package com.hsk.exercise.dto;

import com.hsk.question.domain.QuestionType;
import java.math.BigDecimal;

/**
 * Phản hồi chi tiết câu hỏi trong bài tập (HTT-05-CN-006).
 */
public record ExerciseQuestionResponse(
		Long id,
		Long questionId,
		String content,
		QuestionType type,
		BigDecimal points,
		int sortOrder
) {}
