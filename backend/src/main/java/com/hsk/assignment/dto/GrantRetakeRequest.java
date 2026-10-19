package com.hsk.assignment.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

/**
 * Yêu cầu giáo viên cấp lượt làm lại bài cho học sinh (HTT-06-CN-008, QTN-12).
 */
public record GrantRetakeRequest(
		@Min(value = 2, message = "Số lượt làm bài tối đa phải từ 2 trở lên")
		Integer allowedAttempts,

		@Size(max = 255, message = "Lý do cho phép làm lại không vượt quá 255 ký tự")
		String reason
) {}
