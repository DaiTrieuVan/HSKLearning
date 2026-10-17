package com.hsk.assignment.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Tóm tắt trạng thái và điểm bài nộp của một học sinh trong lớp (HTT-06-CN-006).
 */
public record StudentSubmissionSummaryDto(
		Long studentId,
		String studentName,
		String studentEmail,
		String status, // NOT_STARTED, IN_PROGRESS, SUBMITTED, AUTO_SUBMITTED
		Long submissionId,
		BigDecimal score,
		BigDecimal adjustedScore,
		String adjustReason,
		BigDecimal effectiveScore,
		Integer attemptNumber,
		Instant startedAt,
		Instant submittedAt
) {}
