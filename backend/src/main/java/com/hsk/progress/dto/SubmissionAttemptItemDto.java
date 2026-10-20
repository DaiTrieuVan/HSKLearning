package com.hsk.progress.dto;

import com.hsk.assignment.domain.SubmissionStatus;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO đại diện cho 1 lượt làm bài cụ thể của học sinh (HTT-07-CN-002, TC-03, QTN-13).
 */
public record SubmissionAttemptItemDto(
		Long submissionId,
		Integer attemptNumber,
		SubmissionStatus status,
		BigDecimal score,
		BigDecimal adjustedScore,
		String adjustReason,
		BigDecimal effectiveScore,
		Double scorePercentage,
		boolean isBestScore,
		Instant submittedAt,
		Instant startedAt
) {}
