package com.hsk.learning.repository;

import com.hsk.learning.domain.VocabLearningEntity;
import com.hsk.learning.domain.VocabLearningId;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VocabLearningRepository extends JpaRepository<VocabLearningEntity, VocabLearningId> {

	Optional<VocabLearningEntity> findById_UserIdAndId_VocabularyId(Long userId, Long vocabularyId);

	List<VocabLearningEntity> findAllById_UserIdAndId_VocabularyIdIn(Long userId, Collection<Long> vocabularyIds);

	List<VocabLearningEntity> findAllById_UserId(Long userId);
}
