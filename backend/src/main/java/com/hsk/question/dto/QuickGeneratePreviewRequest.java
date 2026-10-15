package com.hsk.question.dto;

import com.hsk.question.domain.QuestionFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record QuickGeneratePreviewRequest(
	@NotNull(message = "Mã bộ từ vựng không được để trống")
	@Schema(description = "ID của bộ từ vựng cần sinh câu hỏi", example = "1")
	Long vocabSetId,

	@Schema(description = "Định dạng câu hỏi trắc nghiệm cần sinh", example = "HANZI_TO_MEANING")
	QuestionFormat format
) {}
