package com.hsk.learning.dto;

import java.util.List;

public record WritingCharStrokeDto(
		String hanzi,
		int strokeCount,
		List<String> strokes,
		List<List<List<Integer>>> medians,
		boolean supported
) {}

