package com.hsk.pronunciation.dto;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO phản hồi kết quả chấm phát âm (HTT-10-CN-003).
 */
public record PronunciationAssessmentResponse(
		Long attemptId,
		BigDecimal overallScore,
		BigDecimal accuracyScore,
		BigDecimal fluencyScore,
		BigDecimal completenessScore,
		String feedback,
		String feedbackCode,
		Instant assessedAt
) {}
