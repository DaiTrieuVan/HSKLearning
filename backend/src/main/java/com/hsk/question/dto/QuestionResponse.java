package com.hsk.question.dto;

import com.hsk.question.domain.QuestionType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

public record QuestionResponse(
	@Schema(description = "ID của câu hỏi", example = "1")
	Long id,

	@Schema(description = "ID của giáo viên sở hữu", example = "2")
	Long ownerId,

	@Schema(description = "Loại câu hỏi", example = "MCQ")
	QuestionType type,

	@Schema(description = "Nội dung câu hỏi", example = "你好 nghĩa là gì?")
	String content,

	@Schema(description = "Giải thích đáp án", example = "你好 là lời chào hỏi thông dụng trong tiếng Trung.")
	String explanation,

	@Schema(description = "Cấu hình JSON mở rộng", example = "{}")
	String payload,

	@Schema(description = "Danh sách các lựa chọn")
	List<QuestionOptionResponse> options,

	@Schema(description = "Thời gian tạo")
	Instant createdAt
) {}
