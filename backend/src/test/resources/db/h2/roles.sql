-- Role catalogue used by the in-memory "h2" test profile.
-- Mirrors the seed in V1__create_account_tables.sql: the roles are created by the
-- baseline migration in every real environment, so production code may assume
-- STUDENT exists.
INSERT INTO roles (code) VALUES ('ADMIN');
INSERT INTO roles (code) VALUES ('TEACHER');
INSERT INTO roles (code) VALUES ('STUDENT');

-- Initial Seed Data for HSK Levels 1 to 6 (mirrors V6__create_content_tables.sql)
INSERT INTO hsk_levels (id, code, title, level_number, description, target_vocab_count, is_hidden, created_at, updated_at) VALUES
(1, 'HSK_1', 'HSK 1 - Nhập môn', 1, 'Lộ trình cho người bắt đầu làm quen tiếng Trung và ngữ âm', 150, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'HSK_2', 'HSK 2 - Sơ cấp cơ bản', 2, 'Giao tiếp tình huống hàng ngày đơn giản', 300, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'HSK_3', 'HSK 3 - Sơ trung cấp', 3, 'Giao tiếp cơ bản trong công việc, học tập và du lịch', 600, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'HSK_4', 'HSK 4 - Trung cấp', 4, 'Thảo luận lưu loát về nhiều chủ đề đa dạng', 1200, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'HSK_5', 'HSK 5 - Cao cấp', 5, 'Đọc báo, xem phim và thuyết trình chuyên nghiệp', 2500, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'HSK_6', 'HSK 6 - Tinh thông', 6, 'Sử dụng tiếng Trung như người bản xứ', 5000, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
