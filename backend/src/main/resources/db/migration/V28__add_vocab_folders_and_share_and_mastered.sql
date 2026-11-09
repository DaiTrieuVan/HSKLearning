-- V28__add_vocab_folders_and_share_and_mastered.sql
-- Quản lý bộ từ vựng theo Thư mục (Folders), chia sẻ cộng đồng và trạng thái thuộc từ vựng (is_mastered)

CREATE TABLE IF NOT EXISTS vocab_folders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    color VARCHAR(50) NOT NULL DEFAULT '#f59e0b',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_vf_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_vf_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE vocab_sets
    ADD COLUMN folder_id BIGINT NULL,
    ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN share_code VARCHAR(50) NULL UNIQUE,
    ADD COLUMN color VARCHAR(50) NOT NULL DEFAULT '#10b981',
    ADD CONSTRAINT fk_vs_folder FOREIGN KEY (folder_id) REFERENCES vocab_folders(id) ON DELETE SET NULL,
    ADD INDEX idx_vs_folder (folder_id),
    ADD INDEX idx_vs_public (is_public),
    ADD INDEX idx_vs_share_code (share_code);

ALTER TABLE vocab_learning
    ADD COLUMN is_mastered BOOLEAN NOT NULL DEFAULT FALSE,
    ADD INDEX idx_vl_user_mastered (user_id, is_mastered);
