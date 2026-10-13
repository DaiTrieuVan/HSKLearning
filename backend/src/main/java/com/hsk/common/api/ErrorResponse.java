package com.hsk.common.api;

import java.time.Instant;
import java.util.Map;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * The single error envelope used by every endpoint of this API.
 *
 * <p>Success responses never use this shape. {@code fields} is present only when specific
 * input fields are responsible for the failure.
 */
@Schema(description = "Envelope lỗi chung của mọi endpoint")
public record ErrorResponse(
		@Schema(description = "Mã lỗi ổn định để frontend map logic, không đổi theo ngôn ngữ hiển thị",
				example = "EMAIL_ALREADY_IN_USE",
				allowableValues = { "MALFORMED_REQUEST_BODY", "VALIDATION_FAILED", "EMAIL_ALREADY_IN_USE",
						"PASSWORD_CONFIRMATION_MISMATCH", "RESOURCE_ALREADY_EXISTS", "RESOURCE_NOT_FOUND",
						"UNAUTHORIZED", "FORBIDDEN", "INTERNAL_ERROR" })
		String code,

		@Schema(description = "Thông điệp tiếng Việt, hiển thị trực tiếp cho người dùng",
				example = "Email đã được sử dụng cho một tài khoản khác")
		String message,

		@Schema(description = "Đường dẫn API đã sinh ra lỗi này", example = "/api/v1/auth/register")
		String path,

		@Schema(description = "Thời điểm xử lý lỗi (UTC)", example = "2026-10-13T03:21:44.512Z")
		Instant timestamp,

		@Schema(description = "Lỗi theo từng trường, key là tên trường trong request body. "
				+ "Vắng mặt khi lỗi không gắn với trường cụ thể nào",
				example = "{\"password\": \"Mật khẩu phải có tối thiểu 8 ký tự (tối đa 72 ký tự)\"}")
		Map<String, String> fields) {

	public static ErrorResponse of(ApiException exception, String path, Instant timestamp) {
		Map<String, String> fields = exception.fieldErrors();
		return new ErrorResponse(exception.code().name(), exception.getMessage(), path, timestamp,
				fields.isEmpty() ? null : fields);
	}

	public static ErrorResponse of(ApiErrorCode code, String path, Instant timestamp, Map<String, String> fields) {
		return new ErrorResponse(code.name(), code.message(), path, timestamp,
				fields == null || fields.isEmpty() ? null : Map.copyOf(fields));
	}
}
