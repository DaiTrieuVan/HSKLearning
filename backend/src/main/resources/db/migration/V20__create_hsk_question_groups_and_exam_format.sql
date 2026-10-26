-- V20__create_hsk_question_groups_and_exam_format.sql
-- Quản lý & Thi thử Đề thi HSK chuẩn 3.0 (HSK 1: Nghe & Đọc, 8 Question Groups)

ALTER TABLE exercises 
    ADD COLUMN hsk_standard VARCHAR(20) NOT NULL DEFAULT 'HSK_3_0';

CREATE TABLE IF NOT EXISTS question_groups (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    section_id BIGINT NOT NULL,
    part_number INT NOT NULL DEFAULT 1,
    title VARCHAR(255) NOT NULL,
    instruction TEXT NULL,
    format_code VARCHAR(50) NOT NULL,
    shared_data JSON NULL,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_qg_section FOREIGN KEY (section_id) REFERENCES exercise_sections(id) ON DELETE CASCADE,
    INDEX idx_qg_section (section_id),
    INDEX idx_qg_format (format_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE exercise_questions 
    ADD COLUMN group_id BIGINT NULL,
    ADD CONSTRAINT fk_eq_group FOREIGN KEY (group_id) REFERENCES question_groups(id) ON DELETE SET NULL,
    ADD INDEX idx_eq_group (group_id);
