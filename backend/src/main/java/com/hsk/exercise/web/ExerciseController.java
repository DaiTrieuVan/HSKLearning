package com.hsk.exercise.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.exercise.dto.CopyExerciseRequest;
import com.hsk.exercise.dto.CreateExerciseRequest;
import com.hsk.exercise.dto.ExerciseResponse;
import com.hsk.exercise.dto.UpdateExerciseRequest;
import com.hsk.exercise.service.ExerciseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
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
 * REST Controller cho phân hệ Bài tập (HTT-05-CN-006, HTT-05-CN-007).
 */
@RestController
@RequestMapping("/api/exercises")
@Tag(name = "Exercises", description = "HTT-05 — Quản lý, tạo và sao chép bài tập")
public class ExerciseController {

	private final ExerciseService exerciseService;
	private final UserRepository userRepository;

	public ExerciseController(ExerciseService exerciseService, UserRepository userRepository) {
		this.exerciseService = exerciseService;
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
			summary = "HTT-05-CN-006 — Tạo bài tập từ câu hỏi",
			description = "Giáo viên tạo bài tập từ ngân hàng câu hỏi cá nhân, đặt điểm từng câu và lưu dạng DRAFT hoặc READY (QTN-09, QTN-14, QTN-19)."
	)
	public ResponseEntity<ExerciseResponse> createExercise(
			@Valid @RequestBody CreateExerciseRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		ExerciseResponse response = exerciseService.createExercise(user.getId(), request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PostMapping("/{id}/copy")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-007 — Sao chép bài tập",
			description = "Sao chép một bài tập có sẵn thành bài mới ở trạng thái DRAFT với đầy đủ câu hỏi và điểm số (QTN-19)."
	)
	public ResponseEntity<ExerciseResponse> copyExercise(
			@PathVariable("id") Long id,
			@RequestBody(required = false) CopyExerciseRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		ExerciseResponse response = exerciseService.copyExercise(user.getId(), id, request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-008 — Chỉnh sửa bài tập",
			description = "Giáo viên chỉnh sửa tên, mô tả, trạng thái, danh sách câu hỏi, điểm từng câu và thứ tự sắp xếp của bài tập (QTN-09, QTN-10, QTN-14, QTN-19)."
	)
	public ResponseEntity<ExerciseResponse> updateExercise(
			@PathVariable("id") Long id,
			@Valid @RequestBody UpdateExerciseRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		ExerciseResponse response = exerciseService.updateExercise(user.getId(), id, request);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/my")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-006 — Lấy danh sách bài tập của tôi",
			description = "Chỉ trả về các bài tập do chính giáo viên đăng nhập tạo ra (QTN-19)."
	)
	public ResponseEntity<List<ExerciseResponse>> getMyExercises(Principal principal) {
		UserEntity user = requireUser(principal);
		List<ExerciseResponse> response = exerciseService.getMyExercises(user.getId());
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-006 — Xem chi tiết bài tập",
			description = "Xem thông tin bài tập kèm danh sách câu hỏi và điểm số (QTN-19)."
	)
	public ResponseEntity<ExerciseResponse> getExerciseDetail(
			@PathVariable("id") Long id,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		ExerciseResponse response = exerciseService.getExerciseDetail(user.getId(), id);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/mock-exams")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-09-CN-001 — Tạo đề thi thử HSK",
			description = "Giáo viên tạo đề thi thử HSK gồm nhiều phần, giới hạn thời gian, điểm đạt từ ngân hàng câu hỏi (QTN-09, QTN-19)."
	)
	public ResponseEntity<com.hsk.exercise.dto.MockExamResponse> createMockExam(
			@Valid @RequestBody com.hsk.exercise.dto.CreateMockExamRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		com.hsk.exercise.dto.MockExamResponse response = exerciseService.createMockExam(user.getId(), request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/mock-exams")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-09-CN-001 — Lấy danh sách đề thi thử của tôi",
			description = "Chỉ trả về các đề thi thử do chính giáo viên đăng nhập tạo ra (QTN-19)."
	)
	public ResponseEntity<List<com.hsk.exercise.dto.MockExamResponse>> getMyMockExams(Principal principal) {
		UserEntity user = requireUser(principal);
		List<com.hsk.exercise.dto.MockExamResponse> response = exerciseService.getMyMockExams(user.getId());
		return ResponseEntity.ok(response);
	}

	@GetMapping("/mock-exams/history")
	@PreAuthorize("isAuthenticated()")
	@Operation(
			summary = "HTT-09-CN-004 — Xem lịch sử các đề thi thử đã làm",
			description = "Học sinh xem lại danh sách đề thi thử đã làm, điểm số, ngày làm và kết quả đạt/chưa đạt (QTN-02)."
	)
	public ResponseEntity<com.hsk.exercise.dto.MockExamHistoryResponse> getMockExamHistory(Principal principal) {
		UserEntity user = requireUser(principal);
		com.hsk.exercise.dto.MockExamHistoryResponse response = exerciseService.getMockExamHistory(user.getId());
		return ResponseEntity.ok(response);
	}

	@GetMapping("/mock-exams/{id}")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-09-CN-001 — Xem chi tiết đề thi thử HSK",
			description = "Xem cấu trúc đề thi thử kèm các phần thi, câu hỏi và điểm số (QTN-19)."
	)
	public ResponseEntity<com.hsk.exercise.dto.MockExamResponse> getMockExamDetail(
			@PathVariable("id") Long id,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		com.hsk.exercise.dto.MockExamResponse response = exerciseService.getMockExamDetail(user.getId(), id);
		return ResponseEntity.ok(response);
	}
}
