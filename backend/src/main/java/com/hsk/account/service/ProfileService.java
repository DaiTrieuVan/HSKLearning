package com.hsk.account.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
import com.hsk.account.dto.ChangePasswordCommand;
import com.hsk.account.dto.UpdateProfileCommand;
import com.hsk.account.dto.UserProfileResponse;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.common.audit.AuditLogService;

/**
 * HTT-01-CN-006: Quản lý hồ sơ cá nhân, đổi mật khẩu và tải ảnh đại diện.
 */
@Service
public class ProfileService {

	private static final long MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2 MB (TC-04)

	private final UserRepository userRepository;

	private final UserRoleRepository userRoleRepository;

	private final PasswordEncoder passwordEncoder;

	private final AuditLogService auditLogService;

	@Value("${app.upload.dir:uploads/avatars}")
	private String uploadDir;

	public ProfileService(
			UserRepository userRepository,
			UserRoleRepository userRoleRepository,
			PasswordEncoder passwordEncoder,
			AuditLogService auditLogService) {
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
		this.passwordEncoder = passwordEncoder;
		this.auditLogService = auditLogService;
	}

	@Transactional(readOnly = true)
	public UserProfileResponse getProfile(String email) {
		UserEntity user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		List<String> roles = userRoleRepository.findByUser_Id(user.getId())
				.stream()
				.map(r -> r.getRole().getCode().name())
				.toList();

		return UserProfileResponse.from(user, roles);
	}

	/**
	 * HTT-01-CN-006-TC-01: Cập nhật họ tên và ảnh đại diện.
	 */
	@Transactional
	public UserProfileResponse updateProfile(String email, UpdateProfileCommand command) {
		UserEntity user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		user.rename(command.fullName().trim());
		if (command.avatarUrl() != null) {
			user.updateAvatar(command.avatarUrl().trim());
		}

		userRepository.save(user);

		List<String> roles = userRoleRepository.findByUser_Id(user.getId())
				.stream()
				.map(r -> r.getRole().getCode().name())
				.toList();

		return UserProfileResponse.from(user, roles);
	}

	/**
	 * HTT-01-CN-006-TC-01 & TC-04: Tải lên tệp ảnh đại diện (< 2 MB, định dạng ảnh).
	 */
	@Transactional
	public UserProfileResponse uploadAvatar(String email, MultipartFile file) {
		UserEntity user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		if (file == null || file.isEmpty()) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED, "file", "Vui lòng chọn tệp ảnh");
		}

		// TC-04: Giới hạn dung lượng dưới 2 MB
		if (file.getSize() > MAX_AVATAR_BYTES) {
			throw new ApiException(ApiErrorCode.FILE_TOO_LARGE);
		}

		// TC-04: Kiểm tra định dạng ảnh
		String contentType = file.getContentType();
		String filename = file.getOriginalFilename();
		boolean isValidContentType = contentType != null && (
				contentType.equalsIgnoreCase("image/jpeg") ||
				contentType.equalsIgnoreCase("image/jpg") ||
				contentType.equalsIgnoreCase("image/png") ||
				contentType.equalsIgnoreCase("image/webp"));

		boolean isValidExtension = filename != null && (
				filename.toLowerCase().endsWith(".jpg") ||
				filename.toLowerCase().endsWith(".jpeg") ||
				filename.toLowerCase().endsWith(".png") ||
				filename.toLowerCase().endsWith(".webp"));

		if (!isValidContentType || !isValidExtension) {
			throw new ApiException(ApiErrorCode.INVALID_FILE_FORMAT);
		}

		try {
			Path dirPath = Paths.get(uploadDir);
			if (!Files.exists(dirPath)) {
				Files.createDirectories(dirPath);
			}

			String ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
			String newFileName = "avatar_" + user.getId() + "_" + UUID.randomUUID() + ext;
			Path destination = dirPath.resolve(newFileName);
			Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

			String avatarUrl = "/uploads/avatars/" + newFileName;
			user.updateAvatar(avatarUrl);
			userRepository.save(user);

			List<String> roles = userRoleRepository.findByUser_Id(user.getId())
					.stream()
					.map(r -> r.getRole().getCode().name())
					.toList();

			return UserProfileResponse.from(user, roles);
		} catch (IOException e) {
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR, "Không thể lưu tệp ảnh: " + e.getMessage());
		}
	}

	/**
	 * HTT-01-CN-006-TC-02 & TC-03: Đổi mật khẩu tài khoản (yêu cầu mật khẩu hiện tại).
	 */
	@Transactional
	public void changePassword(String email, ChangePasswordCommand command) {
		UserEntity user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		// TC-03: Kiểm tra mật khẩu hiện tại
		if (!passwordEncoder.matches(command.currentPassword(), user.getPasswordHash())) {
			throw new ApiException(ApiErrorCode.INVALID_CURRENT_PASSWORD);
		}

		// Mật khẩu xác nhận phải khớp
		if (!command.newPassword().equals(command.confirmPassword())) {
			throw new ApiException(ApiErrorCode.PASSWORD_CONFIRMATION_MISMATCH);
		}

		user.changePassword(passwordEncoder.encode(command.newPassword()));
		userRepository.save(user);

		auditLogService.record(
				user,
				"PASSWORD_CHANGED",
				"USER",
				String.valueOf(user.getId()),
				"Đổi mật khẩu người dùng thành công");
	}

	/**
	 * HTT-01-CN-009: Chuyển đổi chế độ làm việc (STUDENT ⇄ TEACHER).
	 * QTN-01 & QTN-03: Chỉ cho phép chuyển sang TEACHER nếu tài khoản sở hữu vai trò TEACHER hoặc ADMIN.
	 */
	@Transactional
	public UserProfileResponse switchMode(String email, com.hsk.account.domain.UiMode mode) {
		UserEntity user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		List<com.hsk.account.domain.RoleCode> roleCodes = userRoleRepository.findByUser_Id(user.getId()).stream()
				.map(ur -> ur.getRole().getCode())
				.toList();

		if (mode == com.hsk.account.domain.UiMode.TEACHER && !roleCodes.contains(com.hsk.account.domain.RoleCode.TEACHER) && !roleCodes.contains(com.hsk.account.domain.RoleCode.ADMIN)) {
			throw new ApiException(ApiErrorCode.TEACHER_ROLE_NOT_GRANTED);
		}

		user.recordSuccessfulLogin(mode);
		userRepository.save(user);

		auditLogService.record(
				user,
				"SWITCH_MODE",
				"USER",
				String.valueOf(user.getId()),
				"Chuyển đổi giao diện làm việc sang chế độ: " + mode);

		List<String> roleNames = roleCodes.stream().map(Enum::name).toList();
		return UserProfileResponse.from(user, roleNames);
	}
}
