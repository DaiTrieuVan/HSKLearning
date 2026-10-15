package com.hsk.learning.dto;

import java.util.List;

public record FlashcardSessionSummaryResponse(
		int totalCards,
		int rememberedCount,
		int forgottenCount,
		int unreviewedCount,
		List<Long> forgottenVocabularyIds
) {}
