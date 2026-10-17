package com.hsk.assignment.dto;

import com.hsk.assignment.domain.AssignmentStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Phản hồi chi tiết lần giao bài kèm nội dung snapshot câu hỏi (QTN-10).
 */
public record AssignmentDetailResponse(
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
		List<AssignmentSnapshotQuestionDto> questions,
		Instant createdAt
) {}
