package com.hsk.learning.dto;

import java.time.Instant;

public class LessonProgressResponse {

	private Long lessonId;
	private Long hskLevelId;
	private boolean completed;
	private Instant completedAt;
	private int completedLessonsInLevel;
	private int totalLessonsInLevel;
	private int levelProgressPercent;

	public LessonProgressResponse() {
	}

	public LessonProgressResponse(
			Long lessonId,
			Long hskLevelId,
			boolean completed,
			Instant completedAt,
			int completedLessonsInLevel,
			int totalLessonsInLevel,
			int levelProgressPercent) {
		this.lessonId = lessonId;
		this.hskLevelId = hskLevelId;
		this.completed = completed;
		this.completedAt = completedAt;
		this.completedLessonsInLevel = completedLessonsInLevel;
		this.totalLessonsInLevel = totalLessonsInLevel;
		this.levelProgressPercent = levelProgressPercent;
	}

	public Long getLessonId() {
		return lessonId;
	}

	public void setLessonId(Long lessonId) {
		this.lessonId = lessonId;
	}

	public Long getHskLevelId() {
		return hskLevelId;
	}

	public void setHskLevelId(Long hskLevelId) {
		this.hskLevelId = hskLevelId;
	}

	public boolean isCompleted() {
		return completed;
	}

	public void setCompleted(boolean completed) {
		this.completed = completed;
	}

	public Instant getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(Instant completedAt) {
		this.completedAt = completedAt;
	}

	public int getCompletedLessonsInLevel() {
		return completedLessonsInLevel;
	}

	public void setCompletedLessonsInLevel(int completedLessonsInLevel) {
		this.completedLessonsInLevel = completedLessonsInLevel;
	}

	public int getTotalLessonsInLevel() {
		return totalLessonsInLevel;
	}

	public void setTotalLessonsInLevel(int totalLessonsInLevel) {
		this.totalLessonsInLevel = totalLessonsInLevel;
	}

	public int getLevelProgressPercent() {
		return levelProgressPercent;
	}

	public void setLevelProgressPercent(int levelProgressPercent) {
		this.levelProgressPercent = levelProgressPercent;
	}
}
