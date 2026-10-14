-- Role catalogue used by the in-memory "h2" test profile.
-- Mirrors the seed in V1__create_account_tables.sql: the roles are created by the
-- baseline migration in every real environment, so production code may assume
-- STUDENT exists.
INSERT INTO roles (code) VALUES ('ADMIN');
INSERT INTO roles (code) VALUES ('TEACHER');
INSERT INTO roles (code) VALUES ('STUDENT');
