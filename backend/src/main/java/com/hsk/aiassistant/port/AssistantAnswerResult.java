package com.hsk.aiassistant.port;

/**
 * Kết quả trả về từ nhà cung cấp dịch vụ trợ lý AI (HTT-10-CN-004).
 *
 * @param inScope True nếu câu hỏi thuộc phạm vi học tiếng Trung; False nếu ngoài chủ đề.
 * @param answer Nội dung phản hồi bằng tiếng Việt từ trợ lý AI.
 */
public record AssistantAnswerResult(boolean inScope, String answer) {
}
