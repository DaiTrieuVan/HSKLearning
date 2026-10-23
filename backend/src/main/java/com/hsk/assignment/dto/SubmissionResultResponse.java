package com.hsk.assignment.dto;

import com.hsk.assignment.domain.SubmissionStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Kết quả chấm điểm bài tập trả về sau khi nộp hoặc khi học sinh/giáo viên xem lại bài nộp
 * (HTT-06-CN-003, HTT-06-CN-004, HTT-06-CN-005).
 */
public record SubmissionResultResponse(
		Long submissionId,
		Long assignmentId,
		String title,
		String description,
		SubmissionStatus status,
		Instant startedAt,
		Instant submittedAt,
		BigDecimal score,
		BigDecimal maxScore,
		int attemptNumber,
		boolean showSolutions,
		Instant dueTime,
		BigDecimal adjustedScore,
		String adjustReason,
		List<DetailedQuestionResultDto> questions
) {
	public SubmissionResultResponse(
			Long submissionId,
			Long assignmentId,
			String title,
			String description,
			SubmissionStatus status,
			Instant startedAt,
			Instant submittedAt,
			BigDecimal score,
			BigDecimal maxScore,
			int attemptNumber,
			List<DetailedQuestionResultDto> questions
	) {
		this(submissionId, assignmentId, title, description, status, startedAt, submittedAt, score, maxScore, attemptNumber, true, null, null, null, questions);
	}
}
