package com.hsk.content.dto;

import com.hsk.content.domain.VocabularyEntity;

public record VocabularyResponse(
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
	Long ownerId,
	boolean isPrivate,
	boolean hidden
) {
	public static VocabularyResponse fromEntity(VocabularyEntity entity) {
		return new VocabularyResponse(
			entity.getId(),
			entity.getHanzi(),
			entity.getPinyin(),
			entity.getMeaning(),
			entity.getPartOfSpeech(),
			entity.getAudioUrl(),
			entity.getExampleSentence(),
			entity.getExamplePinyin(),
			entity.getExampleMeaning(),
			entity.getHskLevel() != null ? entity.getHskLevel().getId() : null,
			entity.getOwnerId(),
			entity.getOwnerId() != null,
			entity.isHidden()
		);
	}
}
