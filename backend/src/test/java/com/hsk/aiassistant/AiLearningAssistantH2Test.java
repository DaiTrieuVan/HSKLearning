package com.hsk.aiassistant;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.aiassistant.config.AiAssistantConfig;
import com.hsk.aiassistant.domain.AiAssistantDailyUsageEntity;
import com.hsk.aiassistant.repository.AiAssistantDailyUsageRepository;
import com.hsk.aiassistant.service.AiLearningAssistantService;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Kiểm thử tích hợp toàn diện cho User Story HTT-10-CN-004: Hỏi đáp với trợ lý AI tiếng Việt.
 *
 * <p>Bao phủ các Acceptance Criteria:
 * - TC-01: Luồng thành công (Hỏi câu 'Khi nào dùng 了?', nhận câu trả lời tiếng Việt, remainingQuestions giảm).
 * - TC-02: Dữ liệu không hợp lệ (Để trống hoặc dài > 1000 ký tự -> 400 Bad Request, không gọi AI, không trừ lượt).
 * - TC-03: Ngoại lệ vượt quá số lượt hỏi trong ngày (Hạn mức 20 lượt/ngày, lần thứ 21 trả 429 AI_DAILY_LIMIT_REACHED).
 * - TC-04: Dịch vụ AI bị lỗi (503 AI_PROVIDER_UNAVAILABLE, không trừ lượt hỏi).
 * - TC-05: Câu hỏi ngoài phạm vi (Từ chối lịch sự, gợi ý hỏi về tiếng Trung, tính 1 lượt).
 * - Kiểm thử kiểm soát hạn mức riêng theo người dùng và tự động làm mới sang ngày hôm sau theo Clock.
 * - Kiểm thử tương tranh (concurrency): 25 luồng đồng thời gọi hỏi đáp, không bao giờ vượt quá 20 lượt.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
public class AiLearningAssistantH2Test {

    private static final String LOGIN_URL = "/api/v1/auth/login";
    private static final String QUESTIONS_URL = "/api/v1/ai-assistant/questions";
    private static final String QUOTA_URL = "/api/v1/ai-assistant/quota";

    private static final String STUDENT1_EMAIL = "student_ai1@test.com";
    private static final String STUDENT2_EMAIL = "student_ai2@test.com";
    private static final String PASSWORD = "Password123";

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private AiAssistantDailyUsageRepository dailyUsageRepository;

    @Autowired
    private AiLearningAssistantService aiLearningAssistantService;

    private String student1Token;
    private String student2Token;
    private Long student1Id;
    private Long student2Id;

    @BeforeEach
    void setUp() throws Exception {
        tearDown();

        // Đăng ký Student 1
        registrationService.registerStudent(
                new RegisterStudentRequest("Học sinh AI 1", STUDENT1_EMAIL, PASSWORD, PASSWORD)
        );
        UserEntity student1 = userRepository.findByEmailIgnoreCase(STUDENT1_EMAIL).orElseThrow();
        student1Id = student1.getId();
        student1Token = loginAndGetToken(STUDENT1_EMAIL, PASSWORD);

        // Đăng ký Student 2
        registrationService.registerStudent(
                new RegisterStudentRequest("Học sinh AI 2", STUDENT2_EMAIL, PASSWORD, PASSWORD)
        );
        UserEntity student2 = userRepository.findByEmailIgnoreCase(STUDENT2_EMAIL).orElseThrow();
        student2Id = student2.getId();
        student2Token = loginAndGetToken(STUDENT2_EMAIL, PASSWORD);

        // Đặt lại Clock về mặc định theo giờ Việt Nam
        aiLearningAssistantService.setClock(Clock.system(AiAssistantConfig.ZONE_VN));
    }

    @AfterEach
    void tearDown() {
        dailyUsageRepository.deleteAll();
        userRoleRepository.deleteAll();
        userRepository.deleteAll();
    }

