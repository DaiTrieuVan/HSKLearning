package com.hsk.content.repository;

import com.hsk.content.domain.LessonEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<LessonEntity, Long> {

	List<LessonEntity> findAllByHskLevelIdAndHiddenFalseOrderBySortOrderAsc(Long hskLevelId);

	List<LessonEntity> findAllByHskLevelIdOrderBySortOrderAsc(Long hskLevelId);
}
