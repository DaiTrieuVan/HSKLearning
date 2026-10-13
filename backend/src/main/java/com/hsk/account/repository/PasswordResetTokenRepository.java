package com.hsk.account.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hsk.account.domain.PasswordResetTokenEntity;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokenEntity, Long> {

	Optional<PasswordResetTokenEntity> findByTokenHash(String tokenHash);
}
