-- ============================================================================
-- SCRIPT SEED DỮ LIỆU BAN ĐẦU (SEED ACCOUNTS & SAMPLE DATA)
--
-- File này dùng để nạp nhanh tài khoản mẫu và dữ liệu phục vụ test trực tiếp trong MySQL.
-- Mật khẩu mặc định cho tất cả các tài khoản là: Password123
-- (Hash BCrypt tương ứng: $2a$10$ebMFfYj5ArkAW6Ni1mV4UuoR0X5ub3dA2sSRNv66Cu8dLfa8pnP/m)
-- ============================================================================

USE hsk_learning;

-- 1. Đảm bảo các quyền (Roles) cơ bản đã tồn tại
INSERT INTO roles (code)
SELECT c.code FROM (
	SELECT 'ADMIN'   AS code UNION ALL
	SELECT 'TEACHER' UNION ALL
	SELECT 'STUDENT'
) c
WHERE NOT EXISTS (SELECT 1 FROM roles r WHERE r.code = c.code);

-- 2. Seed Danh sách tài khoản người dùng
-- Mật khẩu chung: Password123
SET @pwd_hash = '$2a$10$ebMFfYj5ArkAW6Ni1mV4UuoR0X5ub3dA2sSRNv66Cu8dLfa8pnP/m';

-- Admin: admin@hsk.com
INSERT INTO users (email, password_hash, full_name, status, last_mode, failed_login_count, locked_until)
VALUES ('admin@hsk.com', @pwd_hash, 'Quản trị viên Hệ thống', 'ACTIVE', 'TEACHER', 0, NULL)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), full_name = VALUES(full_name), status = 'ACTIVE', failed_login_count = 0, locked_until = NULL;

-- Giáo viên 1 & 2
INSERT INTO users (email, password_hash, full_name, status, last_mode, failed_login_count, locked_until)
VALUES ('teacher1@hsk.com', @pwd_hash, 'Cô Vương Lệ (Giáo viên)', 'ACTIVE', 'TEACHER', 0, NULL)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), full_name = VALUES(full_name), status = 'ACTIVE', failed_login_count = 0, locked_until = NULL;

INSERT INTO users (email, password_hash, full_name, status, last_mode, failed_login_count, locked_until)
VALUES ('teacher2@hsk.com', @pwd_hash, 'Thầy Trương Vĩ (Giáo viên)', 'ACTIVE', 'TEACHER', 0, NULL)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), full_name = VALUES(full_name), status = 'ACTIVE', failed_login_count = 0, locked_until = NULL;

-- Học sinh 1 & 2
INSERT INTO users (email, password_hash, full_name, status, last_mode, failed_login_count, locked_until)
VALUES ('student1@hsk.com', @pwd_hash, 'Nguyễn Văn Học (Học sinh)', 'ACTIVE', 'STUDENT', 0, NULL)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), full_name = VALUES(full_name), status = 'ACTIVE', failed_login_count = 0, locked_until = NULL;

INSERT INTO users (email, password_hash, full_name, status, last_mode, failed_login_count, locked_until)
VALUES ('student2@hsk.com', @pwd_hash, 'Trần Thị Sinh (Học sinh)', 'ACTIVE', 'STUDENT', 0, NULL)
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), full_name = VALUES(full_name), status = 'ACTIVE', failed_login_count = 0, locked_until = NULL;

-- 3. Phân quyền (user_roles)
-- Gán quyền ADMIN cho admin@hsk.com
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email = 'admin@hsk.com' AND r.code IN ('ADMIN', 'TEACHER', 'STUDENT');

-- Gán quyền TEACHER & STUDENT cho teacher1 và teacher2
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email IN ('teacher1@hsk.com', 'teacher2@hsk.com') AND r.code IN ('TEACHER', 'STUDENT');

-- Gán quyền STUDENT cho student1 và student2
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r
WHERE u.email IN ('student1@hsk.com', 'student2@hsk.com') AND r.code = 'STUDENT';

-- 4. Seed Lớp học mẫu do teacher1 phụ trách (Mã lớp: HSK101)
INSERT INTO classes (teacher_id, title, description, join_code, status)
SELECT u.id, 'Lớp HSK 1 Cơ bản - Khóa K01', 'Lớp học từ vựng và ngữ pháp nền tảng HSK 1 cho người mới bắt đầu.', 'HSK101', 'ACTIVE'
FROM users u WHERE u.email = 'teacher1@hsk.com'
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Gán student1 vào lớp HSK101
INSERT IGNORE INTO class_members (class_id, student_id, status)
SELECT c.id, s.id, 'ACTIVE'
FROM classes c, users s
WHERE c.join_code = 'HSK101' AND s.email = 'student1@hsk.com';

-- 5. Seed Bộ từ vựng mẫu cho giáo viên teacher1
INSERT INTO vocab_sets (teacher_id, title, description)
SELECT u.id, 'Bộ 20 từ vựng HSK 1 thông dụng', 'Tổng hợp các từ vựng giao tiếp cơ bản nhất cho người mới bắt đầu học tiếng Trung.'
FROM users u WHERE u.email = 'teacher1@hsk.com'
AND NOT EXISTS (SELECT 1 FROM vocab_sets vs WHERE vs.teacher_id = u.id AND vs.title = 'Bộ 20 từ vựng HSK 1 thông dụng');

-- 6. Gán từ vựng mẫu có sẵn vào Bài 1 & Bài 2 của HSK 1
INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v
WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '你';

INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v
WHERE l.title LIKE '%Bài 1%' AND v.hanzi = '好';

INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 1
FROM lessons l, vocabularies v
WHERE l.title LIKE '%Bài 2%' AND v.hanzi = '谢谢';

INSERT IGNORE INTO lesson_vocabularies (lesson_id, vocabulary_id, sort_order)
SELECT l.id, v.id, 2
FROM lessons l, vocabularies v
WHERE l.title LIKE '%Bài 2%' AND v.hanzi = '再见';

SELECT 'Seed completed successfully! Accounts ready:' AS message;
SELECT id, email, full_name, status, last_mode FROM users WHERE email IN ('admin@hsk.com', 'teacher1@hsk.com', 'teacher2@hsk.com', 'student1@hsk.com', 'student2@hsk.com');
