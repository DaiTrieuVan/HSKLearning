package com.hsk.learning.domain;

import com.hsk.account.domain.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(
		name = "user_xp_transactions",
		uniqueConstraints = {
				@UniqueConstraint(name = "uq_user_xp_source", columnNames = {"user_id", "source_type", "source_id"})
		}
)
@Getter
@Setter
@NoArgsConstructor
public class UserXpTransactionEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private UserEntity user;

	@Column(name = "xp_amount", nullable = false)
	private int xpAmount;

	@Column(name = "source_type", nullable = false, length = 50)
	private String sourceType;

	@Column(name = "source_id", length = 100)
	private String sourceId;

	@Column(name = "description", nullable = false)
	private String description;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public UserXpTransactionEntity(
			UserEntity user,
			int xpAmount,
			String sourceType,
			String sourceId,
			String description
	) {
		this.user = user;
		this.xpAmount = xpAmount;
		this.sourceType = sourceType;
		this.sourceId = sourceId;
		this.description = description;
	}
}
