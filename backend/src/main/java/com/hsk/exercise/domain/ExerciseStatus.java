package com.hsk.exercise.domain;

/**
 * Trạng thái của bài tập (HTT-05-CN-006).
 */
public enum ExerciseStatus {
	/**
	 * Bản nháp, giáo viên đang soạn, chưa sẵn sàng giao cho lớp.
	 */
	DRAFT,

	/**
	 * Đã hoàn tất và sẵn sàng giao cho học sinh / lớp học (QTN-09: yêu cầu có ít nhất 1 câu hỏi).
	 */
	READY
}
