package com.hsk.learning.domain;

import com.hsk.account.domain.UserEntity;
import com.hsk.content.domain.VocabularyEntity;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "vocab_learning")
public class VocabLearningEntity {

	@EmbeddedId
	private VocabLearningId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("userId")
	@JoinColumn(name = "user_id")
	private UserEntity user;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("vocabularyId")
	@JoinColumn(name = "vocabulary_id")
	private VocabularyEntity vocabulary;

	@Enumerated(EnumType.STRING)
	@Column(name = "last_result", nullable = false, length = 20)
	private FlashcardResult lastResult;

	@Column(name = "repetition_level", nullable = false)
	private Integer repetitionLevel = 1;

	@Column(name = "interval_days", nullable = false)
	private Integer intervalDays = 1;

	@Column(name = "ease_factor", nullable = false)
	private Double easeFactor = 2.5;

	@Column(name = "next_review_at")
	private Instant nextReviewAt;

	@Column(name = "review_count", nullable = false)
	private Integer reviewCount = 1;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public VocabLearningEntity() {
	}

	public VocabLearningEntity(UserEntity user, VocabularyEntity vocabulary) {
		this.id = new VocabLearningId(user.getId(), vocabulary.getId());
		this.user = user;
		this.vocabulary = vocabulary;
		this.repetitionLevel = 0;
		this.intervalDays = 1;
		this.easeFactor = 2.5;
		this.reviewCount = 0;
	}

	public VocabLearningEntity(UserEntity user, VocabularyEntity vocabulary, FlashcardResult lastResult) {
		this.id = new VocabLearningId(user.getId(), vocabulary.getId());
		this.user = user;
		this.vocabulary = vocabulary;
		this.lastResult = lastResult;
		this.repetitionLevel = (lastResult == FlashcardResult.REMEMBERED) ? 1 : 0;
		this.intervalDays = 1;
		this.easeFactor = 2.5;
		this.reviewCount = 1;
		this.nextReviewAt = Instant.now().plusSeconds(86400L);
	}

	public void recordReview(FlashcardResult result) {
		this.lastResult = result;
		this.reviewCount = (this.reviewCount != null ? this.reviewCount : 0) + 1;
		if (result == FlashcardResult.REMEMBERED) {
			this.repetitionLevel = (this.repetitionLevel != null ? this.repetitionLevel : 0) + 1;
			this.intervalDays = (this.intervalDays != null ? this.intervalDays : 1) * 2;
			this.nextReviewAt = Instant.now().plusSeconds((long) this.intervalDays * 86400L);
		} else {
			this.repetitionLevel = 0;
			this.intervalDays = 1;
			this.nextReviewAt = Instant.now().plusSeconds(86400L);
		}
	}

	public void recordSrsReview(FlashcardResult result) {
		this.lastResult = result;
		this.reviewCount = (this.reviewCount != null ? this.reviewCount : 0) + 1;
		if (result == FlashcardResult.REMEMBERED) {
			int currentLevel = (this.repetitionLevel != null) ? this.repetitionLevel : 0;
			if (currentLevel <= 0) {
				this.repetitionLevel = 1;
				this.intervalDays = 1;
			} else if (currentLevel == 1) {
				this.repetitionLevel = 2;
				this.intervalDays = 6;
			} else {
				this.repetitionLevel = currentLevel + 1;
				double ef = (this.easeFactor != null && this.easeFactor > 0) ? this.easeFactor : 2.5;
				int prevInterval = (this.intervalDays != null && this.intervalDays > 0) ? this.intervalDays : 6;
				this.intervalDays = (int) Math.round(prevInterval * ef);
			}
		} else {
			this.repetitionLevel = 0;
			this.intervalDays = 1;
		}
		this.nextReviewAt = Instant.now().plusSeconds((long) this.intervalDays * 86400L);
	}

	public VocabLearningId getId() {
		return id;
	}

	public UserEntity getUser() {
		return user;
	}

	public VocabularyEntity getVocabulary() {
		return vocabulary;
	}

	public FlashcardResult getLastResult() {
		return lastResult;
	}

	public void setLastResult(FlashcardResult lastResult) {
		this.lastResult = lastResult;
	}

	public Integer getRepetitionLevel() {
		return repetitionLevel;
	}

	public void setRepetitionLevel(Integer repetitionLevel) {
		this.repetitionLevel = repetitionLevel;
	}

	public Integer getIntervalDays() {
		return intervalDays;
	}

	public void setIntervalDays(Integer intervalDays) {
		this.intervalDays = intervalDays;
	}

	public Double getEaseFactor() {
		return easeFactor;
	}

	public void setEaseFactor(Double easeFactor) {
		this.easeFactor = easeFactor;
	}

	public Instant getNextReviewAt() {
		return nextReviewAt;
	}

	public void setNextReviewAt(Instant nextReviewAt) {
		this.nextReviewAt = nextReviewAt;
	}

	public Integer getReviewCount() {
		return reviewCount;
	}

	public void setReviewCount(Integer reviewCount) {
		this.reviewCount = reviewCount;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
