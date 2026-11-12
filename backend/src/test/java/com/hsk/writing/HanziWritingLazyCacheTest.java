package com.hsk.writing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.hsk.writing.domain.HanziStrokeDataEntity;
import com.hsk.writing.dto.HanziStrokeDetailResponse;
import com.hsk.writing.service.HanziStrokeCacheWriter;
import com.hsk.writing.service.HanziStrokeRemoteFetcher;
import com.hsk.writing.service.HanziWritingService;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;

class HanziWritingLazyCacheTest {

	@Test
	void resolveStrokesBatch_fetchesMissingCharactersAndCachesWithoutDuplicateDbCalls() {
		HanziStrokeCacheWriter cacheWriter = mock(HanziStrokeCacheWriter.class);
		HanziStrokeRemoteFetcher remoteFetcher = mock(HanziStrokeRemoteFetcher.class);
		HanziWritingService service = new HanziWritingService(cacheWriter, remoteFetcher);

		HanziStrokeDataEntity cachedNi = new HanziStrokeDataEntity(
				"你", 1,
				"[\"M 0 0 L 50 50 Z\"]",
				"[[[0,0],[50,50]]]",
				"db", "MIT"
		);
		when(cacheWriter.findByHanziIn(any())).thenReturn(List.of(cachedNi));
		when(remoteFetcher.isEnabled()).thenReturn(true);

		HanziStrokeRemoteFetcher.RemoteStrokePayload fetchedTong = new HanziStrokeRemoteFetcher.RemoteStrokePayload(
				"通",
				List.of("M 10 10 L 80 80 Z"),
				List.of(List.of(List.of(10, 10), List.of(80, 80))),
				"MakeMeAHanzi / HanziWriter",
				"MIT / Arphic PL"
		);
		when(remoteFetcher.fetchStrokeData("通")).thenReturn(Optional.of(fetchedTong));
		when(remoteFetcher.fetchStrokeData("罕")).thenReturn(Optional.empty());
		when(cacheWriter.saveIfAbsent(fetchedTong)).thenReturn(new HanziStrokeDataEntity(
				"通", 1,
				"[\"M 10 10 L 80 80 Z\"]",
				"[[[10,10],[80,80]]]",
				"MakeMeAHanzi / HanziWriter", "MIT / Arphic PL"
		));

		Map<String, HanziStrokeDetailResponse> result = service.resolveStrokesBatch(List.of("你", "通", "罕", "A"));

		assertEquals(2, result.size());
		assertTrue(result.containsKey("你"));
		assertTrue(result.containsKey("通"));
		assertFalse(result.containsKey("罕"));
		assertFalse(result.containsKey("A"));
		verify(cacheWriter, times(1)).saveIfAbsent(fetchedTong);
	}
}

