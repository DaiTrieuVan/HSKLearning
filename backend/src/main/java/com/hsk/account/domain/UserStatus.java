package com.hsk.account.domain;

/**
 * Lifecycle state of an account ({@code users.status}).
 *
 * <p>Separate from {@code users.locked_until}: a temporary lock produced by QTN-17 keeps the
 * account {@link #ACTIVE} and only sets {@code locked_until}, while {@link #LOCKED} is the
 * explicit lock an administrator applies through HTT-01-CN-008.
 */
public enum UserStatus {

	/** Created but waiting for approval; only teacher registrations reach this state (QTN-03). */
	PENDING,

	/** Normal state, the account can sign in. */
	ACTIVE,

	/** Blocked by an administrator. */
	LOCKED
}
