package com.hsk.aiassistant.adapter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.aiassistant.port.AssistantAnswerResult;
import com.hsk.aiassistant.port.LearningAssistantProvider;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.time.Duration;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Adapter cấu hình dịch vụ trợ lý AI học tiếng Trung (HTT-10-CN-004).
 *
 * <p>Quy tắc triển khai:
 * - Mặc định provider = "fake" trong môi trường test/local: Hoạt động tất định (deterministic), không cần mạng hay secret.
 * - Khi provider = "openai" hoặc dịch vụ tương thích: Gọi API Chat Completions qua Java {@link HttpClient} với timeout tối đa 20 giây.
 * - Tuyệt đối không log nội dung câu hỏi, câu trả lời hoặc khóa bí mật (API key).
 * - Giới hạn kích thước phản hồi tối đa 5000 ký tự.
 * - Thiếu API key khi chạy chế độ ngoài vẫn cho phép ứng dụng khởi động, chỉ báo lỗi khi endpoint được gọi.
 */
@Component
public class ConfiguredLearningAssistantProvider implements LearningAssistantProvider {

    private static final Logger log = LoggerFactory.getLogger(ConfiguredLearningAssistantProvider.class);

    private static final String POLITE_REFUSAL_MESSAGE =
            "Xin lỗi bạn, tôi là trợ lý AI chuyên hỗ trợ học tiếng Trung. Tôi chỉ có thể giải đáp các câu hỏi "
                    + "về từ vựng, ngữ pháp, phát âm và kiến thức học tiếng Trung. Bạn vui lòng đặt câu hỏi liên quan "
                    + "đến việc học tiếng Trung để tôi có thể hỗ trợ bạn tốt nhất nhé!";

    private static final int MAX_RESPONSE_LENGTH = 5000;

    private final String providerMode;
    private final String apiKey;
    private final String baseUrl;
    private final String model;
    private final int timeoutMs;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public ConfiguredLearningAssistantProvider(
            @Value("${app.ai-assistant.provider:fake}") String providerMode,
            @Value("${app.ai-assistant.api-key:}") String apiKey,
            @Value("${app.ai-assistant.base-url:https://api.openai.com/v1}") String baseUrl,
            @Value("${app.ai-assistant.model:gpt-4o-mini}") String model,
            @Value("${app.ai-assistant.timeout-ms:20000}") int timeoutMs
    ) {
        this.providerMode = (providerMode != null && !providerMode.isBlank()) ? providerMode.trim().toLowerCase(Locale.ROOT) : "fake";
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.baseUrl = (baseUrl != null && !baseUrl.isBlank()) ? baseUrl.trim().replaceAll("/+$", "") : "https://api.openai.com/v1";
        this.model = (model != null && !model.isBlank()) ? model.trim() : "gpt-4o-mini";
        this.timeoutMs = Math.min(Math.max(timeoutMs, 1000), 20000); // Tối đa 20s
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofMillis(this.timeoutMs))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public AssistantAnswerResult answer(String systemPrompt, String question) {
        if ("fake".equals(providerMode) || "mock".equals(providerMode)) {
            return answerFake(question);
        }

        return answerOpenAi(systemPrompt, question);
    }

