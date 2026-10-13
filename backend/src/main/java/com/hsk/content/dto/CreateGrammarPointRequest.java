package com.hsk.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CreateGrammarPointRequest(
	@NotBlank(message = "Tiêu đề điểm ngữ pháp không được để trống")
	@Size(max = 200, message = "Tiêu đề không được quá 200 ký tự")
	String title,

	@Size(max = 300, message = "Cấu trúc không được quá 300 ký tự")
	String structure,

	@NotBlank(message = "Giải thích ngữ pháp không được để trống")
	String explanation,

	Integer sortOrder,

	List<CreateGrammarExampleRequest> examples
) {}
