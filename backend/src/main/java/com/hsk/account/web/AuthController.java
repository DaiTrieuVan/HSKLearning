package com.hsk.account.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsk.account.dto.AccountResponse;
import com.hsk.account.dto.LoginRequest;
import com.hsk.account.dto.LoginResponse;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.service.LoginService;
import com.hsk.account.service.RegistrationService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * HTT-01 — public authentication endpoints.
 */
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Xác thực & Tài khoản", description = "HTT-01 — Quản lý tài khoản và phân quyền")
public class AuthController {

	private final RegistrationService registrationService;

	private final LoginService loginService;

	public AuthController(RegistrationService registrationService, LoginService loginService) {
		this.registrationService = registrationService;
		this.loginService = loginService;
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
							description = "VALIDATION_FAILED hoặc PASSWORD_CONFIRMATION_MISMATCH",
							content = @Content(schema = @Schema(implementation = com.hsk.common.api.ErrorResponse.class))),
					@ApiResponse(responseCode = "409", description = "EMAIL_ALREADY_IN_USE — email đã được dùng",
							content = @Content(schema = @Schema(implementation = com.hsk.common.api.ErrorResponse.class))),
					@ApiResponse(responseCode = "500", description = "INTERNAL_ERROR",
							content = @Content(schema = @Schema(implementation = com.hsk.common.api.ErrorResponse.class))) })
	@PostMapping(path = "/register", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<AccountResponse> registerStudent(@Valid @RequestBody RegisterStudentRequest request) {
		AccountResponse account = registrationService.registerStudent(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(account);
	}

	/** HTT-01-CN-004. */
	@Operation(summary = "HTT-01-CN-004 — Đăng nhập hệ thống",
			description = """
					Xác thực người dùng bằng email và mật khẩu. Trả về JWT token, vai trò và chế độ làm việc.
					Khóa tạm 15 phút nếu nhập sai quá 5 lần liên tiếp (QTN-17).
					""",
			responses = {
					@ApiResponse(responseCode = "200", description = "Đăng nhập thành công",
							content = @Content(schema = @Schema(implementation = LoginResponse.class))),
					@ApiResponse(responseCode = "400", description = "VALIDATION_FAILED (thiếu email/mật khẩu)",
							content = @Content(schema = @Schema(implementation = com.hsk.common.api.ErrorResponse.class))),
					@ApiResponse(responseCode = "401", description = "INVALID_CREDENTIALS (sai email hoặc mật khẩu)",
							content = @Content(schema = @Schema(implementation = com.hsk.common.api.ErrorResponse.class))),
					@ApiResponse(responseCode = "403", description = "ACCOUNT_LOCKED hoặc ACCOUNT_TEMPORARILY_LOCKED",
							content = @Content(schema = @Schema(implementation = com.hsk.common.api.ErrorResponse.class))) })
	@PostMapping(path = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
		LoginResponse response = loginService.login(request);
		return ResponseEntity.ok(response);
	}

	/** HTT-01-CN-004-TC-11. */
	@Operation(summary = "HTT-01-CN-004 — Đăng xuất hệ thống",
			description = "Kết thúc phiên đăng nhập.")
	@PostMapping(path = "/logout")
	public ResponseEntity<Void> logout() {
		return ResponseEntity.ok().build();
	}
}
