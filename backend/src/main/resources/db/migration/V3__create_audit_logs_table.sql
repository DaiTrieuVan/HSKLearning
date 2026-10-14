-- ============================================================================
-- V3 — Nhật ký hành động hệ thống — audit_logs (ERD page 02)
--
-- HTT-01-CN-003-CV-04: Lưu người xử lý, kết quả, lý do duyệt giáo viên.
-- HTT-01-CN-007-CV-04: Lưu người dùng, vai trò, tài nguyên truy cập trái phép.
-- ============================================================================

CREATE TABLE audit_logs (
    id          BIGINT        NOT NULL AUTO_INCREMENT,
    actor_id    BIGINT        NULL,
    action      VARCHAR(50)   NOT NULL,
    entity_type VARCHAR(50)   NOT NULL,
    entity_id   VARCHAR(100)  NULL,
    detail      TEXT          NULL,
    created_at  DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT pk_audit_logs PRIMARY KEY (id),
    CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_audit_logs_actor ON audit_logs (actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs (action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);
