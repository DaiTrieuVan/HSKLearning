package com.hsk.question.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Cấu hình câu hỏi con trong Nhóm ghép tranh HSK.
 */
public record ImageMatchSubQuestionDto(
		@Schema(description = "Nội dung câu hỏi con", example = "Câu 1: Nghe đoạn hội thoại và chọn tranh")
		String content,

		@Schema(description = "Đường dẫn file nghe riêng của câu hỏi con (nếu có)")
		String audioUrl,

		@Schema(description = "Phiên âm pinyin hoặc transcript")
		String transcript,

		@Schema(description = "Nhãn đáp án đúng trong kho ảnh (A, B, C, D, E, F)", example = "A")
		String correctLabel,

		@Schema(description = "Lời giải thích cho câu hỏi con")
		String explanation
) {}
