package com.hsk.learning.dto;

import java.time.Instant;

public record QuizSubmitResponse(
		Long sessionId,
		int correctCount,
		int totalCount,
		int accuracyPercent,
		int xpEarned,
		int totalUserXp,
		boolean duplicateSubmission,
		Instant completedAt
) {}
