package com.hsk.aiassistant.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

/**
 * Phản hồi câu trả lời từ trợ lý AI (HTT-10-CN-004).
 */
public record AskLearningAssistantResponse(
        @Schema(description = "Câu trả lời bằng tiếng Việt của trợ lý AI")
        String answer,

        @Schema(description = "Số lượt hỏi còn lại trong ngày của học sinh", example = "19")
        int remainingQuestions,

        @Schema(description = "Thời điểm trả lời")
        Instant answeredAt
) {
}
