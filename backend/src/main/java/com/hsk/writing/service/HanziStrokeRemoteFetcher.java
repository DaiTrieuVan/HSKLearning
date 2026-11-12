package com.hsk.writing.service;

import java.util.List;
import java.util.Optional;

/**
 * Abstraction for fetching stroke-order SVG and median coordinates when a character
 * is not yet cached in {@code hanzi_stroke_data}.
 */
public interface HanziStrokeRemoteFetcher {

	boolean isEnabled();

	Optional<RemoteStrokePayload> fetchStrokeData(String singleHanzi);

	record RemoteStrokePayload(
			String hanzi,
			List<String> strokes,
			List<List<List<Integer>>> medians,
			String source,
			String license
	) {}
}

