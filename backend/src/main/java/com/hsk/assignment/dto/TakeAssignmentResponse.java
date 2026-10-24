package com.hsk.assignment.dto;

import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.exercise.domain.ExerciseType;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Payload trả về cho học sinh khi mở bài làm hoặc tải lại trang làm bài (HTT-06-CN-003, HTT-09-CN-002).
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
		long serverTimeMillis,
		ExerciseType exerciseType,
		Integer timeLimitMinutes,
		BigDecimal passingScore,
		Integer hskLevel,
		Instant effectiveDeadline
) {
	public TakeAssignmentResponse(
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
	) {
		this(submissionId, assignmentId, title, description, startTime, dueTime, totalPoints, status,
				startedAt, submittedAt, score, attemptNumber, questions, savedAnswers, serverTimeMillis,
				ExerciseType.REGULAR, null, null, null, dueTime);
	}
}
