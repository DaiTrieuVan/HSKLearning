package com.hsk.content.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ClassVocabSetId implements Serializable {

	@Column(name = "class_id")
	private Long classId;

	@Column(name = "vocab_set_id")
	private Long vocabSetId;

	public ClassVocabSetId() {
	}

	public ClassVocabSetId(Long classId, Long vocabSetId) {
		this.classId = classId;
		this.vocabSetId = vocabSetId;
	}

	public Long getClassId() {
		return classId;
	}

	public void setClassId(Long classId) {
		this.classId = classId;
	}

	public Long getVocabSetId() {
		return vocabSetId;
	}

	public void setVocabSetId(Long vocabSetId) {
		this.vocabSetId = vocabSetId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		ClassVocabSetId that = (ClassVocabSetId) o;
		return Objects.equals(classId, that.classId) && Objects.equals(vocabSetId, that.vocabSetId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(classId, vocabSetId);
	}
}
