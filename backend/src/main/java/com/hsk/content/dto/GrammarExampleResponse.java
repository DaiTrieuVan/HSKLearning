package com.hsk.content.dto;

import com.hsk.content.domain.GrammarExampleEntity;

public record GrammarExampleResponse(
	Long id,
	String hanzi,
	String pinyin,
	String meaning,
	Integer sortOrder
) {
	public static GrammarExampleResponse fromEntity(GrammarExampleEntity entity) {
		return new GrammarExampleResponse(
			entity.getId(),
			entity.getHanzi(),
			entity.getPinyin(),
			entity.getMeaning(),
			entity.getSortOrder()
		);
	}
}
