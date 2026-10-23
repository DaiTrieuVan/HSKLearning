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
@Table(name = "vocab_set_items")
public class VocabSetItemEntity {

	@EmbeddedId
	private VocabSetItemId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("vocabSetId")
	@JoinColumn(name = "vocab_set_id")
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private VocabSetEntity vocabSet;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("vocabularyId")
	@JoinColumn(name = "vocabulary_id")
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private VocabularyEntity vocabulary;

	@Column(name = "sort_order", nullable = false)
	private Integer sortOrder = 1;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public VocabSetItemEntity() {
	}

	public VocabSetItemEntity(VocabSetEntity vocabSet, VocabularyEntity vocabulary, Integer sortOrder) {
		this.id = new VocabSetItemId(vocabSet.getId(), vocabulary.getId());
		this.vocabSet = vocabSet;
		this.vocabulary = vocabulary;
		this.sortOrder = sortOrder != null ? sortOrder : 1;
	}

	public VocabSetItemId getId() {
		return id;
	}

	public VocabSetEntity getVocabSet() {
		return vocabSet;
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
