package com.hsk.exercise.dto;

import com.hsk.exercise.domain.ExerciseStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Phản hồi thông tin bài tập hoàn chỉnh (HTT-05-CN-006).
 */
public record ExerciseResponse(
		Long id,
		Long ownerId,
		String title,
		String description,
		ExerciseStatus status,
		BigDecimal totalPoints,
		int questionCount,
		List<ExerciseQuestionResponse> questions,
		Instant createdAt,
		Instant updatedAt
) {}
