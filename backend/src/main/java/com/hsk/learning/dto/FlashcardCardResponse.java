package com.hsk.learning.dto;

import com.hsk.learning.domain.FlashcardResult;

public record FlashcardCardResponse(
		Long id,
		String hanzi,
		String pinyin,
		String meaning,
		String partOfSpeech,
		String audioUrl,
		String exampleSentence,
		String examplePinyin,
		String exampleMeaning,
		FlashcardResult lastResult
) {}
