package com.hsk.account.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hsk.account.domain.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

	/** Emails are stored lower case; callers must normalise before querying. */
	Optional<UserEntity> findByEmail(String email);

	Optional<UserEntity> findByEmailIgnoreCase(String email);

	boolean existsByEmail(String email);

	@org.springframework.data.jpa.repository.Query("""
		SELECT u FROM UserEntity u
		WHERE (:query IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')))
		  AND (:status IS NULL OR u.status = :status)
		ORDER BY u.id DESC
	""")
	org.springframework.data.domain.Page<UserEntity> searchUsers(
			@org.springframework.data.repository.query.Param("query") String query,
			@org.springframework.data.repository.query.Param("status") com.hsk.account.domain.UserStatus status,
			org.springframework.data.domain.Pageable pageable);
}
