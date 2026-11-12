package com.hsk.learning.dto;

import java.util.List;

public record QuizQuestionDto(
		Long vocabularyId,
		String mode,
		String hanzi,
		String pinyin,
		String meaning,
		String partOfSpeech,
		String audioUrl,
		String exampleSentence,
		String examplePinyin,
		String exampleMeaning,
		String maskedSentence,
		List<QuizOptionDto> options
) {}
