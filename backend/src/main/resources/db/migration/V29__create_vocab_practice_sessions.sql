-- V29__create_vocab_practice_sessions.sql
-- Lưu lịch sử các phiên luyện tập từ vựng (Flashcard, Trắc nghiệm, Nối từ, Viết chữ, Gõ từ, Nghe viết)

CREATE TABLE IF NOT EXISTS vocab_practice_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vocab_set_id BIGINT NULL,
    vocab_set_title VARCHAR(200) NOT NULL DEFAULT 'Tất cả bộ từ',
    game_type VARCHAR(30) NOT NULL,
    game_mode VARCHAR(50) NOT NULL,
    correct_count INT NOT NULL DEFAULT 0,
    total_count INT NOT NULL DEFAULT 0,
    xp_earned INT NOT NULL DEFAULT 0,
    duration_seconds INT NOT NULL DEFAULT 0,
    idempotency_key VARCHAR(100) NULL,
    completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_vps_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_vps_vocab_set FOREIGN KEY (vocab_set_id) REFERENCES vocab_sets(id) ON DELETE SET NULL,
    CONSTRAINT uq_vps_user_idempotency UNIQUE (user_id, idempotency_key),
    INDEX idx_vps_user_completed (user_id, completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
