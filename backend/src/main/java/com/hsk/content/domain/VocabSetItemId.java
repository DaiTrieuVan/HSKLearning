package com.hsk.content.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class VocabSetItemId implements Serializable {

	@Column(name = "vocab_set_id")
	private Long vocabSetId;

	@Column(name = "vocabulary_id")
	private Long vocabularyId;

	public VocabSetItemId() {
	}

	public VocabSetItemId(Long vocabSetId, Long vocabularyId) {
		this.vocabSetId = vocabSetId;
		this.vocabularyId = vocabularyId;
	}

	public Long getVocabSetId() {
		return vocabSetId;
	}

	public void setVocabSetId(Long vocabSetId) {
		this.vocabSetId = vocabSetId;
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
		VocabSetItemId that = (VocabSetItemId) o;
		return Objects.equals(vocabSetId, that.vocabSetId) && Objects.equals(vocabularyId, that.vocabularyId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(vocabSetId, vocabularyId);
	}
}
