package com.hsk.aiassistant.dto;

public record AiVocabAutofillItemDto(
	String hanzi,
	String pinyin,
	String meaning,
	String partOfSpeech,
	String exampleSentence,
	String examplePinyin,
	String exampleMeaning
) {}
