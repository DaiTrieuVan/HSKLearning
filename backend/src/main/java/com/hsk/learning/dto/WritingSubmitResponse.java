package com.hsk.learning.dto;

import java.time.Instant;

public record WritingSubmitResponse(
		Long sessionId,
		int correctCount,
		int totalCount,
		int accuracyPercent,
		int xpEarned,
		int baseXp,
		int completionBonusXp,
		int totalUserXp,
		boolean duplicateSubmission,
		Instant completedAt
) {}

