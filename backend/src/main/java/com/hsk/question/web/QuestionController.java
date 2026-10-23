package com.hsk.question.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.question.dto.BatchCreateQuestionsRequest;
import com.hsk.question.dto.CreateFillBlankQuestionRequest;
import com.hsk.question.dto.CreateMatchingQuestionRequest;
import com.hsk.question.dto.CreateOrderingQuestionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.ImportQuestionsResult;
import com.hsk.question.dto.QuestionResponse;
import com.hsk.question.dto.QuickGeneratePreviewRequest;
import com.hsk.question.dto.UpdateQuestionRequest;
import com.hsk.question.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller phục vụ ngân hàng câu hỏi (HTT-05-CN-001 & HTT-05-CN-004).
 */
@RestController
@RequestMapping("/api/questions")
@Tag(name = "Ngân hàng câu hỏi", description = "HTT-05 — Soạn câu hỏi trắc nghiệm và quản lý ngân hàng câu hỏi")
@SecurityRequirement(name = "bearerAuth")
public class QuestionController {

	private final QuestionService questionService;
	private final UserRepository userRepository;

	public QuestionController(QuestionService questionService, UserRepository userRepository) {
		this.questionService = questionService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@PostMapping(value = {"/multiple-choice", ""})
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-001 — Tạo câu hỏi trắc nghiệm",
			description = "Giáo viên tạo câu hỏi trắc nghiệm vào ngân hàng câu hỏi cá nhân. Phải có ít nhất 2 lựa chọn và đúng 1 đáp án đúng (QTN-08)."
	)
	public ResponseEntity<QuestionResponse> createMultipleChoiceQuestion(
			@RequestBody CreateQuestionRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		QuestionResponse response = questionService.createMultipleChoiceQuestion(user.getId(), request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PostMapping("/fill-blank")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-002 — Tạo câu hỏi điền từ vào chỗ trống",
			description = "Giáo viên tạo câu hỏi điền từ vào chỗ trống trong ngân hàng cá nhân (QTN-19). Bắt buộc có ít nhất 1 chỗ trống (___), số chỗ trống khớp số đáp án và đáp án đúng không được rỗng."
	)
	public ResponseEntity<QuestionResponse> createFillBlankQuestion(
			@RequestBody CreateFillBlankQuestionRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		QuestionResponse response = questionService.createFillBlankQuestion(user.getId(), request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PostMapping("/matching")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-003 — Tạo câu hỏi nối từ",
			description = "Giáo viên tạo câu hỏi nối từ với nghĩa trong ngân hàng cá nhân (QTN-19). Bắt buộc có ít nhất 2 cặp, các vế không được rỗng và vế trái không được trùng nhau."
	)
	public ResponseEntity<QuestionResponse> createMatchingQuestion(
			@RequestBody CreateMatchingQuestionRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		QuestionResponse response = questionService.createMatchingQuestion(user.getId(), request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PostMapping("/ordering")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-003 — Tạo câu hỏi sắp xếp câu",
			description = "Giáo viên tạo câu hỏi sắp xếp các từ/cụm từ thành câu hoàn chỉnh trong ngân hàng cá nhân (QTN-19). Bắt buộc có ít nhất 2 thành phần và các thành phần không được rỗng."
	)
	public ResponseEntity<QuestionResponse> createOrderingQuestion(
			@RequestBody CreateOrderingQuestionRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		QuestionResponse response = questionService.createOrderingQuestion(user.getId(), request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PostMapping("/quick-generate/preview")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-004 — Xem trước danh sách câu hỏi sinh tự động từ bộ từ vựng",
			description = "Sinh câu hỏi trắc nghiệm 4 lựa chọn từ các từ trong bộ từ vựng của giáo viên (QTN-08, QTN-19)."
	)
	public ResponseEntity<List<CreateQuestionRequest>> quickGeneratePreview(
			@RequestBody QuickGeneratePreviewRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		List<CreateQuestionRequest> drafts = questionService.quickGeneratePreview(user.getId(), request);
		return ResponseEntity.ok(drafts);
	}

	@PostMapping("/batch")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-004 — Lưu hàng loạt câu hỏi vào ngân hàng câu hỏi",
			description = "Lưu các câu hỏi đã chọn lọc từ danh sách tạo nhanh vào ngân hàng câu hỏi của giáo viên."
	)
	public ResponseEntity<List<QuestionResponse>> batchCreateQuestions(
			@RequestBody BatchCreateQuestionsRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		List<QuestionResponse> saved = questionService.batchCreateQuestions(user.getId(), request);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	@GetMapping("/my")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-001 — Lấy danh sách câu hỏi trong ngân hàng của tôi",
			description = "Chỉ trả về các câu hỏi do chính giáo viên đăng nhập tạo ra (QTN-19)."
	)
	public ResponseEntity<List<QuestionResponse>> getMyQuestions(Principal principal) {
		UserEntity user = requireUser(principal);
		List<QuestionResponse> response = questionService.getMyQuestions(user.getId());
		return ResponseEntity.ok(response);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-005 / TC-06 — Xem chi tiết câu hỏi",
			description = "Xem chi tiết một câu hỏi trong ngân hàng của giáo viên (QTN-19)."
	)
	public ResponseEntity<QuestionResponse> getQuestionDetail(
			@PathVariable("id") Long id,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		QuestionResponse response = questionService.getQuestionDetail(user.getId(), id);
		return ResponseEntity.ok(response);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-005 / TC-02, TC-03 — Cập nhật câu hỏi trong ngân hàng",
			description = "Sửa nội dung, giải thích, các đáp án trắc nghiệm hoặc payload. Tuân thủ QTN-10 và QTN-19."
	)
	public ResponseEntity<QuestionResponse> updateQuestion(
			@PathVariable("id") Long id,
			@Valid @RequestBody UpdateQuestionRequest request,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		QuestionResponse response = questionService.updateQuestion(user.getId(), id, request);
		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "HTT-05-CN-005 / TC-04, TC-05 — Xóa hoặc ẩn câu hỏi",
			description = "Xóa câu hỏi khỏi ngân hàng. Tuân thủ QTN-14: câu hỏi đã dùng trong bài tập thì ẩn, chưa dùng thì xóa cứng."
	)
	public ResponseEntity<Void> deleteOrHideQuestion(
			@PathVariable("id") Long id,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		questionService.deleteOrHideQuestion(user.getId(), id);
		return ResponseEntity.noContent().build();
	}

	@PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(
			summary = "Nhập hàng loạt câu hỏi từ file Excel/CSV",
			description = "Hỗ trợ 4 loại câu hỏi: MCQ, FILL, MATCH, ORDER. Trả về thống kê thành công và lỗi chi tiết."
	)
	public ResponseEntity<ImportQuestionsResult> importQuestions(
			@RequestParam("file") MultipartFile file,
			Principal principal
	) {
		UserEntity user = requireUser(principal);
		ImportQuestionsResult result = questionService.importQuestionsFromFile(user.getId(), file);
		return ResponseEntity.status(HttpStatus.CREATED).body(result);
	}

	@GetMapping("/template/excel")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "Tải file mẫu Excel (.xlsx) nhập câu hỏi")
	public ResponseEntity<byte[]> downloadExcelTemplate() {
		byte[] data = questionService.generateQuestionExcelTemplate();
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"HSK_Question_Import_Template.xlsx\"")
				.contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
				.body(data);
	}

	@GetMapping("/template/csv")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "Tải file mẫu CSV (.csv) nhập câu hỏi")
	public ResponseEntity<byte[]> downloadCsvTemplate() {
		byte[] data = questionService.generateQuestionCsvTemplate();
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"HSK_Question_Import_Template.csv\"")
				.contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
				.body(data);
	}
}
