package com.hsk.content.dto;

import java.util.List;

public record ImportVocabularyResult(
	int totalRows,
	int successCount,
	int skippedCount,
	List<String> errors
) {}
