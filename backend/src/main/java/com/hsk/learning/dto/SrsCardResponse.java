package com.hsk.learning.dto;

import java.time.Instant;

public record SrsCardResponse(
		Long vocabularyId,
		String hanzi,
		String pinyin,
		String meaning,
		String partOfSpeech,
		String audioUrl,
		String exampleSentence,
		String examplePinyin,
		String exampleMeaning,
		Integer repetitionLevel,
		Integer intervalDays,
		Instant nextReviewAt
) {}
