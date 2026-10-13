-- ============================================================================
-- V4 — Khôi phục mật khẩu — password_reset_tokens (ERD page 02)
--
-- HTT-01-CN-005: Token đặt lại mật khẩu có hiệu lực 30 phút (QTN-17).
-- ============================================================================

CREATE TABLE password_reset_tokens (
    id         BIGINT        NOT NULL AUTO_INCREMENT,
    user_id    BIGINT        NOT NULL,
    token_hash VARCHAR(100)  NOT NULL,
    expires_at DATETIME(6)   NOT NULL,
    used_at    DATETIME(6)   NULL,
    created_at DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT pk_password_reset_tokens PRIMARY KEY (id),
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_password_reset_tokens_user ON password_reset_tokens (user_id);
CREATE INDEX idx_password_reset_tokens_hash ON password_reset_tokens (token_hash);
