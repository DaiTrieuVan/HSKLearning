package com.hsk.assignment.domain;

import com.hsk.account.domain.UserEntity;
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
 * Thực thể Bài nộp / Lượt làm bài tập của học sinh (HTT-06-CN-002, HTT-06-CN-003, HTT-06-CN-004).
 */
@Entity
@Table(name = "assignment_submissions")
public class AssignmentSubmissionEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assignment_id", nullable = false)
	private AssignmentEntity assignment;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	private UserEntity student;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 50)
	private SubmissionStatus status = SubmissionStatus.IN_PROGRESS;

	@Column(name = "attempt_number", nullable = false)
	private Integer attemptNumber = 1;

	@Column(name = "score", precision = 6, scale = 2)
	private BigDecimal score;

	@Column(name = "submitted_at")
	private Instant submittedAt;

	@Column(name = "started_at", nullable = false)
	private Instant startedAt = Instant.now();

	@Column(name = "answers_data", columnDefinition = "LONGTEXT")
	private String answersData;

	@Column(name = "adjusted_score", precision = 6, scale = 2)
	private BigDecimal adjustedScore;

	@Column(name = "adjust_reason", length = 255)
	private String adjustReason;

	@Column(name = "adjusted_at")
	private Instant adjustedAt;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	protected AssignmentSubmissionEntity() {
	}

	public static AssignmentSubmissionEntity createInitial(AssignmentEntity assignment, UserEntity student) {
		return createAttempt(assignment, student, 1);
	}

	public static AssignmentSubmissionEntity createAttempt(AssignmentEntity assignment, UserEntity student, int attemptNumber) {
		AssignmentSubmissionEntity sub = new AssignmentSubmissionEntity();
		sub.assignment = assignment;
		sub.student = student;
		sub.attemptNumber = attemptNumber;
		sub.status = SubmissionStatus.IN_PROGRESS;
		sub.startedAt = Instant.now();
		return sub;
	}

	public void submit(BigDecimal score, String answersData) {
		this.status = SubmissionStatus.SUBMITTED;
		this.score = score;
		this.answersData = answersData;
		this.submittedAt = Instant.now();
	}

	public void autoSubmit(BigDecimal score, String answersData) {
		this.status = SubmissionStatus.AUTO_SUBMITTED;
		this.score = score;
		this.answersData = answersData;
		this.submittedAt = Instant.now();
	}

	// Getters and Setters
	public Long getId() {
		return id;
	}

	public AssignmentEntity getAssignment() {
		return assignment;
	}

	public void setAssignment(AssignmentEntity assignment) {
		this.assignment = assignment;
	}

	public UserEntity getStudent() {
		return student;
	}

	public void setStudent(UserEntity student) {
		this.student = student;
	}

	public SubmissionStatus getStatus() {
		return status;
	}

	public void setStatus(SubmissionStatus status) {
		this.status = status;
	}

	public Integer getAttemptNumber() {
		return attemptNumber;
	}

	public void setAttemptNumber(Integer attemptNumber) {
		this.attemptNumber = attemptNumber;
	}

	public BigDecimal getScore() {
		return score;
	}

	public void setScore(BigDecimal score) {
		this.score = score;
	}

	public Instant getSubmittedAt() {
		return submittedAt;
	}

	public void setSubmittedAt(Instant submittedAt) {
		this.submittedAt = submittedAt;
	}

	public Instant getStartedAt() {
		return startedAt;
	}

	public void setStartedAt(Instant startedAt) {
		this.startedAt = startedAt;
	}

	public String getAnswersData() {
		return answersData;
	}

	public void setAnswersData(String answersData) {
		this.answersData = answersData;
	}

	public BigDecimal getAdjustedScore() {
		return adjustedScore;
	}

	public void setAdjustedScore(BigDecimal adjustedScore) {
		this.adjustedScore = adjustedScore;
	}

	public String getAdjustReason() {
		return adjustReason;
	}

	public void setAdjustReason(String adjustReason) {
		this.adjustReason = adjustReason;
	}

	public Instant getAdjustedAt() {
		return adjustedAt;
	}

	public void setAdjustedAt(Instant adjustedAt) {
		this.adjustedAt = adjustedAt;
	}

	public void adjustScore(BigDecimal newScore, String reason) {
		this.adjustedScore = newScore;
		this.adjustReason = reason;
		this.adjustedAt = Instant.now();
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
