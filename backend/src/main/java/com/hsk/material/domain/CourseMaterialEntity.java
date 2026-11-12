package com.hsk.material.domain;

import java.time.Instant;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.hsk.account.domain.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;

/**
 * Giáo trình bài giảng (PDF / PPTX) thuộc kho cá nhân của giáo viên.
 */
@Entity
@Table(name = "course_materials")
@EntityListeners(AuditingEntityListener.class)
@Getter
public class CourseMaterialEntity {

	protected CourseMaterialEntity() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "teacher_id", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private UserEntity teacher;

	@Column(name = "title", nullable = false, length = 200)
	private String title;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "hsk_level")
	private Integer hskLevel;

	@Enumerated(EnumType.STRING)
	@Column(name = "file_type", nullable = false, length = 16)
	private MaterialFileType fileType;

	@Column(name = "original_filename", nullable = false, length = 255)
	private String originalFilename;

	@Column(name = "original_storage_path", nullable = false, length = 500)
	private String originalStoragePath;

	@Column(name = "file_size_bytes", nullable = false)
	private long fileSizeBytes;

	@Column(name = "total_pages", nullable = false)
	private int totalPages;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	private MaterialStatus status;

	@Column(name = "error_message", length = 500)
	private String errorMessage;

	@Column(name = "default_allow_download", nullable = false)
	private boolean defaultAllowDownload;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@LastModifiedDate
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public static CourseMaterialEntity createProcessing(
			UserEntity teacher,
			String title,
			String description,
			Integer hskLevel,
			MaterialFileType fileType,
			String originalFilename,
			String originalStoragePath,
			long fileSizeBytes,
			boolean defaultAllowDownload) {
		CourseMaterialEntity entity = new CourseMaterialEntity();
		entity.teacher = teacher;
		entity.title = title;
		entity.description = description;
		entity.hskLevel = hskLevel;
		entity.fileType = fileType;
		entity.originalFilename = originalFilename;
		entity.originalStoragePath = originalStoragePath;
		entity.fileSizeBytes = fileSizeBytes;
		entity.totalPages = 0;
		entity.status = MaterialStatus.PROCESSING;
		entity.defaultAllowDownload = defaultAllowDownload;
		return entity;
	}

	public void updateMetadata(String title, String description, Integer hskLevel, boolean defaultAllowDownload) {
		this.title = title;
		this.description = description;
		this.hskLevel = hskLevel;
		this.defaultAllowDownload = defaultAllowDownload;
	}

	public void markProcessing() {
		this.status = MaterialStatus.PROCESSING;
		this.errorMessage = null;
		this.totalPages = 0;
	}

	public void markReady(int totalPages) {
		this.status = MaterialStatus.READY;
		this.totalPages = totalPages;
		this.errorMessage = null;
	}

	public void markFailed(String errorMessage) {
		this.status = MaterialStatus.FAILED;
		this.totalPages = 0;
		this.errorMessage = errorMessage != null && errorMessage.length() > 500
				? errorMessage.substring(0, 500)
				: errorMessage;
	}
}
