-- ============================================================================
-- ONE-TIME LOCAL DATABASE SETUP  (HTT-01-CN-001)
--
-- Run as an administrator, e.g. paste the whole file into MySQL Workbench and
-- execute it. Safe to re-run: it never drops data and updates the password if
-- the user already exists.
--
-- Target: MySQL (the MySQL 26.7 service already running on this machine).
-- NOT the MariaDB inside XAMPP: Hibernate 7.4 requires MariaDB >= 10.6, the
-- XAMPP build is 10.4.
-- ============================================================================

-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  EDIT THIS  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
-- The password for the application user. This is the value you put in
-- backend/.env as DB_PASSWORD. It is the only line you need to change.
SET @app_password = 'HskDev2026!';
-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

-- 1. Schemas: one for the running app, one for the automated tests.
--    utf8mb4 everywhere: hanzi and diacritic pinyin must survive.
CREATE DATABASE IF NOT EXISTS hsk_learning
	DEFAULT CHARACTER SET utf8mb4
	DEFAULT COLLATE utf8mb4_0900_ai_ci;

CREATE DATABASE IF NOT EXISTS hsk_learning_test
	DEFAULT CHARACTER SET utf8mb4
	DEFAULT COLLATE utf8mb4_0900_ai_ci;

-- 2. Application user, least privilege. CREATE + ALTER keeps the password in sync
--    with the line above on re-runs, so this file is the single source of truth.
SET @create_localhost = CONCAT(
	"CREATE USER IF NOT EXISTS 'hsk_app'@'localhost' IDENTIFIED BY '", @app_password, "'");
PREPARE stmt FROM @create_localhost; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @create_tcp = CONCAT(
	"CREATE USER IF NOT EXISTS 'hsk_app'@'127.0.0.1' IDENTIFIED BY '", @app_password, "'");
PREPARE stmt FROM @create_tcp; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- MySQL 8+ authenticates with caching_sha2_password by default, which the
-- MySQL JDBC driver (com.mysql:mysql-connector-j) supports out of the box.
SET @alter_localhost = CONCAT(
	"ALTER USER 'hsk_app'@'localhost' IDENTIFIED BY '", @app_password, "'");
PREPARE stmt FROM @alter_localhost; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @alter_tcp = CONCAT(
	"ALTER USER 'hsk_app'@'127.0.0.1' IDENTIFIED BY '", @app_password, "'");
PREPARE stmt FROM @alter_tcp; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- 3. Grants. Flyway needs DDL on the app schema; the test suite additionally
--    cleans and recreates its own schema on every run, so it needs DROP + CREATE VIEW.
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES, LOCK TABLES
	ON hsk_learning.* TO 'hsk_app'@'localhost', 'hsk_app'@'127.0.0.1';

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES, LOCK TABLES,
      CREATE VIEW, SHOW VIEW, EVENT, TRIGGER
	ON hsk_learning_test.* TO 'hsk_app'@'localhost', 'hsk_app'@'127.0.0.1';

FLUSH PRIVILEGES;

-- 4. Verification: these two queries should both return 3 rows / show the grants.
SELECT 'schema hsk_learning' AS check_item, COUNT(*) AS tables_present
	FROM information_schema.tables WHERE table_schema = 'hsk_learning';

SELECT 'schema hsk_learning_test' AS check_item, COUNT(*) AS tables_present
	FROM information_schema.tables WHERE table_schema = 'hsk_learning_test';

SHOW GRANTS FOR 'hsk_app'@'localhost';

-- 5. What to put in backend/.env (copy backend/.env.example to backend/.env first):
SELECT CONCAT('DB_PASSWORD=', @app_password) AS step_1_paste_into_backend_dot_env,
       'Leave DB_USERNAME=hsk_app unchanged'  AS step_2,
       'Then run:  cd backend && .\mvnw.cmd test' AS step_3;
