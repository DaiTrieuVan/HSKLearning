package com.hsk.assignment.dto;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

/**
 * Yêu cầu giao bài tập cho lớp (HTT-06-CN-001).
 */
public record AssignExerciseRequest(
		@NotNull(message = "Mã bài tập không được để trống")
		Long exerciseId,

		@NotNull(message = "Vui lòng chọn lớp học để giao bài")
		Long classId,

		Instant startTime,

		@NotNull(message = "Hạn nộp bài không được để trống")
		Instant dueTime
) {}
