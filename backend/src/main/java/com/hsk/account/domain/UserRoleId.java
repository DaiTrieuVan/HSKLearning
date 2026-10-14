package com.hsk.account.domain;

import java.io.Serializable;
import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

/**
 * Composite primary key of {@link UserRoleEntity}, as required by HTT-01-CN-001-CV-03
 * ("user_roles có khóa chính kép (user_id, role_id)").
 */
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleId implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long user;

	private Long role;

	@Override
	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof UserRoleId that)) {
			return false;
		}
		return Objects.equals(user, that.user) && Objects.equals(role, that.role);
	}

	@Override
	public int hashCode() {
		return Objects.hash(user, role);
	}
}
