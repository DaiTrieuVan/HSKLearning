package com.hsk.progress.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.progress.dto.ClassGradebookResponse;
import com.hsk.progress.dto.PersonalProgressResponse;
import com.hsk.progress.dto.SubmissionHistoryResponse;
import com.hsk.progress.service.ProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

/**
 * Controller phục vụ theo dõi tiến độ học tập cá nhân & lịch sử làm bài (HTT-07-CN-001, HTT-07-CN-002, HTT-07-CN-003).
 */
@RestController
@RequestMapping("/api/progress")
@Tag(name = "Personal Learning Progress", description = "HTT-07 — Theo dõi tiến độ và báo cáo")
public class ProgressController {

	private final ProgressService progressService;
	private final UserRepository userRepository;

	public ProgressController(ProgressService progressService, UserRepository userRepository) {
		this.progressService = progressService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null || principal.getName() == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@GetMapping("/personal")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-07-CN-001 — Lấy tổng quan tiến độ học tập cá nhân",
			description = "Trả về tiến độ theo từng cấp độ HSK, số từ vựng đã học, điểm trung bình bài tập và hoạt động gần đây"
	)
	public ResponseEntity<PersonalProgressResponse> getPersonalProgress(Principal principal) {
		UserEntity user = requireUser(principal);
		PersonalProgressResponse progress = progressService.getPersonalProgress(user.getId());
		return ResponseEntity.ok(progress);
	}

	@GetMapping("/history")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-07-CN-002 — Xem lịch sử bài làm và điểm số",
			description = "Học sinh xem danh sách các bài tập đã nộp, điểm số theo từng lượt (điểm cao nhất theo QTN-13), sắp xếp bài nộp mới nhất lên đầu (TC-01, TC-03, TC-04, TC-05)."
	)
	public ResponseEntity<SubmissionHistoryResponse> getSubmissionHistory(Principal principal) {
		UserEntity user = requireUser(principal);
		SubmissionHistoryResponse history = progressService.getSubmissionHistory(user.getId());
		return ResponseEntity.ok(history);
	}

	@GetMapping("/classes/{classId}/gradebook")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-07-CN-003 — Xem bảng điểm của cả lớp theo từng bài tập",
			description = "Giáo viên xem ma trận bảng điểm của lớp: mỗi ô là điểm cao nhất theo QTN-13, phân biệt chưa nộp với 0 điểm (TC-02), hiển thị điểm điều chỉnh (TC-03), hiển thị học sinh đã rời lớp (TC-04), cách ly dữ liệu QTN-01 (TC-07, TC-08), xem chi tiết các lượt làm bài (TC-09)."
	)
	public ResponseEntity<ClassGradebookResponse> getClassGradebook(
			@PathVariable("classId") Long classId,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		ClassGradebookResponse gradebook = progressService.getClassGradebook(user.getId(), classId);
		return ResponseEntity.ok(gradebook);
	}
}
