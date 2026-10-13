package com.hsk.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateVocabularyRequest(
	@NotBlank(message = "Chữ Hán không được để trống")
	@Size(max = 100, message = "Chữ Hán không được vượt quá 100 ký tự")
	String hanzi,

	@NotBlank(message = "Pinyin không được để trống")
	@Size(max = 150, message = "Pinyin không được vượt quá 150 ký tự")
	String pinyin,

	@NotBlank(message = "Nghĩa tiếng Việt không được để trống")
	@Size(max = 500, message = "Nghĩa không được vượt quá 500 ký tự")
	String meaning,

	@Size(max = 50, message = "Từ loại không được vượt quá 50 ký tự")
	String partOfSpeech,

	@Size(max = 500, message = "URL audio không được vượt quá 500 ký tự")
	String audioUrl,

	@Size(max = 500, message = "Câu ví dụ không được vượt quá 500 ký tự")
	String exampleSentence,

	@Size(max = 500, message = "Pinyin ví dụ không được vượt quá 500 ký tự")
	String examplePinyin,

	@Size(max = 500, message = "Dịch nghĩa ví dụ không được vượt quá 500 ký tự")
	String exampleMeaning,

	Long hskLevelId,

	Boolean isPrivate
) {}
