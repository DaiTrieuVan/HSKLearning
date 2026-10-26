package com.hsk.exercise.dto.hsk30;

import java.math.BigDecimal;
import java.util.List;

public record Hsk30GradedSectionDto(
		Long sectionId,
		String sectionName,
		String skillType,
		int sortOrder,
		List<Hsk30GradedPartDto> parts,
		int correctCount,
		int totalCount,
		BigDecimal score,
		BigDecimal maxScore
) {
}
