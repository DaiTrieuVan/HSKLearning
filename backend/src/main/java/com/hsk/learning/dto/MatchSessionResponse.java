package com.hsk.learning.dto;

import java.util.List;

public record MatchSessionResponse(
		Long vocabSetId,
		String vocabSetTitle,
		String mode,
		int totalPairs,
		int maxHearts,
		List<MatchRoundDto> rounds
) {}
