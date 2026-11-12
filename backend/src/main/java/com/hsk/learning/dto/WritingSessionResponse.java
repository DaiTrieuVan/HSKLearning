package com.hsk.learning.dto;

import java.util.List;

public record WritingSessionResponse(
		Long vocabSetId,
		String vocabSetTitle,
		String mode,
		int totalWords,
		List<WritingWordItemDto> words
) {}

