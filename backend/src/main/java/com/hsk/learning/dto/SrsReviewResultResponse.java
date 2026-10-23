package com.hsk.learning.dto;

import java.time.Instant;

public record SrsReviewResultResponse(
		Long vocabularyId,
		Integer repetitionLevel,
		Integer intervalDays,
		Instant nextReviewAt,
		long remainingDueCount
) {}
