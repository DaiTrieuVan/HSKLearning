package com.hsk.learning.dto;

import java.util.List;

public record VocabSearchResultItem(
		Long id,
		String hanzi,
		String pinyin,
		String meaning,
		String partOfSpeech,
		String audioUrl,
		String exampleSentence,
		String examplePinyin,
		String exampleMeaning,
		Long hskLevelId,
		String hskLevelTitle,
		List<VocabLessonRefResponse> lessons
) {}
