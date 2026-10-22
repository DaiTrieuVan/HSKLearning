CREATE TABLE IF NOT EXISTS user_xp_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    xp_amount INT NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    source_id VARCHAR(100),
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_xp_source UNIQUE (user_id, source_type, source_id)
);

CREATE INDEX IF NOT EXISTS idx_user_xp_user_id ON user_xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_xp_created_at ON user_xp_transactions(created_at DESC);
