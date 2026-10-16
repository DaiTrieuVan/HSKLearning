package com.hsk.exercise.repository;

import com.hsk.exercise.domain.ExerciseEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository cho ExerciseEntity (HTT-05-CN-006).
 */
@Repository
public interface ExerciseRepository extends JpaRepository<ExerciseEntity, Long> {

	/**
	 * Lấy toàn bộ bài tập của giáo viên sở hữu (QTN-19).
	 */
	List<ExerciseEntity> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

	/**
	 * Nạp bài tập kèm danh sách câu hỏi liên kết để tránh N+1 Lazy Loading.
	 */
	@Query("SELECT e FROM ExerciseEntity e LEFT JOIN FETCH e.questions eq LEFT JOIN FETCH eq.question q WHERE e.id = :id")
	Optional<ExerciseEntity> findWithQuestionsById(@Param("id") Long id);

	boolean existsByOwnerIdAndId(Long ownerId, Long id);
}
