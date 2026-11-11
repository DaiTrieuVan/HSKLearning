package com.hsk.learning.domain;

import com.hsk.account.domain.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
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
		name = "vocab_practice_sessions",
		uniqueConstraints = {
				@UniqueConstraint(name = "uq_vps_user_idempotency", columnNames = {"user_id", "idempotency_key"})
		},
		indexes = {
				@Index(name = "idx_vps_user_completed", columnList = "user_id, completed_at")
		}
)
@Getter
@Setter
@NoArgsConstructor
public class VocabPracticeSessionEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private UserEntity user;

	@Column(name = "vocab_set_id")
	private Long vocabSetId;

	@Column(name = "vocab_set_title", nullable = false, length = 200)
	private String vocabSetTitle = "Tất cả bộ từ";

	@Column(name = "game_type", nullable = false, length = 30)
	private String gameType;

	@Column(name = "game_mode", nullable = false, length = 50)
	private String gameMode;

	@Column(name = "correct_count", nullable = false)
	private int correctCount = 0;

	@Column(name = "total_count", nullable = false)
	private int totalCount = 0;

	@Column(name = "xp_earned", nullable = false)
	private int xpEarned = 0;

	@Column(name = "duration_seconds", nullable = false)
	private int durationSeconds = 0;

	@Column(name = "idempotency_key", length = 100)
	private String idempotencyKey;

	@CreationTimestamp
	@Column(name = "completed_at", nullable = false, updatable = false)
	private Instant completedAt;

	public VocabPracticeSessionEntity(
			UserEntity user,
			Long vocabSetId,
			String vocabSetTitle,
			String gameType,
			String gameMode,
			int correctCount,
			int totalCount,
			int xpEarned,
			int durationSeconds,
			String idempotencyKey) {
		this.user = user;
		this.vocabSetId = vocabSetId;
		this.vocabSetTitle = (vocabSetTitle != null && !vocabSetTitle.isBlank()) ? vocabSetTitle : "Tất cả bộ từ";
		this.gameType = gameType;
		this.gameMode = gameMode;
		this.correctCount = correctCount;
		this.totalCount = totalCount;
		this.xpEarned = xpEarned;
		this.durationSeconds = Math.max(0, durationSeconds);
		this.idempotencyKey = (idempotencyKey != null && !idempotencyKey.isBlank()) ? idempotencyKey.trim() : null;
	}
}
