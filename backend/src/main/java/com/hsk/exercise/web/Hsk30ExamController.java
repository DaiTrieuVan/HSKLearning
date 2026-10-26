package com.hsk.exercise.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.exercise.dto.hsk30.Hsk30ExamDetailResponse;
import com.hsk.exercise.dto.hsk30.Hsk30ExamListItemDto;
import com.hsk.exercise.dto.hsk30.Hsk30ExamResultResponse;
import com.hsk.exercise.dto.hsk30.Hsk30SubmitExamRequest;
import com.hsk.exercise.service.Hsk30ExamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/hsk30/exams")
@Tag(name = "HSK 3.0 Exams", description = "Quản lý và thi thử trực tuyến đề thi chuẩn HSK 3.0 (Nghe và Đọc)")
public class Hsk30ExamController {

	private final Hsk30ExamService hsk30ExamService;
	private final UserRepository userRepository;

	public Hsk30ExamController(Hsk30ExamService hsk30ExamService, UserRepository userRepository) {
		this.hsk30ExamService = hsk30ExamService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null || principal.getName() == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@GetMapping
	@Operation(summary = "Danh sách đề thi HSK 3.0", description = "Lấy danh sách các đề thi chuẩn HSK 3.0 theo cấp độ (mặc định HSK 1)")
	public ResponseEntity<List<Hsk30ExamListItemDto>> getExams(
			@RequestParam(required = false, defaultValue = "1") Integer hskLevel
	) {
		List<Hsk30ExamListItemDto> exams = hsk30ExamService.getHskExams(hskLevel);
		return ResponseEntity.ok(exams);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Xem chi tiết đề thi HSK 3.0", description = "Xem cấu trúc đề thi bao gồm đáp án (dành cho giáo viên/quản trị viên)")
	public ResponseEntity<Hsk30ExamDetailResponse> getExamDetail(
			@PathVariable Long id
	) {
		Hsk30ExamDetailResponse exam = hsk30ExamService.getExamDetail(id, false);
		return ResponseEntity.ok(exam);
	}

	@GetMapping("/{id}/take")
	@Operation(summary = "Vào phòng thi HSK 3.0", description = "Lấy đề thi cho thí sinh làm bài, ẩn toàn bộ đáp án và lời giải")
	public ResponseEntity<Hsk30ExamDetailResponse> takeExam(
			@PathVariable Long id
	) {
		Hsk30ExamDetailResponse exam = hsk30ExamService.getExamDetail(id, true);
		return ResponseEntity.ok(exam);
	}

	@PostMapping("/{id}/submit")
	@Operation(summary = "Nộp bài thi HSK 3.0", description = "Chấm điểm tự động 40 câu hỏi, tính điểm phần Nghe/Đọc và trả về bảng điểm chứng chỉ")
	public ResponseEntity<Hsk30ExamResultResponse> submitExam(
			@PathVariable Long id,
			@Valid @RequestBody Hsk30SubmitExamRequest request,
			Principal principal
	) {
		UserEntity student = requireUser(principal);
		Hsk30ExamResultResponse result = hsk30ExamService.submitExam(student.getId(), id, request);
		return ResponseEntity.ok(result);
	}

	@PostMapping("/seed-sample")
	@Operation(summary = "Tạo đề thi mẫu HSK 1 chuẩn HSK 3.0", description = "Tạo nhanh 1 đề thi HSK 1 gồm 40 câu hỏi chia đều 8 phần với tài nguyên hình ảnh/âm thanh đầy đủ")
	public ResponseEntity<Hsk30ExamDetailResponse> seedSampleExam(
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		Hsk30ExamDetailResponse exam = hsk30ExamService.seedSampleHsk1Exam(user.getId());
		return ResponseEntity.ok(exam);
	}
}
