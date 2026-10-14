package com.hsk.content.repository;

import com.hsk.content.domain.VocabularyEntity;
import java.util.List;
import java.util.Optional;
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
}
