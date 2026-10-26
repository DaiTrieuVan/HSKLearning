package com.hsk.exercise.repository;

import com.hsk.exercise.domain.QuestionGroupEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository cho QuestionGroupEntity (HSK 3.0 question groups/parts).
 */
@Repository
public interface QuestionGroupRepository extends JpaRepository<QuestionGroupEntity, Long> {

	List<QuestionGroupEntity> findBySection_IdOrderBySortOrderAsc(Long sectionId);

	List<QuestionGroupEntity> findBySection_IdOrderByPartNumberAsc(Long sectionId);

	List<QuestionGroupEntity> findBySection_Exercise_IdOrderBySortOrderAsc(Long exerciseId);
}
