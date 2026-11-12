package com.hsk.pronunciation.service;

import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.pronunciation.domain.PronunciationAttemptEntity;
import com.hsk.pronunciation.domain.ReferenceType;
import com.hsk.pronunciation.dto.PronunciationAssessmentResponse;
import com.hsk.pronunciation.dto.PronunciationHistoryItemResponse;
import com.hsk.pronunciation.port.PronunciationAssessmentProvider;
import com.hsk.pronunciation.port.PronunciationAssessmentResult;
import com.hsk.pronunciation.repository.PronunciationAttemptRepository;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service xử lý nghiệp vụ chấm phát âm và lưu trữ lịch sử (HTT-10-CN-003).
 */
@Service
public class PronunciationAssessmentService {

	private static final Logger log = LoggerFactory.getLogger(PronunciationAssessmentService.class);

	private static final long MAX_AUDIO_SIZE_BYTES = 10L * 1024 * 1024; // 10 MB
	private static final double MIN_DURATION_SECONDS = 0.5;
	private static final double MAX_DURATION_SECONDS = 60.0;

	private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
			"audio/webm",
			"audio/ogg",
			"audio/wav",
			"audio/x-wav",
			"audio/wave",
			"audio/mpeg",
			"audio/mp3",
			"audio/mp4",
			"audio/m4a",
			"audio/aac",
			"audio/flac",
			"audio/x-m4a",
			"application/octet-stream"
	);

	private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
			".webm", ".ogg", ".wav", ".mp3", ".m4a", ".aac", ".flac"
	);

	private final PronunciationAssessmentProvider assessmentProvider;
	private final PronunciationAttemptRepository attemptRepository;
	private final VocabularyRepository vocabularyRepository;

	public PronunciationAssessmentService(
			PronunciationAssessmentProvider assessmentProvider,
			PronunciationAttemptRepository attemptRepository,
			VocabularyRepository vocabularyRepository
	) {
		this.assessmentProvider = assessmentProvider;
		this.attemptRepository = attemptRepository;
		this.vocabularyRepository = vocabularyRepository;
	}

	/**
	 * Tiếp nhận tệp ghi âm, thẩm định tính hợp lệ, gọi dịch vụ nhận dạng và lưu kết quả (TC-01, TC-03, TC-04, TC-05).
	 *
	 * @param studentId ID tài khoản học sinh đã xác thực từ JWT.
	 * @param audio Tệp âm thanh ghi âm từ client.
	 * @param referenceText Đoạn chữ Hán hoặc câu mẫu chuẩn.
	 * @param referenceType Loại tham chiếu (VOCABULARY hoặc SENTENCE).
	 * @param referenceId ID từ vựng tham chiếu (nếu có).
	 * @param clientDurationSeconds Thời lượng bản ghi âm do client đo được (nếu có).
	 * @return Kết quả chấm điểm phát âm.
	 */
	@Transactional
	public PronunciationAssessmentResponse assessPronunciation(
			Long studentId,
			MultipartFile audio,
			String referenceText,
			ReferenceType referenceType,
			Long referenceId,
			Double clientDurationSeconds
	) {
		// 1. Thẩm định referenceText
		validateReferenceText(referenceText);

		// 2. Đối chiếu dữ liệu chuẩn nếu có referenceId
		validateReferenceId(referenceText, referenceType, referenceId);

		// 3. Thẩm định tệp âm thanh (MIME, dung lượng, thời lượng, dữ liệu im lặng)
		byte[] audioBytes = validateAndExtractAudio(audio, clientDurationSeconds);

		try {
			String contentType = audio.getContentType() != null ? audio.getContentType() : "audio/wav";

			// 4. Gọi Port chấm phát âm độc lập (TC-01, TC-03)
			// Nếu provider gặp lỗi hoặc quá thời gian, exception được ném ra và KHÔNG lưu bản ghi DB nào (TC-03)
			PronunciationAssessmentResult result = assessmentProvider.assess(referenceText, audioBytes, contentType);

			// 5. Chuẩn hóa điểm số
			BigDecimal overallScore = BigDecimal.valueOf(result.overallScore()).setScale(2, RoundingMode.HALF_UP);
			BigDecimal accuracyScore = BigDecimal.valueOf(result.accuracyScore()).setScale(2, RoundingMode.HALF_UP);
			BigDecimal fluencyScore = BigDecimal.valueOf(result.fluencyScore()).setScale(2, RoundingMode.HALF_UP);
			BigDecimal completenessScore = BigDecimal.valueOf(result.completenessScore()).setScale(2, RoundingMode.HALF_UP);
			Instant assessedAt = Instant.now();

			// 6. Lưu lịch sử kết quả vào DB (TC-05: Tuyệt đối KHÔNG lưu audio bytes/URL/file)
			PronunciationAttemptEntity entity = new PronunciationAttemptEntity(
					studentId,
					referenceType,
					referenceId,
					referenceText.trim(),
					overallScore,
					accuracyScore,
					fluencyScore,
					completenessScore,
					result.feedbackCode(),
					assessedAt
			);
			PronunciationAttemptEntity saved = attemptRepository.save(entity);

			return new PronunciationAssessmentResponse(
					saved.getId(),
					saved.getScore(),
					saved.getAccuracyScore(),
					saved.getFluencyScore(),
					saved.getCompletenessScore(),
					result.feedbackMessage(),
					saved.getFeedbackCode(),
					saved.getAssessedAt()
			);
		} finally {
			// Giải phóng buffer tạm thời trong finally (bảo mật bộ nhớ & quyền riêng tư)
			audioBytes = null;
		}
	}

	/**
	 * Lấy lịch sử các lần luyện phát âm của chính học sinh hiện tại (TC-05).
	 *
	 * @param studentId ID tài khoản học sinh.
	 * @param limit Số lượng bản ghi tối đa (1 - 100).
	 * @return Danh sách các lần chấm.
	 */
	@Transactional(readOnly = true)
	public List<PronunciationHistoryItemResponse> getHistory(Long studentId, int limit) {
		int boundedLimit = Math.max(1, Math.min(limit, 100));
		List<PronunciationAttemptEntity> attempts = attemptRepository.findAllByStudentIdOrderByAssessedAtDesc(
				studentId, PageRequest.of(0, boundedLimit)
		);

		return attempts.stream()
				.map(a -> new PronunciationHistoryItemResponse(
						a.getId(),
						a.getReferenceType(),
						a.getReferenceId(),
						a.getReferenceText(),
						a.getScore(),
						a.getAccuracyScore(),
						a.getFluencyScore(),
						a.getCompletenessScore(),
						resolveFeedbackMessage(a.getFeedbackCode(), a.getScore()),
						a.getFeedbackCode(),
						a.getAssessedAt()
				))
				.toList();
	}

	private void validateReferenceText(String referenceText) {
		if (referenceText == null || referenceText.isBlank()) {
			throw new ApiException(ApiErrorCode.INVALID_REFERENCE_TEXT, "Nội dung chuẩn không được để trống");
		}

		String trimmed = referenceText.trim();
		int codePointCount = trimmed.codePointCount(0, trimmed.length());
		if (codePointCount < 1 || codePointCount > 200) {
			throw new ApiException(ApiErrorCode.INVALID_REFERENCE_TEXT, "Nội dung chuẩn phải có độ dài từ 1 đến 200 ký tự");
		}

		boolean hasHanzi = trimmed.codePoints().anyMatch(cp ->
				Character.UnicodeScript.of(cp) == Character.UnicodeScript.HAN
		);
		if (!hasHanzi) {
			throw new ApiException(ApiErrorCode.INVALID_REFERENCE_TEXT, "Nội dung chuẩn phải chứa ít nhất một chữ Hán");
		}
	}

	private void validateReferenceId(String referenceText, ReferenceType referenceType, Long referenceId) {
		if (referenceId == null) {
			return;
		}

		VocabularyEntity vocab = vocabularyRepository.findById(referenceId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy dữ liệu từ vựng tham chiếu"));

		if (referenceType == null || referenceType == ReferenceType.VOCABULARY) {
			if (!vocab.getHanzi().trim().equals(referenceText.trim())) {
				throw new ApiException(ApiErrorCode.VALIDATION_FAILED, "Nội dung chuẩn không khớp với từ vựng ID " + referenceId);
			}
		} else if (referenceType == ReferenceType.SENTENCE) {
			String sentence = vocab.getExampleSentence() != null ? vocab.getExampleSentence().trim() : "";
			if (!sentence.contains(referenceText.trim()) && !referenceText.trim().contains(sentence)) {
				throw new ApiException(ApiErrorCode.VALIDATION_FAILED, "Nội dung chuẩn không khớp với câu ví dụ của từ vựng ID " + referenceId);
			}
		}
	}

	private byte[] validateAndExtractAudio(MultipartFile audio, Double clientDurationSeconds) {
		if (audio == null || audio.isEmpty()) {
			throw new ApiException(ApiErrorCode.INVALID_AUDIO, "Tệp âm thanh không được để trống");
		}

		if (audio.getSize() > MAX_AUDIO_SIZE_BYTES) {
			throw new ApiException(ApiErrorCode.INVALID_AUDIO, "Kích thước tệp âm thanh vượt quá 10 MB");
		}

		String contentType = audio.getContentType() != null ? audio.getContentType().toLowerCase(Locale.ROOT) : "";
		String filename = audio.getOriginalFilename() != null ? audio.getOriginalFilename().toLowerCase(Locale.ROOT) : "";

		boolean allowedMime = ALLOWED_MIME_TYPES.stream().anyMatch(contentType::startsWith);
		boolean allowedExt = ALLOWED_EXTENSIONS.stream().anyMatch(filename::endsWith);

		if (!allowedMime && !allowedExt) {
			throw new ApiException(ApiErrorCode.INVALID_AUDIO, "Định dạng tệp âm thanh không được hỗ trợ");
		}

		// Kiểm tra thời lượng từ client nếu có
		if (clientDurationSeconds != null) {
			if (clientDurationSeconds < MIN_DURATION_SECONDS || clientDurationSeconds > MAX_DURATION_SECONDS) {
				throw new ApiException(ApiErrorCode.INVALID_AUDIO, "Bản ghi âm quá ngắn (dưới 0.5 giây) hoặc quá dài");
			}
		}

		byte[] audioBytes;
		try {
			audioBytes = audio.getBytes();
		} catch (IOException e) {
			throw new ApiException(ApiErrorCode.INVALID_AUDIO, "Không thể đọc dữ liệu âm thanh");
		}

		if (audioBytes.length == 0) {
			throw new ApiException(ApiErrorCode.INVALID_AUDIO, "Dữ liệu âm thanh trống");
		}

		// Với bản ghi âm cực ngắn (dưới 1000 byte) ở mọi định dạng speech
		if (audioBytes.length < 1000 && (clientDurationSeconds != null && clientDurationSeconds < MIN_DURATION_SECONDS)) {
			throw new ApiException(ApiErrorCode.INVALID_AUDIO, "Bản ghi âm quá ngắn hoặc chỉ có tiếng ồn");
		}

		// Kiểm tra container định dạng WAV
		validateWavIfApplicable(audioBytes);

		return audioBytes;
	}

	/**
	 * Phân tích header RIFF WAV để tính toán thời lượng và phát hiện âm thanh im lặng (TC-04).
	 */
	private void validateWavIfApplicable(byte[] audioBytes) {
		if (audioBytes.length < 44) {
			return;
		}

		// Kiểm tra magic header 'RIFF' và format 'WAVE'
		if (audioBytes[0] == 'R' && audioBytes[1] == 'I' && audioBytes[2] == 'F' && audioBytes[3] == 'F'
				&& audioBytes[8] == 'W' && audioBytes[9] == 'A' && audioBytes[10] == 'V' && audioBytes[11] == 'E') {

			ByteBuffer buffer = ByteBuffer.wrap(audioBytes).order(ByteOrder.LITTLE_ENDIAN);

			// Tìm chunk "fmt " và chunk "data"
			int offset = 12;
			int byteRate = 0;
			int dataLength = 0;
			int dataOffset = -1;

			while (offset + 8 <= audioBytes.length) {
				char c1 = (char) audioBytes[offset];
				char c2 = (char) audioBytes[offset + 1];
				char c3 = (char) audioBytes[offset + 2];
				char c4 = (char) audioBytes[offset + 3];
				String chunkId = "" + c1 + c2 + c3 + c4;
				int chunkSize = buffer.getInt(offset + 4);

				if ("fmt ".equals(chunkId)) {
					if (offset + 20 <= audioBytes.length) {
						byteRate = buffer.getInt(offset + 16);
					}
				} else if ("data".equals(chunkId)) {
					dataLength = chunkSize;
					dataOffset = offset + 8;
					break;
				}

				offset += 8 + Math.max(0, chunkSize);
			}

			if (byteRate > 0 && dataLength > 0) {
				double duration = (double) dataLength / byteRate;
				if (duration < MIN_DURATION_SECONDS) {
					throw new ApiException(ApiErrorCode.INVALID_AUDIO, "Bản ghi âm quá ngắn (dưới 0.5 giây)");
				}
				if (duration > MAX_DURATION_SECONDS) {
					throw new ApiException(ApiErrorCode.INVALID_AUDIO, "Bản ghi âm quá dài (vượt quá 60 giây)");
				}
			}

			// Kiểm tra im lặng / nhiễu thuần túy (silent audio check)
			if (dataOffset > 0 && dataOffset + dataLength <= audioBytes.length && dataLength > 100) {
				long totalAmp = 0;
				int sampleCount = 0;
				for (int i = dataOffset; i < dataOffset + Math.min(dataLength, 4000); i += 2) {
					short sample = buffer.getShort(i);
					totalAmp += Math.abs(sample);
					sampleCount++;
				}
				if (sampleCount > 0) {
					double avgAmp = (double) totalAmp / sampleCount;
					if (avgAmp < 2.0) {
						throw new ApiException(ApiErrorCode.INVALID_AUDIO, "Bản ghi âm chỉ có tiếng ồn hoặc không có tiếng nói");
					}
				}
			}
		}
	}

	private String resolveFeedbackMessage(String feedbackCode, BigDecimal score) {
		if ("EXCELLENT".equalsIgnoreCase(feedbackCode)) {
			return "Phát âm rất chuẩn xác và tự nhiên!";
		}
		if ("GOOD".equalsIgnoreCase(feedbackCode)) {
			return "Phát âm tốt, cần chú ý ngữ điệu tự nhiên hơn.";
		}
		if ("NEEDS_PRACTICE".equalsIgnoreCase(feedbackCode)) {
			return "Cần luyện thêm thanh điệu và độ tròn vành rõ chữ.";
		}
		if (score != null && score.doubleValue() >= 80.0) {
			return "Phát âm tốt!";
		}
		return "Đã hoàn thành lượt chấm.";
	}
}
