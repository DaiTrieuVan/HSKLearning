package com.hsk.progress.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Payload phản hồi thống kê hiệu quả làm bài tập của lớp (HTT-07-CN-005).
 */
public record AssignmentStatisticsResponse(
		Long assignmentId,
		String assignmentTitle,
		Long classId,
		String className,
		int totalStudents,
		int submittedCount,
		boolean hasData,
		BigDecimal totalPoints,
		BigDecimal averageScore,
		BigDecimal maxScore,
		BigDecimal minScore,
		List<ScoreDistributionItemDto> scoreDistribution,
		List<QuestionStatItemDto> questionStats
) {}
