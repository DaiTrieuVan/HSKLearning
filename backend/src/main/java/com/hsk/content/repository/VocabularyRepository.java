package com.hsk.content.repository;

import com.hsk.content.domain.VocabularyEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VocabularyRepository extends JpaRepository<VocabularyEntity, Long> {

	Optional<VocabularyEntity> findByOwnerKey(String ownerKey);

	boolean existsByOwnerKey(String ownerKey);

	List<VocabularyEntity> findAllByHskLevelIdAndHiddenFalse(Long hskLevelId);

	List<VocabularyEntity> findAllByOwnerIdIsNullAndHiddenFalse();

	List<VocabularyEntity> findAllByOwnerIdAndHiddenFalse(Long ownerId);

	@Query("SELECT v FROM VocabularyEntity v WHERE v.hidden = false AND (v.ownerId IS NULL OR v.ownerId = :ownerId) " +
		   "AND (:query IS NULL OR :query = '' OR LOWER(v.hanzi) LIKE LOWER(CONCAT('%', :query, '%')) " +
		   "OR LOWER(v.pinyin) LIKE LOWER(CONCAT('%', :query, '%')) " +
		   "OR LOWER(v.meaning) LIKE LOWER(CONCAT('%', :query, '%')))")
	List<VocabularyEntity> searchAccessibleVocabularies(@Param("ownerId") Long ownerId, @Param("query") String query);

	@Query("SELECT v FROM VocabularyEntity v WHERE v.hidden = false " +
		   "AND (v.ownerId IS NULL OR (:userId IS NOT NULL AND v.ownerId = :userId)) " +
		   "AND (" +
		   "   LOWER(v.hanzi) LIKE LOWER(CONCAT('%', :rawQuery, '%')) " +
		   "   OR (:normalizedPinyin <> '' AND v.pinyinSearch LIKE CONCAT('%', :normalizedPinyin, '%')) " +
		   "   OR LOWER(v.meaning) LIKE LOWER(CONCAT('%', :rawQuery, '%')) " +
		   ") ORDER BY v.id ASC")
	List<VocabularyEntity> searchVocabularies(
			@Param("userId") Long userId,
			@Param("rawQuery") String rawQuery,
			@Param("normalizedPinyin") String normalizedPinyin);

	@Query("SELECT v FROM VocabularyEntity v WHERE v.hidden = false AND v.ownerId = :ownerId " +
		   "AND (:keyword IS NULL OR :keyword = '' " +
		   "     OR LOWER(v.hanzi) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
		   "     OR LOWER(v.pinyin) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
		   "     OR LOWER(v.meaning) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
		   "AND (:partOfSpeech IS NULL OR :partOfSpeech = '' OR v.partOfSpeech = :partOfSpeech)")
	Page<VocabularyEntity> searchTeacherPrivateVocabularies(
			@Param("ownerId") Long ownerId,
			@Param("keyword") String keyword,
			@Param("partOfSpeech") String partOfSpeech,
			Pageable pageable);
}
