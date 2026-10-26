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

/**
 * Thực thể phần thi trong đề thi thử (HTT-09-CN-001).
 * Ví dụ: Phần 1 (Nghe), Phần 2 (Đọc), Phần 3 (Viết).
 */
@Entity
@Table(name = "exercise_sections")
public class ExerciseSectionEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exercise_id", nullable = false)
	private ExerciseEntity exercise;

	@Column(name = "name", nullable = false, length = 100)
	private String name;

	@Column(name = "sort_order", nullable = false)
	private int sortOrder = 1;

	@OneToMany(mappedBy = "section", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
	@OrderBy("sortOrder ASC")
	private List<QuestionGroupEntity> groups = new ArrayList<>();

	@OneToMany(mappedBy = "section")
	@OrderBy("sortOrder ASC")
	private List<ExerciseQuestionEntity> questions = new ArrayList<>();

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public ExerciseSectionEntity() {
	}

	public ExerciseSectionEntity(ExerciseEntity exercise, String name, int sortOrder) {
		this.exercise = exercise;
		this.name = name;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public List<QuestionGroupEntity> getGroups() {
		return groups;
	}

	public void setGroups(List<QuestionGroupEntity> groups) {
		this.groups = groups;
	}

	public void addGroup(QuestionGroupEntity group) {
		this.groups.add(group);
		group.setSection(this);
	}

	public void removeGroup(QuestionGroupEntity group) {
		this.groups.remove(group);
		group.setSection(null);
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}