    /**
     * Giả lập phản hồi trợ lý AI tất định phục vụ kiểm thử và môi trường phát triển (IMP-02).
     */
    private AssistantAnswerResult answerFake(String question) {
        if (question == null) {
            throw new ApiException(ApiErrorCode.INVALID_AI_QUESTION);
        }

        // Kịch bản mô phỏng lỗi dịch vụ bên ngoài (HTT-10-CN-004-TC-04)
        if (question.contains("SIMULATE_ERROR") || question.contains("SIMULATE_TIMEOUT")) {
            log.warn("Mô phỏng lỗi hoặc quá thời gian từ dịch vụ AI bên ngoài");
            throw new ApiException(ApiErrorCode.AI_PROVIDER_UNAVAILABLE, "Dịch vụ trợ lý AI tạm thời không khả dụng, vui lòng thử lại sau");
        }

        // Kiểm tra phạm vi chủ đề (HTT-10-CN-004-TC-05)
        if (isOutOfScopeQuestion(question)) {
            return new AssistantAnswerResult(false, POLITE_REFUSAL_MESSAGE);
        }

        // Kịch bản thành công chuẩn về trợ từ 了 (HTT-10-CN-004-TC-01)
        if (question.contains("了") || question.toLowerCase(Locale.ROOT).contains("khi nào dùng 了")) {
            String answer = "Trợ từ '了' (le) trong tiếng Trung thường được dùng trong hai trường hợp chính:\n\n"
                    + "1. Biểu thị động tác đã hoàn thành hoặc thực hiện xong (đặt sau động từ):\n"
                    + "   - Ví dụ: 我吃了早饭。(Wǒ chī le zǎofàn - Tôi đã ăn bữa sáng rồi).\n"
                    + "   - Phủ định: Dùng 没 / 没有 (không dùng 不) và bỏ '了': 我没吃早饭。(Tôi chưa ăn sáng).\n\n"
                    + "2. Biểu thị sự xuất hiện tình huống mới hoặc thay đổi trạng thái (đặt ở cuối câu):\n"
                    + "   - Ví dụ: 下雨了。(Xià yǔ le - Mưa rồi / Trời bắt đầu mưa rồi).\n"
                    + "   - Ví dụ: 我有钱了。(Wǒ yǒu qián le - Tôi có tiền rồi - trước đó không có).\n\n"
                    + "3. Cấu trúc ngữ pháp đặc biệt: 太...了 (quá... rồi):\n"
                    + "   - Ví dụ: 太好了！(Tài hǎo le - Tốt quá rồi!).\n"
                    + "   - Cấu trúc 快要...了 / 要...了 (sắp... rồi): 火车要来了。(Tàu hỏa sắp đến rồi).";
            return new AssistantAnswerResult(true, answer);
        }

        // Phản hồi giả lập tổng quát cho các câu hỏi tiếng Trung khác
        String generalAnswer = "Cảm ơn bạn đã đặt câu hỏi về việc học tiếng Trung!\n\n"
                + "Đối với thắc mắc của bạn: Trong tiếng Trung, việc nắm vững cấu trúc ngữ pháp cơ bản (Chủ ngữ + Thời gian + Địa điểm + Động từ + Tân ngữ) "
                + "và ghi nhớ từ vựng theo cụm từ (collocations) là rất quan trọng.\n\n"
                + "Ví dụ minh họa:\n"
                + "- 我明天在学校学习汉语。(Wǒ míngtiān zài xuéxiào xuéxí Hànyǔ - Ngày mai tôi học tiếng Trung ở trường).\n\n"
                + "Nếu bạn cần giải thích chi tiết hơn về một từ vựng hay điểm ngữ pháp cụ thể, hãy cho tôi biết nhé!";
        return new AssistantAnswerResult(true, generalAnswer);
    }

    /**
     * Nhận diện nhanh các câu hỏi ngoài phạm vi học tiếng Trung (nấu ăn, thể thao, tin tức, lập trình,...).
     */
    private boolean isOutOfScopeQuestion(String question) {
        String lower = question.toLowerCase(Locale.ROOT);
        return lower.contains("nấu ăn")
                || lower.contains("công thức")
                || lower.contains("món ăn")
                || lower.contains("làm bánh")
                || lower.contains("bóng đá")
                || lower.contains("thời tiết hôm nay")
                || lower.contains("lập trình java")
                || lower.contains("viết code");
    }

    /**
     * Gọi API tương thích OpenAI Chat Completions.
     */
    private AssistantAnswerResult answerOpenAi(String systemPrompt, String question) {
        if (apiKey.isBlank()) {
            log.warn("Dịch vụ trợ lý AI chưa được cấu hình API Key");
            throw new ApiException(ApiErrorCode.AI_PROVIDER_UNAVAILABLE, "Dịch vụ trợ lý AI chưa được cấu hình khóa truy cập");
        }

        try {
            Map<String, Object> requestPayload = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", question)
                    ),
                    "max_tokens", 1500,
                    "temperature", 0.5
            );

            String requestBody = objectMapper.writeValueAsString(requestPayload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .timeout(Duration.ofMillis(timeoutMs))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                log.warn("Dịch vụ AI trả về mã lỗi HTTP: {}", response.statusCode());
                throw new ApiException(ApiErrorCode.AI_PROVIDER_UNAVAILABLE, "Dịch vụ trợ lý AI tạm thời không khả dụng, vui lòng thử lại sau");
            }

            JsonNode rootNode = objectMapper.readTree(response.body());
            JsonNode choices = rootNode.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                log.warn("Phản hồi từ dịch vụ AI không hợp lệ: choices rỗng");
                throw new ApiException(ApiErrorCode.AI_PROVIDER_UNAVAILABLE, "Dịch vụ trợ lý AI trả về kết quả không hợp lệ");
            }

            String content = choices.get(0).path("message").path("content").asText("");
            if (content.length() > MAX_RESPONSE_LENGTH) {
                content = content.substring(0, MAX_RESPONSE_LENGTH);
            }

            // Kiểm tra nội dung phản hồi có phải từ chối ngoài phạm vi không
            boolean inScope = !isOutOfScopeQuestion(question);

            return new AssistantAnswerResult(inScope, content);
        } catch (HttpTimeoutException e) {
            log.warn("Gọi dịch vụ AI quá thời gian chờ (timeout)");
            throw new ApiException(ApiErrorCode.AI_PROVIDER_UNAVAILABLE, "Dịch vụ trợ lý AI phản hồi quá thời gian cho phép");
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            log.warn("Lỗi kết nối khi gọi dịch vụ AI: {}", e.getClass().getSimpleName());
            throw new ApiException(ApiErrorCode.AI_PROVIDER_UNAVAILABLE, "Không thể kết nối đến dịch vụ trợ lý AI");
        }
    }
}
