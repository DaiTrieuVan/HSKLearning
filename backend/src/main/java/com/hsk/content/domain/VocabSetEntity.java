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
@Table(name = "vocab_sets")
public class VocabSetEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "teacher_id", nullable = false)
	private Long teacherId;

	@Column(name = "folder_id")
	private Long folderId;

	@Column(name = "title", nullable = false, length = 150)
	private String title;

	@Column(name = "description", length = 500)
	private String description;

	@Column(name = "is_public", nullable = false)
	private boolean isPublic = false;

	@Column(name = "share_code", length = 50, unique = true)
	private String shareCode;

	@Column(name = "color", nullable = false, length = 50)
	private String color = "#10b981";

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public VocabSetEntity() {
	}

	public VocabSetEntity(Long teacherId, String title, String description) {
		this.teacherId = teacherId;
		this.title = title;
		this.description = description;
	}

	public VocabSetEntity(Long teacherId, Long folderId, String title, String description, boolean isPublic, String color) {
		this.teacherId = teacherId;
		this.folderId = folderId;
		this.title = title;
		this.description = description;
		this.isPublic = isPublic;
		this.color = (color != null && !color.isBlank()) ? color : "#10b981";
	}

	public Long getId() {
		return id;
	}

	public Long getTeacherId() {
		return teacherId;
	}

	public void setTeacherId(Long teacherId) {
		this.teacherId = teacherId;
	}

	public Long getFolderId() {
		return folderId;
	}

	public void setFolderId(Long folderId) {
		this.folderId = folderId;
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

	public boolean isPublic() {
		return isPublic;
	}

	public void setPublic(boolean isPublic) {
		this.isPublic = isPublic;
	}

	public String getShareCode() {
		return shareCode;
	}

	public void setShareCode(String shareCode) {
		this.shareCode = shareCode;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = (color != null && !color.isBlank()) ? color : "#10b981";
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
