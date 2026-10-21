package com.hsk.progress.dto;

import java.math.BigDecimal;
import java.util.List;

public record ClassGradebookResponse(
		Long classId,
		String className,
		String classCode,
		Long teacherId,
		String teacherName,
		int totalStudents,
		int activeStudentsCount,
		int totalAssignments,
		BigDecimal classAverageScore,
		List<AssignmentColumnHeaderDto> assignments,
		List<StudentGradeRowDto> students
) {
}
