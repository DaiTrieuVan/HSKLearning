package com.hsk.content.repository;

import com.hsk.content.domain.GrammarExampleEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GrammarExampleRepository extends JpaRepository<GrammarExampleEntity, Long> {

	List<GrammarExampleEntity> findAllByGrammarPointIdOrderBySortOrderAsc(Long grammarPointId);
}
