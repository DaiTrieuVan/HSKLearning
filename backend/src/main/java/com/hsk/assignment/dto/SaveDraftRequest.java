package com.hsk.assignment.dto;

import java.util.List;

/**
 * Yêu cầu lưu nháp câu trả lời khi đang làm bài tập (HTT-06-CN-003).
 */
public record SaveDraftRequest(
		List<StudentAnswerItemDto> answers
) {}
