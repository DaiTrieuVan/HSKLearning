package com.hsk.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateGrammarExampleRequest(
	@NotBlank(message = "Chữ Hán không được để trống")
	@Size(max = 500, message = "Chữ Hán không được quá 500 ký tự")
	String hanzi,

	@NotBlank(message = "Pinyin không được để trống")
	@Size(max = 500, message = "Pinyin không được quá 500 ký tự")
	String pinyin,

	@NotBlank(message = "Dịch nghĩa không được để trống")
	@Size(max = 500, message = "Dịch nghĩa không được quá 500 ký tự")
	String meaning,

	Integer sortOrder
) {}
