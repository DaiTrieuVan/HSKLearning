package com.hsk.progress.dto;

import java.util.List;

/**
 * DTO phản hồi danh sách lịch sử làm bài của học sinh (HTT-07-CN-002).
 */
public record SubmissionHistoryResponse(
		int totalAssignments,
		int totalSubmissions,
		Double averageScorePercentage,
		List<AssignmentHistoryItemDto> items
) {}
