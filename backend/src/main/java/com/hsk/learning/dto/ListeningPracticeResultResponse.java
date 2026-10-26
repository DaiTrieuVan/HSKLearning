package com.hsk.learning.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ListeningPracticeResultResponse(
		Long exerciseId,
		String title,
		BigDecimal earnedPoints,
		BigDecimal totalPoints,
		int totalQuestions,
		int correctAnswersCount,
		double scorePercentage,
		boolean passed,
		String transcript,
		List<ListeningGradedQuestionDto> gradedQuestions,
		Instant submittedAt
) {
}
