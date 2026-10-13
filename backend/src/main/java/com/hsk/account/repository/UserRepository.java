package com.hsk.account.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hsk.account.domain.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

	/** Emails are stored lower case; callers must normalise before querying. */
	Optional<UserEntity> findByEmail(String email);

	Optional<UserEntity> findByEmailIgnoreCase(String email);

	boolean existsByEmail(String email);
}
