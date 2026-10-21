package com.hsk.progress.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record LateSubmissionItemDto(
		Long studentId,
		String fullName,
		String email,
		String avatarUrl,
		Long submissionId,
		Instant submittedAt,
		Instant originalDueTime,
		Instant extendedDueTime,
		BigDecimal score,
		BigDecimal effectiveScore,
		String status,
		boolean isLate
) {
}
