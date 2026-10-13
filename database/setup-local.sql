-- ============================================================================
-- One-time local database setup (run as an administrator, e.g. in MySQL
-- Workbench). Safe to re-run.
--
-- This project targets MySQL (the MySQL 26.7 service already on this machine),
-- NOT the MariaDB shipped with XAMPP: Hibernate 7.4 requires MariaDB >= 10.6.
-- ============================================================================

-- 1. Schemas: one for the running app, one for the test suite.
CREATE DATABASE IF NOT EXISTS hsk_learning
	DEFAULT CHARACTER SET utf8mb4
	DEFAULT COLLATE utf8mb4_0900_ai_ci;

CREATE DATABASE IF NOT EXISTS hsk_learning_test
	DEFAULT CHARACTER SET utf8mb4
	DEFAULT COLLATE utf8mb4_0900_ai_ci;

-- 2. Application user (least privilege: no DDL rights beyond what Flyway needs).
--    CHANGE THE PASSWORD before running, then use the same value in backend/.env.
CREATE USER IF NOT EXISTS 'hsk_app'@'localhost' IDENTIFIED BY 'change-me';
CREATE USER IF NOT EXISTS 'hsk_app'@'127.0.0.1' IDENTIFIED BY 'change-me';

ALTER USER 'hsk_app'@'localhost' IDENTIFIED BY 'change-me';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES
	ON hsk_learning.*      TO 'hsk_app'@'localhost', 'hsk_app'@'127.0.0.1';

-- The test suite cleans and recreates this whole schema on every run.
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES,
      LOCK TABLES, CREATE VIEW, SHOW VIEW, EVENT, TRIGGER
	ON hsk_learning_test.* TO 'hsk_app'@'localhost', 'hsk_app'@'127.0.0.1';

FLUSH PRIVILEGES;

-- 3. Check.
SELECT USER() AS run_as, DATABASE() AS current_db;
SHOW GRANTS FOR 'hsk_app'@'localhost';
