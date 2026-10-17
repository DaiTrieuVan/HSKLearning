package com.hsk.assignment.domain;

import com.hsk.account.domain.UserEntity;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.exercise.domain.ExerciseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * Thực thể Lần giao bài cho lớp (HTT-06-CN-001).
 * Lưu trữ phiên giao bài với hạn nộp độc lập và bản chụp snapshot nội dung bất biến (QTN-10).
 */
@Entity
@Table(name = "assignments")
public class AssignmentEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exercise_id", nullable = false)
	private ExerciseEntity exercise;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "class_id", nullable = false)
	private ClassEntity classroom;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "teacher_id", nullable = false)
	private UserEntity teacher;

	@Column(name = "title", nullable = false)
	private String title;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "start_time", nullable = false)
	private Instant startTime;

	@Column(name = "due_time", nullable = false)
	private Instant dueTime;

	@Column(name = "total_points", nullable = false, precision = 6, scale = 2)
	private BigDecimal totalPoints = BigDecimal.ZERO;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 50)
	private AssignmentStatus status = AssignmentStatus.ACTIVE;

	@Column(name = "snapshot_data", nullable = false, columnDefinition = "LONGTEXT")
	private String snapshotData;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public AssignmentEntity() {
	}

	public AssignmentEntity(
			ExerciseEntity exercise,
			ClassEntity classroom,
			UserEntity teacher,
			String title,
			String description,
			Instant startTime,
			Instant dueTime,
			BigDecimal totalPoints,
			AssignmentStatus status,
			String snapshotData
	) {
		this.exercise = exercise;
		this.classroom = classroom;
		this.teacher = teacher;
		this.title = title;
		this.description = description;
		this.startTime = startTime;
		this.dueTime = dueTime;
		this.totalPoints = totalPoints != null ? totalPoints : BigDecimal.ZERO;
		this.status = status != null ? status : AssignmentStatus.ACTIVE;
		this.snapshotData = snapshotData;
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

	public ClassEntity getClassroom() {
		return classroom;
	}

	public void setClassroom(ClassEntity classroom) {
		this.classroom = classroom;
	}

	public UserEntity getTeacher() {
		return teacher;
	}

	public void setTeacher(UserEntity teacher) {
		this.teacher = teacher;
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

	public Instant getStartTime() {
		return startTime;
	}

	public void setStartTime(Instant startTime) {
		this.startTime = startTime;
	}

	public Instant getDueTime() {
		return dueTime;
	}

	public void setDueTime(Instant dueTime) {
		this.dueTime = dueTime;
	}

	public BigDecimal getTotalPoints() {
		return totalPoints;
	}

	public void setTotalPoints(BigDecimal totalPoints) {
		this.totalPoints = totalPoints;
	}

	public AssignmentStatus getStatus() {
		return status;
	}

	public void setStatus(AssignmentStatus status) {
		this.status = status;
	}

	public String getSnapshotData() {
		return snapshotData;
	}

	public void setSnapshotData(String snapshotData) {
		this.snapshotData = snapshotData;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
