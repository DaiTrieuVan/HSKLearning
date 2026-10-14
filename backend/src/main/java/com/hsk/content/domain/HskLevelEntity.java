package com.hsk.content.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "hsk_levels")
public class HskLevelEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "code", nullable = false, unique = true, length = 50)
	private String code;

	@Column(name = "title", nullable = false, length = 100)
	private String title;

	@Column(name = "level_number", nullable = false, unique = true)
	private Integer levelNumber;

	@Column(name = "description", length = 500)
	private String description;

	@Column(name = "target_vocab_count", nullable = false)
	private Integer targetVocabCount = 150;

	@Column(name = "is_hidden", nullable = false)
	private boolean hidden = false;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public HskLevelEntity() {
	}

	public HskLevelEntity(String code, String title, Integer levelNumber, String description, Integer targetVocabCount) {
		this.code = code;
		this.title = title;
		this.levelNumber = levelNumber;
		this.description = description;
		this.targetVocabCount = targetVocabCount != null ? targetVocabCount : 150;
	}

	public Long getId() {
		return id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Integer getLevelNumber() {
		return levelNumber;
	}

	public void setLevelNumber(Integer levelNumber) {
		this.levelNumber = levelNumber;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getTargetVocabCount() {
		return targetVocabCount;
	}

	public void setTargetVocabCount(Integer targetVocabCount) {
		this.targetVocabCount = targetVocabCount;
	}

	public boolean isHidden() {
		return hidden;
	}

	public void setHidden(boolean hidden) {
		this.hidden = hidden;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
