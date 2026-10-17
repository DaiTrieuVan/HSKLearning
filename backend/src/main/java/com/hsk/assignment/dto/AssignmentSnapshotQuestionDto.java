package com.hsk.assignment.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Snapshot của một câu hỏi trong bài tập tại thời điểm giao bài (QTN-10).
 */
public record AssignmentSnapshotQuestionDto(
		Long questionId,
		String type,
		String content,
		String explanation,
		String payload,
		BigDecimal points,
		int sortOrder,
		List<AssignmentSnapshotOptionDto> options
) {}
