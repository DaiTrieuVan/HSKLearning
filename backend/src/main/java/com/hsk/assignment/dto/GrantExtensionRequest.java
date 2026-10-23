package com.hsk.assignment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

/**
 * Yêu cầu giáo viên gia hạn nộp bài cho học sinh (HTT-06-CN-008, QTN-11).
 */
public record GrantExtensionRequest(
		@NotNull(message = "Thời gian gia hạn không được để trống")
		Instant extendedDueTime,

		@Size(max = 255, message = "Lý do gia hạn không vượt quá 255 ký tự")
		String reason
) {}
