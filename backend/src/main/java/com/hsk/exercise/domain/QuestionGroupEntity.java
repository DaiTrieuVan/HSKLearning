package com.hsk.exercise.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * Thực thể Nhóm câu hỏi (Part) trong một phần thi HSK chuẩn 3.0.
 * Ví dụ: Part 1 (LISTEN_IMAGE_3), Part 3 (LISTEN_IMAGE_MATCH với bộ 6 ảnh dùng chung).
 */
@Entity
@Table(name = "question_groups")
public class QuestionGroupEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "section_id", nullable = false)
	private ExerciseSectionEntity section;

	@Column(name = "part_number", nullable = false)
	private int partNumber = 1;

	@Column(name = "title", nullable = false)
	private String title;

	@Column(name = "instruction", columnDefinition = "TEXT")
	private String instruction;

	@Column(name = "format_code", nullable = false, length = 50)
	private String formatCode;

	@Column(name = "shared_data", columnDefinition = "TEXT")
	private String sharedData;

	@Column(name = "sort_order", nullable = false)
	private int sortOrder = 1;

	@OneToMany(mappedBy = "group")
	@OrderBy("sortOrder ASC")
	private List<ExerciseQuestionEntity> questions = new ArrayList<>();

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public QuestionGroupEntity() {
	}

	public QuestionGroupEntity(
			ExerciseSectionEntity section,
			int partNumber,
			String title,
			String instruction,
			String formatCode,
			String sharedData,
			int sortOrder
	) {
		this.section = section;
		this.partNumber = partNumber;
		this.title = title;
		this.instruction = instruction;
		this.formatCode = formatCode;
		this.sharedData = sharedData;
		this.sortOrder = sortOrder;
	}

	public Long getId() {
		return id;
	}

	public ExerciseSectionEntity getSection() {
		return section;
	}

	public void setSection(ExerciseSectionEntity section) {
		this.section = section;
	}

	public int getPartNumber() {
		return partNumber;
	}

	public void setPartNumber(int partNumber) {
		this.partNumber = partNumber;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getInstruction() {
		return instruction;
	}

	public void setInstruction(String instruction) {
		this.instruction = instruction;
	}

	public String getFormatCode() {
		return formatCode;
	}

	public void setFormatCode(String formatCode) {
		this.formatCode = formatCode;
	}

	public String getSharedData() {
		return sharedData;
	}

	public void setSharedData(String sharedData) {
		this.sharedData = sharedData;
	}

	public int getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(int sortOrder) {
		this.sortOrder = sortOrder;
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
