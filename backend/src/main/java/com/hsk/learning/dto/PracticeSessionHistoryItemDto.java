package com.hsk.learning.dto;

import java.time.Instant;

public record PracticeSessionHistoryItemDto(
		Long id,
		Long vocabSetId,
		String vocabSetTitle,
		String gameType,
		String gameMode,
		int correctCount,
		int totalCount,
		int accuracyPercent,
		int xpEarned,
		int durationSeconds,
		Instant completedAt
) {}
