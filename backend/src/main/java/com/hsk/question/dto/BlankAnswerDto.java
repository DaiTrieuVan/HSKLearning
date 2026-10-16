package com.hsk.question.dto;

import java.util.List;

/**
 * Cấu trúc đáp án cho một chỗ trống trong câu hỏi điền từ (HTT-05-CN-002).
 */
public record BlankAnswerDto(
		int index,
		String correctAnswer,
		List<String> acceptableAnswers
) {}
