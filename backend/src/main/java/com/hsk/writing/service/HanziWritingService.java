package com.hsk.writing.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.writing.domain.HanziStrokeDataEntity;
import com.hsk.writing.dto.HanziStrokeDetailResponse;
import com.hsk.writing.dto.HanziStrokeSummaryResponse;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service xử lý nghiệp vụ luyện viết chữ Hán và tra cứu thứ tự nét (HTT-10-CN-002).
 * Đảm bảo:
 * - Chuẩn hóa Unicode code point, xử lý ký tự đa byte và surrogate pairs.
 * - Truy vấn theo batch chống N+1; tách fetch ngoài transaction ngắn để không giữ lock DB.
 * - Tự động cache dữ liệu nét MakeMeAHanzi vào DB khi gặp chữ chưa được seed.
 */
@Service
public class HanziWritingService {

	private static final Logger log = LoggerFactory.getLogger(HanziWritingService.class);
	private static final int MAX_SUPPORT_TEXT_LENGTH = 20;
	private static final int MAX_REMOTE_FETCH_THREADS = 6;
	private static final long BATCH_FETCH_TIMEOUT_SECONDS = 12L;

	private final HanziStrokeCacheWriter cacheWriter;
	private final HanziStrokeRemoteFetcher remoteFetcher;
	private final ObjectMapper objectMapper;

	public HanziWritingService(
			HanziStrokeCacheWriter cacheWriter,
			HanziStrokeRemoteFetcher remoteFetcher) {
		this.cacheWriter = cacheWriter;
		this.remoteFetcher = remoteFetcher;
		this.objectMapper = new ObjectMapper().findAndRegisterModules();
	}

	/**
	 * Lấy dữ liệu chi tiết thứ tự nét và trung tuyến của một chữ Hán (HTT-10-CN-002-TC-01, TC-03).
	 */
	public HanziStrokeDetailResponse getStrokeData(String hanzi) {
		String normalizedHanzi = validateSingleHanCharacter(hanzi);

		Optional<HanziStrokeDataEntity> cached = cacheWriter.findByHanzi(normalizedHanzi);
		if (cached.isPresent()) {
			return toDetailResponse(cached.get());
		}

		// Fetch external MakeMeAHanzi JSON outside DB transactions, then persist in short REQUIRES_NEW tx.
		Optional<HanziStrokeRemoteFetcher.RemoteStrokePayload> fetched = remoteFetcher.fetchStrokeData(normalizedHanzi);
		if (fetched.isPresent()) {
			return persistFetchedPayload(normalizedHanzi, fetched.get());
		}

		throw new ApiException(ApiErrorCode.HANZI_STROKE_DATA_NOT_FOUND);
	}

	/**
	 * Resolve stroke payloads in batch for a set of unique Chinese characters (used by writing practice & PDF export).
	 * Characters that still lack stroke data are safely omitted rather than failing the whole session.
	 */
	public Map<String, HanziStrokeDetailResponse> resolveStrokesBatch(Collection<String> characters) {
		if (characters == null || characters.isEmpty()) {
			return Map.of();
		}

		Set<String> validHanChars = new LinkedHashSet<>();
		for (String raw : characters) {
			if (isSingleHanCharacter(raw)) {
				validHanChars.add(raw);
			}
		}
		if (validHanChars.isEmpty()) {
			return Map.of();
		}

		List<HanziStrokeDataEntity> dbEntities = cacheWriter.findByHanziIn(validHanChars);
		Map<String, HanziStrokeDetailResponse> resultMap = new LinkedHashMap<>();
		for (HanziStrokeDataEntity entity : dbEntities) {
			try {
				resultMap.put(entity.getHanzi(), toDetailResponse(entity));
			} catch (ApiException ex) {
				log.warn("Bỏ qua dữ liệu nét lỗi của chữ '{}' trong batch practice: {}", entity.getHanzi(), ex.getMessage());
			}
		}

		if (!remoteFetcher.isEnabled()) {
			return resultMap;
		}

		List<String> missingChars = validHanChars.stream()
				.filter(ch -> !resultMap.containsKey(ch))
				.toList();
		if (missingChars.isEmpty()) {
			return resultMap;
		}

		List<HanziStrokeRemoteFetcher.RemoteStrokePayload> fetchedPayloads = fetchMissingConcurrently(missingChars);
		for (HanziStrokeRemoteFetcher.RemoteStrokePayload payload : fetchedPayloads) {
			HanziStrokeDetailResponse detail = persistFetchedPayload(payload.hanzi(), payload);
			resultMap.put(payload.hanzi(), detail);
		}
		return resultMap;
	}

