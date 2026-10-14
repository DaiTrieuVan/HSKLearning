package com.hsk.content.dto;

import com.hsk.content.domain.VocabSetEntity;
import java.time.Instant;

public record VocabSetResponse(
	Long id,
	Long teacherId,
	String title,
	String description,
	int itemCount,
	Instant createdAt
) {
	public static VocabSetResponse fromEntity(VocabSetEntity entity, int itemCount) {
		return new VocabSetResponse(
			entity.getId(),
			entity.getTeacherId(),
			entity.getTitle(),
			entity.getDescription(),
			itemCount,
			entity.getCreatedAt()
		);
	}
}
