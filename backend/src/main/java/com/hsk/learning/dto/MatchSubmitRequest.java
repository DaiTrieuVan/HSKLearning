package com.hsk.learning.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record MatchSubmitRequest(
		Long vocabSetId,
		@NotBlank(message = "Chế độ nối từ không được để trống")
		@Size(max = 50)
		String mode,
		@Min(value = 0, message = "Thời gian không hợp lệ")
		int durationSeconds,
		@Min(value = 0, message = "Số tim không hợp lệ")
		int remainingHearts,
		boolean timedOut,
		@Size(max = 100)
		String idempotencyKey,
		@NotEmpty(message = "Danh sách kết quả nối từ không được để trống")
		@Size(max = 200, message = "Số lượng từ vượt quá giới hạn")
		List<@Valid MatchResultItemRequest> results
) {
	public record MatchResultItemRequest(
			@NotNull(message = "Thiếu ID từ vựng")
			Long vocabularyId,
			boolean matched,
			@Min(value = 0)
			int mistakesCount,
			boolean markMastered
	) {}
}
