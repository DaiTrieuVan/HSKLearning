## THUYẾT MINH LOGICAL ERD
HỆ THỐNG HỌC TIẾNG TRUNG ONLINE | Phiên bản V1.0
Tài liệu tổng hợp danh sách thực thể, các thuộc tính và quan hệ của mô hình dữ liệu logic. PK: khóa chính; FK: khóa ngoại; 1–N: một–nhiều; N–N: nhiều–nhiều. Các trường được trình bày ở mức logic, chưa xác định kiểu dữ liệu MySQL.
## I. DANH SÁCH THỰC THỂ VÀ THUỘC TÍNH
## 1. Tài khoản và phân quyền
users — Tài khoản người dùng
id (PK), email, password_hash, full_name, avatar_url, status, failed_login_count, locked_until, last_mode, created_at, updated_at
roles — Danh mục vai trò ADMIN, TEACHER, STUDENT
id (PK), code
user_roles — Liên kết tài khoản và vai trò
user_id (PK, FK), role_id (PK, FK), granted_by (FK), granted_at
teacher_requests — Yêu cầu trở thành giáo viên
id (PK), user_id (FK), teaching_info, status, reviewed_by (FK), reviewed_at, reject_reason, created_at
password_reset_tokens — Mã khôi phục mật khẩu
id (PK), user_id (FK), token_hash, expires_at, used_at, created_at
audit_logs — Nhật ký hành động hệ thống
id (PK), actor_id (FK), action, entity_type, entity_id, detail, created_at
## 2. Lớp học
classes — Lớp do giáo viên phụ trách
id (PK), teacher_id (FK), name, description, hsk_level_id (FK), join_code, status, created_at, updated_at
class_members — Học sinh tham gia lớp
id (PK), class_id (FK), student_id (FK), status, joined_at, left_at, updated_at
class_member_events — Lịch sử thay đổi thành viên
id (PK), member_id (FK), event, actor_id (FK), created_at
## 3. Học liệu HSK
hsk_programs — Chương trình và phiên bản HSK
id (PK), code, name, version, is_active
hsk_levels — Cấp độ trong chương trình
id (PK), program_id (FK), name, description, sort_order, is_hidden
lessons — Bài học theo cấp độ
id (PK), level_id (FK), title, description, sort_order, is_hidden
grammar_points — Điểm ngữ pháp trong bài
id (PK), lesson_id (FK), title, explanation, sort_order
grammar_examples — Ví dụ của điểm ngữ pháp
id (PK), grammar_point_id (FK), hanzi, pinyin, meaning, sort_order
vocabularies — Từ vựng chung hoặc riêng giáo viên
id (PK), owner_id (FK, nullable), scope, hanzi, pinyin, meaning, example, audio_url, is_hidden, created_at, updated_at
lesson_vocabularies — Liên kết bài học và từ
lesson_id (PK, FK), vocabulary_id (PK, FK), sort_order
vocab_sets — Bộ từ vựng do giáo viên tạo
id (PK), owner_id (FK), name, is_hidden
vocab_set_items — Liên kết bộ từ và từ vựng
set_id (PK, FK), vocabulary_id (PK, FK), sort_order
class_vocab_sets — Giao bộ từ cho lớp
class_id (PK, FK), set_id (PK, FK), assigned_at, assigned_by (FK)
## 4. Tiến độ học tập
lesson_progress — Tiến độ hoàn thành bài học
user_id (PK, FK), lesson_id (PK, FK), completed_at
vocab_learning [Sau MVP] — Trạng thái ôn từ SRS
user_id (PK, FK), vocabulary_id (PK, FK), repetitions, interval_days, ease_factor, due_date, last_result
review_logs [Sau MVP] — Nhật ký ôn tập từ
id (PK), user_id (FK), vocabulary_id (FK), result, reviewed_at
## 5. Ngân hàng câu hỏi và bài tập
questions — Câu hỏi giáo viên tạo
id (PK), owner_id (FK), type, content, explanation, payload, is_hidden, created_at, updated_at
question_options — Lựa chọn cho câu hỏi trắc nghiệm
id (PK), question_id (FK), content, is_correct, sort_order
exercises — Bài tập tái sử dụng
id (PK), owner_id (FK), name, description, kind, time_limit_minutes, pass_score, status, is_hidden, created_at, updated_at
exercise_questions — Liên kết bài tập và câu hỏi
exercise_id (PK, FK), question_id (PK, FK), points, sort_order, section_name
## 6. Giao bài, làm bài và chấm điểm
assignments — Một lần giao bài tập cho lớp
id (PK), exercise_id (FK), class_id (FK), assigned_by (FK), start_at, due_at, time_limit_minutes, pass_score, status, created_at, updated_at
assignment_questions — Snapshot câu hỏi tại thời điểm giao
id (PK), assignment_id (FK), source_question_id (FK, nullable), type, snapshot, points, sort_order, section_name
assignment_overrides — Gia hạn hoặc thêm lượt làm theo học sinh
id (PK), assignment_id (FK), student_id (FK), extended_due_at, extra_attempts, granted_by (FK), updated_at
attempts — Một lượt làm bài của học sinh
id (PK), assignment_id (FK), student_id (FK), attempt_no, status, started_at, deadline_at, submitted_at, auto_score, max_score, final_score, created_at, updated_at
attempt_answers — Câu trả lời trong lượt làm
id (PK), attempt_id (FK), assignment_id (FK), assignment_question_id (FK), answer, is_correct, score_awarded, grading_detail, graded_at
score_adjustments — Lịch sử sửa điểm
id (PK), attempt_id (FK), old_score, new_score, reason, adjusted_by (FK), adjusted_at
## 7. Gamification [Sau MVP]
daily_goals — Mục tiêu học tập hằng ngày
id (PK), user_id (FK), goal_date, lessons_done, words_reviewed, assignments_done, completed_at
xp_events — Lịch sử cộng XP
id (PK), user_id (FK), source_type, source_id, xp, created_at
user_gamification — Tổng hợp XP, cấp độ, chuỗi học
user_id (PK, FK), total_xp, level, current_streak, last_goal_date
## II. QUAN HỆ GIỮA CÁC BẢNG
## 1. Tài khoản và phân quyền
[TABLE]
Quan hệ | Loại | Diễn giải
users → user_roles | 1–N | Một tài khoản có nhiều bản ghi gán vai trò
roles → user_roles | 1–N | Một vai trò được gán cho nhiều tài khoản
users → teacher_requests | 1–N | Một người có thể yêu cầu xét duyệt nhiều lần
users → password_reset_tokens | 1–N | Một tài khoản có nhiều lần yêu cầu khôi phục
users → audit_logs | 1–N | Một người thực hiện nhiều sự kiện được ghi nhật ký
[/TABLE]
## 2. Lớp học
[TABLE]
Quan hệ | Loại | Diễn giải
users → classes | 1–N | Giáo viên phụ trách nhiều lớp
classes → class_members | 1–N | Lớp có nhiều học sinh
users → class_members | 1–N | Học sinh có thể tham gia nhiều lớp
class_members → class_member_events | 1–N | Thành viên có nhiều sự kiện
users → class_member_events | 1–N | Người dùng thực hiện thay đổi thành viên
[/TABLE]
## 3. Học liệu HSK
[TABLE]
Quan hệ | Loại | Diễn giải
hsk_programs → hsk_levels | 1–N | Chương trình có nhiều cấp độ
hsk_levels → lessons | 1–N | Cấp độ có nhiều bài học
hsk_levels → classes | 1–N | Cấp độ gắn với nhiều lớp
lessons → grammar_points | 1–N | Bài học có nhiều điểm ngữ pháp
grammar_points → grammar_examples | 1–N | Điểm ngữ pháp có nhiều ví dụ
lessons → lesson_vocabularies | 1–N | Bài có nhiều liên kết từ
vocabularies → lesson_vocabularies | 1–N | Từ xuất hiện trong nhiều bài
users → vocabularies | 1–N | Giáo viên sở hữu nhiều từ riêng
users → vocab_sets | 1–N | Giáo viên tạo nhiều bộ từ
vocab_sets → vocab_set_items | 1–N | Bộ từ có nhiều mục
vocabularies → vocab_set_items | 1–N | Từ thuộc nhiều bộ
classes → class_vocab_sets | 1–N | Lớp có nhiều bộ từ
vocab_sets → class_vocab_sets | 1–N | Bộ từ dùng ở nhiều lớp
[/TABLE]
## 4. Tiến độ học tập
[TABLE]
Quan hệ | Loại | Diễn giải
users → lesson_progress | 1–N | Học sinh có tiến độ nhiều bài
lessons → lesson_progress | 1–N | Bài học có nhiều học sinh hoàn thành
users → vocab_learning | 1–N | Người dùng học nhiều từ
vocabularies → vocab_learning | 1–N | Từ được nhiều người học
users → review_logs | 1–N | Người dùng có nhiều lượt ôn
vocabularies → review_logs | 1–N | Từ có nhiều lượt ôn
[/TABLE]
## 5. Ngân hàng câu hỏi
[TABLE]
Quan hệ | Loại | Diễn giải
users → questions | 1–N | Giáo viên tạo nhiều câu hỏi
questions → question_options | 1–N | Câu trắc nghiệm có nhiều lựa chọn
users → exercises | 1–N | Giáo viên tạo nhiều bài tập
exercises → exercise_questions | 1–N | Bài tập chứa nhiều câu
questions → exercise_questions | 1–N | Câu hỏi tái sử dụng ở nhiều bài
[/TABLE]
## 6. Giao bài và chấm điểm
[TABLE]
Quan hệ | Loại | Diễn giải
exercises → assignments | 1–N | Bài tập được giao nhiều lần
classes → assignments | 1–N | Lớp nhận nhiều lần giao
users → assignments | 1–N | Giáo viên thực hiện nhiều lần giao
assignments → assignment_questions | 1–N | Lần giao có nhiều câu snapshot
questions → assignment_questions | 1–N | Câu gốc có nhiều snapshot; liên kết có thể NULL
assignments → assignment_overrides | 1–N | Lần giao có nhiều ngoại lệ
users → assignment_overrides | 1–N | Học sinh được gia hạn nhiều bài
assignments → attempts | 1–N | Lần giao có nhiều lượt làm
users → attempts | 1–N | Học sinh có nhiều lượt làm
attempts → attempt_answers | 1–N | Lượt làm có nhiều câu trả lời
assignment_questions → attempt_answers | 1–N | Câu snapshot được trả lời ở nhiều lượt
attempts → score_adjustments | 1–N | Lượt làm có lịch sử sửa điểm
[/TABLE]
## 7. Gamification
[TABLE]
Quan hệ | Loại | Diễn giải
users → daily_goals | 1–N | Người dùng có mục tiêu theo ngày
users → xp_events | 1–N | Người dùng nhận XP nhiều lần
users → user_gamification | 1–0..1 | Người dùng có tối đa một bản tổng hợp
[/TABLE]
## III. CÁC QUAN HỆ TRỌNG TÂM
## Người dùng – Lớp học
users (1) → (N) class_members (N) ← (1) classes. Đây là quan hệ N–N giữa học sinh và lớp được giải quyết qua bảng thành viên.
## Bài tập – Câu hỏi
exercises (1) → (N) exercise_questions (N) ← (1) questions. Một câu hỏi có thể tái sử dụng ở nhiều bài tập.
## Giao bài – Làm bài
exercises (1) → (N) assignments (1) → (N) attempts (1) → (N) attempt_answers. assignments còn có assignment_questions để đóng băng nội dung tại thời điểm giao.
## IV. QUY TẮC NGHIỆP VỤ CẦN LƯU Ý
Mỗi tài khoản có vai trò STUDENT mặc định; TEACHER cần được duyệt. Giáo viên không tham gia chính lớp mình dạy.
class_members duy trì một bản ghi trên mỗi cặp (class_id, student_id); LEFT có thể tham gia lại, REMOVED cần được khôi phục.
Bài tập (exercise) có thể tái sử dụng; assignment là một lần giao cụ thể và lưu snapshot bất biến của câu hỏi, đáp án và điểm.
Mỗi học sinh mặc định một lượt làm; giáo viên có thể cấp thêm. Không mở lại lượt đã nộp khi gia hạn.
Điểm hiển thị là điểm cao nhất trong các lượt đã nộp; mọi lần điều chỉnh điểm được ghi lịch sử.
Các bảng SRS và Gamification là phạm vi sau MVP; phiên bản HSK và nguồn học liệu cần nhóm xác nhận.
Ghi chú: Danh sách trên có 34 thực thể, gồm 28 thực thể chính và 6 thực thể sau MVP. Một số FK tới users (ví dụ granted_by, reviewed_by, assigned_by, adjusted_by) là quan hệ bổ sung với cùng bảng users và cần thể hiện khi dựng sơ đồ vật lý.