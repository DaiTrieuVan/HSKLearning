package com.hsk.pronunciation.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.pronunciation.domain.ReferenceType;
import com.hsk.pronunciation.dto.PronunciationAssessmentResponse;
import com.hsk.pronunciation.dto.PronunciationHistoryItemResponse;
import com.hsk.pronunciation.service.PronunciationAssessmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.security.Principal;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST Controller cho tính năng Chấm phát âm bằng nhận dạng giọng nói (HTT-10-CN-003).
 */
@Validated
@RestController
@RequestMapping({"/api/v1/pronunciation", "/api/pronunciation"})
@Tag(name = "Pronunciation", description = "Endpoints ghi âm và chấm phát âm (HTT-10-CN-003)")
public class PronunciationController {

	private final PronunciationAssessmentService pronunciationAssessmentService;
	private final UserRepository userRepository;

	public PronunciationController(
			PronunciationAssessmentService pronunciationAssessmentService,
			UserRepository userRepository
	) {
		this.pronunciationAssessmentService = pronunciationAssessmentService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	/**
	 * Gửi tệp ghi âm để chấm điểm phát âm so với văn bản chữ Hán chuẩn (HTT-10-CN-003-TC-01..TC-04).
	 *
	 * @param audio Tệp âm thanh ghi âm từ microphone của học sinh.
	 * @param referenceText Đoạn chữ Hán hoặc câu mẫu chuẩn cần so khớp.
	 * @param referenceType Loại tham chiếu (VOCABULARY hoặc SENTENCE).
	 * @param referenceId ID từ vựng tham chiếu (nếu có).
	 * @param durationSeconds Thời lượng bản ghi âm do client ghi nhận (giây).
	 * @param principal Thông tin tài khoản người dùng đã đăng nhập.
	 * @return Kết quả chấm điểm gồm điểm tổng thể, độ chính xác, độ trôi chảy và nhận xét.
	 */
	@Operation(summary = "Chấm điểm bản ghi âm phát âm so với nội dung chuẩn")
	@PostMapping(value = "/assess", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<PronunciationAssessmentResponse> assessPronunciation(
			@RequestPart("audio") MultipartFile audio,
			@RequestParam("referenceText") String referenceText,
			@RequestParam(value = "referenceType", required = false) ReferenceType referenceType,
			@RequestParam(value = "referenceId", required = false) Long referenceId,
			@RequestParam(value = "durationSeconds", required = false) Double durationSeconds,
			Principal principal
	) {
		UserEntity student = requireUser(principal);

		PronunciationAssessmentResponse response = pronunciationAssessmentService.assessPronunciation(
				student.getId(),
				audio,
				referenceText,
				referenceType,
				referenceId,
				durationSeconds
		);

		return ResponseEntity.ok(response);
	}

	/**
	 * Lấy danh sách lịch sử các lần luyện phát âm của chính học sinh hiện tại (HTT-10-CN-003-TC-05).
	 *
	 * @param limit Giới hạn số lượng bản ghi trả về (mặc định 20, tối đa 100).
	 * @param principal Thông tin tài khoản người dùng đăng nhập.
	 * @return Danh sách các lần luyện phát âm đã ghi nhận (không kèm tệp âm thanh).
	 */
	@Operation(summary = "Xem lịch sử luyện phát âm của học sinh")
	@GetMapping("/history")
	public ResponseEntity<List<PronunciationHistoryItemResponse>> getHistory(
			@RequestParam(value = "limit", defaultValue = "20") int limit,
			Principal principal
	) {
		UserEntity student = requireUser(principal);
		List<PronunciationHistoryItemResponse> history = pronunciationAssessmentService.getHistory(student.getId(), limit);
		return ResponseEntity.ok(history);
	}
}
