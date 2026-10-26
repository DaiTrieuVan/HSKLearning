package com.hsk.exercise.dto.hsk30;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record Hsk30ExamDetailResponse(
		Long id,
		String title,
		String description,
		Integer hskLevel,
		String hskStandard,
		Integer timeLimitMinutes,
		BigDecimal totalPoints,
		BigDecimal passingScore,
		int totalQuestions,
		List<Hsk30SectionItemDto> sections,
		Instant createdAt
) {
}
