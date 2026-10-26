package com.hsk.assignment.dto;

import java.math.BigDecimal;

/**
 * Kết quả phân tích theo từng phần thi của đề thi thử HSK (HTT-09-CN-003 / TC-01).
 */
public record MockExamSectionResultDto(
		Long sectionId,
		String sectionName,
		int sortOrder,
		BigDecimal score,
		BigDecimal maxScore,
		int correctCount,
		int totalQuestions,
		int percentage
) {}
