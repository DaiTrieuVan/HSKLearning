package com.hsk.progress.dto;

import java.time.Instant;

public record UnsubmittedStudentItemDto(
		Long studentId,
		String fullName,
		String email,
		String avatarUrl,
		String status,
		Instant startedAt,
		boolean hasExtendedDueTime,
		Instant effectiveDueTime,
		boolean isOverdue
) {
}
