package com.hsk.content.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "lessons")
public class LessonEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "hsk_level_id", nullable = false)
	private HskLevelEntity hskLevel;

	@Column(name = "title", nullable = false, length = 150)
	private String title;

	@Column(name = "description", length = 500)
	private String description;

	@Column(name = "sort_order", nullable = false)
	private Integer sortOrder = 1;

	@Column(name = "is_hidden", nullable = false)
	private boolean hidden = false;

	@Column(name = "created_by")
	private Long createdBy;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public LessonEntity() {
	}

	public LessonEntity(HskLevelEntity hskLevel, String title, String description, Integer sortOrder, Long createdBy) {
		this.hskLevel = hskLevel;
		this.title = title;
		this.description = description;
		this.sortOrder = sortOrder != null ? sortOrder : 1;
		this.createdBy = createdBy;
	}

	public Long getId() {
		return id;
	}

	public HskLevelEntity getHskLevel() {
		return hskLevel;
	}

	public void setHskLevel(HskLevelEntity hskLevel) {
		this.hskLevel = hskLevel;
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

	public boolean isHidden() {
		return hidden;
	}

	public void setHidden(boolean hidden) {
		this.hidden = hidden;
	}

	public Long getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(Long createdBy) {
		this.createdBy = createdBy;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
