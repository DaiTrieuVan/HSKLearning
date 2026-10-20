package com.hsk.progress.dto;

import java.time.Instant;

public record RecentActivityDto(
		String type,
		String title,
		String hskLevelTitle,
		Double scorePercentage,
		Instant timestamp
) {}
