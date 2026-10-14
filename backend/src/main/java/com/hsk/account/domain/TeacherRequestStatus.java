package com.hsk.account.domain;

/**
 * Trạng thái của một yêu cầu nâng quyền giáo viên (HTT-01-CN-002, HTT-01-CN-003).
 */
public enum TeacherRequestStatus {
	/** Đang chờ quản trị viên phê duyệt. */
	PENDING,

	/** Đã được quản trị viên chấp thuận; tài khoản được cấp quyền TEACHER (QTN-03). */
	APPROVED,

	/** Bị quản trị viên từ chối kèm lý do; tài khoản có thể gửi lại yêu cầu mới. */
	REJECTED
}
