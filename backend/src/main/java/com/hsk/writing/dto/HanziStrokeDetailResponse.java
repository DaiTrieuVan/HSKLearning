package com.hsk.writing.dto;

import java.util.List;

/**
 * Phản hồi chi tiết thứ tự nét và trung tuyến của một chữ Hán (HTT-10-CN-002).
 */
public record HanziStrokeDetailResponse(
		String hanzi,
		int strokeCount,
		List<String> strokes,
		List<List<List<Integer>>> medians,
		String source,
		String license
) {
}
