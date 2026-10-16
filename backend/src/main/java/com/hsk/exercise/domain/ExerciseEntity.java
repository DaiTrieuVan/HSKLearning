package com.hsk.exercise.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * Thực thể Bài tập do giáo viên tạo ra (HTT-05-CN-006).
 * Đóng gói câu hỏi thành bài tập hoàn chỉnh, sẵn sàng giao cho lớp (QTN-09, QTN-19).
 */
@Entity
@Table(name = "exercises")
public class ExerciseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "owner_id", nullable = false)
	private Long ownerId;

	@Column(name = "title", nullable = false)
	private String title;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 50)
	private ExerciseStatus status = ExerciseStatus.DRAFT;

	@Column(name = "total_points", nullable = false, precision = 6, scale = 2)
	private BigDecimal totalPoints = BigDecimal.ZERO;

	@OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("sortOrder ASC")
	private List<ExerciseQuestionEntity> questions = new ArrayList<>();

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public ExerciseEntity() {
	}

	public ExerciseEntity(Long ownerId, String title, String description, ExerciseStatus status) {
		this.ownerId = ownerId;
		this.title = title;
		this.description = description;
		this.status = status != null ? status : ExerciseStatus.DRAFT;
		this.totalPoints = BigDecimal.ZERO;
	}

	public void addQuestion(ExerciseQuestionEntity eq) {
		this.questions.add(eq);
		eq.setExercise(this);
	}

	public void removeQuestion(ExerciseQuestionEntity eq) {
		this.questions.remove(eq);
		eq.setExercise(null);
	}

	public Long getId() {
		return id;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
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

	public ExerciseStatus getStatus() {
		return status;
	}

	public void setStatus(ExerciseStatus status) {
		this.status = status;
	}

	public BigDecimal getTotalPoints() {
		return totalPoints;
	}

	public void setTotalPoints(BigDecimal totalPoints) {
		this.totalPoints = totalPoints;
	}

	public List<ExerciseQuestionEntity> getQuestions() {
		return questions;
	}

	public void setQuestions(List<ExerciseQuestionEntity> questions) {
		this.questions = questions;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
