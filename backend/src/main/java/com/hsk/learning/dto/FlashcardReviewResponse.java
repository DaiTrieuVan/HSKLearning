package com.hsk.learning.dto;

import com.hsk.learning.domain.FlashcardResult;
import java.time.Instant;

public record FlashcardReviewResponse(
		Long vocabularyId,
		FlashcardResult result,
		Integer repetitionLevel,
		Integer intervalDays,
		Instant updatedAt
) {}
