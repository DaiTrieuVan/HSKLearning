package com.hsk.account.dto;

import java.util.Locale;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Payload for HTT-01-CN-001 (student self registration).
 *
 * <p>{@code confirmPassword} is validated even though the service could compare the passwords
 * itself: HTT-01-CN-001-TC-05 expects the error to be attached to that specific field so the form
 * can keep the values the student already typed.
 *
 * <p>Required-ness is declared through Bean Validation ({@code @NotBlank}) only; springdoc reads
 * those constraints and marks the properties required in the OpenAPI document, so there is no
 * second source of truth to keep in sync.
 */
@Schema(description = "Thông tin đăng ký tài khoản học sinh")
public record RegisterStudentRequest(

		@Schema(description = "Họ tên hiển thị", example = "Nguyễn Văn An")
		@NotBlank(message = "Họ tên không được để trống")
		@Size(max = 100, message = "Họ tên tối đa 100 ký tự")
		String fullName,

		@Schema(description = "Email đăng nhập, không phân biệt chữ hoa hay chữ thường",
				example = "an.hs@example.com")
		@NotBlank(message = "Email không được để trống")
		@Size(max = 190, message = "Email tối đa 190 ký tự")
		@Pattern(regexp = EMAIL_PATTERN, message = "Email không đúng định dạng")
		String email,

		@Schema(description = "Mật khẩu. QTN-17: tối thiểu 8 ký tự. Tối đa 72 ký tự vì BCrypt chỉ dùng 72 ký tự đầu.",
				example = "Hoctot2026")
		@NotBlank(message = "Mật khẩu không được để trống")
		@Size(min = 8, max = 72, message = "Mật khẩu phải có tối thiểu 8 ký tự (tối đa 72 ký tự)")
		String password,

		@Schema(description = "Nhập lại mật khẩu để xác nhận", example = "Hoctot2026")
		@NotBlank(message = "Mật khẩu xác nhận không được để trống")
		String confirmPassword) {

	/**
	 * Pragmatic email pattern: something@something.tld. It rejects the malformed values used by
	 * HTT-01-CN-001-TC-04 ("an.hs@", "an.hs.example.com") without pulling in a full RFC 5322
	 * expression, which would be unreadable here.
	 */
	static final String EMAIL_PATTERN = "^[^\\s@]+@[^\\s@.]+(\\.[^\\s@.]+)+$";

	/** Emails are stored and compared in lower case, so the unique index stays reliable. */
	public String normalizedEmail() {
		return email == null ? null : email.trim().toLowerCase(Locale.ROOT);
	}
}
