# HSK Learning — tự động hóa tài liệu cho Agent

## Thiết lập

```bash
pip install openpyxl
python scripts/export_stories.py
```

File Excel nguồn: `docs/requirements.xlsx`. Các file đầu ra: `docs/user-stories/HTT-XX-CN-XXX.md`.

## Sử dụng với Agent

Ví dụ: `Đọc AGENTS.md và docs/user-stories/HTT-05-CN-003.md; kiểm tra code hiện có, lập Implementation Plan và chờ duyệt trước khi triển khai.`

## Đồng bộ hai máy

Đặt các file này trong repository GitHub HSKLearning. Khi cập nhật Excel, chạy script rồi commit và push cả Excel và Markdown. Trên máy còn lại dùng git pull. Không commit mật khẩu hoặc thông tin bí mật.

## Lưu ý

Script đọc sheet theo thứ tự cột hiện tại của tài liệu V2. Nếu đổi cấu trúc cột, cần cập nhật ánh xạ. File Markdown sinh ra là bản sao của Excel, không phải nguồn chỉnh sửa chính.


## Tự động bóc tách Implementation Tasks

Đã bổ sung `AGENTS.md`, workflow `.agent/workflows/implement-story.md` và mẫu `docs/implementation-plans/TEMPLATE.md`.
Trong Antigravity, yêu cầu Agent dùng workflow `/implement-story` với mã Story (hoặc chỉ định đọc file workflow nếu môi trường không tự nhận slash command). Agent phân tích code hiện có, tự đề xuất Tasks, tạo kế hoạch riêng và chờ phê duyệt. Các Tasks đề xuất **không** tự động ghi vào Excel/Jira và không bị lẫn với Tasks nguồn.
