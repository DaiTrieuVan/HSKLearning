---
description: Phân tích User Story, tự bóc tách Implementation Tasks và lập kế hoạch chờ duyệt
---

Nhận mã User Story từ yêu cầu người dùng (ví dụ `HTT-05-CN-003`).

1. Đọc `AGENTS.md` và `docs/user-stories/<STORY_ID>.md`.
2. Đọc đầy đủ User Story, AC, Test Case, Business Rules, Tasks nguồn, phụ thuộc.
3. Khảo sát code, DB, API, UI, tests hiện có; nêu rõ phần đã có và còn thiếu.
4. Bóc tách **Proposed Implementation Tasks** theo nhu cầu thực tế. Mỗi task có ID `IMP-XX`, tiêu đề, mô tả, AC/Test Case liên quan, deliverable, DoD, phụ thuộc và ước lượng nếu có căn cứ. Phân biệt với Tasks nguồn.
5. Lập bảng truy vết AC/Test Case -> Task -> phương án kiểm thử. Nêu rủi ro và điểm chưa rõ.
6. Lưu kế hoạch tại `docs/implementation-plans/<STORY_ID>.md` theo `docs/implementation-plans/TEMPLATE.md`.
7. DỪNG và chờ người dùng phê duyệt; không code, không sửa Excel, không cập nhật Jira.
