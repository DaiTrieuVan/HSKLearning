package com.hsk.exercise.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO phản hồi danh sách lịch sử đề thi thử HSK kèm các chỉ số tổng hợp (HTT-09-CN-004).
 */
public record MockExamHistoryResponse(
		int totalExamsTaken,
		int totalPassed,
		BigDecimal averageScore,
		List<MockExamHistoryItemDto> items
) {}
