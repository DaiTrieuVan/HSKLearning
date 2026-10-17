package com.hsk.assignment.dto;

import com.hsk.assignment.domain.StudentAssignmentStatus;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO trả về thông tin bài tập đã giao kèm trạng thái cá nhân hóa cho học sinh (HTT-06-CN-002).
 */
public record StudentAssignmentResponse(
		Long id,
		Long exerciseId,
		Long classId,
		String className,
		String title,
		String description,
		Instant startTime,
		Instant dueTime,
		BigDecimal totalPoints,
		int questionCount,
		StudentAssignmentStatus studentStatus,
		boolean canStart,
		Long submissionId,
		Instant submittedAt,
		BigDecimal score
) {}
