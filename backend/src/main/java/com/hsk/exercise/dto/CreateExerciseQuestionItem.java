package com.hsk.exercise.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Cấu hình câu hỏi và điểm số đưa vào bài tập (HTT-05-CN-006).
 */
public record CreateExerciseQuestionItem(
		@NotNull(message = "questionId không được null")
		Long questionId,

		@NotNull(message = "points không được null")
		BigDecimal points,

		Integer sortOrder
) {}
