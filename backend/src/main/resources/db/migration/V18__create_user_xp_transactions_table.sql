CREATE TABLE IF NOT EXISTS user_xp_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    xp_amount INT NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    source_id VARCHAR(100) NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_xp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_user_xp_source UNIQUE (user_id, source_type, source_id),
    INDEX idx_user_xp_user_id (user_id),
    INDEX idx_user_xp_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
