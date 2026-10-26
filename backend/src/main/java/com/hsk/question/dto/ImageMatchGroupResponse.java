package com.hsk.question.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/**
 * Kết quả tạo nhóm câu hỏi ghép tranh HSK.
 */
public record ImageMatchGroupResponse(
		@Schema(description = "Câu hỏi cha (chứa Kho ảnh và ngữ cảnh)")
		QuestionResponse parentQuestion,

		@Schema(description = "Danh sách các câu hỏi con đã được tạo")
		List<QuestionResponse> subQuestions
) {}
