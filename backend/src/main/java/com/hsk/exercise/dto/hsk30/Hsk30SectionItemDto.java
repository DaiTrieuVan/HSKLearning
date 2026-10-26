package com.hsk.exercise.dto.hsk30;

import java.util.List;

public record Hsk30SectionItemDto(
		Long sectionId,
		String name,
		int sortOrder,
		List<Hsk30PartItemDto> parts
) {
}
