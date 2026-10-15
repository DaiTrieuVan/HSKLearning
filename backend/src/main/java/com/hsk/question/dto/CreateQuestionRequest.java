package com.hsk.question.dto;

import com.hsk.question.domain.QuestionType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public record CreateQuestionRequest(
	@Schema(description = "Nội dung câu hỏi", example = "你好 nghĩa là gì?")
	String content,

	@Schema(description = "Giải thích đáp án", example = "你好 là lời chào hỏi thông dụng trong tiếng Trung.")
	String explanation,

	@Schema(description = "Loại câu hỏi", example = "MCQ")
	QuestionType type,

	@Schema(description = "Cấu hình JSON mở rộng", example = "{}")
	String payload,

	@Schema(description = "Danh sách lựa chọn cho câu trắc nghiệm")
	List<CreateQuestionOptionRequest> options
) {}
