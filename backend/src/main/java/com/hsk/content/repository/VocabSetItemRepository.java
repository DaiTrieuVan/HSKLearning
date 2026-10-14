package com.hsk.content.repository;

import com.hsk.content.domain.VocabSetItemEntity;
import com.hsk.content.domain.VocabSetItemId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VocabSetItemRepository extends JpaRepository<VocabSetItemEntity, VocabSetItemId> {

	List<VocabSetItemEntity> findAllByVocabSetIdOrderBySortOrderAsc(Long vocabSetId);

	boolean existsByVocabularyId(Long vocabularyId);

	void deleteByVocabSetIdAndVocabularyId(Long vocabSetId, Long vocabularyId);
}
