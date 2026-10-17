package com.hsk.assignment.dto;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

/**
 * Yêu cầu kéo dài hạn nộp lần giao bài (HTT-06-CN-010).
 */
public record ExtendAssignmentDueDateRequest(
		@NotNull(message = "Hạn nộp mới không được để trống")
		Instant newDueTime
) {}
