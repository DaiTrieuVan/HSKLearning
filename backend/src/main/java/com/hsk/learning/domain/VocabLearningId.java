package com.hsk.learning.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class VocabLearningId implements Serializable {

	@Column(name = "user_id")
	private Long userId;

	@Column(name = "vocabulary_id")
	private Long vocabularyId;

	public VocabLearningId() {
	}

	public VocabLearningId(Long userId, Long vocabularyId) {
		this.userId = userId;
		this.vocabularyId = vocabularyId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getVocabularyId() {
		return vocabularyId;
	}

	public void setVocabularyId(Long vocabularyId) {
		this.vocabularyId = vocabularyId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		VocabLearningId that = (VocabLearningId) o;
		return Objects.equals(userId, that.userId) && Objects.equals(vocabularyId, that.vocabularyId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(userId, vocabularyId);
	}
}
