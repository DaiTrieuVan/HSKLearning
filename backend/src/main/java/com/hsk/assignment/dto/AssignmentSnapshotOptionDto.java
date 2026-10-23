package com.hsk.assignment.dto;

/**
 * Snapshot của một lựa chọn câu hỏi tại thời điểm giao bài (QTN-10).
 */
public record AssignmentSnapshotOptionDto(
		Long id,
		String content,
		boolean isCorrect,
		int sortOrder
) {}
