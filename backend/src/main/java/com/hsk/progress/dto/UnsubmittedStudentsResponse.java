package com.hsk.progress.dto;

import java.time.Instant;
import java.util.List;

public record UnsubmittedStudentsResponse(
		Long assignmentId,
		String assignmentTitle,
		Long classId,
		String className,
		Instant originalDueTime,
		boolean isAssignmentOverdue,
		int totalStudents,
		int submittedCount,
		int unsubmittedCount,
		int lateSubmittedCount,
		List<UnsubmittedStudentItemDto> unsubmittedStudents,
		List<LateSubmissionItemDto> lateSubmissions
) {
}
