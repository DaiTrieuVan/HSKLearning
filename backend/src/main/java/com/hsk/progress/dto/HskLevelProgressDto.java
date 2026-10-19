package com.hsk.progress.dto;

public record HskLevelProgressDto(
		Long hskLevelId,
		String hskLevelCode,
		String hskLevelTitle,
		int levelNumber,
		int completedLessons,
		int totalLessons,
		double progressPercentage,
		int vocabLearned,
		int totalVocab
) {}
