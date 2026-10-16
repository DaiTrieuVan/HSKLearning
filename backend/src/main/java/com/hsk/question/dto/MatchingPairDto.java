package com.hsk.question.dto;

/**
 * Một cặp từ và nghĩa trong câu hỏi nối từ (HTT-05-CN-003).
 */
public record MatchingPairDto(
		String left,
		String right
) {
}
