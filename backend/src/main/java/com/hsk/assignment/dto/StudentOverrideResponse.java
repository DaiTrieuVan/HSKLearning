package com.hsk.assignment.dto;

import java.time.Instant;

/**
 * Phản hồi thông tin ngoại lệ gia hạn hoặc làm lại của học sinh (HTT-06-CN-008).
 */
public record StudentOverrideResponse(
		Long assignmentId,
		Long studentId,
		Instant extendedDueTime,
		Integer allowedAttempts,
		String reason,
		Instant updatedAt
) {}
