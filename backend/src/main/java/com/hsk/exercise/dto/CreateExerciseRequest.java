package com.hsk.exercise.dto;

import com.hsk.exercise.domain.ExerciseStatus;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

/**
 * Yêu cầu tạo bài tập từ câu hỏi (HTT-05-CN-006).
 */
public record CreateExerciseRequest(
		@NotBlank(message = "Tên bài tập không được để trống")
		String title,

		String description,

		ExerciseStatus status,

		List<CreateExerciseQuestionItem> questions
) {}
