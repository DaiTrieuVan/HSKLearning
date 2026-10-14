-- ============================================================================
-- V1 — Tài khoản và phân quyền (ERD page 02) — HTT-01-CN-001-CV-03
--
-- Creates only what this story needs: users, roles, user_roles.
-- teacher_requests, password_reset_tokens and audit_logs come with the stories
-- that actually use them (HTT-01-CN-002/003, HTT-01-CN-005, HTT-01-CN-007), so
-- each migration stays reviewable and matches one user story.
--
-- Character set is utf8mb4 from the start: Chinese hanzi and diacritic pinyin
-- must survive, and later tables (vocabularies) depend on it.
-- Engine InnoDB: foreign keys and row level locking both require it.
-- ============================================================================

CREATE TABLE roles (
	id     BIGINT       NOT NULL AUTO_INCREMENT,
	code   VARCHAR(30)  NOT NULL,
	CONSTRAINT pk_roles PRIMARY KEY (id),
	CONSTRAINT uk_roles_code UNIQUE (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE users (
	id                   BIGINT        NOT NULL AUTO_INCREMENT,
	email                VARCHAR(190)  NOT NULL,
	password_hash        VARCHAR(100)  NOT NULL,
	full_name            VARCHAR(100)  NOT NULL,
	avatar_url           VARCHAR(500)  NULL,
	-- PENDING: teacher account awaiting approval (QTN-03). ACTIVE: normal use.
	-- LOCKED: blocked by an administrator (HTT-01-CN-008).
	status               VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
	-- QTN-17: temporary lock after repeated failed sign-ins (HTT-01-CN-004).
	failed_login_count   INT           NOT NULL DEFAULT 0,
	locked_until         DATETIME(6)   NULL,
	-- Presentation hint only: which workspace to open. Never an authority.
	last_mode            VARCHAR(20)   NULL,
	-- DATETIME(6), not TIMESTAMP: Hibernate maps java.time.Instant to datetime(6), the schema is
	-- checked with ddl-auto=validate, and TIMESTAMP would cap every deadline at the year 2038.
	created_at           DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	updated_at           DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
	CONSTRAINT pk_users PRIMARY KEY (id),
	-- Precondition of HTT-01-CN-001: "Email chưa được dùng cho tài khoản khác".
	-- 190 chars stays under InnoDB's unique index key length limit.
	CONSTRAINT uk_users_email UNIQUE (email),
	CONSTRAINT ck_users_status CHECK (status IN ('PENDING','ACTIVE','LOCKED')),
	CONSTRAINT ck_users_failed_login CHECK (failed_login_count >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_users_status ON users (status);

-- N-N link table: one person may hold several roles at once (ERD page 02).
-- Composite primary key (user_id, role_id) as required by CV-03, which also
-- guarantees a role cannot be granted twice to the same account.
CREATE TABLE user_roles (
	user_id     BIGINT     NOT NULL,
	role_id     BIGINT     NOT NULL,
	-- NULL when the platform granted the role automatically, e.g. STUDENT on
	-- self registration; set to the admin's id when an administrator grants it.
	granted_by  BIGINT     NULL,
	granted_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	CONSTRAINT pk_user_roles PRIMARY KEY (user_id, role_id),
	CONSTRAINT fk_user_roles_user     FOREIGN KEY (user_id) REFERENCES users (id)  ON DELETE CASCADE,
	CONSTRAINT fk_user_roles_role     FOREIGN KEY (role_id) REFERENCES roles (id),
	CONSTRAINT fk_user_roles_granted_by FOREIGN KEY (granted_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Reverse lookups ("all accounts that are a teacher") are not served by the PK.
CREATE INDEX idx_user_roles_role ON user_roles (role_id);

-- The three roles of the platform (VT-01, VT-02, VT-03). Idempotent so the
-- baseline can be re-applied to a schema that already holds them.
INSERT INTO roles (code)
SELECT c.code FROM (
	SELECT 'ADMIN'   AS code UNION ALL
	SELECT 'TEACHER' UNION ALL
	SELECT 'STUDENT'
) c
WHERE NOT EXISTS (SELECT 1 FROM roles r WHERE r.code = c.code);
