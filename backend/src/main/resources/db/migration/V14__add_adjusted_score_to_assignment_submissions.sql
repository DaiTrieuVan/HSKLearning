-- V14__add_adjusted_score_to_assignment_submissions.sql
-- Epic HTT-06: Giao bài, làm bài và chấm điểm (HTT-06-CN-005 Xem kết quả và đáp án)
-- Hỗ trợ lưu điểm sau điều chỉnh của giáo viên và lý do điều chỉnh (TC-04, QTN-13)

ALTER TABLE assignment_submissions
    ADD COLUMN adjusted_score DECIMAL(6,2) NULL,
    ADD COLUMN adjust_reason VARCHAR(255) NULL,
    ADD COLUMN adjusted_at TIMESTAMP NULL;
