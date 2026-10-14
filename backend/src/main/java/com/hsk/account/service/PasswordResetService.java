package com.hsk.account.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hsk.account.domain.PasswordResetTokenEntity;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.dto.ForgotPasswordRequest;
import com.hsk.account.dto.ForgotPasswordResponse;
import com.hsk.account.dto.ResetPasswordRequest;
import com.hsk.account.repository.PasswordResetTokenRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.common.audit.AuditLogService;

/**
 * HTT-01-CN-005: Đặt lại mật khẩu tài khoản.
 */
@Service
public class PasswordResetService {

	private static final String SUCCESS_MESSAGE =
			"Nếu email tồn tại trên hệ thống, liên kết đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.";

	private final UserRepository userRepository;

	private final PasswordResetTokenRepository tokenRepository;

	private final PasswordEncoder passwordEncoder;

	private final AuditLogService auditLogService;

	public PasswordResetService(
			UserRepository userRepository,
			PasswordResetTokenRepository tokenRepository,
			PasswordEncoder passwordEncoder,
			AuditLogService auditLogService) {
		this.userRepository = userRepository;
		this.tokenRepository = tokenRepository;
		this.passwordEncoder = passwordEncoder;
		this.auditLogService = auditLogService;
	}

	/**
	 * HTT-01-CN-005-TC-01..TC-03: Yêu cầu đặt lại mật khẩu.
	 * Bảo mật: Luôn trả về thông báo chung để tránh brute-force/enumeration danh sách email (TC-03).
	 */
	@Transactional
	public ForgotPasswordResponse requestReset(ForgotPasswordRequest request) {
		String email = request.email().trim().toLowerCase();
		Optional<UserEntity> userOpt = userRepository.findByEmail(email);

		if (userOpt.isEmpty()) {
			// TC-03: Email chưa đăng ký -> Trả về thông báo thành công chung, không tạo token
			return new ForgotPasswordResponse(SUCCESS_MESSAGE, null);
		}

		UserEntity user = userOpt.get();
		String rawToken = UUID.randomUUID().toString().replace("-", "");
		String tokenHash = hashToken(rawToken);

		PasswordResetTokenEntity tokenEntity = PasswordResetTokenEntity.create(user, tokenHash, Instant.now());
		tokenRepository.save(tokenEntity);

		return new ForgotPasswordResponse(SUCCESS_MESSAGE, rawToken);
	}

	/**
	 * HTT-01-CN-005-TC-04 & TC-05: Kiểm tra tính hợp lệ của token trước khi hiển thị form đổi mật khẩu.
	 */
	@Transactional(readOnly = true)
	public void validateToken(String rawToken) {
		if (rawToken == null || rawToken.trim().isBlank()) {
			throw new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND, "Mã liên kết không hợp lệ");
		}

		String tokenHash = hashToken(rawToken.trim());
		PasswordResetTokenEntity token = tokenRepository.findByTokenHash(tokenHash)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND, "Liên kết đặt lại mật khẩu không hợp lệ"));

		if (token.isUsed()) {
			throw new ApiException(ApiErrorCode.TOKEN_ALREADY_USED);
		}

		if (token.isExpired(Instant.now())) {
			throw new ApiException(ApiErrorCode.TOKEN_EXPIRED);
		}
	}

	/**
	 * HTT-01-CN-005-TC-02 & TC-06: Đổi mật khẩu mới bằng token.
	 */
	@Transactional
	public void resetPassword(ResetPasswordRequest request) {
		// TC-06: Mật khẩu xác nhận không khớp
		if (!request.newPassword().equals(request.confirmPassword())) {
			throw new ApiException(ApiErrorCode.PASSWORD_CONFIRMATION_MISMATCH);
		}

		String tokenHash = hashToken(request.token().trim());
		PasswordResetTokenEntity token = tokenRepository.findByTokenHash(tokenHash)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND, "Liên kết đặt lại mật khẩu không hợp lệ"));

		// TC-05: Đã dùng rồi
		if (token.isUsed()) {
			throw new ApiException(ApiErrorCode.TOKEN_ALREADY_USED);
		}

		// TC-04: Quá hạn 30 phút
		Instant now = Instant.now();
		if (token.isExpired(now)) {
			throw new ApiException(ApiErrorCode.TOKEN_EXPIRED);
		}

		// TC-02: Đổi mật khẩu thành công & vô hiệu hóa token
		UserEntity user = token.getUser();
		user.changePassword(passwordEncoder.encode(request.newPassword()));
		token.markUsed(now);

		// Lưu audit log
		auditLogService.record(
				user,
				"PASSWORD_RESET",
				"USER",
				String.valueOf(user.getId()),
				"Đặt lại mật khẩu thành công qua email token");
	}

	private String hashToken(String token) {
		try {
			MessageDigest md = MessageDigest.getInstance("SHA-256");
			byte[] digest = md.digest(token.getBytes(StandardCharsets.UTF_8));
			return HexFormat.of().formatHex(digest);
		} catch (NoSuchAlgorithmException e) {
			throw new IllegalStateException("SHA-256 algorithm not available", e);
		}
	}
}
