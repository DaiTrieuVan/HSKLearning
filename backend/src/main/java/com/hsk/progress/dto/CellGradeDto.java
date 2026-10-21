package com.hsk.progress.dto;

import java.math.BigDecimal;
import java.util.List;

public record CellGradeDto(
		Long assignmentId,
		boolean hasSubmitted,
		BigDecimal bestScore,
		BigDecimal totalPoints,
		BigDecimal scorePercentage,
		boolean isAdjusted,
		String status,
		int totalAttempts,
		List<GradeAttemptDetailDto> attempts
) {
}
