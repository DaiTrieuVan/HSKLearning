-- V7__create_learning_progress_tables.sql
-- Epic HTT-04: Học bài & Từ vựng (Tiến độ học tập và Lộ trình HSK)

CREATE TABLE IF NOT EXISTS lesson_progress (
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lesson_id),
    CONSTRAINT fk_lp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_lp_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_lp_user (user_id),
    INDEX idx_lp_lesson (lesson_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Seed HSK 7-9 (level_number 7) with 0 lessons to verify TC-04 (Cấp độ chưa có bài học nào)
INSERT INTO hsk_levels (code, title, level_number, description, target_vocab_count, is_hidden)
VALUES ('HSK_7_9', 'HSK 7-9 - Cao cấp chuyên sâu', 7, 'Dành cho dịch thuật, nghiên cứu và học thuật nâng cao', 11000, FALSE)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Seed 1 hidden level to verify TC-03 (Cấp độ ẩn không xuất hiện trên lộ trình)
INSERT INTO hsk_levels (code, title, level_number, description, target_vocab_count, is_hidden)
VALUES ('HSK_TRIAL', 'HSK Khảo nghiệm (Ẩn)', 99, 'Cấp độ thử nghiệm nội bộ của quản trị viên', 50, TRUE)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Seed Lessons 3 to 10 for HSK 1 to reach total 10 visible lessons (TC-02 test data: 10 visible lessons)
INSERT INTO lessons (hsk_level_id, title, description, sort_order, is_hidden)
SELECT id, 'Bài 3: Số đếm & Mua sắm', 'Học các con số từ 1-100 và cách hỏi giá tiền', 3, FALSE
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO lessons (hsk_level_id, title, description, sort_order, is_hidden)
SELECT id, 'Bài 4: Thời gian & Ngày tháng', 'Cách nói giờ giấc, thứ trong tuần và các tháng', 4, FALSE
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO lessons (hsk_level_id, title, description, sort_order, is_hidden)
SELECT id, 'Bài 5: Gia đình & Người thân', 'Từ vựng các thành viên trong gia đình và nghề nghiệp', 5, FALSE
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO lessons (hsk_level_id, title, description, sort_order, is_hidden)
SELECT id, 'Bài 6: Đồ ăn & Đồ uống', 'Gọi món tại nhà hàng và nói về sở thích ẩm thực', 6, FALSE
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO lessons (hsk_level_id, title, description, sort_order, is_hidden)
SELECT id, 'Bài 7: Hỏi đường & Phương tiện', 'Chỉ hướng đi, bắt taxi và đi xe buýt', 7, FALSE
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO lessons (hsk_level_id, title, description, sort_order, is_hidden)
SELECT id, 'Bài 8: Thời tiết & Bốn mùa', 'Miêu tả khí hậu, nắng mưa và nhiệt độ trong ngày', 8, FALSE
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO lessons (hsk_level_id, title, description, sort_order, is_hidden)
SELECT id, 'Bài 9: Sở thích & Hoạt động', 'Nói về các môn thể thao, nghe nhạc và xem phim', 9, FALSE
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO lessons (hsk_level_id, title, description, sort_order, is_hidden)
SELECT id, 'Bài 10: Ôn tập & Tổng kết HSK 1', 'Hệ thống hóa toàn bộ từ vựng và cấu trúc ngữ pháp HSK 1', 10, FALSE
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Seed 1 hidden lesson for HSK 1 to verify TC-03 (Bài học ẩn không xuất hiện và không tính vào tiến độ)
INSERT INTO lessons (hsk_level_id, title, description, sort_order, is_hidden)
SELECT id, 'Bài học thử nghiệm (Ẩn)', 'Bài học nháp chỉ dành cho người soạn giáo án', 99, TRUE
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Seed 3 completed lessons for student@hsk.edu to satisfy TC-02 (3/10 bài hoàn thành = 30%)
INSERT INTO lesson_progress (user_id, lesson_id, completed_at)
SELECT u.id, l.id, CURRENT_TIMESTAMP
FROM users u
JOIN lessons l ON l.sort_order IN (1, 2, 3) AND l.is_hidden = FALSE
JOIN hsk_levels hl ON l.hsk_level_id = hl.id AND hl.code = 'HSK_1'
WHERE u.email = 'student@hsk.edu'
ON DUPLICATE KEY UPDATE completed_at = VALUES(completed_at);
