package com.hsk.writing.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.writing.domain.HanziStrokeDataEntity;
import com.hsk.writing.dto.HanziStrokeDetailResponse;
import com.hsk.writing.dto.HanziStrokeSummaryResponse;
import com.hsk.writing.repository.HanziStrokeDataRepository;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service xử lý nghiệp vụ luyện viết chữ Hán và tra cứu thứ tự nét (HTT-10-CN-002).
 * Đảm bảo:
 * - Chuẩn hóa Unicode code point, xử lý ký tự đa byte và surrogate pairs.
 * - Truy vấn theo batch chống N+1.
 * - Kiểm tra tính toàn vẹn và an toàn dữ liệu SVG JSON.
 */
@Service
@Transactional(readOnly = true)
public class HanziWritingService {

	private static final Logger log = LoggerFactory.getLogger(HanziWritingService.class);
	private static final int MAX_SUPPORT_TEXT_LENGTH = 20;

	private final HanziStrokeDataRepository hanziStrokeDataRepository;
	private final ObjectMapper objectMapper;

	public HanziWritingService(HanziStrokeDataRepository hanziStrokeDataRepository) {
		this.hanziStrokeDataRepository = hanziStrokeDataRepository;
		this.objectMapper = new ObjectMapper().findAndRegisterModules();
	}

	/**
	 * Lấy dữ liệu chi tiết thứ tự nét và trung tuyến của một chữ Hán (HTT-10-CN-002-TC-01, TC-03).
	 *
	 * @param hanzi Ký tự chữ Hán cần tra cứu (đúng 1 Han ideograph).
	 * @return Dữ liệu nét vẽ chi tiết.
	 */
	public HanziStrokeDetailResponse getStrokeData(String hanzi) {
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

		String normalizedHanzi = new String(Character.toChars(codePoint));
		HanziStrokeDataEntity entity = hanziStrokeDataRepository.findByHanzi(normalizedHanzi)
				.orElseThrow(() -> new ApiException(ApiErrorCode.HANZI_STROKE_DATA_NOT_FOUND));

		List<String> strokes;
		List<List<List<Integer>>> medians;
		try {
			strokes = objectMapper.readValue(entity.getStrokesJson(), new TypeReference<List<String>>() {});
			medians = objectMapper.readValue(entity.getMediansJson(), new TypeReference<List<List<List<Integer>>>>() {});
		} catch (Exception e) {
			log.error("Lỗi khi đọc JSON dữ liệu nét của chữ {}: {}", normalizedHanzi, e.getMessage());
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR, "Không thể đọc dữ liệu nét vẽ");
		}

		// Kiểm tra tính toàn vẹn: strokeCount == strokes.size == medians.size
		if (entity.getStrokeCount() == null || entity.getStrokeCount() != strokes.size() || strokes.size() != medians.size()) {
			log.error("Dữ liệu nét chữ {} không toàn vẹn: count={}, strokes={}, medians={}",
					normalizedHanzi, entity.getStrokeCount(), strokes.size(), medians.size());
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR, "Dữ liệu nét vẽ không nhất quán");
		}

		// Xử lý bảo mật: đảm bảo các chuỗi path không chứa thẻ nhúng hoặc mã độc
		for (String strokePath : strokes) {
			if (strokePath.contains("<") || strokePath.contains(">") || strokePath.toLowerCase().contains("script")) {
				log.warn("Phát hiện dữ liệu bất thường trong SVG path của chữ {}", normalizedHanzi);
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

	/**
	 * Kiểm tra trạng thái hỗ trợ luyện viết cho chuỗi ký tự (tối đa 20 code points).
	 * Truy vấn batch để loại bỏ hoàn toàn vấn đề N+1 query.
	 *
	 * @param text Chuỗi ký tự cần kiểm tra.
	 * @return Danh sách trạng thái theo từng ký tự.
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

		// Batch query theo IN danh sách chữ Hán
		Map<String, HanziStrokeDataEntity> entityMap = hanziStrokeDataRepository.findByHanziIn(hanziCandidates)
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
}
