package com.hsk.learning.dto;

import java.util.List;

public record WritingWordItemDto(
		Long vocabularyId,
		String hanzi,
		String pinyin,
		String meaning,
		String partOfSpeech,
		String audioUrl,
		String exampleSentence,
		String examplePinyin,
		String exampleMeaning,
		List<WritingCharStrokeDto> characters
) {}

