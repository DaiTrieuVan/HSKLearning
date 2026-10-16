package com.hsk.question.dto;

import java.util.List;

/**
 * Cấu trúc JSON payload lưu trữ trong QuestionEntity cho câu hỏi nối từ (HTT-05-CN-003).
 */
public record MatchingPayloadDto(
		List<MatchingPairDto> pairs
) {
}
