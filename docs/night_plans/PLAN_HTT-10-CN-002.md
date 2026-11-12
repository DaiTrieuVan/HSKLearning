# Night plan — HTT-10-CN-002: Luyện viết chữ Hán

## Nguồn và kiến trúc

- Story nguồn: `hsk_agent_automation/docs/user-stories/HTT-10-CN-002.md`.
- Chưa có module stroke-order. Tận dụng `VocabularyEntity`; tạo module `com.hsk.writing`.
- Dữ liệu nét phục vụ nội bộ, không phụ thuộc CDN runtime. MVP có fixture chữ `你`; dataset bên thứ ba phải xác minh license và attribution.
- Không lưu tọa độ luyện viết; client kiểm tra thứ tự nét, backend cấp dữ liệu chuẩn.

## Backend/database

- Migration kế tiếp tạo `hanzi_stroke_data(id, hanzi UNIQUE, strokes_json, medians_json, stroke_count, source, license, created_at, updated_at)`.
- Entity `HanziStrokeDataEntity`.
- DTO: `HanziStrokeSummaryResponse`, `HanziStrokeDetailResponse(hanzi,strokeCount,strokes,medians,source)`.
- Repository `HanziStrokeDataRepository`: `findByHanzi`, batch lookup.
- Service `HanziWritingService`: chuẩn hóa Unicode code point, validate dữ liệu, trả unsupported.
- Controller `HanziWritingController` tại `/api/v1/writing`.

### Endpoints/payload

1. `GET /api/v1/writing/characters/{hanzi}/strokes`
   - `200`: `{hanzi,strokeCount,strokes:[...],medians:[...],source}`.
   - `400`: không phải đúng một Han ideograph; `404 HANZI_STROKE_DATA_NOT_FOUND`: chưa hỗ trợ.
2. `GET /api/v1/writing/characters/support?text=你好`
   - `200`: trạng thái hỗ trợ theo từng code point, tối đa 20 chữ.

### Validation

- JWT bắt buộc; xử lý Unicode code point, không dùng đơn thuần Java `char`.
- `text` không rỗng, tối đa 20 code point; batch query, không N+1.
- `strokeCount == strokes.size == medians.size`; JSON parse được, không NaN/vô hạn; không trả HTML/script.

## Frontend

- Tạo `api/writing.ts`, `HanziWritingPracticePage.tsx`, route/sidebar `/writing`.
- Components: `HanziCharacterPicker`, `StrokeOrderAnimator`, `HanziTraceCanvas`, `StrokeFeedback`.
- SVG animation play/pause/replay/speed; canvas hỗ trợ pointer/touch, guide grid, undo/reset.
- Tách `utils/strokeMatching.ts`: kiểm tra stroke index, điểm đầu/cuối, hướng, khoảng cách theo median với constants có tên.
- Vẽ sai nét 2 phải báo lỗi và không tiến bước; chữ thiếu data hiện “Chưa hỗ trợ chữ này”.
- Accessible, responsive, không phụ thuộc chỉ vào màu.

## Tests và tasks

- `HanziWritingH2Test`: chữ `你`, data thiếu, Latin/nhiều chữ, JWT, integrity JSON.
- Nếu thêm Vitest thì thêm script `test` và test deterministic cho stroke matching.
- `IMP-01`: migration/entity/repository/seed có license.
- `IMP-02`: DTO/service/controller/error code.
- `IMP-03`: animator/canvas/matching.
- `IMP-04`: page/route/sidebar/states.
- `IMP-05`: tests và OpenAPI.

## Nghiệm thu bắt buộc

```powershell
Push-Location backend
.\mvnw.cmd -B -Dtest=HanziWritingH2Test test
.\mvnw.cmd -B test
Pop-Location
Push-Location frontend
npm run lint
npm run build
if ((npm run | Out-String) -match ' test') { npm test -- --run }
Pop-Location
git diff --check
```

DoD: `你` animate đúng; nét thứ 2 sai bị chặn; unsupported state đúng; full backend tests và frontend gates pass.
