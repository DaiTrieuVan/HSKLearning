package com.hsk.learning.repository;

import com.hsk.learning.domain.UserXpTransactionEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserXpTransactionRepository extends JpaRepository<UserXpTransactionEntity, Long> {

	boolean existsByUserIdAndSourceTypeAndSourceId(Long userId, String sourceType, String sourceId);

	Optional<UserXpTransactionEntity> findByUserIdAndSourceTypeAndSourceId(Long userId, String sourceType, String sourceId);

	Page<UserXpTransactionEntity> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

	List<UserXpTransactionEntity> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}
