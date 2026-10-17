package com.hsk.assignment.domain;

/**
 * Trạng thái bài tập dưới góc nhìn cá nhân hóa của từng học sinh (HTT-06-CN-002).
 */
public enum StudentAssignmentStatus {
	/**
	 * Chưa đến thời gian bắt đầu làm bài (now < start_time).
	 */
	UPCOMING,

	/**
	 * Đang mở làm bài và học sinh chưa bắt đầu làm (now >= start_time && now <= due_time).
	 */
	NOT_STARTED,

	/**
	 * Học sinh đang làm dở bài và bài còn trong hạn (now <= due_time).
	 */
	IN_PROGRESS,

	/**
	 * Học sinh đã nộp bài thành công (thủ công hoặc tự động).
	 */
	SUBMITTED,

	/**
	 * Đã quá hạn nộp bài mà học sinh chưa hoàn tất nộp (now > due_time).
	 */
	OVERDUE
}
