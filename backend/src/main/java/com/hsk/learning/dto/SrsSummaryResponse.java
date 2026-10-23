package com.hsk.learning.dto;

public record SrsSummaryResponse(
		long dueTodayCount,
		long masteredCount,
		long learningCount
) {}
