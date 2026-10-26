package com.hsk.exercise.dto.hsk30;

import java.math.BigDecimal;
import java.util.List;

public record Hsk30GradedPartDto(
		Long groupId,
		int partNumber,
		String title,
		String instruction,
		String formatCode,
		String sharedData,
		List<Hsk30SharedOptionItem> sharedOptions,
		String passage,
		List<Hsk30GradedQuestionDto> questions,
		int correctCount,
		int totalCount,
		BigDecimal partScore
) {
}
