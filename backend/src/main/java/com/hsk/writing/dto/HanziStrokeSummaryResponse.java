package com.hsk.writing.dto;

/**
 * Phản hồi tóm tắt trạng thái hỗ trợ luyện viết cho từng ký tự (HTT-10-CN-002).
 */
public record HanziStrokeSummaryResponse(
		String character,
		boolean supported,
		Integer strokeCount
) {
}
