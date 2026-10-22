package com.hsk.assignment.domain;

import com.hsk.account.domain.UserEntity;
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
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * Thực thể lưu trữ cấu hình ngoại lệ (Gia hạn thời gian / Cấp lượt làm lại)
 * dành riêng cho từng học sinh theo từng bài tập (HTT-06-CN-008, QTN-11, QTN-12).
 */
@Entity
@Table(
		name = "assignment_student_overrides",
		uniqueConstraints = {
				@UniqueConstraint(name = "uq_assignment_student_override", columnNames = {"assignment_id", "student_id"})
		}
)
public class AssignmentStudentOverrideEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assignment_id", nullable = false)
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private AssignmentEntity assignment;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private UserEntity student;

	@Column(name = "extended_due_time")
	private Instant extendedDueTime;

	@Column(name = "allowed_attempts", nullable = false)
	private Integer allowedAttempts = 1;

	@Column(name = "reason", length = 255)
	private String reason;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	protected AssignmentStudentOverrideEntity() {
	}

	public static AssignmentStudentOverrideEntity create(
			AssignmentEntity assignment,
			UserEntity student,
			Instant extendedDueTime,
			Integer allowedAttempts,
			String reason
	) {
		AssignmentStudentOverrideEntity override = new AssignmentStudentOverrideEntity();
		override.assignment = assignment;
		override.student = student;
		override.extendedDueTime = extendedDueTime;
		override.allowedAttempts = allowedAttempts != null ? allowedAttempts : 1;
		override.reason = reason;
		return override;
	}

	public void grantExtension(Instant newDueTime, String reason) {
		this.extendedDueTime = newDueTime;
		if (reason != null && !reason.trim().isEmpty()) {
			this.reason = reason.trim();
		}
	}

	public void grantRetake(int totalAllowedAttempts, String reason) {
		this.allowedAttempts = Math.max(this.allowedAttempts, totalAllowedAttempts);
		if (reason != null && !reason.trim().isEmpty()) {
			this.reason = reason.trim();
		}
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

	public Instant getExtendedDueTime() {
		return extendedDueTime;
	}

	public void setExtendedDueTime(Instant extendedDueTime) {
		this.extendedDueTime = extendedDueTime;
	}

	public Integer getAllowedAttempts() {
		return allowedAttempts != null ? allowedAttempts : 1;
	}

	public void setAllowedAttempts(Integer allowedAttempts) {
		this.allowedAttempts = allowedAttempts;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
