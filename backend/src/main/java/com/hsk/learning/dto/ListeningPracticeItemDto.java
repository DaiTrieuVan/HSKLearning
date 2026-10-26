package com.hsk.learning.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record ListeningPracticeItemDto(
		Long id,
		String title,
		String description,
		Integer hskLevel,
		int questionCount,
		BigDecimal totalPoints,
		String primaryAudioUrl,
		Instant createdAt
) {
}
