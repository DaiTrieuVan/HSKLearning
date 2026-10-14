package com.hsk.content.dto;

import com.hsk.content.domain.HskLevelEntity;

public record HskLevelResponse(
	Long id,
	String code,
	String title,
	Integer levelNumber,
	String description,
	Integer targetVocabCount,
	boolean hidden
) {
	public static HskLevelResponse fromEntity(HskLevelEntity entity) {
		return new HskLevelResponse(
			entity.getId(),
			entity.getCode(),
			entity.getTitle(),
			entity.getLevelNumber(),
			entity.getDescription(),
			entity.getTargetVocabCount(),
			entity.isHidden()
		);
	}
}
