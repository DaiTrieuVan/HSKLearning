package com.hsk.learning.dto;

public record MatchPairItemDto(
		Long vocabularyId,
		String hanzi,
		String pinyin,
		String meaning,
		String partOfSpeech,
		String audioUrl
) {}
