package com.hsk.learning.repository;

import com.hsk.learning.domain.VocabPracticeSessionEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VocabPracticeSessionRepository extends JpaRepository<VocabPracticeSessionEntity, Long> {

	List<VocabPracticeSessionEntity> findByUser_IdOrderByCompletedAtDescIdDesc(Long userId, Pageable pageable);

	Optional<VocabPracticeSessionEntity> findByUser_IdAndIdempotencyKey(Long userId, String idempotencyKey);
}
