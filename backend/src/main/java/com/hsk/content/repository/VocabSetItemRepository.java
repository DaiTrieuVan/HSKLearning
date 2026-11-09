package com.hsk.content.repository;

import com.hsk.content.domain.VocabSetItemEntity;
import com.hsk.content.domain.VocabSetItemId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VocabSetItemRepository extends JpaRepository<VocabSetItemEntity, VocabSetItemId> {

	List<VocabSetItemEntity> findAllByVocabSetIdOrderBySortOrderAsc(Long vocabSetId);

	long countByVocabSetId(Long vocabSetId);

	boolean existsByVocabularyId(Long vocabularyId);

	boolean existsByVocabSetIdAndVocabularyId(Long vocabSetId, Long vocabularyId);

	void deleteByVocabSetIdAndVocabularyId(Long vocabSetId, Long vocabularyId);

	void deleteByVocabSetId(Long vocabSetId);

	@Query("SELECT vsi.vocabulary.id FROM VocabSetItemEntity vsi WHERE vsi.vocabSet.id = :vocabSetId")
	List<Long> findVocabularyIdsByVocabSetId(@Param("vocabSetId") Long vocabSetId);
}
