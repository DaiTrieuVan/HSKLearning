package com.hsk.aiassistant.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Payload yêu cầu gửi câu hỏi đến trợ lý AI (HTT-10-CN-004).
 */
public record AskLearningAssistantRequest(
        @Schema(description = "Câu hỏi về ngữ pháp hoặc từ vựng tiếng Trung", example = "Khi nào dùng 了?")
        @NotBlank(message = "Câu hỏi không được để trống")
        @Size(max = 1000, message = "Câu hỏi không được vượt quá 1000 ký tự")
        String question
) {
}
