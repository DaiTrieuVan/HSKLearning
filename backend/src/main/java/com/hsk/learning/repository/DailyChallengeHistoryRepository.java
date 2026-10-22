package com.hsk.learning.repository;

import com.hsk.learning.domain.DailyChallengeHistoryEntity;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DailyChallengeHistoryRepository extends JpaRepository<DailyChallengeHistoryEntity, Long> {

	Optional<DailyChallengeHistoryEntity> findByUserIdAndChallengeDate(Long userId, LocalDate challengeDate);
}
