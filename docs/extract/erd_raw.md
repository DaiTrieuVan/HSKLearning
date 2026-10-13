

########## PAGE: 01 - Tổng quan ##########
[NODE] users PK id email full_name
[NODE] classes PK id FK teacher_id → users FK hsk_level_id
[NODE] class_members PK id FK class_id FK student_id status
[NODE] hsk_programs PK id code, version
[NODE] hsk_levels PK id FK program_id
[NODE] lessons PK id FK level_id
[NODE] vocabularies PK id FK owner_id (optional) hanzi, pinyin
[NODE] questions PK id FK owner_id type
[NODE] exercises PK id FK owner_id
[NODE] assignments PK id FK exercise_id FK class_id
[NODE] assignment_questions PK id FK assignment_id snapshot
[NODE] attempts PK id FK assignment_id FK student_id
[NODE] attempt_answers PK id FK attempt_id FK assignment_question_id
[NODE] score_adjustments PK id FK attempt_id
[NODE] lesson_progress PK user_id PK lesson_id
[EDGE] 1:N giáo viên  e1 -> e2
[EDGE] 1:N học sinh  e1 -> e3
[EDGE] 1:N  e2 -> e3
[EDGE] 1:N  e4 -> e5
[EDGE] 1:N  e5 -> e6
[EDGE] 1:N  e1 -> e8
[EDGE] 1:N  e1 -> e9
[EDGE] 1:N  e9 -> e10
[EDGE] 1:N  e2 -> e10
[EDGE] 1:N  e10 -> e11
[EDGE] 1:N  e10 -> e12
[EDGE] 1:N  e12 -> e13
[EDGE] 1:N  e12 -> e14
[EDGE] 1:N  e1 -> e15
[EDGE] 1:N  e6 -> e15
[NODE-BIG] BỨC TRANH TỔNG THỂ • Hệ thống gồm 3 vai trò: Admin, Giáo viên và Học sinh. Một người dùng có thể mang nhiều vai trò. • Giáo viên tạo lớp; học sinh tham gia thông qua class_members. Mỗi lớp thuộc một cấp HSK mục tiêu. • Học liệu đi theo chương trình HSK → cấp độ → bài học → từ vựng. • Giáo viên soạn câu hỏi, gom thành bài tập (exercise), rồi giao thành assignment cho từng lớp. • Học sinh thực hiện attempt; câu trả lời và điểm được lưu theo từng lượt. Bảng điểm lấy lượt hợp lệ cao nhất. • Sơ đồ tổng quan lược bớt bảng phụ; xem các trang tiếp theo để hiểu đầy đủ quan hệ.


########## PAGE: 02 - Tài khoản & phân quyền ##########
[NODE] users PK id email [unique] password_hash full_name, avatar_url status, failed_login_count locked_until, last_mode created_at, updated_at
[NODE] roles PK id code [unique]
[NODE] user_roles PK/FK user_id PK/FK role_id FK granted_by → users granted_at
[NODE] teacher_requests PK id FK user_id teaching_info status FK reviewed_by → users reviewed_at, reject_reason created_at
[NODE] password_reset_tokens PK id FK user_id token_hash expires_at, used_at
[NODE] audit_logs PK id FK actor_id → users (nullable) action, entity_type, entity_id detail (JSON) created_at
[EDGE] 1:N  e1 -> e3
[EDGE] 1:N  e2 -> e3
[EDGE] 1:N  e1 -> e4
[EDGE] 1:N  e1 -> e5
[EDGE] 1:N (optional)  e1 -> e6
[NODE-BIG] TÀI KHOẢN VÀ QUYỀN • users lưu thông tin đăng nhập và trạng thái tài khoản; roles định nghĩa ADMIN / TEACHER / STUDENT. • user_roles là bảng trung gian N–N: một người có thể vừa là giáo viên vừa là học sinh. • Người đăng ký được cấp STUDENT. teacher_requests lưu hồ sơ xin quyền TEACHER và kết quả duyệt. • password_reset_tokens hỗ trợ đặt lại mật khẩu, chỉ lưu mã token đã băm. • audit_logs ghi lại hành động quan trọng; actor_id có thể trống với sự kiện do hệ thống tạo. • last_mode chỉ điều khiển giao diện; quyền truy cập luôn được kiểm tra ở máy chủ.


