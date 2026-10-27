package com.hsk.aiassistant.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.aiassistant.dto.AiAssistantQuotaResponse;
import com.hsk.aiassistant.dto.AskLearningAssistantRequest;
import com.hsk.aiassistant.dto.AskLearningAssistantResponse;
import com.hsk.aiassistant.service.AiLearningAssistantService;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller cho tính năng Hỏi đáp với trợ lý AI tiếng Việt (HTT-10-CN-004).
 */
@Validated
@RestController
@RequestMapping({"/api/v1/ai-assistant", "/api/ai-assistant"})
@Tag(name = "AI Assistant", description = "Endpoints hỏi đáp với trợ lý AI và quản lý hạn mức ngày (HTT-10-CN-004)")
public class AiLearningAssistantController {

    private final AiLearningAssistantService aiLearningAssistantService;
    private final UserRepository userRepository;

    public AiLearningAssistantController(
            AiLearningAssistantService aiLearningAssistantService,
            UserRepository userRepository
    ) {
        this.aiLearningAssistantService = aiLearningAssistantService;
        this.userRepository = userRepository;
    }

    private UserEntity requireUser(Principal principal) {
        if (principal == null) {
            throw new ApiException(ApiErrorCode.UNAUTHORIZED);
        }
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
    }

    /**
     * Gửi câu hỏi học tập đến trợ lý AI (HTT-10-CN-004-TC-01..TC-05).
     *
     * @param request Nội dung câu hỏi của học sinh (tối đa 1000 ký tự).
     * @param principal Thông tin tài khoản người dùng đã đăng nhập.
     * @return Câu trả lời tiếng Việt, số lượt còn lại và thời điểm trả lời.
     */
    @Operation(summary = "Gửi câu hỏi về từ vựng, ngữ pháp tiếng Trung đến trợ lý AI")
    @PostMapping("/questions")
    public ResponseEntity<AskLearningAssistantResponse> askQuestion(
            @Valid @RequestBody AskLearningAssistantRequest request,
            Principal principal
    ) {
        UserEntity user = requireUser(principal);
        AskLearningAssistantResponse response = aiLearningAssistantService.askQuestion(user.getId(), request);
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy thông tin hạn mức số lượt hỏi trợ lý AI trong ngày.
     *
     * @param principal Thông tin tài khoản người dùng đã đăng nhập.
     * @return Hạn mức tối đa, số lượt đã dùng, số lượt còn lại và thời điểm làm mới.
     */
    @Operation(summary = "Xem thông tin hạn mức số lượt hỏi trợ lý AI trong ngày")
    @GetMapping("/quota")
    public ResponseEntity<AiAssistantQuotaResponse> getQuota(Principal principal) {
        UserEntity user = requireUser(principal);
        AiAssistantQuotaResponse quota = aiLearningAssistantService.getQuota(user.getId());
        return ResponseEntity.ok(quota);
    }
}
