package com.hsk.question.dto;

import java.util.List;

/**
 * Payload yêu cầu tạo câu hỏi điền từ vào chỗ trống (HTT-05-CN-002-CV-01).
 */
public record CreateFillBlankQuestionRequest(
		String content,
		String explanation,
		List<BlankAnswerDto> blanks
) {}
