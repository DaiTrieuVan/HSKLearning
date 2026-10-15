package com.hsk.question.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
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
