package com.hsk.content.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class LessonVocabularyId implements Serializable {

	@Column(name = "lesson_id")
	private Long lessonId;

	@Column(name = "vocabulary_id")
	private Long vocabularyId;

	public LessonVocabularyId() {
	}

	public LessonVocabularyId(Long lessonId, Long vocabularyId) {
		this.lessonId = lessonId;
		this.vocabularyId = vocabularyId;
	}

	public Long getLessonId() {
		return lessonId;
	}

	public void setLessonId(Long lessonId) {
		this.lessonId = lessonId;
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
		LessonVocabularyId that = (LessonVocabularyId) o;
		return Objects.equals(lessonId, that.lessonId) && Objects.equals(vocabularyId, that.vocabularyId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(lessonId, vocabularyId);
	}
}
