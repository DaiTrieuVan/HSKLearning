package com.hsk.assignment.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Tổng quan danh sách bài nộp của bài tập dành cho Giáo viên (HTT-06-CN-006).
 */
public record AssignmentSubmissionsOverviewResponse(
		Long assignmentId,
		String assignmentTitle,
		String assignmentDescription,
		BigDecimal totalPoints,
		Instant dueTime,
		String status,
		int totalStudents,
		int submittedCount,
		int inProgressCount,
		int notStartedCount,
		List<StudentSubmissionSummaryDto> students
) {}
