package com.hsk.exercise.dto;

import com.hsk.exercise.domain.ExerciseStatus;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

/**
 * Yêu cầu cập nhật bài tập (HTT-05-CN-008).
 */
public record UpdateExerciseRequest(
		@NotBlank(message = "Tên bài tập không được để trống")
		String title,

		String description,

		ExerciseStatus status,

		List<CreateExerciseQuestionItem> questions
) {}
