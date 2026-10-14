package com.hsk.content.domain;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "lesson_vocabularies")
public class LessonVocabularyEntity {

	@EmbeddedId
	private LessonVocabularyId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("lessonId")
	@JoinColumn(name = "lesson_id")
	private LessonEntity lesson;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("vocabularyId")
	@JoinColumn(name = "vocabulary_id")
	private VocabularyEntity vocabulary;

	@Column(name = "sort_order", nullable = false)
	private Integer sortOrder = 1;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public LessonVocabularyEntity() {
	}

	public LessonVocabularyEntity(LessonEntity lesson, VocabularyEntity vocabulary, Integer sortOrder) {
		this.id = new LessonVocabularyId(lesson.getId(), vocabulary.getId());
		this.lesson = lesson;
		this.vocabulary = vocabulary;
		this.sortOrder = sortOrder != null ? sortOrder : 1;
	}

	public LessonVocabularyId getId() {
		return id;
	}

	public LessonEntity getLesson() {
		return lesson;
	}

	public VocabularyEntity getVocabulary() {
		return vocabulary;
	}

	public Integer getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(Integer sortOrder) {
		this.sortOrder = sortOrder;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}
