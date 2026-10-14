package com.hsk.content.repository;

import com.hsk.content.domain.GrammarPointEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrammarPointRepository extends JpaRepository<GrammarPointEntity, Long> {

	List<GrammarPointEntity> findAllByLessonIdOrderBySortOrderAsc(Long lessonId);
}
