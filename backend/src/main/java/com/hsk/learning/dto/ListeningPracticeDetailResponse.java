package com.hsk.learning.dto;

import java.math.BigDecimal;
import java.util.List;

public record ListeningPracticeDetailResponse(
		Long id,
		String title,
		String description,
		Integer hskLevel,
		BigDecimal totalPoints,
		String primaryAudioUrl,
		String transcript,
		List<ListeningQuestionItemDto> questions
) {
}
