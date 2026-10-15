package com.hsk.question.repository;

import com.hsk.question.domain.QuestionOptionEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionOptionRepository extends JpaRepository<QuestionOptionEntity, Long> {

	List<QuestionOptionEntity> findByQuestion_IdOrderBySortOrderAsc(Long questionId);
}
