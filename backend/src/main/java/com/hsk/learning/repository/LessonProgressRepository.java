package com.hsk.learning.repository;

import com.hsk.learning.domain.LessonProgressEntity;
import com.hsk.learning.domain.LessonProgressId;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgressEntity, LessonProgressId> {

	List<LessonProgressEntity> findByIdUserId(Long userId);

	Optional<LessonProgressEntity> findByIdUserIdAndIdLessonId(Long userId, Long lessonId);

	boolean existsByIdUserIdAndIdLessonId(Long userId, Long lessonId);

	@Query("SELECT lp.id.lessonId FROM LessonProgressEntity lp WHERE lp.id.userId = :userId")
	Set<Long> findCompletedLessonIdsByUserId(@Param("userId") Long userId);

	@Query("SELECT lp FROM LessonProgressEntity lp WHERE lp.id.userId = :userId")
	List<LessonProgressEntity> findAllByUserId(@Param("userId") Long userId);

	@Query("""
		SELECT COUNT(DISTINCT lp.id.lessonId) FROM LessonProgressEntity lp
		WHERE lp.id.userId = :userId
		  AND lp.completedAt >= :startOfDay
		  AND lp.completedAt <= :endOfDay
	""")
	long countCompletedLessonsInRange(
			@Param("userId") Long userId,
			@Param("startOfDay") java.time.Instant startOfDay,
			@Param("endOfDay") java.time.Instant endOfDay
	);
}
