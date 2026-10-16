package com.hsk.question.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.question.dto.CreateFillBlankQuestionRequest;
import com.hsk.question.dto.CreateMatchingQuestionRequest;
import com.hsk.question.dto.CreateOrderingQuestionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.QuestionResponse;
import com.hsk.question.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller phục vụ ngân hàng câu hỏi (HTT-05-CN-001).
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
}
