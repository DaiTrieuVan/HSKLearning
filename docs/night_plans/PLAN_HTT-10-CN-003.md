# Night plan — HTT-10-CN-003: Chấm phát âm

## Nguồn và kiến trúc

- Story nguồn: `hsk_agent_automation/docs/user-stories/HTT-10-CN-003.md`.
- Tạo module `com.hsk.pronunciation` theo ports/adapters. Nghiệp vụ phụ thuộc `PronunciationAssessmentProvider`; production adapter cấu hình bằng environment, test dùng fake provider, không gọi mạng.
- Không commit key, không log/giữ audio. File/buffer tạm phải giải phóng trong `finally`; DB chỉ lưu điểm và thời gian (TC-05).

## Backend/database

- Migration tạo `pronunciation_attempts(id,student_id,reference_type,reference_id,reference_text,score,accuracy_score,fluency_score,completeness_score,feedback_code,assessed_at)`; tuyệt đối không có blob/audio URL/path.
- `PronunciationAttemptEntity`, `PronunciationAttemptRepository`.
- DTO: multipart `PronunciationAssessmentRequest`; `PronunciationAssessmentResponse`; `PronunciationHistoryItemResponse`.
- Port `PronunciationAssessmentProvider.assess(referenceText,audioBytes,contentType)` và provider-neutral result.
- `ConfiguredSpeechAssessmentProvider`: timeout hữu hạn, cấu hình `app.pronunciation.*`, mapping lỗi upstream.
- `PronunciationAssessmentService`; `PronunciationController` tại `/api/v1/pronunciation`.

### Endpoints/payload

1. `POST /api/v1/pronunciation/assess` multipart gồm `audio`, `referenceText`, optional `referenceType=VOCABULARY|SENTENCE`, `referenceId`.
   - `200`: `{attemptId,overallScore,accuracyScore,fluencyScore,completenessScore,feedback,assessedAt}`.
   - `400 INVALID_AUDIO`: quá ngắn/nhiễu/sai format.
   - `503 PRONUNCIATION_PROVIDER_UNAVAILABLE`: timeout/upstream; không persist.
2. `GET /api/v1/pronunciation/history?limit=20`: chỉ user hiện tại, limit 1–100, không audio.

### Validation/security/privacy

- JWT; không nhận `studentId`. `referenceText` 1–200 code point, có chữ Hán; nếu có referenceId phải đối chiếu dữ liệu chuẩn.
- MIME cho phép: webm/ogg/wav/mpeg; tối đa 10 MB; duration 0,5–60 giây; kiểm tra header/container ở mức khả thi.
- Timeout tối đa 15 giây; không retry request tính phí mù quáng.
- Không log bytes/base64. Thiếu credential thì app vẫn start, endpoint trả lỗi cấu hình.

## Frontend

- Tạo `api/pronunciation.ts`, `PronunciationPracticePage.tsx`, route/sidebar `/pronunciation`.
- Components: target picker, permission guide, recorder, preview, score card, history.
- Dùng `getUserMedia`/`MediaRecorder`; stop tracks khi unmount/reset.
- `NotAllowedError` hiển thị hướng dẫn và không gọi API. Blob <0,5 giây bị client chặn; server vẫn validate.
- Lỗi/timeout có retry, không hiển thị kết quả cũ như kết quả mới.

## Tests và tasks

- `PronunciationAssessmentH2Test`: success `你好`; anonymous; timeout không persist; audio 0,3 giây không gọi provider; history không audio/không lộ user khác.
- Unit test adapter mapping/timeout; frontend mock permission nếu có test runner.
- `IMP-01`: persistence/privacy.
- `IMP-02`: provider port/config/fake/production adapter.
- `IMP-03`: API validation/service/controller/errors.
- `IMP-04`: recorder UI và lifecycle.
- `IMP-05`: tests và env docs không chứa secret.

## Nghiệm thu bắt buộc

```powershell
Push-Location backend
.\mvnw.cmd -B -Dtest=PronunciationAssessmentH2Test test
.\mvnw.cmd -B test
Pop-Location
Push-Location frontend
npm run lint
npm run build
if ((npm run | Out-String) -match ' test') { npm test -- --run }
Pop-Location
git diff --check
```

DoD: năm TC pass bằng fake provider deterministic; không audio trong DB/log/repository; lỗi provider không tạo record; all gates pass.
