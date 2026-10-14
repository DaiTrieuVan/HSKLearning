package com.hsk.common.audit;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.hsk.account.domain.UserEntity;

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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Nhật ký hoạt động hệ thống (ERD page 02, audit_logs).
 */
@Entity
@Table(name = "audit_logs")
@EntityListeners(AuditingEntityListener.class)
@Getter
public class AuditLogEntity {

	protected AuditLogEntity() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actor_id")
	private UserEntity actor;

	@Column(name = "action", nullable = false, length = 50)
	private String action;

	@Column(name = "entity_type", nullable = false, length = 50)
	private String entityType;

	@Column(name = "entity_id", length = 100)
	private String entityId;

	@Column(name = "detail", columnDefinition = "TEXT")
	private String detail;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public static AuditLogEntity of(UserEntity actor, String action, String entityType, String entityId, String detail) {
		AuditLogEntity log = new AuditLogEntity();
		log.actor = actor;
		log.action = action;
		log.entityType = entityType;
		log.entityId = entityId;
		log.detail = detail;
		return log;
	}
}
