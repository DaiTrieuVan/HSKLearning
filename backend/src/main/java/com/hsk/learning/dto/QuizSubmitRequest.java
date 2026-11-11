package com.hsk.learning.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record QuizSubmitRequest(
		Long vocabSetId,
		@NotBlank(message = "Chế độ trắc nghiệm không được để trống")
		@Size(max = 50)
		String mode,
		@Min(value = 0, message = "Thời gian không hợp lệ")
		int durationSeconds,
		@Size(max = 100)
		String idempotencyKey,
		@NotEmpty(message = "Danh sách câu trả lời không được để trống")
		@Size(max = 200, message = "Số lượng câu hỏi vượt quá giới hạn")
		List<@Valid QuizAnswerItemRequest> answers
) {
	public record QuizAnswerItemRequest(
			@NotNull(message = "Thiếu ID từ vựng")
			Long vocabularyId,
			boolean correct
	) {}
}
