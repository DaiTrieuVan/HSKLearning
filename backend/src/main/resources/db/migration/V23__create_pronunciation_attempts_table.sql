-- V23__create_pronunciation_attempts_table.sql
-- HTT-10-CN-003: Chấm phát âm - Bảng lưu trữ lịch sử chấm điểm phát âm (không lưu audio/blob)

CREATE TABLE IF NOT EXISTS pronunciation_attempts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    reference_type VARCHAR(20) NULL,
    reference_id BIGINT NULL,
    reference_text VARCHAR(500) NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    accuracy_score DECIMAL(5,2) NOT NULL,
    fluency_score DECIMAL(5,2) NOT NULL,
    completeness_score DECIMAL(5,2) NOT NULL,
    feedback_code VARCHAR(100) NULL,
    assessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pronunciation_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_pronunciation_student_assessed (student_id, assessed_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