########## PAGE: 03 - Lớp học ##########
[NODE] users PK id full_name roles qua user_roles
[NODE] classes PK id FK teacher_id → users FK hsk_level_id → hsk_levels name, description join_code [unique] status ACTIVE / ARCHIVED
[NODE] class_members PK id FK class_id → classes FK student_id → users status ACTIVE / LEFT / REMOVED joined_at, left_at unique(class_id, student_id)
[NODE] class_member_events PK id FK member_id → class_members FK actor_id → users event JOINED/LEFT/REMOVED/RESTORED created_at
[NODE] hsk_levels PK id FK program_id name
[NODE] class_vocab_sets PK class_id PK set_id FK assigned_by → users assigned_at
[NODE] vocab_sets PK id FK owner_id → users name
[EDGE] 1:N phụ trách  e1 -> e2
[EDGE] 1:N tham gia  e1 -> e3
[EDGE] 1:N  e2 -> e3
[EDGE] 1:N  e3 -> e4
[EDGE] 1:N  e5 -> e2
[EDGE] 1:N  e2 -> e6
[EDGE] 1:N  e7 -> e6
[NODE-BIG] VÒNG ĐỜI LỚP HỌC • Một users (giáo viên) có thể phụ trách nhiều classes; mỗi lớp có đúng một giáo viên chính. • class_members nối học sinh với lớp, đồng thời lưu ACTIVE / LEFT / REMOVED. • Một cặp (class_id, student_id) chỉ có một bản ghi thành viên; vào lại là đổi trạng thái, không tạo trùng. • class_member_events lưu các sự kiện JOINED, LEFT, REMOVED, RESTORED để không mất lịch sử. • Lớp ACTIVE có thể nhận học sinh và giao bài; lớp ARCHIVED chỉ xem lại. • Học sinh bị REMOVED chỉ được khôi phục bởi giáo viên; kết quả đã nộp vẫn được giữ.


########## PAGE: 04 - Học liệu HSK ##########
[NODE] hsk_programs PK id code, version name, is_active
[NODE] hsk_levels PK id FK program_id name, sort_order, is_hidden
[NODE] lessons PK id FK level_id title, description sort_order, is_hidden
[NODE] grammar_points PK id FK lesson_id title, explanation, sort_order
[NODE] grammar_examples PK id FK grammar_point_id hanzi, pinyin, meaning sort_order
[NODE] vocabularies PK id FK owner_id → users (nullable) scope SYSTEM / TEACHER hanzi, pinyin, meaning example, audio_url, is_hidden owner_key [derived]
[NODE] lesson_vocabularies PK/FK lesson_id PK/FK vocabulary_id sort_order
[NODE] vocab_sets PK id FK owner_id → users name, is_hidden
[NODE] vocab_set_items PK/FK set_id PK/FK vocabulary_id sort_order
[NODE] class_vocab_sets PK/FK class_id PK/FK set_id FK assigned_by assigned_at
[NODE] classes PK id FK teacher_id
[NODE] users PK id full_name
[EDGE] 1:N  e1 -> e2
[EDGE] 1:N  e2 -> e3
[EDGE] 1:N  e3 -> e4
[EDGE] 1:N  e4 -> e5
[EDGE] 1:N  e3 -> e7
[EDGE] 1:N  e6 -> e7
[EDGE] 1:N  e8 -> e9
[EDGE] 1:N  e6 -> e9
[EDGE] 1:N  e11 -> e10
[EDGE] 1:N  e8 -> e10
[EDGE] 1:N  e12 -> e8
[EDGE] 1:N (optional)  e12 -> e6
[NODE-BIG] HỌC LIỆU VÀ TỪ VỰNG • hsk_programs chứa phiên bản chương trình; mỗi chương trình có nhiều hsk_levels và mỗi cấp có nhiều lessons. • grammar_points và grammar_examples lưu điểm ngữ pháp và ví dụ theo bài. • vocabularies chứa từ dùng chung (owner_id rỗng) hoặc từ riêng của giáo viên (owner_id có giá trị). • lesson_vocabularies giải quyết quan hệ N–N: một từ xuất hiện ở nhiều bài và một bài có nhiều từ. • vocab_sets là bộ từ do giáo viên tạo; vocab_set_items nối bộ với các từ. • class_vocab_sets cho phép một bộ từ được gắn cho nhiều lớp mà không nhân bản nội dung. • Nội dung đã được sử dụng nên ẩ


########## PAGE: 05 - Ngân hàng câu hỏi ##########
[NODE] users PK id full_name
[NODE] questions PK id FK owner_id → users type MCQ/FILL/MATCH/ORDER content, explanation payload (structured) is_hidden
[NODE] question_options PK id FK question_id content, is_correct, sort_order
[NODE] exercises PK id FK owner_id → users name, description kind, time_limit_minutes pass_score, status, is_hidden
[NODE] exercise_questions PK/FK exercise_id PK/FK question_id points, sort_order section_name
[EDGE] 1:N  e1 -> e2
[EDGE] 1:N  e1 -> e4
[EDGE] 1:N  e2 -> e3
[EDGE] 1:N  e2 -> e5
[EDGE] 1:N  e4 -> e5
[NODE-BIG] SOẠN CÂU HỎI VÀ BÀI TẬP • questions là ngân hàng câu hỏi thuộc giáo viên; mỗi câu có loại MCQ, FILL, MATCH hoặc ORDER. • question_options chứa lựa chọn cho MCQ; payload JSON chứa dữ liệu đặc thù các dạng còn lại. • exercises là bộ câu hỏi có thể dùng lại nhiều lần, không phải lần giao bài. • exercise_questions là bảng nối N–N giữa exercises và questions; lưu điểm và thứ tự của câu trong bài. • Sửa câu hỏi hoặc bài tập gốc không thay đổi assignment đã giao vì nội dung giao được chụp riêng. • Giáo viên chỉ quản lý câu hỏi và bài tập của mình.


