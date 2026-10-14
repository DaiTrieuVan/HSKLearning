package com.hsk.content.dto;

import com.hsk.content.domain.LessonEntity;
import java.util.List;

public record LessonStudyResponse(
	Long id,
	Long hskLevelId,
	String levelTitle,
	String title,
	String description,
	Integer sortOrder,
	boolean hidden,
	List<VocabularyResponse> vocabularies,
	List<GrammarPointResponse> grammarPoints
) {
	public static LessonStudyResponse from(
		LessonEntity lesson,
		List<VocabularyResponse> vocabularies,
		List<GrammarPointResponse> grammarPoints
	) {
		String levelTitle = lesson.getHskLevel() != null ? lesson.getHskLevel().getTitle() : null;
		return new LessonStudyResponse(
			lesson.getId(),
			lesson.getHskLevel() != null ? lesson.getHskLevel().getId() : null,
			levelTitle,
			lesson.getTitle(),
			lesson.getDescription(),
			lesson.getSortOrder(),
			lesson.isHidden(),
			vocabularies,
			grammarPoints
		);
	}
}
