package com.hsk.progress.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record GradeAttemptDetailDto(
		Long submissionId,
		int attemptNumber,
		BigDecimal score,
		BigDecimal adjustedScore,
		String adjustReason,
		Instant adjustedAt,
		String adjustedByName,
		BigDecimal effectiveScore,
		String status,
		Instant submittedAt,
		boolean isBestAttempt
) {
}
