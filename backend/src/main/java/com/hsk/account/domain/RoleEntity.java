package com.hsk.account.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
 * A role offered by the platform ({@code roles}, ERD page 02).
 *
 * <p>Columns deliberately match the ERD, which defines only {@code id} and a unique {@code code}:
 * the Vietnamese label shown in the UI belongs to the frontend, not to a second source of truth.
 * Rows are created by the Flyway baseline and never inserted at runtime, so this entity is
 * read-only.
 */
@Entity
@Table(name = "roles")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RoleEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(name = "code", nullable = false, unique = true, length = 30)
	private RoleCode code;
}
