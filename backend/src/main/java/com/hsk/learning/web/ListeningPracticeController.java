package com.hsk.learning.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.dto.ListeningPracticeDetailResponse;
import com.hsk.learning.dto.ListeningPracticeItemDto;
import com.hsk.learning.dto.ListeningPracticeResultResponse;
import com.hsk.learning.dto.SubmitListeningPracticeRequest;
import com.hsk.learning.service.ListeningPracticeService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller phục vụ luyện nghe hiểu (HTT-10-CN-001).
 * Tuân thủ Senior Backend Mode: DTO boundary validation, RFC standardized errors, structured logging.
 */
@RestController
@RequestMapping({"/api/listening-practices", "/api/v1/listening-practices"})
public class ListeningPracticeController {

	private final ListeningPracticeService listeningPracticeService;
	private final UserRepository userRepository;

	public ListeningPracticeController(
			ListeningPracticeService listeningPracticeService,
			UserRepository userRepository
	) {
		this.listeningPracticeService = listeningPracticeService;
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
	 * Lấy danh sách các bài luyện nghe khả dụng (HTT-10-CN-001-TC-03).
	 * Tự động lọc bỏ các bài nghe thiếu tệp âm thanh.
	 */
	@GetMapping
	public ResponseEntity<List<ListeningPracticeItemDto>> getListeningPractices(
			@RequestParam(required = false) Integer hskLevel
	) {
		List<ListeningPracticeItemDto> result = listeningPracticeService.getListeningPractices(hskLevel);
		return ResponseEntity.ok(result);
	}

	/**
	 * Lấy chi tiết bài nghe và các câu hỏi đi kèm (đáp án đúng được ẩn bảo mật).
	 */
	@GetMapping("/{id}")
	public ResponseEntity<ListeningPracticeDetailResponse> getListeningPracticeDetail(
			@PathVariable("id") Long id
	) {
		ListeningPracticeDetailResponse response = listeningPracticeService.getListeningPracticeDetail(id);
		return ResponseEntity.ok(response);
	}

	/**
	 * Nộp bài nghe và nhận kết quả chấm điểm tức thì (HTT-10-CN-001-TC-01).
	 */
	@PostMapping("/{id}/submit")
	public ResponseEntity<ListeningPracticeResultResponse> submitListeningPractice(
			@PathVariable("id") Long id,
			@Valid @RequestBody SubmitListeningPracticeRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		ListeningPracticeResultResponse result = listeningPracticeService.submitListeningPractice(user.getId(), id, request);
		return ResponseEntity.ok(result);
	}
}
