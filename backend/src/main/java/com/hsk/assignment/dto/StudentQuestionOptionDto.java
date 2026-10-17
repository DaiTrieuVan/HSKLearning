package com.hsk.assignment.dto;

/**
 * Lựa chọn câu hỏi trắc nghiệm gửi về cho học sinh khi đang làm bài.
 * Tuyệt đối không chứa cờ isCorrect để bảo mật đề thi.
 */
public record StudentQuestionOptionDto(
		Long id,
		String content,
		Integer sortOrder
) {}
