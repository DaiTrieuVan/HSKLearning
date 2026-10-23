package com.hsk.exercise.domain;

import com.hsk.question.domain.QuestionEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;

/**
 * Liên kết câu hỏi trong bài tập kèm điểm số và thứ tự hiển thị (HTT-05-CN-006).
 */
@Entity
@Table(
		name = "exercise_questions",
		uniqueConstraints = {
				@UniqueConstraint(name = "uk_exercise_question", columnNames = {"exercise_id", "question_id"})
		}
)
public class ExerciseQuestionEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exercise_id", nullable = false)
	private ExerciseEntity exercise;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "question_id", nullable = false)
	private QuestionEntity question;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "section_id")
	private ExerciseSectionEntity section;

	@Column(name = "points", nullable = false, precision = 6, scale = 2)
	private BigDecimal points = BigDecimal.ONE;

	@Column(name = "sort_order", nullable = false)
	private int sortOrder = 1;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public ExerciseQuestionEntity() {
	}

	public ExerciseQuestionEntity(ExerciseEntity exercise, QuestionEntity question, BigDecimal points, int sortOrder) {
		this(exercise, null, question, points, sortOrder);
	}

	public ExerciseQuestionEntity(ExerciseEntity exercise, ExerciseSectionEntity section, QuestionEntity question, BigDecimal points, int sortOrder) {
		this.exercise = exercise;
		this.section = section;
		this.question = question;
		this.points = points;
		this.sortOrder = sortOrder;
	}

	public Long getId() {
		return id;
	}

	public ExerciseEntity getExercise() {
		return exercise;
	}

	public void setExercise(ExerciseEntity exercise) {
		this.exercise = exercise;
	}

	public ExerciseSectionEntity getSection() {
		return section;
	}

	public void setSection(ExerciseSectionEntity section) {
		this.section = section;
	}

	public QuestionEntity getQuestion() {
		return question;
	}

	public void setQuestion(QuestionEntity question) {
		this.question = question;
	}

	public BigDecimal getPoints() {
		return points;
	}

	public void setPoints(BigDecimal points) {
		this.points = points;
	}

	public int getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(int sortOrder) {
		this.sortOrder = sortOrder;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}
