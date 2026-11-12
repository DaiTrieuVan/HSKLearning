package com.hsk.content.dto;

public record StudentVocabWordItemDto(
	Long id,
	String hanzi,
	String pinyin,
	String meaning,
	String partOfSpeech,
	String audioUrl,
	String exampleSentence,
	String examplePinyin,
	String exampleMeaning,
	boolean isMastered
) {}
