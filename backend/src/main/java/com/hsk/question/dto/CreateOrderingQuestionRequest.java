package com.hsk.question.dto;

import java.util.List;

/**
 * Payload yêu cầu tạo câu hỏi sắp xếp câu (HTT-05-CN-003).
 */
public record CreateOrderingQuestionRequest(
		String content,
		String explanation,
		List<String> items
) {
}
