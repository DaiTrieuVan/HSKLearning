package com.hsk.learning.dto;

import java.util.List;

public record QuizSessionResponse(
		Long vocabSetId,
		String vocabSetTitle,
		String requestedMode,
		int totalQuestions,
		List<QuizQuestionDto> questions
) {}
