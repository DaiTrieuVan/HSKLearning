package com.hsk.assignment.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.assignment.dto.AssignmentSubmissionsOverviewResponse;
import com.hsk.assignment.dto.SaveDraftRequest;
import com.hsk.assignment.dto.SubmissionResultResponse;
import com.hsk.assignment.dto.SubmitAssignmentRequest;
import com.hsk.assignment.dto.TakeAssignmentResponse;
import com.hsk.assignment.service.AssignmentSubmissionService;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller xử lý các nghiệp vụ Học sinh làm bài tập và nộp bài (HTT-06-CN-003).
 */
@RestController
@RequestMapping("/api/assignments")
@Tag(name = "Assignment Submissions", description = "HTT-06-CN-003 — Làm bài, lưu nháp và nộp bài")
public class AssignmentSubmissionController {

	private final AssignmentSubmissionService submissionService;
	private final UserRepository userRepository;

	public AssignmentSubmissionController(
			AssignmentSubmissionService submissionService,
			UserRepository userRepository
	) {
		this.submissionService = submissionService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null || principal.getName() == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@PostMapping("/{id}/take")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-06-CN-003 — Bắt đầu làm bài hoặc tiếp tục làm bài dở",
			description = "Tạo lượt làm mới hoặc trả về lượt đang IN_PROGRESS kèm các câu đã lưu nháp. Tự nộp nếu quá hạn (QTN-11, QTN-20)."
	)
	public ResponseEntity<TakeAssignmentResponse> takeAssignment(
			@PathVariable("id") Long id,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		TakeAssignmentResponse response = submissionService.takeAssignment(user.getId(), id);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}/draft")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-06-CN-003 — Lưu nháp câu trả lời bài tập",
			description = "Lưu tạm câu trả lời khi đang làm bài. Kiểm tra thời hạn, tự nộp nếu quá hạn (QTN-20)."
	)
	public ResponseEntity<Void> saveDraft(
			@PathVariable("id") Long id,
			@Valid @RequestBody(required = false) SaveDraftRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		submissionService.saveDraft(user.getId(), id, request);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/{id}/submit")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-06-CN-003 — Nộp bài tập chính thức",
			description = "Chấm điểm tự động trắc nghiệm dựa theo bản chụp snapshot. Khóa bài làm thành SUBMITTED hoặc AUTO_SUBMITTED (QTN-11, QTN-12, QTN-20)."
	)
	public ResponseEntity<SubmissionResultResponse> submitAssignment(
			@PathVariable("id") Long id,
			@Valid @RequestBody(required = false) SubmitAssignmentRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		SubmissionResultResponse response = submissionService.submitAssignment(user.getId(), id, request);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{id}/submissions")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-06-CN-006 — Xem danh sách bài nộp của lớp học",
			description = "Giáo viên xem thống kê và danh sách học sinh kèm điểm số, trạng thái (QTN-01)."
	)
	public ResponseEntity<AssignmentSubmissionsOverviewResponse> getAssignmentSubmissionsOverview(
			@PathVariable("id") Long id,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		AssignmentSubmissionsOverviewResponse response = submissionService.getAssignmentSubmissionsOverview(user.getId(), id);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{id}/result")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-06-CN-003 & HTT-06-CN-005 — Xem kết quả bài làm và giải thích chi tiết",
			description = "Học sinh xem lại điểm số, câu trả lời của mình, đáp án đúng và lời giải sau khi đã nộp bài (QTN-02). Ẩn đáp án nếu chưa hết hạn nộp."
	)
	public ResponseEntity<SubmissionResultResponse> getSubmissionResult(
			@PathVariable("id") Long id,
			@org.springframework.web.bind.annotation.RequestParam(value = "studentId", required = false) Long studentId,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		SubmissionResultResponse response = submissionService.getSubmissionResult(user.getId(), id, studentId);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/submissions/{submissionId}")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-06-CN-005 — Xem chi tiết bài nộp theo mã bài nộp (Direct URL)",
			description = "Xem kết quả bài nộp bằng mã trực tiếp. Từ chối nếu bài nộp thuộc học sinh khác (QTN-02 / TC-05)."
	)
	public ResponseEntity<SubmissionResultResponse> getSubmissionResultById(
			@PathVariable("submissionId") Long submissionId,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		SubmissionResultResponse response = submissionService.getSubmissionResultById(user.getId(), submissionId);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/submissions/{submissionId}/adjust-score")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-06-CN-005 — Giáo viên điều chỉnh điểm bài nộp",
			description = "Giáo viên phụ trách điều chỉnh điểm số kèm lý do (QTN-13 / TC-04)."
	)
	public ResponseEntity<SubmissionResultResponse> adjustScore(
			@PathVariable("submissionId") Long submissionId,
			@Valid @RequestBody com.hsk.assignment.dto.AdjustScoreRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		SubmissionResultResponse response = submissionService.adjustScore(user.getId(), submissionId, request);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/{id}/regrade")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-06-CN-004 — Chấm lại bài nộp đã hoàn tất (Idempotent)",
			description = "Kiểm tra và giữ nguyên điểm gốc, không tạo điểm mới nếu bài đã chấm (TC-08)."
	)
	public ResponseEntity<SubmissionResultResponse> regradeSubmission(
			@PathVariable("id") Long id,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		SubmissionResultResponse response = submissionService.regradeSubmission(user.getId(), id);
		return ResponseEntity.ok(response);
	}
}
