package com.hsk.learning.dto;

import java.util.List;

public record TypingSessionResponse(
		Long vocabSetId,
		String vocabSetTitle,
		String mode,
		int totalQuestions,
		List<TypingWordItemDto> items
) {}
