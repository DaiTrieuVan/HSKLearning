package com.hsk.content.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CreateVocabSetRequest(
	@NotBlank(message = "Tên bộ từ vựng không được để trống")
	@Size(max = 150, message = "Tên bộ từ không được vượt quá 150 ký tự")
	String title,

	@Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
	String description,

	Long folderId,

	String color,

	Boolean isPublic,

	List<Long> vocabularyIds
) {
	public CreateVocabSetRequest(String title, String description) {
		this(title, description, null, null, null, null);
	}

	public CreateVocabSetRequest(String title, String description, List<Long> vocabularyIds) {
		this(title, description, null, null, null, vocabularyIds);
	}
}
