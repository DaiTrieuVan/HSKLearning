package com.hsk.content.dto;

public record StudentWordsStatsDto(
	long totalWords,
	long masteredWords,
	long unmasteredWords,
	int progressPercent
) {}
