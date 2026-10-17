package com.hsk.assignment.repository;

import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository thao tác với bảng assignment_submissions (HTT-06-CN-002, HTT-06-CN-003).
 */
@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmissionEntity, Long> {

	/**
	 * Lấy tất cả lượt nộp bài của một học sinh trong một lớp học.
	 * Dùng cho batch fetch để tránh N+1 query khi hiển thị danh sách bài tập của lớp (Senior Backend Mode).
	 */
	List<AssignmentSubmissionEntity> findByAssignment_Classroom_IdAndStudent_Id(Long classId, Long studentId);

	/**
	 * Lấy lượt nộp bài mới nhất của học sinh cho một lần giao bài cụ thể.
	 */
	Optional<AssignmentSubmissionEntity> findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(Long assignmentId, Long studentId);

	/**
	 * Lấy tất cả lượt làm bài của học sinh đối với một lần giao bài.
	 */
	List<AssignmentSubmissionEntity> findByAssignment_IdAndStudent_Id(Long assignmentId, Long studentId);

	/**
	 * Kiểm tra xem học sinh đã có bất kỳ lượt làm bài nào cho lần giao hay chưa.
	 */
	boolean existsByAssignment_IdAndStudent_Id(Long assignmentId, Long studentId);

	/**
	 * Kiểm tra xem Lần giao bài đã có bất kỳ học sinh nào bắt đầu làm hoặc nộp bài chưa (HTT-06-CN-009 / QTN-21).
	 */
	boolean existsByAssignment_Id(Long assignmentId);

	/**
	 * Lấy tất cả bài nộp của một lần giao bài (dùng cho thống kê giáo viên HTT-06-CN-006).
	 */
	List<AssignmentSubmissionEntity> findByAssignment_Id(Long assignmentId);

	/**
	 * Xóa bài nộp theo lần giao bài (phục vụ dọn dẹp hoặc test).
	 */
	void deleteByAssignment_Id(Long assignmentId);
}
