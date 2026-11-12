package com.hsk.pronunciation.dto;

import com.hsk.pronunciation.domain.ReferenceType;
import java.math.BigDecimal;
import java.time.Instant;

/**
 * DTO lịch sử lượt chấm phát âm (HTT-10-CN-003).
 *
 * <p>Tuyệt đối không chứa bất kỳ trường tệp âm thanh (audio URL / blob / path) nào.
 */
public record PronunciationHistoryItemResponse(
		Long attemptId,
		ReferenceType referenceType,
		Long referenceId,
		String referenceText,
		BigDecimal overallScore,
		BigDecimal accuracyScore,
		BigDecimal fluencyScore,
		BigDecimal completenessScore,
		String feedback,
		String feedbackCode,
		Instant assessedAt
) {}
