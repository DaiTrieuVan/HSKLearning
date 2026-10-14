package com.hsk.content.dto;

public record VocabularyAudioResponse(
		Long vocabularyId,
		String hanzi,
		String pinyin,
		String audioUrl
) {}
