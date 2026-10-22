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
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(
		name = "daily_challenge_history",
		uniqueConstraints = {
				@UniqueConstraint(name = "uq_daily_challenge_user_date", columnNames = {"user_id", "challenge_date"})
		}
)
@Getter
@Setter
@NoArgsConstructor
public class DailyChallengeHistoryEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private UserEntity user;

	@Column(name = "challenge_date", nullable = false)
	private LocalDate challengeDate;

	@Column(name = "completed", nullable = false)
	private boolean completed = false;

	@Column(name = "reward_xp", nullable = false)
	private int rewardXp = 50;

	@Column(name = "reward_claimed", nullable = false)
	private boolean rewardClaimed = false;

	@Column(name = "completed_at")
	private Instant completedAt;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public DailyChallengeHistoryEntity(UserEntity user, LocalDate challengeDate, int rewardXp) {
		this.user = user;
		this.challengeDate = challengeDate;
		this.rewardXp = rewardXp;
		this.completed = false;
		this.rewardClaimed = false;
	}

	public void markCompleted() {
		if (!this.completed) {
			this.completed = true;
			this.completedAt = Instant.now();
		}
	}

	public boolean claimReward() {
		if (this.completed && !this.rewardClaimed) {
			this.rewardClaimed = true;
			return true;
		}
		return false;
	}
}
