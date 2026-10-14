package com.hsk.content.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "grammar_points")
public class GrammarPointEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "lesson_id", nullable = false)
	private LessonEntity lesson;

	@Column(name = "title", nullable = false, length = 200)
	private String title;

	@Column(name = "structure", length = 300)
	private String structure;

	@Column(name = "explanation", nullable = false, columnDefinition = "TEXT")
	private String explanation;

	@Column(name = "sort_order", nullable = false)
	private Integer sortOrder = 1;

	@OneToMany(mappedBy = "grammarPoint", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("sortOrder ASC")
	private List<GrammarExampleEntity> examples = new ArrayList<>();

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public GrammarPointEntity() {
	}

	public GrammarPointEntity(LessonEntity lesson, String title, String structure, String explanation, Integer sortOrder) {
		this.lesson = lesson;
		this.title = title;
		this.structure = structure;
		this.explanation = explanation;
		this.sortOrder = sortOrder != null ? sortOrder : 1;
	}

	public Long getId() {
		return id;
	}

	public LessonEntity getLesson() {
		return lesson;
	}

	public void setLesson(LessonEntity lesson) {
		this.lesson = lesson;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getStructure() {
		return structure;
	}

	public void setStructure(String structure) {
		this.structure = structure;
	}

	public String getExplanation() {
		return explanation;
	}

	public void setExplanation(String explanation) {
		this.explanation = explanation;
	}

	public Integer getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(Integer sortOrder) {
		this.sortOrder = sortOrder;
	}

	public List<GrammarExampleEntity> getExamples() {
		return examples;
	}

	public void addExample(GrammarExampleEntity example) {
		examples.add(example);
		example.setGrammarPoint(this);
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
