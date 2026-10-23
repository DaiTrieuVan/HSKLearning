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

	boolean existsByQuestion_Id(Long questionId);

	void deleteByExercise_Id(Long exerciseId);
}
