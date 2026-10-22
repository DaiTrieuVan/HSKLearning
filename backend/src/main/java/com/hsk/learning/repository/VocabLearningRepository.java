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

	long countById_UserId(Long userId);

	@org.springframework.data.jpa.repository.Query("""
		SELECT vl FROM VocabLearningEntity vl
		JOIN FETCH vl.vocabulary v
		WHERE vl.user.id = :userId
		  AND vl.nextReviewAt <= :now
		  AND NOT EXISTS (
		      SELECT 1 FROM LessonVocabularyEntity lv
		      WHERE lv.vocabulary.id = v.id AND lv.lesson.hidden = true
		  )
		ORDER BY vl.nextReviewAt ASC
	""")
	List<VocabLearningEntity> findDueReviewCards(
			@org.springframework.data.repository.query.Param("userId") Long userId,
			@org.springframework.data.repository.query.Param("now") java.time.Instant now
	);

	@org.springframework.data.jpa.repository.Query("""
		SELECT COUNT(vl) FROM VocabLearningEntity vl
		WHERE vl.user.id = :userId
		  AND vl.nextReviewAt <= :now
		  AND NOT EXISTS (
		      SELECT 1 FROM LessonVocabularyEntity lv
		      WHERE lv.vocabulary.id = vl.vocabulary.id AND lv.lesson.hidden = true
		  )
	""")
	long countDueReviewCards(
			@org.springframework.data.repository.query.Param("userId") Long userId,
			@org.springframework.data.repository.query.Param("now") java.time.Instant now
	);

	@org.springframework.data.jpa.repository.Query("""
		SELECT COUNT(vl) FROM VocabLearningEntity vl
		WHERE vl.user.id = :userId
		  AND vl.repetitionLevel >= 3
	""")
	long countMasteredCards(@org.springframework.data.repository.query.Param("userId") Long userId);
}
