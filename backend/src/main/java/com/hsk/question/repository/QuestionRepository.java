package com.hsk.question.repository;

import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionEntity, Long> {

	/**
	 * QTN-19: Lấy danh sách câu hỏi do chính giáo viên sở hữu.
	 */
	List<QuestionEntity> findByOwnerIdAndIsHiddenFalseOrderByCreatedAtDesc(Long ownerId);

	List<QuestionEntity> findByOwnerIdAndTypeAndIsHiddenFalseOrderByCreatedAtDesc(Long ownerId, QuestionType type);
}
