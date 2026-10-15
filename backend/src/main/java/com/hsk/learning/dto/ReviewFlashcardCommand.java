package com.hsk.learning.dto;

import com.hsk.learning.domain.FlashcardResult;
import jakarta.validation.constraints.NotNull;

public record ReviewFlashcardCommand(
		@NotNull(message = "vocabularyId không được để trống")
		Long vocabularyId,

		@NotNull(message = "result không được để trống (REMEMBERED hoặc FORGOTTEN)")
		FlashcardResult result
) {}
