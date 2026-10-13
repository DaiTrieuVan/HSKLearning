package com.hsk.account.domain;

/**
 * The workspace an account last used ({@code users.last_mode}).
 *
 * <p>Distinct from {@link RoleCode} on purpose. The ERD notes that {@code last_mode} only drives
 * the interface, while access rights are always checked server side; keeping it a separate type
 * prevents anyone from reading it as an authority.
 */
public enum UiMode {

	/** The student learning workspace. */
	STUDENT,

	/** The teacher classroom workspace. */
	TEACHER
}
