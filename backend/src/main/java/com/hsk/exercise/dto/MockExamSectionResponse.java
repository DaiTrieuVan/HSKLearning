package com.hsk.exercise.dto;

import java.util.List;

/**
 * Chi tiết phần thi trong đề thi thử (HTT-09-CN-001).
 */
public record MockExamSectionResponse(
		Long id,
		String name,
		int sortOrder,
		int questionCount,
		List<ExerciseQuestionResponse> questions
) {}
