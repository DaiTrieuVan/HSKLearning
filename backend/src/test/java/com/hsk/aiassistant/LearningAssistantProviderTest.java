package com.hsk.aiassistant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.hsk.aiassistant.adapter.ConfiguredLearningAssistantProvider;
import com.hsk.aiassistant.port.AssistantAnswerResult;
import com.hsk.aiassistant.service.AiLearningAssistantService;
import com.hsk.common.api.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Unit test cho ConfiguredLearningAssistantProvider và Prompt/Scope Mapping (IMP-02, IMP-05).
 */
public class LearningAssistantProviderTest {

    private ConfiguredLearningAssistantProvider provider;

    @BeforeEach
    void setUp() {
        provider = new ConfiguredLearningAssistantProvider(
                "fake",
                "",
                "https://api.openai.com/v1",
                "gpt-4o-mini",
                20000
        );
    }

    @Test
    @DisplayName("Provider giả lập trả lời câu hỏi ngữ pháp tiếng Trung trong phạm vi")
    void testFakeProviderChineseQuestion() {
        AssistantAnswerResult result = provider.answer(AiLearningAssistantService.SYSTEM_PROMPT, "Khi nào dùng 了?");
        assertTrue(result.inScope());
        assertTrue(result.answer().contains("Trợ từ '了'"));
    }

    @Test
    @DisplayName("Provider giả lập nhận diện và từ chối câu hỏi ngoài lề (công thức nấu ăn)")
    void testFakeProviderOutOfScope() {
        AssistantAnswerResult result = provider.answer(AiLearningAssistantService.SYSTEM_PROMPT, "Chỉ tôi cách nấu ăn sườn xào");
        assertFalse(result.inScope());
        assertTrue(result.answer().contains("chuyên hỗ trợ học tiếng Trung"));
    }

    @Test
    @DisplayName("Provider giả lập mô phỏng lỗi khi gặp cờ SIMULATE_ERROR")
    void testFakeProviderSimulatedError() {
        ApiException ex = assertThrows(ApiException.class, () ->
                provider.answer(AiLearningAssistantService.SYSTEM_PROMPT, "SIMULATE_ERROR")
        );
        assertEquals("AI_PROVIDER_UNAVAILABLE", ex.code().name());
    }

    @Test
    @DisplayName("Provider chế độ openai nhưng thiếu API key sẽ báo lỗi cấu hình khi gọi")
    void testOpenAiMissingApiKey() {
        ConfiguredLearningAssistantProvider openAiProvider = new ConfiguredLearningAssistantProvider(
                "openai",
                "",
                "https://api.openai.com/v1",
                "gpt-4o-mini",
                20000
        );
        ApiException ex = assertThrows(ApiException.class, () ->
                openAiProvider.answer(AiLearningAssistantService.SYSTEM_PROMPT, "Khi nào dùng 了?")
        );
        assertEquals("AI_PROVIDER_UNAVAILABLE", ex.code().name());
    }
}
