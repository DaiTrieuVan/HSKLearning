-- V21__add_multimedia_and_passage_to_questions.sql
-- Nâng cấp Ngân hàng câu hỏi: Hỗ trợ Đa phương tiện (Audio, Ảnh, Pinyin) và phân loại HSK

-- 1. Thêm cột image_url vào bảng question_options (cho phép phương án là hình ảnh, ví dụ đề thi HSK Part 1 Nghe)
ALTER TABLE question_options
    ADD COLUMN image_url VARCHAR(500) NULL AFTER content;

-- 2. Thêm cột hsk_level và parent_id vào bảng questions phục vụ câu hỏi chùm (đoạn văn / bài đọc) và phân loại cấp độ HSK
ALTER TABLE questions
    ADD COLUMN hsk_level INT NULL AFTER type,
    ADD COLUMN parent_id BIGINT NULL AFTER owner_id,
    ADD CONSTRAINT fk_questions_parent FOREIGN KEY (parent_id) REFERENCES questions(id) ON DELETE CASCADE,
    ADD INDEX idx_questions_hsk_level (hsk_level),
    ADD INDEX idx_questions_parent (parent_id);
