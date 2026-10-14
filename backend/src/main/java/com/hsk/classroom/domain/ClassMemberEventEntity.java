package com.hsk.classroom.domain;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
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
 * Lịch sử biến động thành viên trong lớp học (ERD page 02, class_member_events, QTN-06).
 */
@Entity
@Table(name = "class_member_events")
@EntityListeners(AuditingEntityListener.class)
@Getter
public class ClassMemberEventEntity {

	protected ClassMemberEventEntity() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "class_id", nullable = false)
	private ClassEntity classroom;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	private UserEntity student;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actor_id", nullable = false)
	private UserEntity actor;

	@Enumerated(EnumType.STRING)
	@Column(name = "event_type", nullable = false, length = 30)
	private ClassMemberEventType eventType;

	@Column(name = "reason", columnDefinition = "TEXT")
	private String reason;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public static ClassMemberEventEntity of(
			ClassEntity classroom,
			UserEntity student,
			UserEntity actor,
			ClassMemberEventType eventType,
			String reason) {
		ClassMemberEventEntity event = new ClassMemberEventEntity();
		event.classroom = classroom;
		event.student = student;
		event.actor = actor;
		event.eventType = eventType;
		event.reason = reason;
		return event;
	}
}
