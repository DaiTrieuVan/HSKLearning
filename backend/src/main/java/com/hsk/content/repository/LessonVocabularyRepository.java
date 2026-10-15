package com.hsk.content.repository;

import com.hsk.content.domain.LessonVocabularyEntity;
import com.hsk.content.domain.LessonVocabularyId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonVocabularyRepository extends JpaRepository<LessonVocabularyEntity, LessonVocabularyId> {

	List<LessonVocabularyEntity> findAllByLessonIdOrderBySortOrderAsc(Long lessonId);

	List<LessonVocabularyEntity> findAllByVocabularyId(Long vocabularyId);

	List<LessonVocabularyEntity> findAllByVocabularyIdIn(java.util.Collection<Long> vocabularyIds);

	boolean existsByVocabularyId(Long vocabularyId);

	void deleteByLessonIdAndVocabularyId(Long lessonId, Long vocabularyId);
}
