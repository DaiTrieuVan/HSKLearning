package com.hsk.content.dto;

import com.hsk.content.domain.VocabFolderEntity;
import java.time.Instant;

public record VocabFolderDto(
	Long id,
	Long userId,
	String title,
	String description,
	String color,
	int vocabSetCount,
	Instant createdAt,
	Instant updatedAt
) {
	public static VocabFolderDto fromEntity(VocabFolderEntity entity, int vocabSetCount) {
		return new VocabFolderDto(
			entity.getId(),
			entity.getUserId(),
			entity.getTitle(),
			entity.getDescription(),
			entity.getColor(),
			vocabSetCount,
			entity.getCreatedAt(),
			entity.getUpdatedAt()
		);
	}
}
