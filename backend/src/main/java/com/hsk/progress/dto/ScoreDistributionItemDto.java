package com.hsk.progress.dto;

import java.math.BigDecimal;

/**
 * Thống kê số lượng và tỷ lệ học sinh theo từng khoảng phổ điểm (HTT-07-CN-005, TC-01).
 */
public record ScoreDistributionItemDto(
		String rangeKey,
		String label,
		BigDecimal minScore,
		BigDecimal maxScore,
		long count,
		double percentage
) {}
