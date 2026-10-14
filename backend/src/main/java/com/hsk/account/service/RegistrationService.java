package com.hsk.account.service;

import java.util.Set;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.RoleEntity;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
import com.hsk.account.dto.AccountResponse;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.RoleRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;

/**
 * HTT-01-CN-001 / HTT-01-CN-001-CV-04: create a student account from a public registration form.
 *
 * <p>Rules honoured here:
 * <ul>
 *   <li>QTN-17 — passwords need at least 8 characters; hashing is BCrypt.</li>
 *   <li>CV-01 — every self-service registration becomes a STUDENT.</li>
 *   <li>ERD page 02 — a STUDENT is granted immediately, TEACHER needs approval (that is
 *       HTT-01-CN-002 and is deliberately not implemented yet).</li>
 * </ul>
 */
@Service
public class RegistrationService {

	private final UserRepository userRepository;

	private final UserRoleRepository userRoleRepository;

	private final RoleRepository roleRepository;

	private final PasswordEncoder passwordEncoder;

	public RegistrationService(UserRepository userRepository, UserRoleRepository userRoleRepository,
			RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
		this.roleRepository = roleRepository;
		this.passwordEncoder = passwordEncoder;
	}

	/**
	 * @throws ApiException with {@code EMAIL_ALREADY_IN_USE} when the address is taken (TC-02)
	 *             or {@code PASSWORD_CONFIRMATION_MISMATCH} when the two inputs differ (TC-05)
	 */
	@Transactional
	public AccountResponse registerStudent(RegisterStudentRequest request) {
		if (!request.password().equals(request.confirmPassword())) {
			throw new ApiException(ApiErrorCode.PASSWORD_CONFIRMATION_MISMATCH, "confirmPassword",
					ApiErrorCode.PASSWORD_CONFIRMATION_MISMATCH.message());
		}

		String email = request.normalizedEmail();
		if (userRepository.existsByEmail(email)) {
			throw new ApiException(ApiErrorCode.EMAIL_ALREADY_IN_USE);
		}

		RoleEntity studentRole = roleRepository.findByCode(RoleCode.STUDENT)
				.orElseThrow(() -> new IllegalStateException(
						"Role STUDENT is missing; the Flyway baseline V1 must seed roles"));

		UserEntity saved;
		try {
			// saveAndFlush: forces the INSERT now so the unique index is checked before the
			// transaction commits and we can report a clean 409 instead of a 500.
			saved = userRepository.saveAndFlush(UserEntity.register(email,
					passwordEncoder.encode(request.password()), request.fullName().trim()));
			// grantedBy stays null: the role was granted by the system as part of self registration.
			userRoleRepository.save(UserRoleEntity.of(saved, studentRole, null));
		}
		catch (DataIntegrityViolationException ex) {
			// Lost the race against another registration with the same email (unique index uk_users_email).
			throw new ApiException(ApiErrorCode.EMAIL_ALREADY_IN_USE);
		}

		return AccountResponse.of(saved, Set.of(RoleCode.STUDENT));
	}
}
