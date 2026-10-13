package com.hsk.common.api;

import org.springframework.http.HttpStatus;

/**
 * Stable machine-readable error codes for the REST API.
 *
 * <p>The frontend maps its logic on {@link #name()} while {@link #message()} is the
 * Vietnamese text shown to the end user (decided for HTT-01-CN-001). Codes are part of the
 * API contract: renaming one is a breaking change, so add a new code instead.
 */
public enum ApiErrorCode {

	/** The JSON body could not be read (missing, malformed, unknown structure). */
	MALFORMED_REQUEST_BODY(HttpStatus.BAD_REQUEST, "Dữ liệu gửi lên không hợp lệ"),

	/** One or more fields failed bean validation; details are in the {@code fields} map. */
	VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "Dữ liệu nhập không hợp lệ"),

	/** QTN-17: the email is already taken by another account. */
	EMAIL_ALREADY_IN_USE(HttpStatus.CONFLICT, "Email đã được sử dụng cho một tài khoản khác"),

	/** The confirmation password differs from the password. */
	PASSWORD_CONFIRMATION_MISMATCH(HttpStatus.BAD_REQUEST, "Mật khẩu xác nhận không khớp"),

	/** A resource with the same unique value already exists (database constraint). */
	RESOURCE_ALREADY_EXISTS(HttpStatus.CONFLICT, "Dữ liệu đã tồn tại trong hệ thống"),

	/** No resource matches the requested identifier. */
	RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy dữ liệu"),

	/** The caller is authenticated but not allowed to perform this action. */
	FORBIDDEN(HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này"),

	/** Credentials are missing or invalid. */
	UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Bạn chưa đăng nhập hoặc phiên đã hết hạn"),

	/** TC-05 / TC-06: Wrong password or non-existent email (unified to prevent account enumeration). */
	INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không chính xác"),

	/** TC-08: Account has been locked by an administrator. */
	ACCOUNT_LOCKED(HttpStatus.FORBIDDEN, "Tài khoản đã bị quản trị viên khóa, vui lòng liên hệ quản trị viên"),

	/** TC-09 & QTN-17: Account temporarily locked for 15 minutes after 5 consecutive failures. */
	ACCOUNT_TEMPORARILY_LOCKED(HttpStatus.FORBIDDEN, "Tài khoản bị khóa tạm thời do nhập sai quá 5 lần liên tiếp. Vui lòng thử lại sau 15 phút"),

	/** HTT-01-CN-002: User already has a pending teacher upgrade request. */
	PENDING_REQUEST_ALREADY_EXISTS(HttpStatus.CONFLICT, "Bạn đã có một yêu cầu đang chờ duyệt"),

	/** HTT-01-CN-002: User already holds the teacher role. */
	ALREADY_TEACHER(HttpStatus.BAD_REQUEST, "Tài khoản đã có quyền giáo viên"),

	/** HTT-01-CN-003: Request has already been reviewed (approved or rejected). */
	REQUEST_ALREADY_PROCESSED(HttpStatus.BAD_REQUEST, "Yêu cầu đã được xử lý trước đó"),

	/** HTT-01-CN-007 / HTT-02-CN-001: Attempting teacher actions without teacher role. */
	TEACHER_ROLE_NOT_GRANTED(HttpStatus.FORBIDDEN, "Bạn chưa có quyền giáo viên để thực hiện thao tác này"),

	/** HTT-01-CN-005: Password reset token has expired (>30 minutes). */
	TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "Liên kết đã hết hạn, vui lòng yêu cầu liên kết mới"),

	/** HTT-01-CN-005: Password reset token has already been consumed. */
	TOKEN_ALREADY_USED(HttpStatus.BAD_REQUEST, "Liên kết đã được sử dụng"),

	/** Unexpected server side failure; the client may retry. */
	INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Hệ thống đang gặp sự cố, vui lòng thử lại sau");

	private final HttpStatus status;

	private final String message;

	ApiErrorCode(HttpStatus status, String message) {
		this.status = status;
		this.message = message;
	}

	public HttpStatus status() {
		return this.status;
	}

	public String message() {
		return this.message;
	}
}
