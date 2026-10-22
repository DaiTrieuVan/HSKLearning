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
 * Thành viên học sinh trong lớp học (ERD page 02, class_members).
 */
@Entity
@Table(name = "class_members")
@EntityListeners(AuditingEntityListener.class)
@Getter
public class ClassMemberEntity {

	protected ClassMemberEntity() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "class_id", nullable = false)
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private ClassEntity classroom;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private UserEntity student;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	private ClassMemberStatus status;

	@CreatedDate
	@Column(name = "joined_at", nullable = false, updatable = false)
	private Instant joinedAt;

	@LastModifiedDate
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public static ClassMemberEntity create(ClassEntity classroom, UserEntity student) {
		ClassMemberEntity entity = new ClassMemberEntity();
		entity.classroom = classroom;
		entity.student = student;
		entity.status = ClassMemberStatus.ACTIVE;
		return entity;
	}

	public void remove() {
		this.status = ClassMemberStatus.REMOVED;
	}

	public void leave() {
		this.status = ClassMemberStatus.LEFT;
	}

	public void restore() {
		this.status = ClassMemberStatus.ACTIVE;
	}
}
