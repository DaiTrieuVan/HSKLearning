package com.hsk.question.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * Yêu cầu tạo Nhóm ghép tranh HSK (1 kho ảnh A-F dùng chung cho nhóm 5 câu hỏi).
 */
public record CreateImageMatchGroupRequest(
		@Schema(description = "Tiêu đề hoặc ngữ cảnh nhóm câu hỏi", example = "Phần 1: Nghe và chọn tranh tương ứng (Câu 1 - 5)")
		@NotBlank(message = "Tiêu đề nhóm không được để trống")
		String title,

		@Schema(description = "Cấp độ HSK", example = "1")
		Integer hskLevel,

		@Schema(description = "Audio chung của cả nhóm (nếu có)")
		String audioUrl,

		@Schema(description = "Lời giải thích chung cho cả nhóm")
		String explanation,

		@Schema(description = "Kho ảnh dùng chung (ví dụ 6 ảnh A-F)")
		@NotEmpty(message = "Kho ảnh không được để trống")
		List<ImagePoolItemDto> imagePool,

		@Schema(description = "Danh sách các câu hỏi con (ví dụ 5 câu)")
		@NotEmpty(message = "Cần ít nhất một câu hỏi con trong nhóm")
		List<ImageMatchSubQuestionDto> subQuestions
) {}
