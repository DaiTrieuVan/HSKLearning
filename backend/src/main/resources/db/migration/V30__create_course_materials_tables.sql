-- V30__create_course_materials_tables.sql
-- Quản lý giáo trình (PDF / PowerPoint PPTX), trang ảnh slide đã render và chia sẻ vào lớp học

CREATE TABLE IF NOT EXISTS course_materials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    teacher_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    hsk_level INT NULL,
    file_type VARCHAR(16) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    original_storage_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    total_pages INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'PROCESSING',
    error_message VARCHAR(500) NULL,
    default_allow_download BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cm_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_cm_teacher_created (teacher_id, created_at DESC),
    INDEX idx_cm_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS course_material_pages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    material_id BIGINT NOT NULL,
    page_number INT NOT NULL,
    image_storage_path VARCHAR(500) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    CONSTRAINT fk_cmp_material FOREIGN KEY (material_id) REFERENCES course_materials(id) ON DELETE CASCADE,
    CONSTRAINT uk_cmp_material_page UNIQUE (material_id, page_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS class_course_materials (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_id BIGINT NOT NULL,
    material_id BIGINT NOT NULL,
    shared_by BIGINT NOT NULL,
    allow_download BOOLEAN NOT NULL DEFAULT FALSE,
    note VARCHAR(500) NULL,
    shared_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ccm_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_ccm_material FOREIGN KEY (material_id) REFERENCES course_materials(id) ON DELETE CASCADE,
    CONSTRAINT fk_ccm_shared_by FOREIGN KEY (shared_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_ccm_class_material UNIQUE (class_id, material_id),
    INDEX idx_ccm_class_shared (class_id, shared_at DESC),
    INDEX idx_ccm_material (material_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
