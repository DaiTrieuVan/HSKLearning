-- V15__create_assignment_student_overrides_table.sql
-- Epic HTT-06: Giao bài, làm bài và chấm điểm (HTT-06-CN-008 Gia hạn nộp bài và cho làm lại)
-- Hỗ trợ gia hạn hạn nộp bài riêng và cấp thêm lượt làm bài riêng cho từng học sinh (QTN-11, QTN-12)

CREATE TABLE IF NOT EXISTS assignment_student_overrides (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    extended_due_time TIMESTAMP NULL,
    allowed_attempts INT NOT NULL DEFAULT 1,
    reason VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_overrides_assignment FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    CONSTRAINT fk_overrides_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_assignment_student_override UNIQUE (assignment_id, student_id),
    INDEX idx_overrides_assignment (assignment_id),
    INDEX idx_overrides_student (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
