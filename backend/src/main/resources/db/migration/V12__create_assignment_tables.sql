-- V12__create_assignment_tables.sql
-- Epic HTT-06: Giao bài, làm bài và chấm điểm (HTT-06-CN-001 Giao bài cho lớp)

CREATE TABLE IF NOT EXISTS assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    exercise_id BIGINT NOT NULL,
    class_id BIGINT NOT NULL,
    teacher_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_time TIMESTAMP NOT NULL,
    total_points DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    snapshot_data LONGTEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignments_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT,
    CONSTRAINT fk_assignments_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignments_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_assignments_class (class_id),
    INDEX idx_assignments_teacher (teacher_id),
    INDEX idx_assignments_due_time (due_time),
    INDEX idx_assignments_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
