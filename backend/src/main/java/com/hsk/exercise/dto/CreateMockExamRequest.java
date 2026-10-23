package com.hsk.exercise.dto;

import com.hsk.exercise.domain.ExerciseStatus;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.List;

/**
 * Yêu cầu tạo đề thi thử HSK có tính giờ (HTT-09-CN-001).
 */
public record CreateMockExamRequest(
		@NotBlank(message = "Tên đề thi thử không được để trống")
		String title,

		String description,

		Integer hskLevel,

		Integer timeLimitMinutes,

		BigDecimal passingScore,

		ExerciseStatus status,

		List<CreateMockExamSectionItem> sections
) {}
