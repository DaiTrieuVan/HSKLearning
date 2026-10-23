package com.hsk.account.domain;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Grants a role to an account ({@code user_roles}, ERD page 02).
 *
 * <p>The primary key is the pair {@code (user_id, role_id)} exactly as the ERD and task
 * HTT-01-CN-001-CV-03 require: a role can be granted to one account only once, and the link table
 * is what makes "one person can be both a teacher and a student" possible.
 */
@Entity
@Table(name = "user_roles")
@IdClass(UserRoleId.class)
@EntityListeners(AuditingEntityListener.class)
@Getter
public class UserRoleEntity {

	protected UserRoleEntity() {
	}

	@Id
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_roles_user"))
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private UserEntity user;

	@Id
	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "role_id", nullable = false, foreignKey = @ForeignKey(name = "fk_user_roles_role"))
	private RoleEntity role;

	/** Null when the platform granted the role automatically, i.e. STUDENT during self registration. */
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "granted_by", foreignKey = @ForeignKey(name = "fk_user_roles_granted_by"))
	private UserEntity grantedBy;

	@CreatedDate
	@Column(name = "granted_at", nullable = false, updatable = false)
	private Instant grantedAt;

	public static UserRoleEntity of(UserEntity user, RoleEntity role, UserEntity grantedBy) {
		UserRoleEntity grant = new UserRoleEntity();
		grant.user = user;
		grant.role = role;
		grant.grantedBy = grantedBy;
		return grant;
	}
}
