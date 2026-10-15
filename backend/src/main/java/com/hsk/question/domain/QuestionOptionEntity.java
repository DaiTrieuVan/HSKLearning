package com.hsk.question.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;

/**
 * Lựa chọn trả lời cho câu hỏi trắc nghiệm (ERD page 05 question_options).
 */
@Entity
@Table(name = "question_options")
public class QuestionOptionEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "question_id", nullable = false)
	private QuestionEntity question;

	@Column(name = "content", nullable = false, columnDefinition = "TEXT")
	private String content;

	@Column(name = "is_correct", nullable = false)
	private boolean isCorrect = false;

	@Column(name = "sort_order", nullable = false)
	private int sortOrder = 1;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public QuestionOptionEntity() {
	}

	public QuestionOptionEntity(String content, boolean isCorrect, int sortOrder) {
		this.content = content;
		this.isCorrect = isCorrect;
		this.sortOrder = sortOrder;
	}

	public Long getId() {
		return id;
	}

	public QuestionEntity getQuestion() {
		return question;
	}

	public void setQuestion(QuestionEntity question) {
		this.question = question;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public boolean isCorrect() {
		return isCorrect;
	}

	public void setCorrect(boolean correct) {
		isCorrect = correct;
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
