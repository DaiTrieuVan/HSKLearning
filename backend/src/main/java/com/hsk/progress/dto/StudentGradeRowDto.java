package com.hsk.progress.dto;

import java.math.BigDecimal;
import java.util.List;

public record StudentGradeRowDto(
		Long studentId,
		String fullName,
		String email,
		String avatarUrl,
		String membershipStatus,
		boolean isEnrolled,
		int submittedAssignmentsCount,
		BigDecimal studentAverageScore,
		List<CellGradeDto> grades
) {
}
