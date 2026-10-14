-- V6__create_content_tables.sql
-- Epic HTT-03: Quản lý nội dung học (Levels, Lessons, Vocabularies, Grammar, Sets)

CREATE TABLE IF NOT EXISTS hsk_levels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    level_number INT NOT NULL UNIQUE,
    description VARCHAR(500),
    target_vocab_count INT NOT NULL DEFAULT 150,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS lessons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hsk_level_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    sort_order INT NOT NULL DEFAULT 1,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_lessons_hsk_level FOREIGN KEY (hsk_level_id) REFERENCES hsk_levels(id) ON DELETE CASCADE,
    INDEX idx_lessons_level_order (hsk_level_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS vocabularies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hanzi VARCHAR(100) NOT NULL,
    pinyin VARCHAR(150) NOT NULL,
    meaning VARCHAR(500) NOT NULL,
    part_of_speech VARCHAR(50),
    audio_url VARCHAR(500),
    example_sentence VARCHAR(500),
    example_pinyin VARCHAR(500),
    example_meaning VARCHAR(500),
    hsk_level_id BIGINT,
    owner_id BIGINT NULL,
    owner_key VARCHAR(255) NOT NULL UNIQUE,
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vocab_level FOREIGN KEY (hsk_level_id) REFERENCES hsk_levels(id) ON DELETE SET NULL,
    CONSTRAINT fk_vocab_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_vocab_hanzi_pinyin (hanzi, pinyin),
    INDEX idx_vocab_owner (owner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS lesson_vocabularies (
    lesson_id BIGINT NOT NULL,
    vocabulary_id BIGINT NOT NULL,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (lesson_id, vocabulary_id),
    CONSTRAINT fk_lv_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT fk_lv_vocabulary FOREIGN KEY (vocabulary_id) REFERENCES vocabularies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS grammar_points (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lesson_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    structure VARCHAR(300),
    explanation TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_gp_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    INDEX idx_gp_lesson (lesson_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS grammar_examples (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    grammar_point_id BIGINT NOT NULL,
    hanzi VARCHAR(500) NOT NULL,
    pinyin VARCHAR(500) NOT NULL,
    meaning VARCHAR(500) NOT NULL,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ge_grammar_point FOREIGN KEY (grammar_point_id) REFERENCES grammar_points(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS vocab_sets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vs_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_vs_teacher (teacher_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS vocab_set_items (
    vocab_set_id BIGINT NOT NULL,
    vocabulary_id BIGINT NOT NULL,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (vocab_set_id, vocabulary_id),
    CONSTRAINT fk_vsi_set FOREIGN KEY (vocab_set_id) REFERENCES vocab_sets(id) ON DELETE CASCADE,
    CONSTRAINT fk_vsi_vocab FOREIGN KEY (vocabulary_id) REFERENCES vocabularies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS class_vocab_sets (
    class_id BIGINT NOT NULL,
    vocab_set_id BIGINT NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (class_id, vocab_set_id),
    CONSTRAINT fk_cvs_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_cvs_set FOREIGN KEY (vocab_set_id) REFERENCES vocab_sets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Initial Seed Data for HSK Levels 1 to 6
INSERT INTO hsk_levels (code, title, level_number, description, target_vocab_count) VALUES
('HSK_1', 'HSK 1 - Nhập môn', 1, 'Lộ trình cho người bắt đầu làm quen tiếng Trung và ngữ âm', 150),
('HSK_2', 'HSK 2 - Sơ cấp cơ bản', 2, 'Giao tiếp tình huống hàng ngày đơn giản', 300),
('HSK_3', 'HSK 3 - Sơ trung cấp', 3, 'Giao tiếp cơ bản trong công việc, học tập và du lịch', 600),
('HSK_4', 'HSK 4 - Trung cấp', 4, 'Thảo luận lưu loát về nhiều chủ đề đa dạng', 1200),
('HSK_5', 'HSK 5 - Cao cấp', 5, 'Đọc báo, xem phim và thuyết trình chuyên nghiệp', 2500),
('HSK_6', 'HSK 6 - Tinh thông', 6, 'Sử dụng tiếng Trung như người bản xứ', 5000)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Seed Sample Lessons for HSK 1
INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 1: Chào hỏi & Làm quen', 'Học cách chào hỏi cơ bản, tự giới thiệu tên và quốc tịch', 1
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title);

INSERT INTO lessons (hsk_level_id, title, description, sort_order)
SELECT id, 'Bài 2: Cảm ơn & Tạm biệt', 'Cách diễn đạt lời cảm ơn, xin lỗi và tạm biệt lễ phép', 2
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Seed Sample Vocabularies into Shared Pool
INSERT INTO vocabularies (hanzi, pinyin, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '你', 'nǐ', 'Bạn, anh, chị (đại từ ngôi thứ 2)', 'pronoun', '你好！', 'Nǐ hǎo!', 'Chào bạn!', id, NULL, 'SHARED_你_nǐ'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning);

INSERT INTO vocabularies (hanzi, pinyin, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '好', 'hǎo', 'Tốt, khỏe, hay', 'adjective', '很好。', 'Hěn hǎo.', 'Rất tốt.', id, NULL, 'SHARED_好_hǎo'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning);

INSERT INTO vocabularies (hanzi, pinyin, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '谢谢', 'xièxie', 'Cảm ơn', 'verb', '谢谢你！', 'Xièxie nǐ!', 'Cảm ơn bạn!', id, NULL, 'SHARED_谢谢_xièxie'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning);

INSERT INTO vocabularies (hanzi, pinyin, meaning, part_of_speech, example_sentence, example_pinyin, example_meaning, hsk_level_id, owner_id, owner_key)
SELECT '再见', 'zàijiàn', 'Tạm biệt, hẹn gặp lại', 'verb', '明天再见！', 'Míngtiān zàijiàn!', 'Ngày mai gặp lại!', id, NULL, 'SHARED_再见_zàijiàn'
FROM hsk_levels WHERE code = 'HSK_1'
ON DUPLICATE KEY UPDATE meaning = VALUES(meaning);
