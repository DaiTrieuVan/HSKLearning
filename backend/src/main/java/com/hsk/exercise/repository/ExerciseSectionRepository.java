package com.hsk.exercise.repository;

import com.hsk.exercise.domain.ExerciseSectionEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Kho dữ liệu phần thi trong bài tập/đề thi (HTT-09-CN-001).
 */
@Repository
public interface ExerciseSectionRepository extends JpaRepository<ExerciseSectionEntity, Long> {

	List<ExerciseSectionEntity> findByExerciseIdOrderBySortOrderAsc(Long exerciseId);

	void deleteByExerciseId(Long exerciseId);
}
