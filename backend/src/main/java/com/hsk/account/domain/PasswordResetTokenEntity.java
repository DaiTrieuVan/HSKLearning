package com.hsk.account.domain;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;

/**
 * HTT-01-CN-005: Token đặt lại mật khẩu có hiệu lực 30 phút (QTN-17).
 */
@Entity
@Table(name = "password_reset_tokens")
@EntityListeners(AuditingEntityListener.class)
@Getter
public class PasswordResetTokenEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private UserEntity user;

	@Column(name = "token_hash", nullable = false, length = 100)
	private String tokenHash;

	@Column(name = "expires_at", nullable = false)
	private Instant expiresAt;

	@Column(name = "used_at")
	private Instant usedAt;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	protected PasswordResetTokenEntity() {
	}

	public static PasswordResetTokenEntity create(UserEntity user, String tokenHash, Instant now) {
		PasswordResetTokenEntity entity = new PasswordResetTokenEntity();
		entity.user = user;
		entity.tokenHash = tokenHash;
		// QTN-17: Token có hiệu lực 30 phút
		entity.expiresAt = now.plus(30, ChronoUnit.MINUTES);
		return entity;
	}

	public boolean isExpired(Instant now) {
		return now.isAfter(this.expiresAt);
	}

	public boolean isUsed() {
		return this.usedAt != null;
	}

	public void markUsed(Instant now) {
		this.usedAt = now;
	}
}