########## PAGE: 06 - Giao bài & chấm điểm ##########
[NODE] classes PK id FK teacher_id
[NODE] exercises PK id FK owner_id
[NODE] assignments PK id FK exercise_id FK class_id FK assigned_by start_at, due_at time_limit_minutes, pass_score status ACTIVE/CANCELLED
[NODE] assignment_questions PK id FK assignment_id FK source_question_id (optional) type, snapshot points, sort_order, section_name
[NODE] assignment_overrides PK id FK assignment_id FK student_id extended_due_at, extra_attempts FK granted_by
[NODE] attempts PK id FK assignment_id FK student_id attempt_no, status started_at, deadline_at, submitted_at auto_score, max_score, final_score
[NODE] attempt_answers PK id FK attempt_id FK assignment_question_id assignment_id (consistency) answer, is_correct score_awarded, grading_detail
[NODE] score_adjustments PK id FK attempt_id old_score, new_score reason, FK adjusted_by adjusted_at
[NODE] users PK id full_name
[EDGE] 1:N  e1 -> e3
[EDGE] 1:N  e2 -> e3
[EDGE] 1:N  e3 -> e4
[EDGE] 1:N  e3 -> e5
[EDGE] 1:N  e3 -> e6
[EDGE] 1:N  e6 -> e7
[EDGE] 1:N  e4 -> e7
[EDGE] 1:N  e6 -> e8
[EDGE] 1:N  e9 -> e6
[EDGE] 1:N  e9 -> e5
[NODE-BIG] GIAO BÀI, NỘP BÀI, CHẤM ĐIỂM • Một exercise có thể tạo nhiều assignments cho nhiều lớp hoặc giao nhiều lần cho cùng lớp. • assignment_questions lưu bản chụp JSON của câu hỏi, đáp án và điểm khi giao; tránh thay đổi đề cũ. • assignment_overrides lưu gia hạn và số lượt làm bổ sung riêng cho từng học sinh. • attempts lưu từng lượt làm của học sinh: IN_PROGRESS → SUBMITTED hoặc AUTO_SUBMITTED. • attempt_answers lưu câu trả lời và điểm từng câu; score_adjustments lưu lịch sử giáo viên sửa điểm. • Điểm bảng điểm = điểm final_score cao nhất trong các lượt đã nộp hợp lệ. • Khi hết giờ/hạn, server tự n


########## PAGE: 07 - Tiến độ & Gamification (Sau) ##########
[NODE] users PK id full_name
[NODE] lessons PK id FK level_id
[NODE] vocabularies PK id hanzi, pinyin
[NODE] lesson_progress PK/FK user_id PK/FK lesson_id completed_at
[NODE] vocab_learning [Sau] PK/FK user_id PK/FK vocabulary_id repetitions, interval_days ease_factor, due_date last_result
[NODE] review_logs [Sau] PK id FK user_id FK vocabulary_id result, reviewed_at
[NODE] daily_goals [Sau] PK id FK user_id goal_date lessons_done, words_reviewed assignments_done, completed_at
[NODE] xp_events [Sau] PK id FK user_id source_type, source_id xp, created_at
[NODE] user_gamification [Sau] PK/FK user_id total_xp, level current_streak, last_goal_date
[EDGE] 1:N  e1 -> e4
[EDGE] 1:N  e2 -> e4
[EDGE] 1:N  e1 -> e5
[EDGE] 1:N  e3 -> e5
[EDGE] 1:N  e1 -> e6
[EDGE] 1:N  e3 -> e6
[EDGE] 1:N  e1 -> e7
[EDGE] 1:N  e1 -> e8
[EDGE] 1:0..1  e1 -> e9
[NODE-BIG] TIẾN ĐỘ VÀ TÍNH NĂNG SAU MVP • lesson_progress lưu một lần hoàn thành cho mỗi cặp (học sinh, bài học). • vocab_learning (Sau) lưu lịch ôn từ theo SRS; review_logs (Sau) ghi từng lần ôn. • daily_goals (Sau) tổng hợp hoạt động theo ngày Việt Nam; mỗi người một bản ghi mỗi ngày. • xp_events (Sau) ghi nguồn cộng điểm XP để tránh cộng trùng. • user_gamification (Sau) tổng hợp XP, cấp độ và streak để hiển thị nhanh. • Các bảng đánh dấu (Sau) là phần mở rộng, không cần triển khai trong MVP đầu tiên.