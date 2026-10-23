package com.hsk.progress.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record AssignmentColumnHeaderDto(
		Long assignmentId,
		String title,
		BigDecimal totalPoints,
		Instant dueTime,
		Instant createdAt,
		int submittedCount,
		BigDecimal assignmentAverageScore
) {
}
