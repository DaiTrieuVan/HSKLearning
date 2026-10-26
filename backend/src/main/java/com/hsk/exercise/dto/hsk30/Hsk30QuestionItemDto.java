package com.hsk.exercise.dto.hsk30;

import java.math.BigDecimal;
import java.util.List;

public record Hsk30QuestionItemDto(
		Long questionId,
		int questionNumber,
		String content,
		String audioUrl,
		String pinyin,
		BigDecimal points,
		List<Hsk30QuestionOptionDto> options,
		// Các trường đáp án (chỉ trả về khi xem kết quả sau khi nộp)
		String correctKey,
		Long correctOptionId,
		String explanation
) {
	// Constructor ẩn đáp án dùng cho thí sinh làm bài (/take)
	public static Hsk30QuestionItemDto forTake(
			Long questionId,
			int questionNumber,
			String content,
			String audioUrl,
			String pinyin,
			BigDecimal points,
			List<Hsk30QuestionOptionDto> options
	) {
		return new Hsk30QuestionItemDto(
				questionId,
				questionNumber,
				content,
				audioUrl,
				pinyin,
				points,
				options,
				null,
				null,
				null
		);
	}
}
