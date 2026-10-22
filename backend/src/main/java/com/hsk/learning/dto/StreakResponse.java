package com.hsk.learning.dto;

import java.time.LocalDate;

public record StreakResponse(
		int currentStreak,
		int longestStreak,
		boolean completedToday,
		LocalDate lastCompletedDate,
		LocalDate referenceDate,
		String message
) {
}
