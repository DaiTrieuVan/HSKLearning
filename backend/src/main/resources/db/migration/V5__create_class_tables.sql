-- ============================================================================
-- V5 — Quản lý lớp học (ERD page 02) — Epic HTT-02
--
-- Tables:
-- 1. classes: Lớp học do giáo viên phụ trách, mã join_code 6 ký tự duy nhất (QTN-04).
-- 2. class_members: Thành viên học sinh trong lớp (ACTIVE, LEFT, REMOVED).
-- 3. class_member_events: Nhật ký sự kiện thành viên (QTN-06).
-- 4. class_join_attempts: Nhật ký và giới hạn số lần nhập sai mã lớp (QTN-05).
-- ============================================================================

CREATE TABLE classes (
	id           BIGINT        NOT NULL AUTO_INCREMENT,
	teacher_id   BIGINT        NOT NULL,
	title        VARCHAR(150)  NOT NULL,
	description  TEXT          NULL,
	join_code    VARCHAR(6)    NOT NULL,
	status       VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
	created_at   DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	updated_at   DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
	CONSTRAINT pk_classes PRIMARY KEY (id),
	CONSTRAINT uk_classes_join_code UNIQUE (join_code),
	CONSTRAINT fk_classes_teacher FOREIGN KEY (teacher_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_classes_teacher_id ON classes (teacher_id);
CREATE INDEX idx_classes_status ON classes (status);

CREATE TABLE class_members (
	id           BIGINT        NOT NULL AUTO_INCREMENT,
	class_id     BIGINT        NOT NULL,
	student_id   BIGINT        NOT NULL,
	status       VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
	joined_at    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	updated_at   DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
	CONSTRAINT pk_class_members PRIMARY KEY (id),
	CONSTRAINT uk_class_members_student UNIQUE (class_id, student_id),
	CONSTRAINT fk_class_members_class FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE,
	CONSTRAINT fk_class_members_student FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_class_members_student ON class_members (student_id);
CREATE INDEX idx_class_members_status ON class_members (status);

CREATE TABLE class_member_events (
	id           BIGINT        NOT NULL AUTO_INCREMENT,
	class_id     BIGINT        NOT NULL,
	student_id   BIGINT        NOT NULL,
	actor_id     BIGINT        NOT NULL,
	event_type   VARCHAR(30)   NOT NULL,
	reason       TEXT          NULL,
	created_at   DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	CONSTRAINT pk_class_member_events PRIMARY KEY (id),
	CONSTRAINT fk_cme_class FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE,
	CONSTRAINT fk_cme_student FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE RESTRICT,
	CONSTRAINT fk_cme_actor FOREIGN KEY (actor_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_cme_class_student ON class_member_events (class_id, student_id);

CREATE TABLE class_join_attempts (
	id              BIGINT        NOT NULL AUTO_INCREMENT,
	student_id      BIGINT        NOT NULL,
	attempted_code  VARCHAR(20)   NOT NULL,
	is_successful   BOOLEAN       NOT NULL,
	created_at      DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	CONSTRAINT pk_class_join_attempts PRIMARY KEY (id),
	CONSTRAINT fk_cja_student FOREIGN KEY (student_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE INDEX idx_cja_student_created_at ON class_join_attempts (student_id, created_at);
