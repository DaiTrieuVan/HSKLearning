package com.hsk.exercise.dto.hsk30;

import java.util.List;

public record Hsk30PartItemDto(
		Long groupId,
		int partNumber,
		String title,
		String instruction,
		String formatCode,
		String sharedData,
		List<Hsk30SharedOptionItem> sharedOptions,
		String passage,
		List<Hsk30QuestionItemDto> questions
) {
}
