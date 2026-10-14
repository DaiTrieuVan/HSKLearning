package com.hsk.account.domain;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * An account on the platform ({@code users} in the logical ERD, page 02).
 *
 * <p>State changes are expressed through intent-revealing methods ({@link #rename},
 * {@link #changePassword}) instead of public setters, so business rules stay next to the data
 * they guard.
 */
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
@Getter
public class UserEntity {

	protected UserEntity() {
	}

	/** BCrypt output is 60 characters; the column leaves room for a future algorithm. */
	private static final int PASSWORD_HASH_MAX_LENGTH = 100;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/** Stored lower case so the unique constraint behaves case-insensitively. */
	@Column(name = "email", nullable = false, unique = true, length = 190)
	private String email;

	@Column(name = "password_hash", nullable = false, length = PASSWORD_HASH_MAX_LENGTH)
	private String passwordHash;

	@Column(name = "full_name", nullable = false, length = 100)
	private String fullName;

	@Column(name = "avatar_url", length = 500)
	private String avatarUrl;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	private UserStatus status;

	/** QTN-17: consecutive failed sign-ins, reset on success. Used by HTT-01-CN-004. */
	@Column(name = "failed_login_count", nullable = false)
	private int failedLoginCount;

	/** QTN-17: while this is in the future the account cannot sign in. Used by HTT-01-CN-004. */
	@Column(name = "locked_until")
	private Instant lockedUntil;

	/** Last UI the account used. Presentation hint only, never an authority (see {@link UiMode}). */
	@Enumerated(EnumType.STRING)
	@Column(name = "last_mode", length = 20)
	private UiMode lastMode;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@LastModifiedDate
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	/**
	 * Creates an account in the state a self-service registration produces.
	 *
	 * @param email        already normalised to lower case by the caller
	 * @param passwordHash BCrypt hash, never the plain password
	 */
	public static UserEntity register(String email, String passwordHash, String fullName) {
		UserEntity user = new UserEntity();
		user.email = email;
		user.passwordHash = passwordHash;
		user.fullName = fullName;
		user.status = UserStatus.ACTIVE;
		return user;
	}

	/** Creates an account awaiting administrator approval (QTN-03, used by HTT-01-CN-002). */
	public static UserEntity registerPendingApproval(String email, String passwordHash, String fullName) {
		UserEntity user = register(email, passwordHash, fullName);
		user.status = UserStatus.PENDING;
		return user;
	}

	public void rename(String fullName) {
		this.fullName = fullName;
	}

	public void changePassword(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public void updateAvatar(String avatarUrl) {
		this.avatarUrl = avatarUrl;
	}

	/**
	 * QTN-17: Increments failed login count. Locks for 15 minutes after 5 consecutive failures.
	 */
	public void recordFailedLogin(Instant now) {
		this.failedLoginCount++;
		if (this.failedLoginCount >= 5) {
			this.lockedUntil = now.plus(15, java.time.temporal.ChronoUnit.MINUTES);
		}
	}

	/**
	 * Resets failed login counters and updates last mode preference on successful login.
	 */
	public void recordSuccessfulLogin(UiMode mode) {
		this.failedLoginCount = 0;
		this.lockedUntil = null;
		if (mode != null) {
			this.lastMode = mode;
		}
	}

	public void switchMode(UiMode mode) {
		this.lastMode = mode;
	}

	public boolean isTemporarilyLocked(Instant now) {
		return this.lockedUntil != null && this.lockedUntil.isAfter(now);
	}

	public boolean isPermanentlyLocked() {
		return this.status == UserStatus.LOCKED;
	}

	public void lock() {
		this.status = UserStatus.LOCKED;
	}

	public void unlock() {
		this.status = UserStatus.ACTIVE;
		this.failedLoginCount = 0;
		this.lockedUntil = null;
	}

	public void setStatus(UserStatus status) {
		this.status = status;
	}

	/**
	 * Roles are NOT modelled here: an account can hold several of them, so the truth lives in
	 * {@link UserRoleEntity}. See ERD page 02.
	 */
}
