package com.hsk.learning.dto;

public record TypingWordItemDto(
		Long vocabularyId,
		String hanzi,
		String pinyin,
		String pinyinSearch,
		String meaning,
		String partOfSpeech,
		String audioUrl,
		String exampleSentence,
		String maskedExampleSentence,
		String examplePinyin,
		String exampleMeaning
) {}
