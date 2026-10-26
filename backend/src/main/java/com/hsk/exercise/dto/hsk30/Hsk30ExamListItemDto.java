package com.hsk.exercise.dto.hsk30;

import java.math.BigDecimal;
import java.time.Instant;

public record Hsk30ExamListItemDto(
		Long id,
		String title,
		String description,
		Integer hskLevel,
		String hskStandard,
		Integer timeLimitMinutes,
		BigDecimal totalPoints,
		BigDecimal passingScore,
		int totalQuestions,
		Instant createdAt
) {
}
