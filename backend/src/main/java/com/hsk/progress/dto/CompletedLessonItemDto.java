package com.hsk.progress.dto;

import java.time.Instant;

public record CompletedLessonItemDto(
		Long lessonId,
		String lessonTitle,
		String levelCode,
		String levelName,
		int levelNumber,
		Instant completedAt
) {}
