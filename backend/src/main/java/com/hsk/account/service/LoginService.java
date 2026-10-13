package com.hsk.account.service;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.UiMode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.dto.LoginRequest;
import com.hsk.account.dto.LoginResponse;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.common.security.JwtService;

/**
 * HTT-01-CN-004: Handles user authentication, failed attempt throttling (QTN-17),
 * and workspace presentation modes.
 */
@Service
public class LoginService {

	private final UserRepository userRepository;

	private final UserRoleRepository userRoleRepository;

	private final PasswordEncoder passwordEncoder;

	private final JwtService jwtService;

	public LoginService(
			UserRepository userRepository,
			UserRoleRepository userRoleRepository,
			PasswordEncoder passwordEncoder,
			JwtService jwtService) {
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
	}

	@Transactional(noRollbackFor = ApiException.class)
	public LoginResponse login(LoginRequest request) {
		String email = request.normalizedEmail();
		Instant now = Instant.now();

		UserEntity user = userRepository.findByEmail(email).orElse(null);

		// TC-06: Unified error if email not found to avoid user enumeration
		if (user == null) {
			throw new ApiException(ApiErrorCode.INVALID_CREDENTIALS);
		}

		// TC-08: Permanently locked by administrator
		if (user.isPermanentlyLocked()) {
			throw new ApiException(ApiErrorCode.ACCOUNT_LOCKED);
		}

		// TC-09: Temporarily locked after 5 consecutive failed attempts
		if (user.isTemporarilyLocked(now)) {
			throw new ApiException(ApiErrorCode.ACCOUNT_TEMPORARILY_LOCKED);
		}

		// Verify password
		if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
			user.recordFailedLogin(now);
			userRepository.saveAndFlush(user);

			if (user.isTemporarilyLocked(now)) {
				throw new ApiException(ApiErrorCode.ACCOUNT_TEMPORARILY_LOCKED);
			}
			throw new ApiException(ApiErrorCode.INVALID_CREDENTIALS);
		}

		// Get roles
		Set<RoleCode> roles = userRoleRepository.findByUser_Id(user.getId()).stream()
				.map(ur -> ur.getRole().getCode())
				.collect(Collectors.toSet());

		// TC-13: Determine active mode
		UiMode activeMode = resolveActiveMode(user, roles, request.mode());

		// TC-10: Reset failed attempts on success and record mode
		user.recordSuccessfulLogin(activeMode);
		userRepository.save(user);

		String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getFullName(), roles);

		return new LoginResponse(
				token,
				user.getId(),
				user.getEmail(),
				user.getFullName(),
				user.getAvatarUrl(),
				user.getStatus(),
				roles,
				activeMode,
				false);
	}

	private UiMode resolveActiveMode(UserEntity user, Set<RoleCode> roles, UiMode requestedMode) {
		if (requestedMode != null && hasMatchingRole(roles, requestedMode)) {
			return requestedMode;
		}
		if (user.getLastMode() != null && hasMatchingRole(roles, user.getLastMode())) {
			return user.getLastMode();
		}
		if (roles.contains(RoleCode.TEACHER)) {
			return UiMode.TEACHER;
		}
		return UiMode.STUDENT;
	}

	private boolean hasMatchingRole(Set<RoleCode> roles, UiMode mode) {
		if (mode == UiMode.TEACHER) {
			return roles.contains(RoleCode.TEACHER) || roles.contains(RoleCode.ADMIN);
		}
		return roles.contains(RoleCode.STUDENT);
	}
}
