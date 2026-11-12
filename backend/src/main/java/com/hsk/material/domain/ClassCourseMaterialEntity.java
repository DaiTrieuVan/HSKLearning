package com.hsk.material.domain;

import java.time.Instant;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.hsk.account.domain.UserEntity;
import com.hsk.classroom.domain.ClassEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;

/**
 * Liên kết chia sẻ giáo trình vào lớp học kèm cấu hình cho phép tải file gốc hay chỉ xem.
 */
@Entity
@Table(
		name = "class_course_materials",
		uniqueConstraints = @UniqueConstraint(name = "uk_ccm_class_material", columnNames = { "class_id", "material_id" })
)
@EntityListeners(AuditingEntityListener.class)
@Getter
public class ClassCourseMaterialEntity {

	protected ClassCourseMaterialEntity() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "class_id", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private ClassEntity classroom;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "material_id", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private CourseMaterialEntity material;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "shared_by", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private UserEntity sharedBy;

	@Column(name = "allow_download", nullable = false)
	private boolean allowDownload;

	@Column(name = "note", length = 500)
	private String note;

	@CreatedDate
	@Column(name = "shared_at", nullable = false, updatable = false)
	private Instant sharedAt;

	public static ClassCourseMaterialEntity create(
			ClassEntity classroom,
			CourseMaterialEntity material,
			UserEntity sharedBy,
			boolean allowDownload,
			String note) {
		ClassCourseMaterialEntity entity = new ClassCourseMaterialEntity();
		entity.classroom = classroom;
		entity.material = material;
		entity.sharedBy = sharedBy;
		entity.allowDownload = allowDownload;
		entity.note = note;
		return entity;
	}

	public void updateShareSettings(boolean allowDownload, String note) {
		this.allowDownload = allowDownload;
		this.note = note;
	}

	public void setAllowDownload(boolean allowDownload) {
		this.allowDownload = allowDownload;
	}
}
