package com.hsk.assignment.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Snapshot của một câu hỏi trong bài tập tại thời điểm giao bài (QTN-10, HTT-09-CN-003).
 */
public record AssignmentSnapshotQuestionDto(
		Long questionId,
		String type,
		String content,
		String explanation,
		String payload,
		BigDecimal points,
		int sortOrder,
		List<AssignmentSnapshotOptionDto> options,
		Long sectionId,
		String sectionName
) {
	public AssignmentSnapshotQuestionDto(
			Long questionId,
			String type,
			String content,
			String explanation,
			String payload,
			BigDecimal points,
			int sortOrder,
			List<AssignmentSnapshotOptionDto> options
	) {
		this(questionId, type, content, explanation, payload, points, sortOrder, options, null, null);
	}
}
