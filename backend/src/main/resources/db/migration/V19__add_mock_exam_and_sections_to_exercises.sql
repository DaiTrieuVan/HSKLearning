-- V19__add_mock_exam_and_sections_to_exercises.sql
-- Epic HTT-09: Luyện thi HSK (HTT-09-CN-001 Tạo đề thi thử HSK)

ALTER TABLE exercises 
    ADD COLUMN exercise_type VARCHAR(50) NOT NULL DEFAULT 'REGULAR',
    ADD COLUMN hsk_level INT NULL,
    ADD COLUMN time_limit_minutes INT NULL,
    ADD COLUMN passing_score DECIMAL(6,2) NULL;

CREATE TABLE IF NOT EXISTS exercise_sections (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exercise_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    sort_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_es_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    INDEX idx_es_exercise (exercise_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE exercise_questions 
    ADD COLUMN section_id BIGINT NULL,
    ADD CONSTRAINT fk_eq_section FOREIGN KEY (section_id) REFERENCES exercise_sections(id) ON DELETE SET NULL,
    ADD INDEX idx_eq_section (section_id);
