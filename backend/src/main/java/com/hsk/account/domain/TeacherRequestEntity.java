package com.hsk.account.domain;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
 * Bản ghi yêu cầu nâng quyền giáo viên của học sinh (HTT-01-CN-002, HTT-01-CN-003).
 */
@Entity
@Table(name = "teacher_requests")
@EntityListeners(AuditingEntityListener.class)
@Getter
public class TeacherRequestEntity {

	protected TeacherRequestEntity() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private UserEntity user;

	@Column(name = "teaching_info", nullable = false, columnDefinition = "TEXT")
	private String teachingInfo;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	private TeacherRequestStatus status;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reviewed_by")
	private UserEntity reviewedBy;

	@Column(name = "reviewed_at")
	private Instant reviewedAt;

	@Column(name = "reject_reason", length = 500)
	private String rejectReason;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@LastModifiedDate
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public static TeacherRequestEntity create(UserEntity user, String teachingInfo) {
		TeacherRequestEntity request = new TeacherRequestEntity();
		request.user = user;
		request.teachingInfo = teachingInfo;
		request.status = TeacherRequestStatus.PENDING;
		return request;
	}

	public void approve(UserEntity reviewer, Instant now) {
		this.status = TeacherRequestStatus.APPROVED;
		this.reviewedBy = reviewer;
		this.reviewedAt = now;
	}

	public void reject(UserEntity reviewer, String reason, Instant now) {
		this.status = TeacherRequestStatus.REJECTED;
		this.reviewedBy = reviewer;
		this.rejectReason = reason;
		this.reviewedAt = now;
	}
}
