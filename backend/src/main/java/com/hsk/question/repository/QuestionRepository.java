package com.hsk.question.repository;

import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionEntity, Long> {

	/**
	 * QTN-19: Lấy danh sách câu hỏi do chính giáo viên sở hữu.
	 */
	@EntityGraph(attributePaths = {"options"})
	List<QuestionEntity> findByOwnerIdAndIsHiddenFalseOrderByCreatedAtDesc(Long ownerId);

	@EntityGraph(attributePaths = {"options"})
	List<QuestionEntity> findByOwnerIdAndTypeAndIsHiddenFalseOrderByCreatedAtDesc(Long ownerId, QuestionType type);

	@EntityGraph(attributePaths = {"options"})
	@Query("SELECT q FROM QuestionEntity q WHERE q.id = :id")
	Optional<QuestionEntity> findWithOptionsById(@Param("id") Long id);

	/**
	 * Tìm kiếm câu hỏi của giáo viên có phân trang, lọc theo từ khóa và loại câu hỏi.
	 */
	@EntityGraph(attributePaths = {"options"})
	@Query(
			value = """
				SELECT q FROM QuestionEntity q
				WHERE q.ownerId = :ownerId
				  AND q.isHidden = false
				  AND (:type IS NULL OR q.type = :type)
				  AND (
				    :keyword IS NULL OR :keyword = ''
				    OR LOWER(q.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
				    OR LOWER(COALESCE(q.explanation, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
				  )
			""",
			countQuery = """
				SELECT COUNT(q) FROM QuestionEntity q
				WHERE q.ownerId = :ownerId
				  AND q.isHidden = false
				  AND (:type IS NULL OR q.type = :type)
				  AND (
				    :keyword IS NULL OR :keyword = ''
				    OR LOWER(q.content) LIKE LOWER(CONCAT('%', :keyword, '%'))
				    OR LOWER(COALESCE(q.explanation, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
				  )
			"""
	)
	Page<QuestionEntity> searchMyQuestions(
			@Param("ownerId") Long ownerId,
			@Param("keyword") String keyword,
			@Param("type") QuestionType type,
			Pageable pageable
	);
}
