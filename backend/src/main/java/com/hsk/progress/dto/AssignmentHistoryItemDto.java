package com.hsk.progress.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * DTO đại diện cho 1 bài tập trong lịch sử làm bài (HTT-07-CN-002, TC-01, TC-03).
 */
public record AssignmentHistoryItemDto(
		Long assignmentId,
		String assignmentTitle,
		Long classId,
		String className,
		BigDecimal totalPoints,
		BigDecimal bestScore,
		Double bestScorePercentage,
		Instant latestSubmittedAt,
		int attemptsCount,
		List<SubmissionAttemptItemDto> attempts
) {}
