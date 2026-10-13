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
