package com.hsk.question.dto;

import java.util.List;

/**
 * Cấu trúc JSON lưu trữ trong trường payload của QuestionEntity đối với câu hỏi điền từ (HTT-05-CN-002).
 */
public record FillBlankPayloadDto(
		List<BlankAnswerDto> blanks
) {}
