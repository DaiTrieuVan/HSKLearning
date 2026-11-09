package com.hsk.content.dto;

import com.hsk.content.domain.VocabSetEntity;
import java.time.Instant;

public record VocabSetSummaryDto(
	Long id,
	Long ownerId,
	Long folderId,
	String title,
	String description,
	String color,
	boolean isPublic,
	String shareCode,
	int wordCount,
	int masteredCount,
	Instant createdAt,
	Instant updatedAt
) {
	public static VocabSetSummaryDto fromEntity(VocabSetEntity entity, int wordCount, int masteredCount) {
		return new VocabSetSummaryDto(
			entity.getId(),
			entity.getTeacherId(),
			entity.getFolderId(),
			entity.getTitle(),
			entity.getDescription(),
			entity.getColor(),
			entity.isPublic(),
			entity.getShareCode(),
			wordCount,
			masteredCount,
			entity.getCreatedAt(),
			entity.getUpdatedAt()
		);
	}
}
