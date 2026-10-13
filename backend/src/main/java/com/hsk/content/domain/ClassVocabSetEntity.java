package com.hsk.content.domain;

import com.hsk.classroom.domain.ClassEntity;
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
@Table(name = "class_vocab_sets")
public class ClassVocabSetEntity {

	@EmbeddedId
	private ClassVocabSetId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("classId")
	@JoinColumn(name = "class_id")
	private ClassEntity classroom;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("vocabSetId")
	@JoinColumn(name = "vocab_set_id")
	private VocabSetEntity vocabSet;

	@CreationTimestamp
	@Column(name = "assigned_at", nullable = false, updatable = false)
	private Instant assignedAt;

	public ClassVocabSetEntity() {
	}

	public ClassVocabSetEntity(ClassEntity classroom, VocabSetEntity vocabSet) {
		this.id = new ClassVocabSetId(classroom.getId(), vocabSet.getId());
		this.classroom = classroom;
		this.vocabSet = vocabSet;
	}

	public ClassVocabSetId getId() {
		return id;
	}

	public ClassEntity getClassroom() {
		return classroom;
	}

	public VocabSetEntity getVocabSet() {
		return vocabSet;
	}

	public Instant getAssignedAt() {
		return assignedAt;
	}
}
