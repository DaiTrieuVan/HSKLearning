package com.hsk.question.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

/**
 * HTT-05-CN-005: DTO cập nhật câu hỏi trong ngân hàng của giáo viên.
 */
@Schema(description = "Yêu cầu cập nhật câu hỏi")
public record UpdateQuestionRequest(
		@Schema(description = "Nội dung câu hỏi mới", example = "Chọn nghĩa tiếng Việt của từ: 老师")
		@NotBlank(message = "Nội dung câu hỏi không được để trống")
		String content,

		@Schema(description = "Lời giải thích đáp án", example = "老师 có nghĩa là giáo viên, thầy cô giáo.")
		String explanation,

		@Schema(description = "Danh sách lựa chọn mới (dành cho câu hỏi trắc nghiệm MCQ)")
		List<CreateQuestionOptionRequest> options,

		@Schema(description = "Dữ liệu payload JSON mới (dành cho câu hỏi FILL, MATCH, ORDER)")
		String payload,

		@Schema(description = "URL hình ảnh đính kèm", example = "/uploads/images/q1.png")
		String imageUrl,

		@Schema(description = "URL âm thanh đính kèm", example = "/uploads/audio/q1.mp3")
		String audioUrl,

		@Schema(description = "Nội dung bài nghe / transcript")
		String transcript,

		@Schema(description = "Phiên âm pinyin", example = "Nǐ hǎo")
		String pinyin,

		@Schema(description = "Cấp độ HSK", example = "1")
		Integer hskLevel,

		@Schema(description = "ID câu hỏi cha (nếu thuộc bài đọc/nghe chung)")
		Long parentId
) {
	// Constructor tương thích ngược cho 4 tham số ban đầu
	public UpdateQuestionRequest(
			String content,
			String explanation,
			List<CreateQuestionOptionRequest> options,
			String payload
	) {
		this(content, explanation, options, payload, null, null, null, null, null, null);
	}
}
