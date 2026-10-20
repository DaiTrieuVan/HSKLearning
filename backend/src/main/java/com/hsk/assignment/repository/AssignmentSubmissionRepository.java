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
	 * Lấy tất cả lượt làm bài của học sinh đối với một lần giao bài sắp xếp theo lượt giảm dần.
	 */
	List<AssignmentSubmissionEntity> findByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(Long assignmentId, Long studentId);

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
	 * Lấy tất cả bài nộp của học sinh theo trạng thái (dùng cho tiến độ cá nhân HTT-07-CN-001).
	 */
	List<AssignmentSubmissionEntity> findByStudent_IdAndStatusIn(Long studentId, java.util.Collection<com.hsk.assignment.domain.SubmissionStatus> statuses);

	/**
	 * Lấy lịch sử bài nộp của học sinh (kèm join fetch assignment và classroom) sắp xếp theo thời gian nộp giảm dần (HTT-07-CN-002).
	 * Tránh N+1 query khi hiển thị lịch sử bài làm (Senior Backend Mode).
	 */
	@org.springframework.data.jpa.repository.Query("SELECT s FROM AssignmentSubmissionEntity s " +
			"JOIN FETCH s.assignment a " +
			"JOIN FETCH a.classroom c " +
			"WHERE s.student.id = :studentId AND s.status IN :statuses " +
			"ORDER BY s.submittedAt DESC")
	List<AssignmentSubmissionEntity> findStudentSubmissionHistory(
			@org.springframework.data.repository.query.Param("studentId") Long studentId,
			@org.springframework.data.repository.query.Param("statuses") java.util.Collection<com.hsk.assignment.domain.SubmissionStatus> statuses
	);

	/**
	 * Lấy tất cả bài nộp của một học sinh.
	 */
	List<AssignmentSubmissionEntity> findByStudent_Id(Long studentId);

	/**
	 * Xóa bài nộp theo lần giao bài (phục vụ dọn dẹp hoặc test).
	 */
	void deleteByAssignment_Id(Long assignmentId);
}
