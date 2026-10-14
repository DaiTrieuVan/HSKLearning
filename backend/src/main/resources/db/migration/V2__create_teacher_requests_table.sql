-- ============================================================================
-- V2 — Yêu cầu nâng quyền giáo viên — HTT-01-CN-002 / HTT-01-CN-003
--
-- Lưu trữ các yêu cầu trở thành giáo viên từ học sinh, kèm thông tin giảng dạy,
-- trạng thái phê duyệt (PENDING, APPROVED, REJECTED), người duyệt và lý do từ chối.
-- ============================================================================

CREATE TABLE teacher_requests (
    id            BIGINT        NOT NULL AUTO_INCREMENT,
    user_id       BIGINT        NOT NULL,
    teaching_info TEXT          NOT NULL,
    status        VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
    reviewed_by   BIGINT        NULL,
    reviewed_at   DATETIME(6)   NULL,
    reject_reason VARCHAR(500)  NULL,
    created_at    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT pk_teacher_requests PRIMARY KEY (id),
    CONSTRAINT fk_teacher_requests_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_teacher_requests_reviewer FOREIGN KEY (reviewed_by) REFERENCES users (id),
    CONSTRAINT ck_teacher_requests_status CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_teacher_requests_user ON teacher_requests (user_id);
CREATE INDEX idx_teacher_requests_status ON teacher_requests (status);
