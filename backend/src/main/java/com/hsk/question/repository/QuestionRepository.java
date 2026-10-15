package com.hsk.question.repository;

import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionType;
import java.util.List;
import java.util.Optional;
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
}
