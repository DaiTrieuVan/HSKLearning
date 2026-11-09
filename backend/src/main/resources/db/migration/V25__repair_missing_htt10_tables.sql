-- Repairs environments where V22-V24 are recorded as successful in
-- flyway_schema_history but one or more physical tables are missing.
-- The statements are idempotent and are safe both for healthy and drifted schemas.

CREATE TABLE IF NOT EXISTS hanzi_stroke_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    hanzi VARCHAR(10) NOT NULL,
    stroke_count INT NOT NULL,
    strokes_json LONGTEXT NOT NULL,
    medians_json LONGTEXT NOT NULL,
    source VARCHAR(100) NOT NULL,
    license VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_hanzi_stroke_data_hanzi UNIQUE (hanzi),
    INDEX idx_hanzi_stroke_data_hanzi (hanzi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
