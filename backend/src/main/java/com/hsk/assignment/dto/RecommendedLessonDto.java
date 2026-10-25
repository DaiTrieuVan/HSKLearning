package com.hsk.assignment.dto;

import java.util.List;

/**
 * Gợi ý bài học cần ôn tập bổ sung dựa trên các câu trả lời sai (HTT-09-CN-003 / TC-02, TC-03).
 */
public record RecommendedLessonDto(
		Long lessonId,
		String lessonTitle,
		Integer hskLevel,
		List<String> relatedWords,
		String reason
) {}
