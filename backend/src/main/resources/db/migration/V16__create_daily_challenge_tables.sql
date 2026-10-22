-- V16__create_daily_challenge_tables.sql
-- Epic HTT-08: Ôn tập ghi nhớ và gamification (HTT-08-CN-003 Thử thách hằng ngày)

ALTER TABLE users ADD COLUMN total_xp INT NOT NULL DEFAULT 0;

CREATE TABLE daily_challenge_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    challenge_date DATE NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    reward_xp INT NOT NULL DEFAULT 50,
    reward_claimed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_daily_challenge_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_daily_challenge_user_date UNIQUE (user_id, challenge_date),
    INDEX idx_daily_challenge_user_date (user_id, challenge_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
