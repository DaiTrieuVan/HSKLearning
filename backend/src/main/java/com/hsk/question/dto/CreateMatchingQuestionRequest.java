package com.hsk.question.dto;

import java.util.List;

/**
 * Payload yêu cầu tạo câu hỏi nối từ (HTT-05-CN-003).
 */
public record CreateMatchingQuestionRequest(
		String content,
		String explanation,
		List<MatchingPairDto> pairs
) {
}
