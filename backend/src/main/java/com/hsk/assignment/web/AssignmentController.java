package com.hsk.assignment.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.assignment.dto.AssignExerciseRequest;
import com.hsk.assignment.dto.AssignmentDetailResponse;
import com.hsk.assignment.dto.AssignmentResponse;
import com.hsk.assignment.service.AssignmentService;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.assignment.dto.StudentAssignmentDetailResponse;
import com.hsk.assignment.dto.StudentAssignmentResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.hsk.assignment.dto.ExtendAssignmentDueDateRequest;

/**
 * Controller xử lý các yêu cầu Giao bài tập cho lớp (HTT-06-CN-001)
 * và Học sinh xem bài tập được giao (HTT-06-CN-002).
 */
@RestController
@RequestMapping("/api/assignments")
@Tag(name = "Assignments", description = "HTT-06 — Giao bài, làm bài và chấm điểm")
public class AssignmentController {

	private final AssignmentService assignmentService;
	private final UserRepository userRepository;

	public AssignmentController(AssignmentService assignmentService, UserRepository userRepository) {
		this.assignmentService = assignmentService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null || principal.getName() == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@PostMapping
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-06-CN-001 — Giao bài tập cho lớp",
			description = "Giáo viên chọn bài tập, lớp học, thời gian bắt đầu và hạn nộp để giao bài. Chụp lại snapshot toàn bộ câu hỏi đáp án theo QTN-10."
	)
	public ResponseEntity<AssignmentResponse> assignExercise(
			@Valid @RequestBody AssignExerciseRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		AssignmentResponse response = assignmentService.assignExercise(user.getId(), request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/classes/{classId}")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-06-CN-001 — Lấy danh sách bài tập đã giao cho một lớp",
			description = "Giáo viên phụ trách xem toàn bộ; học sinh chỉ thấy bài đã đến giờ bắt đầu hoặc bài còn hạn nộp."
	)
	public ResponseEntity<List<AssignmentResponse>> getAssignmentsForClass(
			@PathVariable("classId") Long classId,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		List<AssignmentResponse> responses = assignmentService.getAssignmentsForClass(user.getId(), classId);
		return ResponseEntity.ok(responses);
	}

	@GetMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-06-CN-001 — Xem chi tiết lần giao bài",
			description = "Xem thông tin phiên giao bài kèm bản chụp nội dung câu hỏi snapshot."
	)
	public ResponseEntity<AssignmentDetailResponse> getAssignmentDetail(
			@PathVariable("id") Long id,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		AssignmentDetailResponse response = assignmentService.getAssignmentDetail(user.getId(), id);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/classes/{classId}/student")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-06-CN-002 — Học sinh xem danh sách bài tập được giao",
			description = "Hiển thị danh sách bài tập kèm hạn nộp và trạng thái cá nhân: chưa làm, đã nộp, quá hạn, chưa mở (QTN-02, QTN-18)."
	)
	public ResponseEntity<List<StudentAssignmentResponse>> getStudentAssignmentsForClass(
			@PathVariable("classId") Long classId,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		List<StudentAssignmentResponse> responses = assignmentService.getStudentAssignmentsForClass(user.getId(), classId);
		return ResponseEntity.ok(responses);
	}

	@GetMapping("/{id}/student")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-06-CN-002 — Học sinh xem chi tiết bài tập được giao",
			description = "Xem chi tiết bài tập được giao. Ẩn nội dung câu hỏi nếu bài tập chưa đến giờ mở (TC-03), từ chối nếu không thuộc lớp (TC-05)."
	)
	public ResponseEntity<StudentAssignmentDetailResponse> getStudentAssignmentDetail(
			@PathVariable("id") Long id,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		StudentAssignmentDetailResponse response = assignmentService.getStudentAssignmentDetail(user.getId(), id);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/{id}/cancel")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-06-CN-009 — Hủy lần giao bài",
			description = "Giáo viên phụ trách lớp hủy lần giao bài giao nhầm (chuyển sang CANCELLED). Chỉ hủy được khi chưa có học sinh nào làm/nộp bài (QTN-01, QTN-21)."
	)
	public ResponseEntity<AssignmentResponse> cancelAssignment(
			@PathVariable("id") Long id,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		AssignmentResponse response = assignmentService.cancelAssignment(user.getId(), id);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-06-CN-009 — Hủy lần giao bài (RESTful delete alias)",
			description = "Bí danh RESTful để hủy lần giao bài mà không xóa vật lý khỏi cơ sở dữ liệu."
	)
	public ResponseEntity<AssignmentResponse> deleteAssignment(
			@PathVariable("id") Long id,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		AssignmentResponse response = assignmentService.cancelAssignment(user.getId(), id);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/{id}/due-date")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-06-CN-010 — Kéo dài hạn nộp lần giao bài",
			description = "Giáo viên phụ trách lớp kéo dài hạn nộp của cả lần giao bài (QTN-21). "
					+ "Hạn mới phải sau hạn hiện tại. Lượt đã nộp không bị mở lại (TC-04)."
	)
	public ResponseEntity<AssignmentResponse> extendAssignmentDueDate(
			@PathVariable("id") Long id,
			@Valid @RequestBody ExtendAssignmentDueDateRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		AssignmentResponse response = assignmentService.extendAssignmentDueDate(
				user.getId(), id, request.newDueTime());
		return ResponseEntity.ok(response);
	}
}
