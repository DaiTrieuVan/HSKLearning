package com.hsk.account.domain;

/**
 * Role codes seeded by {@code V1__create_account_tables.sql} (ERD page 02, table {@code roles.code}).
 *
 * <p>The platform has exactly three roles; a user may hold several of them at once, which is why
 * {@code user_roles} is an N-N link table rather than a column on {@code users}.
 */
public enum RoleCode {

	/** Quản trị viên nền tảng (VT-01). */
	ADMIN,

	/** Giáo viên (VT-02). */
	TEACHER,

	/** Học sinh (VT-03). */
	STUDENT
}
