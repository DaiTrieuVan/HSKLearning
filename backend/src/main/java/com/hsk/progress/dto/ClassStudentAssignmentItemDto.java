package com.hsk.progress.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record ClassStudentAssignmentItemDto(
		Long assignmentId,
		String title,
		Instant dueDate,
		BigDecimal totalPoints,
		String status, // SUBMITTED, NOT_SUBMITTED, OVERDUE, LATE
		int attemptCount,
		BigDecimal score,
		BigDecimal adjustedScore,
		BigDecimal effectiveScore,
		BigDecimal percentage,
		Instant submittedAt,
		boolean isLate,
		String feedback
) {}
