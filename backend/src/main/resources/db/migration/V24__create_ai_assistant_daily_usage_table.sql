-- V24__create_ai_assistant_daily_usage_table.sql
-- HTT-10-CN-004: Lưu trữ và kiểm soát hạn mức lượt hỏi trợ lý AI theo ngày

CREATE TABLE IF NOT EXISTS ai_assistant_daily_usage (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    usage_date DATE NOT NULL,
    successful_count INT NOT NULL DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_ai_assistant_usage_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_ai_assistant_student_date UNIQUE (student_id, usage_date),
    INDEX idx_ai_assistant_student_date (student_id, usage_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
