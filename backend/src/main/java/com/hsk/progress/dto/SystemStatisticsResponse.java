package com.hsk.progress.dto;

import java.time.Instant;

/**
 * DTO dữ liệu thống kê toàn hệ thống dành cho Quản trị viên (HTT-07-CN-008).
 */
public record SystemStatisticsResponse(
		String period,
		long totalUsers,
		long totalStudents,
		long totalTeachers,
		long totalAdmins,
		long totalClasses,
		long totalLessons,
		long totalSubmissions,
		long newUsersInPeriod,
		long newClassesInPeriod,
		long newSubmissionsInPeriod,
		Instant timestamp
) {}
