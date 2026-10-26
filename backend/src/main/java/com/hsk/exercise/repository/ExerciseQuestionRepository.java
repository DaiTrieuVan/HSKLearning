package com.hsk.exercise.repository;

import com.hsk.exercise.domain.ExerciseQuestionEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository cho ExerciseQuestionEntity (HTT-05-CN-006).
 */
@Repository
public interface ExerciseQuestionRepository extends JpaRepository<ExerciseQuestionEntity, Long> {

	List<ExerciseQuestionEntity> findByExercise_IdOrderBySortOrderAsc(Long exerciseId);

	@org.springframework.data.jpa.repository.Query("""
		SELECT eq FROM ExerciseQuestionEntity eq
		LEFT JOIN FETCH eq.question q
		LEFT JOIN FETCH q.options
		LEFT JOIN FETCH eq.section s
		LEFT JOIN FETCH eq.group g
		WHERE eq.exercise.id = :exerciseId
		ORDER BY eq.sortOrder ASC
	""")
	List<ExerciseQuestionEntity> findByExerciseIdWithDetails(@org.springframework.data.repository.query.Param("exerciseId") Long exerciseId);

	boolean existsByQuestion_Id(Long questionId);

	void deleteByExercise_Id(Long exerciseId);
}
