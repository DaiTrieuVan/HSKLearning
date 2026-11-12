package com.hsk.learning.dto;

import java.util.List;

public record MatchRoundDto(
		int roundIndex,
		int pairsCount,
		List<MatchPairItemDto> pairs,
		List<MatchCardSideDto> leftCards,
		List<MatchCardSideDto> rightCards
) {}
