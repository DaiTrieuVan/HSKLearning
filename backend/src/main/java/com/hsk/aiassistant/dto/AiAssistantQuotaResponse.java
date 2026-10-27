package com.hsk.aiassistant.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

/**
 * Phản hồi thông tin hạn mức lượt hỏi trợ lý AI trong ngày (HTT-10-CN-004).
 */
public record AiAssistantQuotaResponse(
        @Schema(description = "Hạn mức tối đa mỗi ngày", example = "20")
        int limit,

        @Schema(description = "Số lượt đã sử dụng thành công trong ngày", example = "1")
        int used,

        @Schema(description = "Số lượt còn lại trong ngày", example = "19")
        int remaining,

        @Schema(description = "Thời điểm làm mới hạn mức (00:00 ngày tiếp theo theo giờ Việt Nam)")
        Instant resetsAt
) {
}
