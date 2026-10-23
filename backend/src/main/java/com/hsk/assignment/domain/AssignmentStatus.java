package com.hsk.assignment.domain;

/**
 * Trạng thái của Lần giao bài (HTT-06-CN-001).
 */
public enum AssignmentStatus {
	/** Đã lên lịch, chưa đến thời điểm bắt đầu. */
	SCHEDULED,

	/** Đang diễn ra, học sinh có thể làm và nộp bài. */
	ACTIVE,

	/** Đã quá hạn nộp bài. */
	CLOSED,

	/** Lần giao bài đã được lưu trữ. */
	ARCHIVED,

	/** Lần giao bài đã bị giáo viên hủy (chưa có lượt làm nào) - HTT-06-CN-009. */
	CANCELLED
}
