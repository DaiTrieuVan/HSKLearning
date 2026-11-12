package com.hsk.learning.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record TypingSubmitRequest(
		Long vocabSetId,
		@NotBlank(message = "Chế độ gõ từ không được để trống")
		@Size(max = 50)
		String mode,
		@Min(value = 0, message = "Thời gian không hợp lệ")
		int durationSeconds,
		@Size(max = 100)
		String idempotencyKey,
		@NotEmpty(message = "Danh sách kết quả không được để trống")
		@Size(max = 200, message = "Số lượng từ vượt quá giới hạn")
		List<@Valid TypingResultItemRequest> results
) {
	public record TypingResultItemRequest(
			@NotNull(message = "Thiếu ID từ vựng")
			Long vocabularyId,
			boolean correct,
			@Min(value = 0, message = "Số lần gợi ý không hợp lệ")
			int hintsUsed,
			boolean markMastered
	) {}
}
