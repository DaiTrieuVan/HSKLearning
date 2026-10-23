package com.hsk.assignment.domain;

/**
 * Trạng thái bài nộp của học sinh (HTT-06-CN-002, HTT-06-CN-003, HTT-06-CN-004).
 */
public enum SubmissionStatus {
	/**
	 * Đang làm dở, đã lưu nháp câu trả lời.
	 */
	IN_PROGRESS,

	/**
	 * Học sinh đã chủ động nộp bài thành công trước hạn.
	 */
	SUBMITTED,

	/**
	 * Hệ thống tự động thu bài nộp khi hết giờ hoặc tới hạn nộp (QTN-20).
	 */
	AUTO_SUBMITTED,

	/**
	 * Bài nộp đã hoàn tất chấm điểm.
	 */
	GRADED;

	/**
	 * Kiểm tra xem bài nộp đã được nộp hoàn tất hay chưa.
	 */
	public boolean isCompleted() {
		return this == SUBMITTED || this == AUTO_SUBMITTED || this == GRADED;
	}
}