	/**
	 * Kiểm tra trạng thái hỗ trợ luyện viết cho chuỗi ký tự (tối đa 20 code points).
	 */
	public List<HanziStrokeSummaryResponse> getSupportStatus(String text) {
		if (text == null || text.isBlank()) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED, "Văn bản không được để trống");
		}

		int codePointCount = text.codePointCount(0, text.length());
		if (codePointCount > MAX_SUPPORT_TEXT_LENGTH) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED,
					"Văn bản kiểm tra tối đa " + MAX_SUPPORT_TEXT_LENGTH + " ký tự");
		}

		List<String> characters = new ArrayList<>(codePointCount);
		Set<String> hanziCandidates = new LinkedHashSet<>();

		int length = text.length();
		for (int offset = 0; offset < length; ) {
			int codePoint = text.codePointAt(offset);
			String charStr = new String(Character.toChars(codePoint));
			characters.add(charStr);
			if (Character.UnicodeScript.of(codePoint) == Character.UnicodeScript.HAN) {
				hanziCandidates.add(charStr);
			}
			offset += Character.charCount(codePoint);
		}

		Map<String, HanziStrokeDataEntity> entityMap = cacheWriter.findByHanziIn(hanziCandidates)
				.stream()
				.collect(Collectors.toMap(HanziStrokeDataEntity::getHanzi, e -> e, (a, b) -> a));

		List<HanziStrokeSummaryResponse> summaries = new ArrayList<>(characters.size());
		for (String charStr : characters) {
			HanziStrokeDataEntity entity = entityMap.get(charStr);
			if (entity != null) {
				summaries.add(new HanziStrokeSummaryResponse(charStr, true, entity.getStrokeCount()));
			} else {
				summaries.add(new HanziStrokeSummaryResponse(charStr, false, null));
			}
		}

		return summaries;
	}

	public static boolean isSingleHanCharacter(String text) {
		if (text == null || text.isBlank() || text.codePointCount(0, text.length()) != 1) {
			return false;
		}
		return Character.UnicodeScript.of(text.codePointAt(0)) == Character.UnicodeScript.HAN;
	}

	private static String validateSingleHanCharacter(String hanzi) {
		if (hanzi == null || hanzi.isBlank()) {
			throw new ApiException(ApiErrorCode.INVALID_HANZI_CHARACTER, "Ký tự không được để trống");
		}
		int codePointCount = hanzi.codePointCount(0, hanzi.length());
		if (codePointCount != 1) {
			throw new ApiException(ApiErrorCode.INVALID_HANZI_CHARACTER, "Chỉ được tra cứu đúng 1 chữ Hán");
		}
		int codePoint = hanzi.codePointAt(0);
		if (Character.UnicodeScript.of(codePoint) != Character.UnicodeScript.HAN) {
			throw new ApiException(ApiErrorCode.INVALID_HANZI_CHARACTER, "Ký tự không phải là chữ Hán hợp lệ");
		}
		return new String(Character.toChars(codePoint));
	}

	private List<HanziStrokeRemoteFetcher.RemoteStrokePayload> fetchMissingConcurrently(List<String> missingChars) {
		int poolSize = Math.min(MAX_REMOTE_FETCH_THREADS, Math.max(1, missingChars.size()));
		try (ExecutorService executor = Executors.newFixedThreadPool(poolSize)) {
			List<CompletableFuture<Optional<HanziStrokeRemoteFetcher.RemoteStrokePayload>>> futures = missingChars.stream()
					.map(ch -> CompletableFuture.supplyAsync(() -> remoteFetcher.fetchStrokeData(ch), executor))
					.toList();

			CompletableFuture<Void> allDone = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
			try {
				allDone.get(BATCH_FETCH_TIMEOUT_SECONDS, TimeUnit.SECONDS);
			} catch (Exception ex) {
				log.debug("Timed out waiting for some remote Hanzi stroke fetches: {}", ex.getMessage());
			}

			List<HanziStrokeRemoteFetcher.RemoteStrokePayload> resolved = new ArrayList<>();
			for (CompletableFuture<Optional<HanziStrokeRemoteFetcher.RemoteStrokePayload>> future : futures) {
				if (future.isDone() && !future.isCompletedExceptionally()) {
					future.getNow(Optional.empty()).ifPresent(resolved::add);
				}
			}
			return resolved;
		}
	}

	private HanziStrokeDetailResponse persistFetchedPayload(
			String normalizedHanzi,
			HanziStrokeRemoteFetcher.RemoteStrokePayload payload) {
		try {
			HanziStrokeDataEntity saved = cacheWriter.saveIfAbsent(payload);
			return toDetailResponse(saved);
		} catch (RuntimeException ex) {
			// Concurrent request or transient DB error: prefer existing DB record if inserted concurrently,
			// otherwise return the verified in-memory payload so the user request still succeeds cleanly.
			Optional<HanziStrokeDataEntity> concurrent = cacheWriter.findByHanzi(normalizedHanzi);
			if (concurrent.isPresent()) {
				return toDetailResponse(concurrent.get());
			}
			return new HanziStrokeDetailResponse(
					payload.hanzi(),
					payload.strokes().size(),
					payload.strokes(),
					payload.medians(),
					payload.source(),
					payload.license()
			);
		}
	}

	private HanziStrokeDetailResponse toDetailResponse(HanziStrokeDataEntity entity) {
		List<String> strokes;
		List<List<List<Integer>>> medians;
		try {
			strokes = objectMapper.readValue(entity.getStrokesJson(), new TypeReference<List<String>>() {});
			medians = objectMapper.readValue(entity.getMediansJson(), new TypeReference<List<List<List<Integer>>>>() {});
		} catch (Exception e) {
			log.error("Lỗi khi đọc JSON dữ liệu nét của chữ {}: {}", entity.getHanzi(), e.getMessage());
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR, "Không thể đọc dữ liệu nét vẽ");
		}

		if (entity.getStrokeCount() == null || entity.getStrokeCount() != strokes.size() || strokes.size() != medians.size()) {
			log.error("Dữ liệu nét chữ {} không toàn vẹn: count={}, strokes={}, medians={}",
					entity.getHanzi(), entity.getStrokeCount(), strokes.size(), medians.size());
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR, "Dữ liệu nét vẽ không nhất quán");
		}

		for (String strokePath : strokes) {
			if (strokePath.contains("<") || strokePath.contains(">") || strokePath.toLowerCase().contains("script")) {
				log.warn("Phát hiện dữ liệu bất thường trong SVG path của chữ {}", entity.getHanzi());
				throw new ApiException(ApiErrorCode.INTERNAL_ERROR, "Dữ liệu SVG không an toàn");
			}
		}

		return new HanziStrokeDetailResponse(
				entity.getHanzi(),
				entity.getStrokeCount(),
				strokes,
				medians,
				entity.getSource(),
				entity.getLicense()
		);
	}
}
