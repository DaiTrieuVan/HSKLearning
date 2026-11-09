package com.hsk.content.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record BatchSaveWordsRequest(
	@NotNull(message = "ID bộ từ vựng không được để trống")
	Long vocabSetId,

	@NotEmpty(message = "Danh sách từ không được để trống")
	@Valid
	List<CreateWordRowDto> words
) {}
