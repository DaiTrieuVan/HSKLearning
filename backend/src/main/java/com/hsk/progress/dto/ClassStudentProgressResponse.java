package com.hsk.progress.dto;

import java.time.Instant;
import java.util.List;

public record ClassStudentProgressResponse(
		Long classId,
		String className,
		String classCode,
		Long studentId,
		String studentName,
		String studentEmail,
		String membershipStatus,
		Instant joinedAt,
		boolean hasActivity,
		ClassStudentProgressSummaryDto summary,
		List<ClassStudentAssignmentItemDto> assignments,
		List<CompletedLessonItemDto> completedLessons,
		List<HskLevelProgressDto> levelProgressList
) {}
