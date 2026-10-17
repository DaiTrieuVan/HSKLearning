package com.hsk.assignment.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

/**
 * Yêu cầu giáo viên điều chỉnh điểm bài nộp của học sinh (HTT-06-CN-005, TC-04, QTN-13).
 */
public record AdjustScoreRequest(
		@NotNull(message = "Điểm điều chỉnh không được để trống")
		@DecimalMin(value = "0.0", message = "Điểm điều chỉnh phải lớn hơn hoặc bằng 0")
		BigDecimal adjustedScore,

		@NotBlank(message = "Lý do điều chỉnh điểm không được để trống")
		@Size(max = 255, message = "Lý do điều chỉnh không vượt quá 255 ký tự")
		String reason
) {}
