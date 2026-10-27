package com.hsk.aiassistant.port;

/**
 * Port giao tiếp với dịch vụ trợ lý AI (HTT-10-CN-004).
 */
public interface LearningAssistantProvider {

    /**
     * Gửi câu hỏi kèm system prompt đến dịch vụ AI và nhận về câu trả lời.
     *
     * @param systemPrompt Chỉ dẫn hệ thống quy định vai trò, ngôn ngữ và phạm vi câu hỏi.
     * @param question Câu hỏi do học sinh nhập vào.
     * @return Kết quả gồm trạng thái thuộc phạm vi (inScope) và câu trả lời.
     */
    AssistantAnswerResult answer(String systemPrompt, String question);
}
