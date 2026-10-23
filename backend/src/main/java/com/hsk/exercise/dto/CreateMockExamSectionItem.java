package com.hsk.exercise.dto;

import java.util.List;

/**
 * Phần thi trong yêu cầu tạo đề thi thử (HTT-09-CN-001).
 */
public record CreateMockExamSectionItem(
		String name,
		Integer sortOrder,
		List<CreateExerciseQuestionItem> questions
) {}
