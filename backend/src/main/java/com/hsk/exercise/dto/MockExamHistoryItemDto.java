package com.hsk.exercise.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO biểu diễn một đề thi thử HSK trong lịch sử làm bài của học sinh (HTT-09-CN-004).
 */
public record MockExamHistoryItemDto(
		Long submissionId,
		Long assignmentId,
		Long mockExamId,
		String title,
		Integer hskLevel,
		Long classId,
		String className,
		Integer attemptNumber,
		BigDecimal score,
		BigDecimal adjustedScore,
		BigDecimal effectiveScore,
		BigDecimal maxScore,
		Integer percentage,
		BigDecimal passingScore,
		boolean isPassed,
		Instant startedAt,
		Instant submittedAt,
		Integer timeSpentSeconds
) {}
