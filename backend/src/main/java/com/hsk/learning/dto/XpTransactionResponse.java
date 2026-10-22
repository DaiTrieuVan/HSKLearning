package com.hsk.learning.dto;

import java.time.Instant;

public record XpTransactionResponse(
		Long id,
		int xpAmount,
		String sourceType,
		String sourceId,
		String description,
		Instant createdAt
) {
}
