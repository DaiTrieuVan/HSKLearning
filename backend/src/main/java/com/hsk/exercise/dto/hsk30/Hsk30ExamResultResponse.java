package com.hsk.exercise.dto.hsk30;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record Hsk30ExamResultResponse(
		Long examId,
		String examTitle,
		Integer hskLevel,
		String hskStandard,
		BigDecimal totalScore,
		BigDecimal maxScore,
		BigDecimal passingScore,
		boolean passed,
		BigDecimal listeningScore,
		BigDecimal readingScore,
		int totalCorrect,
		int totalQuestions,
		Integer timeSpentSeconds,
		List<Hsk30GradedSectionDto> sections,
		Instant submittedAt,
		Long attemptId
) {
}
