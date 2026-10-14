package com.hsk.account.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.RoleEntity;

/** Read-only access to the seeded {@code roles} catalogue. */
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {

	Optional<RoleEntity> findByCode(RoleCode code);
}
