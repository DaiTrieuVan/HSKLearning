package com.hsk.learning.dto;

public record ClassLeaderboardEntry(
		int rank,
		Long studentId,
		String studentName,
		String avatarUrl,
		int weeklyXp,
		int level,
		String levelTitle,
		boolean isCurrentUser
) {
}
