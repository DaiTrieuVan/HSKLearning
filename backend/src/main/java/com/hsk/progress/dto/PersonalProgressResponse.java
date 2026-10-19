package com.hsk.progress.dto;

import java.util.List;

public record PersonalProgressResponse(
		int completedLessons,
		int totalLessons,
		int learnedVocabulary,
		Double averageScorePercentage,
		int totalAssignmentsSubmitted,
		List<HskLevelProgressDto> hskLevels,
		List<RecentActivityDto> recentActivities
) {}
