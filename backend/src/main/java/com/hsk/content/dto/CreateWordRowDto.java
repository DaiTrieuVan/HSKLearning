package com.hsk.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateWordRowDto(
	@NotBlank(message = "Từ/Cụm từ Hán không được để trống")
	@Size(max = 100, message = "Từ không được quá 100 ký tự")
	String hanzi,

	String pinyin,

	@NotBlank(message = "Nghĩa không được để trống")
	@Size(max = 500, message = "Nghĩa không được quá 500 ký tự")
	String meaning,

	String partOfSpeech,

	String exampleSentence,

	String notes
) {}
