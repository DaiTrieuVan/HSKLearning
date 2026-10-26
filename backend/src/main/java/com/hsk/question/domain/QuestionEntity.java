package com.hsk.question.domain;

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
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * Ngân hàng câu hỏi của giáo viên (ERD page 05 questions).
 */
@Entity
@Table(name = "questions")
public class QuestionEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "owner_id", nullable = false)
	private Long ownerId;

	@Enumerated(EnumType.STRING)
	@Column(name = "type", nullable = false, length = 50)
	private QuestionType type = QuestionType.MCQ;

	@Column(name = "hsk_level")
	private Integer hskLevel;

	@jakarta.persistence.ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
	@jakarta.persistence.JoinColumn(name = "parent_id")
	private QuestionEntity parent;

	@OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
	@OrderBy("id ASC")
	private List<QuestionEntity> children = new ArrayList<>();

	@Column(name = "content", nullable = false, columnDefinition = "TEXT")
	private String content;

	@Column(name = "explanation", columnDefinition = "TEXT")
	private String explanation;

	@Column(name = "payload", columnDefinition = "TEXT")
	private String payload;

	@Column(name = "is_hidden", nullable = false)
	private boolean isHidden = false;

	@OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
	@OrderBy("sortOrder ASC")
	private List<QuestionOptionEntity> options = new ArrayList<>();

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public QuestionEntity() {
	}

	public QuestionEntity(Long ownerId, QuestionType type, String content, String explanation, String payload) {
		this.ownerId = ownerId;
		this.type = type != null ? type : QuestionType.MCQ;
		this.content = content;
		this.explanation = explanation;
		this.payload = payload;
		this.isHidden = false;
	}

	public void addOption(QuestionOptionEntity option) {
		options.add(option);
		option.setQuestion(this);
	}

	public void removeOption(QuestionOptionEntity option) {
		options.remove(option);
		option.setQuestion(null);
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

	public QuestionType getType() {
		return type;
	}

	public void setType(QuestionType type) {
		this.type = type;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getExplanation() {
		return explanation;
	}

	public void setExplanation(String explanation) {
		this.explanation = explanation;
	}

	public String getPayload() {
		return payload;
	}

	public void setPayload(String payload) {
		this.payload = payload;
	}

	public boolean isHidden() {
		return isHidden;
	}

	public void setHidden(boolean hidden) {
		isHidden = hidden;
	}

	public List<QuestionOptionEntity> getOptions() {
		return options;
	}

	public void setOptions(List<QuestionOptionEntity> options) {
		this.options = options;
	}

	public Integer getHskLevel() {
		return hskLevel;
	}

	public void setHskLevel(Integer hskLevel) {
		this.hskLevel = hskLevel;
	}

	public QuestionEntity getParent() {
		return parent;
	}

	public void setParent(QuestionEntity parent) {
		this.parent = parent;
	}

	public List<QuestionEntity> getChildren() {
		return children;
	}

	public void setChildren(List<QuestionEntity> children) {
		this.children = children;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
