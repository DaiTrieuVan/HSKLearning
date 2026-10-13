package com.hsk.account.web;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hsk.account.dto.RejectTeacherRequestCommand;
import com.hsk.account.dto.SubmitTeacherRequestCommand;
import com.hsk.account.dto.TeacherRequestResponse;
import com.hsk.account.service.TeacherRequestService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * Controller xử lý yêu cầu nâng quyền giáo viên:
 * - Học sinh gửi yêu cầu (HTT-01-CN-002)
 * - Quản trị viên xét duyệt / từ chối (HTT-01-CN-003)
 */
@RestController
@RequestMapping("/api/v1")
@Tag(name = "Yêu cầu nâng quyền giáo viên", description = "HTT-01-CN-002 & HTT-01-CN-003")
public class TeacherRequestController {

	private final TeacherRequestService teacherRequestService;

	public TeacherRequestController(TeacherRequestService teacherRequestService) {
		this.teacherRequestService = teacherRequestService;
	}

	@Operation(summary = "HTT-01-CN-002 — Học sinh gửi yêu cầu trở thành giáo viên",
			description = "Tạo yêu cầu nâng quyền ở trạng thái PENDING kèm thông tin giảng dạy. Người dùng vẫn là học sinh cho đến khi được duyệt.")
	@PostMapping(path = "/teacher-requests", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<TeacherRequestResponse> submitRequest(
			@Valid @RequestBody SubmitTeacherRequestCommand command,
			Principal principal) {
		TeacherRequestResponse response = teacherRequestService.submitRequest(principal.getName(), command);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@Operation(summary = "HTT-01-CN-002 — Xem trạng thái yêu cầu nâng quyền của tôi",
			description = "Lấy yêu cầu gần nhất của người dùng hiện tại để hiển thị thông báo chờ duyệt hoặc lý do bị từ chối.")
	@GetMapping(path = "/teacher-requests/me", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<TeacherRequestResponse> getMyLatestRequest(Principal principal) {
		return teacherRequestService.getMyLatestRequest(principal.getName())
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.noContent().build());
	}

	@Operation(summary = "HTT-01-CN-003 — Quản trị viên xem danh sách yêu cầu chờ duyệt")
	@GetMapping(path = "/admin/teacher-requests", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<TeacherRequestResponse>> listPendingRequests() {
		List<TeacherRequestResponse> list = teacherRequestService.listPendingRequests();
		return ResponseEntity.ok(list);
	}

	@Operation(summary = "HTT-01-CN-003 — Quản trị viên phê duyệt yêu cầu giáo viên",
			description = "Chuyển trạng thái sang APPROVED, cấp thêm vai trò TEACHER cho người dùng và giữ nguyên vai trò STUDENT (QTN-03).")
	@PostMapping(path = "/admin/teacher-requests/{id}/approve", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<TeacherRequestResponse> approveRequest(
			@PathVariable("id") Long id,
			Principal principal) {
		TeacherRequestResponse response = teacherRequestService.approveRequest(id, principal.getName());
		return ResponseEntity.ok(response);
	}

	@Operation(summary = "HTT-01-CN-003 — Quản trị viên từ chối yêu cầu giáo viên kèm lý do",
			description = "Chuyển trạng thái sang REJECTED kèm lý do. Tài khoản vẫn là học sinh và có thể gửi lại yêu cầu mới.")
	@PostMapping(path = "/admin/teacher-requests/{id}/reject", produces = MediaType.APPLICATION_JSON_VALUE)
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<TeacherRequestResponse> rejectRequest(
			@PathVariable("id") Long id,
			@Valid @RequestBody RejectTeacherRequestCommand command,
			Principal principal) {
		TeacherRequestResponse response = teacherRequestService.rejectRequest(id, principal.getName(), command.reason());
		return ResponseEntity.ok(response);
	}
}
