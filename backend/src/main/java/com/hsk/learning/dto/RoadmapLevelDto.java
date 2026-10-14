package com.hsk.learning.dto;

import java.util.ArrayList;
import java.util.List;

public class RoadmapLevelDto {

	private Long id;
	private String code;
	private String title;
	private Integer levelNumber;
	private String description;
	private Integer targetVocabCount;
	private int totalLessons;
	private int completedLessons;
	private int progressPercent;
	private boolean available;
	private List<RoadmapLessonDto> lessons = new ArrayList<>();

	public RoadmapLevelDto() {
	}

	public RoadmapLevelDto(
			Long id,
			String code,
			String title,
			Integer levelNumber,
			String description,
			Integer targetVocabCount,
			int totalLessons,
			int completedLessons,
			int progressPercent,
			boolean available,
			List<RoadmapLessonDto> lessons) {
		this.id = id;
		this.code = code;
		this.title = title;
		this.levelNumber = levelNumber;
		this.description = description;
		this.targetVocabCount = targetVocabCount;
		this.totalLessons = totalLessons;
		this.completedLessons = completedLessons;
		this.progressPercent = progressPercent;
		this.available = available;
		this.lessons = lessons != null ? lessons : new ArrayList<>();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public Integer getLevelNumber() {
		return levelNumber;
	}

	public void setLevelNumber(Integer levelNumber) {
		this.levelNumber = levelNumber;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Integer getTargetVocabCount() {
		return targetVocabCount;
	}

	public void setTargetVocabCount(Integer targetVocabCount) {
		this.targetVocabCount = targetVocabCount;
	}

	public int getTotalLessons() {
		return totalLessons;
	}

	public void setTotalLessons(int totalLessons) {
		this.totalLessons = totalLessons;
	}

	public int getCompletedLessons() {
		return completedLessons;
	}

	public void setCompletedLessons(int completedLessons) {
		this.completedLessons = completedLessons;
	}

	public int getProgressPercent() {
		return progressPercent;
	}

	public void setProgressPercent(int progressPercent) {
		this.progressPercent = progressPercent;
	}

	public boolean isAvailable() {
		return available;
	}

	public void setAvailable(boolean available) {
		this.available = available;
	}

	public List<RoadmapLessonDto> getLessons() {
		return lessons;
	}

	public void setLessons(List<RoadmapLessonDto> lessons) {
		this.lessons = lessons;
	}
}
