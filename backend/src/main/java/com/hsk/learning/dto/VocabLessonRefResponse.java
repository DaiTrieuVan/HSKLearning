package com.hsk.learning.dto;

public record VocabLessonRefResponse(
		Long lessonId,
		String lessonTitle,
		Integer lessonSortOrder,
		Long hskLevelId,
		String hskLevelTitle,
		Integer levelNumber
) {}
