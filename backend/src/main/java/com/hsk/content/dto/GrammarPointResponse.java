package com.hsk.content.dto;

import com.hsk.content.domain.GrammarPointEntity;
import java.util.List;

public record GrammarPointResponse(
	Long id,
	Long lessonId,
	String title,
	String structure,
	String explanation,
	Integer sortOrder,
	List<GrammarExampleResponse> examples
) {
	public static GrammarPointResponse fromEntity(GrammarPointEntity entity) {
		List<GrammarExampleResponse> exampleDtos = entity.getExamples() != null
			? entity.getExamples().stream().map(GrammarExampleResponse::fromEntity).toList()
			: List.of();

		return new GrammarPointResponse(
			entity.getId(),
			entity.getLesson().getId(),
			entity.getTitle(),
			entity.getStructure(),
			entity.getExplanation(),
			entity.getSortOrder(),
			exampleDtos
		);
	}
}
