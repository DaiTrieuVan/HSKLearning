package com.hsk.learning.dto;

import java.util.ArrayList;
import java.util.List;

public class RoadmapResponse {

	private int totalCompletedLessons;
	private int overallProgressPercent;
	private List<RoadmapLevelDto> levels = new ArrayList<>();

	public RoadmapResponse() {
	}

	public RoadmapResponse(int totalCompletedLessons, int overallProgressPercent, List<RoadmapLevelDto> levels) {
		this.totalCompletedLessons = totalCompletedLessons;
		this.overallProgressPercent = overallProgressPercent;
		this.levels = levels != null ? levels : new ArrayList<>();
	}

	public int getTotalCompletedLessons() {
		return totalCompletedLessons;
	}

	public void setTotalCompletedLessons(int totalCompletedLessons) {
		this.totalCompletedLessons = totalCompletedLessons;
	}

	public int getOverallProgressPercent() {
		return overallProgressPercent;
	}

	public void setOverallProgressPercent(int overallProgressPercent) {
		this.overallProgressPercent = overallProgressPercent;
	}

	public List<RoadmapLevelDto> getLevels() {
		return levels;
	}

	public void setLevels(List<RoadmapLevelDto> levels) {
		this.levels = levels;
	}
}
