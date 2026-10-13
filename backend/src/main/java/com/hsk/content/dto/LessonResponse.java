package com.hsk.content.dto;

import com.hsk.content.domain.LessonEntity;

public record LessonResponse(
	Long id,
	Long hskLevelId,
	String title,
	String description,
	Integer sortOrder,
	boolean hidden,
	int vocabCount,
	int grammarCount
) {
	public static LessonResponse fromEntity(LessonEntity entity, int vocabCount, int grammarCount) {
		return new LessonResponse(
			entity.getId(),
			entity.getHskLevel().getId(),
			entity.getTitle(),
			entity.getDescription(),
			entity.getSortOrder(),
			entity.isHidden(),
			vocabCount,
			grammarCount
		);
	}
}