    private String loginAndGetToken(String email, String password) throws Exception {
        String json = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
        MvcResult result = mockMvc.perform(post(LOGIN_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        return root.get("token").asText();
    }

    @Test
    @DisplayName("HTT-10-CN-004-TC-01: Luồng thành công - Hỏi 'Khi nào dùng 了?' nhận câu trả lời tiếng Việt")
    void testAskQuestionSuccess_Ac01() throws Exception {
        String requestJson = "{\"question\":\"Khi nào dùng 了?\"}";

        mockMvc.perform(post(QUESTIONS_URL)
                        .header("Authorization", "Bearer " + student1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer", containsString("Trợ từ '了'")))
                .andExpect(jsonPath("$.remainingQuestions", is(19)))
                .andExpect(jsonPath("$.answeredAt", notNullValue()));

        // Kiểm tra quota endpoint
        mockMvc.perform(get(QUOTA_URL)
                        .header("Authorization", "Bearer " + student1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.limit", is(20)))
                .andExpect(jsonPath("$.used", is(1)))
                .andExpect(jsonPath("$.remaining", is(19)))
                .andExpect(jsonPath("$.resetsAt", notNullValue()));
    }

    @Test
    @DisplayName("HTT-10-CN-004-TC-02: Dữ liệu không hợp lệ - Để trống hoặc quá 1000 ký tự")
    void testAskQuestionValidation_Ac02() throws Exception {
        // 1. Câu hỏi rỗng
        mockMvc.perform(post(QUESTIONS_URL)
                        .header("Authorization", "Bearer " + student1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"question\":\"   \"}"))
                .andExpect(status().isBadRequest());

        // 2. Câu hỏi dài 1200 ký tự
        String longQuestion = "A".repeat(1200);
        String requestJson = objectMapper.writeValueAsString(Collections.singletonMap("question", longQuestion));

        mockMvc.perform(post(QUESTIONS_URL)
                        .header("Authorization", "Bearer " + student1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isBadRequest());

        // Quota không bị trừ
        mockMvc.perform(get(QUOTA_URL)
                        .header("Authorization", "Bearer " + student1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.used", is(0)))
                .andExpect(jsonPath("$.remaining", is(20)));
    }

    @Test
    @DisplayName("HTT-10-CN-004-TC-03: Ngoại lệ - Dùng hết 20 lượt hỏi trong ngày thì lần 21 trả về 429")
    void testAskQuestionDailyQuotaLimit_Ac03() throws Exception {
        // Thực hiện 20 lượt hỏi hợp lệ
        for (int i = 1; i <= 20; i++) {
            String q = "{\"question\":\"Câu hỏi số " + i + " về từ vựng tiếng Trung\"}";
            mockMvc.perform(post(QUESTIONS_URL)
                            .header("Authorization", "Bearer " + student1Token)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(q))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.remainingQuestions", is(20 - i)));
        }

        // Lần thứ 21: Bị chặn với mã 429 AI_DAILY_LIMIT_REACHED
        mockMvc.perform(post(QUESTIONS_URL)
                        .header("Authorization", "Bearer " + student1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"question\":\"Câu hỏi thứ 21\"}"))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.code", is("AI_DAILY_LIMIT_REACHED")))
                .andExpect(jsonPath("$.message", containsString("Bạn đã dùng hết 20 lượt hỏi trong ngày")));

        // Quota hiển thị remaining = 0
        mockMvc.perform(get(QUOTA_URL)
                        .header("Authorization", "Bearer " + student1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.used", is(20)))
                .andExpect(jsonPath("$.remaining", is(0)));
    }

    @Test
    @DisplayName("HTT-10-CN-004-TC-04: Dịch vụ AI bị lỗi - Trả 503 và không trừ lượt hỏi")
    void testProviderErrorDoesNotConsumeQuota_Ac04() throws Exception {
        String errorPayload = "{\"question\":\"Giải thích ngữ pháp SIMULATE_ERROR\"}";

        mockMvc.perform(post(QUESTIONS_URL)
                        .header("Authorization", "Bearer " + student2Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(errorPayload))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.code", is("AI_PROVIDER_UNAVAILABLE")));

        // Kiểm tra lượt hỏi của student2 KHÔNG bị trừ
        mockMvc.perform(get(QUOTA_URL)
                        .header("Authorization", "Bearer " + student2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.used", is(0)))
                .andExpect(jsonPath("$.remaining", is(20)));
    }

    @Test
    @DisplayName("HTT-10-CN-004-TC-05: Câu hỏi ngoài lề - Từ chối lịch sự, gợi ý hỏi về tiếng Trung và tính 1 lượt")
    void testOutOfScopeQuestionRefusal_Ac05() throws Exception {
        String outOfScopeJson = "{\"question\":\"Cho tôi công thức nấu ăn món sườn xào chua ngọt\"}";

        mockMvc.perform(post(QUESTIONS_URL)
                        .header("Authorization", "Bearer " + student1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(outOfScopeJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer", containsString("chuyên hỗ trợ học tiếng Trung")))
                .andExpect(jsonPath("$.remainingQuestions", is(19)));

        // Quota vẫn tính 1 lượt theo quy định
        mockMvc.perform(get(QUOTA_URL)
                        .header("Authorization", "Bearer " + student1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.used", is(1)))
                .andExpect(jsonPath("$.remaining", is(19)));
    }

    @Test
    @DisplayName("Kiểm tra tách biệt Quota giữa các User và Reset khi sang ngày mới theo Clock")
    void testQuotaSeparationAndClockReset() throws Exception {
        // Student 1 hỏi 1 câu
        mockMvc.perform(post(QUESTIONS_URL)
                        .header("Authorization", "Bearer " + student1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"question\":\"Hỏi câu 1\"}"))
                .andExpect(status().isOk());

        // Student 2 vẫn còn nguyên 20 lượt
        mockMvc.perform(get(QUOTA_URL)
                        .header("Authorization", "Bearer " + student2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.used", is(0)))
                .andExpect(jsonPath("$.remaining", is(20)));

        // Tua đồng hồ sang ngày hôm sau (+24 giờ)
        Clock originalClock = Clock.system(AiAssistantConfig.ZONE_VN);
        Clock nextDayClock = Clock.offset(originalClock, Duration.ofDays(1));
        aiLearningAssistantService.setClock(nextDayClock);

        // Student 1 kiểm tra quota ngày mới -> đã được reset về 20 lượt
        mockMvc.perform(get(QUOTA_URL)
                        .header("Authorization", "Bearer " + student1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.used", is(0)))
                .andExpect(jsonPath("$.remaining", is(20)));
    }

    @Test
    @DisplayName("Kiểm tra tương tranh: 25 requests đồng thời không vượt quá hạn mức 20")
    void testConcurrencyDoesNotExceed20() throws Exception {
        // Đăng ký user 3 riêng biệt cho test tương tranh
        String student3Email = "student_ai_concurrency@test.com";
        registrationService.registerStudent(
                new RegisterStudentRequest("Học sinh Tương tranh", student3Email, PASSWORD, PASSWORD)
        );
        UserEntity student3 = userRepository.findByEmailIgnoreCase(student3Email).orElseThrow();
        String student3Token = loginAndGetToken(student3Email, PASSWORD);

        int totalRequests = 25;
        ExecutorService executor = Executors.newFixedThreadPool(10);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch endLatch = new CountDownLatch(totalRequests);

        AtomicInteger successCount = new AtomicInteger(0);
        AtomicInteger limitReachedCount = new AtomicInteger(0);
        AtomicInteger otherErrors = new AtomicInteger(0);

        List<Future<?>> futures = new ArrayList<>();
        for (int i = 0; i < totalRequests; i++) {
            final int index = i;
            futures.add(executor.submit(() -> {
                try {
                    startLatch.await();
                    MvcResult res = mockMvc.perform(post(QUESTIONS_URL)
                                    .header("Authorization", "Bearer " + student3Token)
                                    .contentType(MediaType.APPLICATION_JSON)
                                    .content("{\"question\":\"Câu hỏi tương tranh số " + index + "\"}"))
                            .andReturn();
                    int statusCode = res.getResponse().getStatus();
                    if (statusCode == 200) {
                        successCount.incrementAndGet();
                    } else if (statusCode == 429) {
                        limitReachedCount.incrementAndGet();
                    } else {
                        otherErrors.incrementAndGet();
                    }
                } catch (Exception e) {
                    otherErrors.incrementAndGet();
                } finally {
                    endLatch.countDown();
                }
            }));
        }

        // Bắt đầu đồng loạt
        startLatch.countDown();
        endLatch.await();
        executor.shutdown();

        assertEquals(0, otherErrors.get(), "Không được có lỗi không mong muốn");
        assertEquals(20, successCount.get(), "Chính xác 20 yêu cầu thành công");
        assertEquals(5, limitReachedCount.get(), "Chính xác 5 yêu cầu bị từ chối 429");

        // Kiểm tra trực tiếp số liệu trong Database
        LocalDate today = aiLearningAssistantService.getTodayDate();
        AiAssistantDailyUsageEntity dbUsage = dailyUsageRepository
                .findByStudentIdAndUsageDate(student3.getId(), today)
                .orElseThrow();
        assertEquals(20, dbUsage.getSuccessfulCount(), "Database phải ghi nhận đúng 20 lượt");
    }

    @Test
    @DisplayName("Kiểm tra bảo mật: Không có JWT thì từ chối 401")
    void testUnauthorizedWhenMissingJwt() throws Exception {
        mockMvc.perform(post(QUESTIONS_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"question\":\"Khi nào dùng 了?\"}"))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get(QUOTA_URL))
                .andExpect(status().isUnauthorized());
    }
}
