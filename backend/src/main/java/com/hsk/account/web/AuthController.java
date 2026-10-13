package com.hsk.account.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsk.account.dto.AccountResponse;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.service.RegistrationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * HTT-01 — public account endpoints. Public by design: no Spring Security filter chain exists
 * yet, which is why this controller needs no explicit permit-all rule.
 */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Xác thực & Tài khoản", description = "HTT-01 — Quản lý tài khoản và phân quyền")
public class AuthController {

	private final RegistrationService registrationService;

	public AuthController(RegistrationService registrationService) {
		this.registrationService = registrationService;
	}

	/** HTT-01-CN-001-CV-04. */
	@Operation(summary = "HTT-01-CN-001 — Đăng ký tài khoản học sinh",
			description = """
					Tạo tài khoản công khai bằng họ tên, email và mật khẩu. Mọi tài khoản đăng ký qua \
					endpoint này đều được gán vai trò STUDENT (CV-01). Mật khẩu được băm bằng BCrypt \
					(QTN-17) và không bao giờ được lưu hay trả về dưới dạng thuần.

					Email được chuẩn hóa về chữ thường trước khi lưu và trước khi kiểm tra trùng.
					""",
			responses = {
					@ApiResponse(responseCode = "201", description = "Tạo tài khoản thành công, vai trò STUDENT",
							content = @Content(schema = @Schema(implementation = AccountResponse.class))),
					@ApiResponse(responseCode = "400",
							description = "VALIDATION_FAILED (thiếu họ tên/email/mật khẩu, mật khẩu dưới 8 ký tự, "
									+ "email sai định dạng) hoặc PASSWORD_CONFIRMATION_MISMATCH. "
									+ "Lỗi theo trường nằm trong `fields`.",
							content = @Content(schema = @Schema(implementation = com.hsk.common.api.ErrorResponse.class))),
					@ApiResponse(responseCode = "409", description = "EMAIL_ALREADY_IN_USE — email đã được dùng",
							content = @Content(schema = @Schema(implementation = com.hsk.common.api.ErrorResponse.class))),
					@ApiResponse(responseCode = "500", description = "INTERNAL_ERROR",
							content = @Content(schema = @Schema(implementation = com.hsk.common.api.ErrorResponse.class))) })
	// produces is declared so the generated contract says "application/json" instead of "*/*":
	// client code generators key the response model off that media type.
	@PostMapping(path = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<AccountResponse> registerStudent(@Valid @RequestBody RegisterStudentRequest request) {
		AccountResponse account = registrationService.registerStudent(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(account);
	}
}
