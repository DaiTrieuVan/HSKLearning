package com.hsk.question.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public record BatchCreateQuestionsRequest(
	@Schema(description = "Danh sách các câu hỏi cần lưu vào ngân hàng câu hỏi")
	List<CreateQuestionRequest> questions
) {}
