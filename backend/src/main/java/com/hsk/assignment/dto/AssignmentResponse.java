package com.hsk.assignment.dto;

import com.hsk.assignment.domain.AssignmentStatus;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * Phản hồi tóm tắt lần giao bài cho lớp (HTT-06-CN-001).
 */
public record AssignmentResponse(
		Long id,
		Long exerciseId,
		Long classId,
		String classTitle,
		Long teacherId,
		String title,
		String description,
		Instant startTime,
		Instant dueTime,
		BigDecimal totalPoints,
		AssignmentStatus status,
		int questionCount,
		Instant createdAt
) {}
