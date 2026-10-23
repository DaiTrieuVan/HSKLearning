package com.hsk.learning.domain;

import com.hsk.account.domain.UserEntity;
import com.hsk.content.domain.LessonEntity;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "lesson_progress")
public class LessonProgressEntity {

	@EmbeddedId
	private LessonProgressId id;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("userId")
	@JoinColumn(name = "user_id")
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private UserEntity user;

	@ManyToOne(fetch = FetchType.LAZY)
	@MapsId("lessonId")
	@JoinColumn(name = "lesson_id")
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private LessonEntity lesson;

	@CreationTimestamp
	@Column(name = "completed_at", nullable = false, updatable = false)
	private Instant completedAt;

	public LessonProgressEntity() {
	}

	public LessonProgressEntity(UserEntity user, LessonEntity lesson) {
		this.id = new LessonProgressId(user.getId(), lesson.getId());
		this.user = user;
		this.lesson = lesson;
	}

	public LessonProgressId getId() {
		return id;
	}

	public UserEntity getUser() {
		return user;
	}

	public LessonEntity getLesson() {
		return lesson;
	}

	public Instant getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(Instant completedAt) {
		this.completedAt = completedAt;
	}
}
