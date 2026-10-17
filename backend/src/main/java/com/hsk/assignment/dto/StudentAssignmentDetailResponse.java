package com.hsk.assignment.dto;

import com.hsk.assignment.domain.StudentAssignmentStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * DTO chi tiết bài tập dành cho học sinh (HTT-06-CN-002).
 * Nếu bài chưa đến thời gian mở (UPCOMING), questions sẽ là danh sách rỗng để bảo mật đề thi (TC-03).
 */
public record StudentAssignmentDetailResponse(
		Long id,
		Long exerciseId,
		Long classId,
		String className,
		Long teacherId,
		String teacherName,
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
		BigDecimal score,
		List<AssignmentSnapshotQuestionDto> questions
) {}
