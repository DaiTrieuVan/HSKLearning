package com.hsk.learning.dto;

import java.time.LocalDate;

public record DailyChallengeResponse(
		LocalDate date,
		int targetLessons,
		long completedLessons,
		int targetVocabs,
		long reviewedVocabs,
		int targetExercises,
		long completedExercises,
		boolean isCompleted,
		int rewardXp,
		boolean rewardClaimed,
		int overallProgressPercent,
		int currentTotalXp
) {}
