package com.hsk.classroom.domain;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.hsk.account.domain.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
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
 * Nhật ký nỗ lực tham gia lớp học (QTN-05: rate limit chống dò mã lớp).
 */
@Entity
@Table(name = "class_join_attempts")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ClassJoinAttemptEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "student_id", nullable = false)
	private UserEntity student;

	@Column(name = "attempted_code", nullable = false, length = 20)
	private String attemptedCode;

	@Column(name = "is_successful", nullable = false)
	private boolean successful;

	@CreatedDate
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public static ClassJoinAttemptEntity of(UserEntity student, String attemptedCode, boolean successful) {
		ClassJoinAttemptEntity attempt = new ClassJoinAttemptEntity();
		attempt.student = student;
		attempt.attemptedCode = attemptedCode;
		attempt.successful = successful;
		return attempt;
	}
}
