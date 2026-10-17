package com.hsk.assignment.dto;

import java.util.List;

/**
 * Yêu cầu nộp bài tập chính thức (HTT-06-CN-003).
 */
public record SubmitAssignmentRequest(
		List<StudentAnswerItemDto> answers
) {}
