package com.hsk.content.dto;

import java.util.List;

public record StudentWordsPageResponse(
	StudentWordsStatsDto stats,
	List<StudentVocabWordItemDto> items,
	int currentPage,
	int totalPages,
	long totalElements
) {}
