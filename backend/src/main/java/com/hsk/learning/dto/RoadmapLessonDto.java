package com.hsk.learning.dto;

import java.time.Instant;

public class RoadmapLessonDto {

	private Long id;
	private String title;
	private String description;
	private Integer sortOrder;
	private int vocabCount;
	private int grammarCount;
	private boolean completed;
	private Instant completedAt;

	public RoadmapLessonDto() {
	}

	public RoadmapLessonDto(
			Long id,
			String title,
			String description,
			Integer sortOrder,
			int vocabCount,
			int grammarCount,
			boolean completed,
			Instant completedAt) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.sortOrder = sortOrder;
		this.vocabCount = vocabCount;
		this.grammarCount = grammarCount;
		this.completed = completed;
		this.completedAt = completedAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(Integer sortOrder) {
		this.sortOrder = sortOrder;
	}

	public int getVocabCount() {
		return vocabCount;
	}

	public void setVocabCount(int vocabCount) {
		this.vocabCount = vocabCount;
	}

	public int getGrammarCount() {
		return grammarCount;
	}

	public void setGrammarCount(int grammarCount) {
		this.grammarCount = grammarCount;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	}

	public Instant getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(Instant completedAt) {
		this.completedAt = completedAt;
	}
}
