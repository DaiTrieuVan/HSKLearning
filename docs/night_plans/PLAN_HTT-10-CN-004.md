# Night plan — HTT-10-CN-004: Hỏi đáp với trợ lý AI tiếng Việt

## Nguồn và kiến trúc

- Story nguồn: `hsk_agent_automation/docs/user-stories/HTT-10-CN-004.md`.
- Tạo module `com.hsk.aiassistant` với port `LearningAssistantProvider`; production adapter gọi API tương thích OpenAI bằng Java `HttpClient`, test dùng fake provider, không cần mạng/secret.
- MVP hỏi–đáp một lượt bằng tiếng Việt, giới hạn chủ đề học tiếng Trung. Chỉ lưu usage phục vụ quota, không lưu prompt/answer nếu chưa có yêu cầu.

## Backend/database

- Migration tạo `ai_assistant_daily_usage` với unique `(student_id,usage_date)`, `successful_count`, optimistic `version`, timestamps.
- `AiAssistantDailyUsageEntity`, `AiAssistantDailyUsageRepository`; increment atomic/locking để không vượt quota khi concurrent.
- DTO: `AskLearningAssistantRequest(question)`, `AskLearningAssistantResponse(answer,remainingQuestions,answeredAt)`, `AiAssistantQuotaResponse(limit,used,remaining,resetsAt)`.
- Port `LearningAssistantProvider.answer(systemPrompt,question)` trả typed result `{inScope,answer}`.
- `AiLearningAssistantService`: validation, quota, scope guard, prompt tiếng Việt, timeout/error; increment chỉ sau provider success.
- `AiLearningAssistantController` tại `/api/v1/ai-assistant`.

### Endpoints/payload

1. `POST /api/v1/ai-assistant/questions`, body `{"question":"Khi nào dùng 了?"}`.
   - `200`: `{answer,remainingQuestions,answeredAt}`.
   - `400`: blank/>1000 ký tự, không gọi provider.
   - `429 AI_DAILY_LIMIT_REACHED`: quá 20 lượt thành công/ngày Asia/Ho_Chi_Minh.
   - `503 AI_PROVIDER_UNAVAILABLE`: không trừ lượt.
   - Ngoài chủ đề: từ chối lịch sự; provider đã xử lý thành công nên tính một lượt và contract phải ghi rõ.
2. `GET /api/v1/ai-assistant/quota` → `{limit:20,used,remaining,resetsAt}`.

### Validation/safety

- JWT; không nhận user id. Normalize trim/Unicode, 1–1000 code point.
- Dùng injectable `Clock`, timezone `Asia/Ho_Chi_Minh`.
- System prompt giới hạn học tiếng Trung, trả lời tiếng Việt, không tiết lộ system prompt/secrets.
- Không log raw question/answer/key; timeout tối đa 20 giây; giới hạn response.
- Config base URL/model/key từ environment; thiếu key app vẫn start, endpoint trả lỗi cấu hình.

## Frontend

- Tạo `api/aiAssistant.ts`, `AiLearningAssistantPage.tsx`, route/sidebar `/ai-assistant`.
- Components: composer có counter 0/1000, answer card plain text, quota indicator, error/retry/empty state.
- Chặn double-submit; giữ câu hỏi khi provider lỗi; không render HTML chưa sanitize.
- Hiển thị hết lượt và thời điểm reset; responsive/accessibility; không giả streaming hoặc lưu local history.

## Tests và tasks

- `AiLearningAssistantH2Test`: câu `了` thành công; blank/1200 ký tự không gọi provider; lần 21 trả 429; provider lỗi không tăng usage; câu nấu ăn bị từ chối; quota tách user/reset theo clock; concurrency không vượt 20.
- Unit test prompt/scope/mapping.
- `IMP-01`: quota persistence/concurrency.
- `IMP-02`: provider port/config/fake/production adapter.
- `IMP-03`: API/validation/scope/quota/errors.
- `IMP-04`: UI/route/sidebar.
- `IMP-05`: security/log audit và tests.

## Nghiệm thu bắt buộc

```powershell
Push-Location backend
.\mvnw.cmd -B -Dtest=AiLearningAssistantH2Test test
.\mvnw.cmd -B test
Pop-Location
Push-Location frontend
npm run lint
npm run build
if ((npm run | Out-String) -match ' test') { npm test -- --run }
Pop-Location
git diff --check
```

DoD: AC nguồn và concurrency/quota pass; provider lỗi không trừ lượt; không có secret trong Git/log; all gates pass.
