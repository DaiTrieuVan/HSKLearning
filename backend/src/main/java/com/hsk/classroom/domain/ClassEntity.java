package com.hsk.classroom.domain;

import java.time.Instant;

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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Lớp học do giáo viên phụ trách (ERD page 02, classes).
 */
@Entity
@Table(name = "classes")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ClassEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "teacher_id", nullable = false)
	private UserEntity teacher;

	@Column(name = "title", nullable = false, length = 150)
	private String title;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "join_code", nullable = false, unique = true, length = 6)
	private String joinCode;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	private ClassStatus status;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@LastModifiedDate
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public static ClassEntity create(UserEntity teacher, String title, String description, String joinCode) {
		ClassEntity entity = new ClassEntity();
		entity.teacher = teacher;
		entity.title = title;
		entity.description = description;
		entity.joinCode = joinCode;
		entity.status = ClassStatus.ACTIVE;
		return entity;
	}

	public void updateInfo(String title, String description) {
		this.title = title;
		this.description = description;
	}

	public void archive() {
		this.status = ClassStatus.ARCHIVED;
	}

	public void activate() {
		this.status = ClassStatus.ACTIVE;
	}

	public boolean isArchived() {
		return this.status == ClassStatus.ARCHIVED;
	}
}
