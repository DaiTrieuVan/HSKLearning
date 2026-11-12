package com.hsk.material.dto;

import java.time.Instant;

public record MaterialShareResponse(
		Long classId,
		String classTitle,
		boolean allowDownload,
		String note,
		Instant sharedAt
) {
}
