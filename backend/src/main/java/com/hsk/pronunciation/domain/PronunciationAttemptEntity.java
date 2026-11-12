package com.hsk.pronunciation.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * Thực thể lưu trữ kết quả chấm phát âm (HTT-10-CN-003).
 *
 * <p>Tuân thủ nghiêm ngặt TC-05: Tuyệt đối không lưu URL, file path hoặc binary blob
 * của tệp âm thanh vào cơ sở dữ liệu. Chỉ lưu điểm số, thời điểm và phản hồi chuẩn hóa.
 */
@Entity
@Table(name = "pronunciation_attempts")
public class PronunciationAttemptEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "student_id", nullable = false)
	private Long studentId;

	@Enumerated(EnumType.STRING)
	@Column(name = "reference_type", length = 20)
	private ReferenceType referenceType;

	@Column(name = "reference_id")
	private Long referenceId;

	@Column(name = "reference_text", length = 500, nullable = false)
	private String referenceText;

	@Column(name = "score", precision = 5, scale = 2, nullable = false)
	private BigDecimal score;

	@Column(name = "accuracy_score", precision = 5, scale = 2, nullable = false)
	private BigDecimal accuracyScore;

	@Column(name = "fluency_score", precision = 5, scale = 2, nullable = false)
	private BigDecimal fluencyScore;

	@Column(name = "completeness_score", precision = 5, scale = 2, nullable = false)
	private BigDecimal completenessScore;

	@Column(name = "feedback_code", length = 100)
	private String feedbackCode;

	@Column(name = "assessed_at", nullable = false)
	private Instant assessedAt;

	protected PronunciationAttemptEntity() {
		// JPA requirement
	}

	public PronunciationAttemptEntity(
			Long studentId,
			ReferenceType referenceType,
			Long referenceId,
			String referenceText,
			BigDecimal score,
			BigDecimal accuracyScore,
			BigDecimal fluencyScore,
			BigDecimal completenessScore,
			String feedbackCode,
			Instant assessedAt
	) {
		this.studentId = studentId;
		this.referenceType = referenceType;
		this.referenceId = referenceId;
		this.referenceText = referenceText;
		this.score = score;
		this.accuracyScore = accuracyScore;
		this.fluencyScore = fluencyScore;
		this.completenessScore = completenessScore;
		this.feedbackCode = feedbackCode;
		this.assessedAt = assessedAt != null ? assessedAt : Instant.now();
	}

	public Long getId() {
		return id;
	}

	public Long getStudentId() {
		return studentId;
	}

	public ReferenceType getReferenceType() {
		return referenceType;
	}

	public Long getReferenceId() {
		return referenceId;
	}

	public String getReferenceText() {
		return referenceText;
	}

	public BigDecimal getScore() {
		return score;
	}

	public BigDecimal getAccuracyScore() {
		return accuracyScore;
	}

	public BigDecimal getFluencyScore() {
		return fluencyScore;
	}

	public BigDecimal getCompletenessScore() {
		return completenessScore;
	}

	public String getFeedbackCode() {
		return feedbackCode;
	}

	public Instant getAssessedAt() {
		return assessedAt;
	}
}
