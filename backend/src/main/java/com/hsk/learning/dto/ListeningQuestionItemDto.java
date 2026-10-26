package com.hsk.learning.dto;

import java.math.BigDecimal;
import java.util.List;

public record ListeningQuestionItemDto(
		Long questionId,
		String content,
		String audioUrl,
		String pinyin,
		BigDecimal points,
		Integer sortOrder,
		List<ListeningOptionDto> options
) {
}
