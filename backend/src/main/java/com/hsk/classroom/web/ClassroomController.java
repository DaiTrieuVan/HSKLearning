package com.hsk.classroom.web;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.dto.ClassMemberResponse;
import com.hsk.classroom.dto.ClassResponse;
import com.hsk.classroom.dto.CreateClassCommand;
import com.hsk.classroom.dto.JoinClassCommand;
import com.hsk.classroom.dto.UpdateClassCommand;
import com.hsk.classroom.service.ClassroomService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * HTT-02: REST API Quản lý lớp học và thành viên.
 */
@RestController
@RequestMapping("/api/v1/classes")
@Tag(name = "Quản lý lớp học", description = "HTT-02 — Tạo lớp, tham gia bằng mã, quản lý thành viên")
@SecurityRequirement(name = "bearerAuth")
public class ClassroomController {

	private final ClassroomService classroomService;

	public ClassroomController(ClassroomService classroomService) {
		this.classroomService = classroomService;
	}

	@PostMapping
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "HTT-02-CN-001 — Tạo lớp học mới", description = "Sinh mã join_code 6 ký tự duy nhất (QTN-04)")
	public ResponseEntity<ClassResponse> createClass(
			@Valid @RequestBody CreateClassCommand command,
			Principal principal) {
		ClassResponse response = classroomService.createClass(principal.getName(), command);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "HTT-02-CN-002 — Cập nhật thông tin lớp học")
	public ResponseEntity<ClassResponse> updateClass(
			@PathVariable Long id,
			@Valid @RequestBody UpdateClassCommand command,
			Principal principal) {
		ClassResponse response = classroomService.updateClass(principal.getName(), id, command);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/{id}/archive")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "HTT-02-CN-002 — Lưu trữ lớp học", description = "Chuyển trạng thái sang ARCHIVED (QTN-01)")
	public ResponseEntity<ClassResponse> archiveClass(
			@PathVariable Long id,
			Principal principal) {
		ClassResponse response = classroomService.archiveClass(principal.getName(), id);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/teaching")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "HTT-02-CN-004 — Xem danh sách các lớp học do giáo viên phụ trách")
	public ResponseEntity<List<ClassResponse>> getTeachingClasses(Principal principal) {
		List<ClassResponse> list = classroomService.getTeacherClasses(principal.getName());
		return ResponseEntity.ok(list);
	}

	@PostMapping("/join")
	@Operation(summary = "HTT-02-CN-003 — Học sinh tham gia lớp bằng mã 6 ký tự", description = "Chống dò mã lớp giới hạn 10 lần sai trong 1 giờ (QTN-05)")
	public ResponseEntity<ClassResponse> joinClass(
			@Valid @RequestBody JoinClassCommand command,
			Principal principal) {
		ClassResponse response = classroomService.joinClass(principal.getName(), command);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/enrolled")
	@Operation(summary = "HTT-02-CN-005 — Xem danh sách các lớp học sinh đã tham gia (QTN-02)")
	public ResponseEntity<List<ClassResponse>> getEnrolledClasses(Principal principal) {
		List<ClassResponse> list = classroomService.getEnrolledClasses(principal.getName());
		return ResponseEntity.ok(list);
	}

	@GetMapping("/{id}/members")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "HTT-02-CN-006 — Xem danh sách thành viên trong lớp")
	public ResponseEntity<List<ClassMemberResponse>> getClassMembers(
			@PathVariable Long id,
			@RequestParam(required = false) ClassMemberStatus status,
			Principal principal) {
		List<ClassMemberResponse> list = classroomService.getClassMembers(principal.getName(), id, status);
		return ResponseEntity.ok(list);
	}

	@PostMapping("/{id}/members/{studentId}/remove")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "HTT-02-CN-007 — Xóa học sinh khỏi lớp", description = "Chuyển trạng thái thành REMOVED, bảo lưu điểm số và bài tập (QTN-06)")
	public ResponseEntity<Void> removeStudent(
			@PathVariable Long id,
			@PathVariable Long studentId,
			@RequestParam(defaultValue = "Xóa bởi giáo viên") String reason,
			Principal principal) {
		classroomService.removeStudentFromClass(principal.getName(), id, studentId, reason);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/{id}/members/{studentId}/restore")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "HTT-02-CN-009 — Khôi phục học sinh đã bị xóa vào lớp (QTN-01 & QTN-06)")
	public ResponseEntity<Void> restoreStudent(
			@PathVariable Long id,
			@PathVariable Long studentId,
			Principal principal) {
		classroomService.restoreStudentToClass(principal.getName(), id, studentId);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/{id}/leave")
	@Operation(summary = "HTT-02-CN-008 — Học sinh tự rời khỏi lớp", description = "Chuyển trạng thái sang LEFT, bảo lưu kết quả (QTN-05 & QTN-06)")
	public ResponseEntity<Void> leaveClass(
			@PathVariable Long id,
			Principal principal) {
		classroomService.leaveClass(principal.getName(), id);
		return ResponseEntity.ok().build();
	}
}
