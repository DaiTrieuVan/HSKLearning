package com.hsk.question.dto;

import java.util.List;

/**
 * Cấu trúc JSON payload lưu trữ trong QuestionEntity cho câu hỏi sắp xếp câu (HTT-05-CN-003).
 */
public record OrderingPayloadDto(
		List<String> correctOrder
) {
}
