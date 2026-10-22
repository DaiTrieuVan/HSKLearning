package com.hsk.learning.dto;

import java.time.Instant;
import java.util.List;

public record ClassLeaderboardResponse(
		Long classId,
		String className,
		Instant weekStart,
		Instant weekEnd,
		int totalStudents,
		Integer currentUserRank,
		Integer currentUserWeeklyXp,
		List<ClassLeaderboardEntry> leaderboard
) {
}
