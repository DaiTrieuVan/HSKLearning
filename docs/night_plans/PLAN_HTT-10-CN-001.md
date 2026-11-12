# Night plan — HTT-10-CN-001: Luyện nghe hiểu

## Nguồn và hiện trạng

- Story nguồn: `hsk_agent_automation/docs/user-stories/HTT-10-CN-001.md`.
- Repository đã có `ListeningPracticeController`, `ListeningPracticeService`, DTO `Listening*`, `ExerciseType.LISTENING`, API client, hai trang React và `ListeningPracticeH2Test`.
- Mục tiêu: audit ba acceptance test và sửa gap; không dựng lại module hay tạo migration nếu không cần.

## Backend cần kiểm tra/sửa

- Entity: `QuestionEntity` (audio trong `payload`), `ExerciseEntity`, `ExerciseQuestionEntity`, `AssignmentSubmissionEntity`.
- DTO: `ListeningPracticeItemDto`, `ListeningPracticeDetailResponse`, `ListeningQuestionItemDto`, `ListeningOptionDto`, `SubmitListeningPracticeRequest`, `ListeningAnswerItemDto`, `ListeningPracticeResultResponse`, `ListeningGradedQuestionDto`.
- Repository: `ExerciseRepository`, `AssignmentRepository`, `AssignmentSubmissionRepository`.
- Service/Controller: `ListeningPracticeService`, `ListeningPracticeController`; tích hợp `XpLevelService`, `StreakService`.
- Question API: xác nhận `CreateQuestionRequest`, `UpdateQuestionRequest`, `QuestionResponse`, `QuestionService` round-trip được `audioUrl`, `transcript`, `pinyin`.

### API contract

1. `GET /api/listening-practices?hskLevel={1..6}` → `200` mảng `{id,title,description,hskLevel,questionCount,totalPoints,primaryAudioUrl,createdAt}`; chỉ trả bài LISTENING có audio.
2. `GET /api/listening-practices/{id}` → chi tiết và options nhưng không lộ đáp án; `404` nếu id sai/không phải LISTENING.
3. `POST /api/listening-practices/{id}/submit`, body `{"answers":[{"questionId":1,"selectedOptionId":2}]}` → điểm, phần trăm, pass/fail, transcript, kết quả từng câu; JWT bắt buộc.

### Validation

- `hskLevel` 1–6; câu trắc nghiệm có ít nhất 2 lựa chọn và đúng 1 đáp án (QTN-08).
- Không lộ đáp án trước submit; từ chối question/option không thuộc bài và question id trùng.
- Audio lỗi trên client không tạo submission; bài thiếu audio không xuất hiện.
- Chỉ lưu kết quả sau submit hợp lệ; không nuốt lỗi persistence nếu kết quả bắt buộc phải lưu.

## Frontend

- Audit `frontend/src/api/listening.ts`, `ListeningPracticeListPage.tsx`, `ListeningPracticeDetailPage.tsx`, route/sidebar `/listening`.
- Audio player có play/pause, seek, tốc độ, loading/error/retry. Khi `onError`, khóa submit đến khi audio tải lại thành công.
- Có loading, empty/error state, kết quả từng câu, transcript sau submit; responsive và keyboard accessible.
- Dùng `lucide-react`, không emoji icon/modal mới.

## Implementation tasks

1. `IMP-01`: audit contract và chống lộ đáp án.
2. `IMP-02`: harden grading, ownership, duplicate answers và persistence.
3. `IMP-03`: audit UI audio failure theo TC-02.
4. `IMP-04`: bổ sung regression test chỉ cho gap phát hiện.

## Nghiệm thu bắt buộc

```powershell
Push-Location backend
.\mvnw.cmd -B -Dtest=ListeningPracticeH2Test test
.\mvnw.cmd -B test
Pop-Location
Push-Location frontend
npm run lint
npm run build
Pop-Location
git diff --check
```

DoD: ba TC nguồn pass, không lộ đáp án, backend regression và frontend lint/build pass.
