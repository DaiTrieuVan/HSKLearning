package com.hsk.assignment.dto;

import com.hsk.assignment.domain.SubmissionStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Payload trả về cho học sinh khi mở bài làm hoặc tải lại trang làm bài (HTT-06-CN-003).
 */
public record TakeAssignmentResponse(
		Long submissionId,
		Long assignmentId,
		String title,
		String description,
		Instant startTime,
		Instant dueTime,
		BigDecimal totalPoints,
		SubmissionStatus status,
		Instant startedAt,
		Instant submittedAt,
		BigDecimal score,
		int attemptNumber,
		List<StudentQuestionDto> questions,
		List<StudentAnswerItemDto> savedAnswers,
		long serverTimeMillis
) {}
