package com.hsk.exercise.dto;

import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.domain.ExerciseType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Phản hồi thông tin đề thi thử HSK hoàn chỉnh (HTT-09-CN-001).
 */
public record MockExamResponse(
		Long id,
		Long ownerId,
		String title,
		String description,
		ExerciseType exerciseType,
		Integer hskLevel,
		Integer timeLimitMinutes,
		BigDecimal passingScore,
		ExerciseStatus status,
		BigDecimal totalPoints,
		int sectionCount,
		int questionCount,
		List<MockExamSectionResponse> sections,
		Instant createdAt,
		Instant updatedAt
) {}
