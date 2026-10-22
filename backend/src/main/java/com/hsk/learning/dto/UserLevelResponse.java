package com.hsk.learning.dto;

public record UserLevelResponse(
		int currentLevel,
		String title,
		int totalXp,
		int currentLevelThreshold,
		int nextLevelThreshold,
		int xpToNextLevel,
		int progressPercent,
		boolean levelUpJustNow
) {
}
