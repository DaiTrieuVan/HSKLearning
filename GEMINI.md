# QUY TẮC LÀM VIỆC & PHÁT TRIỂN DỰ ÁN (PROJECT WORKFLOW & RULES)

## 1. VAI TRÒ (ROLE)
- AI đảm nhận vai trò lập trình chính toàn diện: **Backend (BE)**, **Frontend (FE)** và **Kiểm thử (Test)**.
- Người dùng (User) là người định nghĩa yêu cầu (Story/Specs), phản biện và phê duyệt (Approver/Reviewer).

---

## 2. QUY TRÌNH TIẾP NHẬN & THỰC THI USER STORY
1. **Tiếp nhận Story & Lập Kế hoạch (Plan First):**
   - Khi nhận story/yêu cầu từ người dùng, AI **BẮT BUỘC** phải lên kế hoạch thực hiện chi tiết (Implementation Plan).
   - **TUYỆT ĐỐI KHÔNG CODE NGAY LẬP TỨC** khi chưa được duyệt kế hoạch.
2. **Phê duyệt Kế hoạch (User Approval):**
   - Chỉ khi người dùng bấm **Proceed** hoặc xác nhận đồng ý với kế hoạch, AI mới được chuyển sang bước code.
3. **Chuẩn bị Nhánh làm việc (Git Branching):**
   - Bước 1: Pull code mới nhất từ `origin/develop`:
     ```bash
     git checkout develop
     git pull origin develop
     ```
   - Bước 2: Tạo nhánh feature mới theo quy ước:
     ```bash
     git checkout -b feature/<mã_userstory>
     # Ví dụ: feature/HTT-04-CN-002-lesson-study
     ```

---

## 3. QUY ƯỚC COMMIT (COMMIT DISCIPLINE)
- **Tuyệt đối KHÔNG gom toàn bộ thay đổi thành 1 commit lớn.**
- **Bắt buộc xé nhỏ commit (Atomic Commits):**
  - Chia nhỏ theo từng phần logic (ví dụ: database/entity/migration, service logic, controller/API, frontend component, integration/state, tests).
  - Sử dụng quy ước Conventional Commits rõ ràng (ví dụ: `feat(be): ...`, `feat(fe): ...`, `test: ...`, `refactor: ...`).

---

## 4. QUY ĐỊNH THIẾT KẾ GIAO DIỆN (UI/UX CONSTRAINTS)
- **KHÔNG DÙNG ICON DẠNG TEXT / EMOJI:**
  - Tuyệt đối không dùng ký tự text hoặc emoji (ví dụ: `🔍`, `🗑️`, `✨`, v.v.) làm icon trên giao diện.
  - Phải dùng bộ thư viện icon vector chuẩn (SVG, Lucide React, Heroicons,...).
- **KHÔNG DÙNG MODAL (NO POPUPS / NO MODALS):**
  - Tuyệt đối không thiết kế các tác vụ mở popup/modal dialog che chắn màn hình.
  - Thay thế bằng các giải pháp UX hiện đại hơn: inline expand (accordion, thẻ mở rộng tại chỗ), Drawer/Slide-over bên cạnh, hoặc điều hướng trang chuyên biệt (Dedicated sub-page).

---

## 5. NGUYÊN TẮC THIẾT KẾ CƠ SỞ DỮ LIỆU (DATABASE CONSTRAINTS)
- **Ưu tiên kiểm tra và tái sử dụng cấu trúc bảng hiện có:**
  - Trước khi tạo bảng mới, BẮT BUỘC phải rà soát kỹ lưỡng toàn bộ schema và các file migration hiện tại xem cấu trúc bảng/trường tương đương đã tồn tại chưa.
  - Tối đa hóa việc tái sử dụng schema hiện có để đảm bảo tính nhất quán (Single Source of Truth), tránh phân mảnh dữ liệu và tránh tạo migration dư thừa.
- **Chỉ tạo bảng mới khi thực sự cần thiết:**
  - Chỉ tạo bảng hoặc migration mới khi nghiệp vụ yêu cầu một thực thể độc lập hoàn toàn mới hoặc việc tách bảng mang lại lợi ích rõ rệt về mặt hiệu năng (indexing, partitioning, normalization).
  - Phải giải trình rõ lý do và sự cần thiết trong Implementation Plan trước khi thực hiện.
