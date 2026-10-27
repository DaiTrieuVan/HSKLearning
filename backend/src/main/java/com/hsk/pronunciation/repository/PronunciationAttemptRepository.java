package com.hsk.pronunciation.repository;

import com.hsk.pronunciation.domain.PronunciationAttemptEntity;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository truy xuất lịch sử chấm phát âm (HTT-10-CN-003).
 */
@Repository
public interface PronunciationAttemptRepository extends JpaRepository<PronunciationAttemptEntity, Long> {

	/**
	 * Lấy lịch sử làm bài của một học sinh theo thứ tự thời gian mới nhất trước.
	 *
	 * @param studentId ID tài khoản học sinh.
	 * @param pageable Phân trang / giới hạn số lượng.
	 * @return Danh sách lượt chấm phát âm.
	 */
	List<PronunciationAttemptEntity> findAllByStudentIdOrderByAssessedAtDesc(Long studentId, Pageable pageable);

	/**
	 * Đếm tổng số lượt chấm phát âm của một học sinh.
	 *
	 * @param studentId ID tài khoản học sinh.
	 * @return Số lượng lượt chấm.
	 */
	long countByStudentId(Long studentId);
}
