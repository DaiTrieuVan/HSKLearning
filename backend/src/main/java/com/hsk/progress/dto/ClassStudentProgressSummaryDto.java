package com.hsk.progress.dto;

import java.math.BigDecimal;

public record ClassStudentProgressSummaryDto(
		int totalAssignments,
		int submittedAssignments,
		int overdueAssignments,
		BigDecimal averageScorePercentage,
		int completedLessonsCount
) {}
