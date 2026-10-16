# Quy tắc làm việc với HSK Learning

- Khi được giao mã Story `HTT-XX-CN-XXX`, đọc `docs/user-stories/<STORY_ID>.md` trước khi lập kế hoạch.
- Đối chiếu toàn bộ Given/When/Then, dữ liệu kiểm thử, business rules và tasks.
- Kiểm tra code hiện có trước khi đề xuất thay đổi; không tự ý thay đổi yêu cầu.
- Lập Implementation Plan (backend/frontend/database/test) và chờ người dùng duyệt trước khi code.
- Đảm bảo quyền truy cập, tính toàn vẹn dữ liệu và kiểm thử cả trường hợp lỗi.
- Nếu tài liệu mâu thuẫn hoặc thiếu thông tin, báo rõ để người dùng quyết định.
- Không sửa file Markdown được sinh tự động; sửa Excel nguồn và chạy lại script.


## Tự bóc tách Implementation Tasks

- Khi Story không có Tasks nguồn hoặc Tasks chưa đủ chi tiết, tự đề xuất Implementation Tasks từ User Story, AC/Test Case, Business Rules và code hiện có.
- Phân biệt rõ `Source Tasks` (từ Excel) và `Proposed Implementation Tasks` (do Agent đề xuất). Không ghi Task đề xuất ngược vào file Story tự sinh, Excel hoặc Jira nếu chưa được phê duyệt.
- Kiểm tra phụ thuộc Story và những tính năng có sẵn, tránh đề xuất lại phần đã làm.
- Mỗi Task đề xuất cần có: mã tạm `IMP-01`, tiêu đề, phạm vi, AC/Test Case liên quan, đầu ra/tiêu chí hoàn thành, phụ thuộc, và độ phức tạp ước lượng nếu đủ dữ liệu.
- Nhóm theo backend/frontend/database/integration/testing khi thực sự cần, không ép phải có đủ nhóm.
- Ghi kế hoạch vào `docs/implementation-plans/<STORY_ID>.md` (tài liệu thủ công, không bị script export ghi đè).
- Chỉ lập kế hoạch trong lượt đầu; đợi người dùng duyệt trước khi sửa code, migration hoặc test.
- Nếu AC mâu thuẫn, thiếu hoặc không thể kiểm chứng, nêu câu hỏi cần làm rõ, không tự đặt yêu cầu mới.
