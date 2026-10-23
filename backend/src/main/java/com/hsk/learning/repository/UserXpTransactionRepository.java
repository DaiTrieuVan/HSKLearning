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

	Page<UserXpTransactionEntity> findByUserIdOrderByIdDesc(Long userId, Pageable pageable);

	List<UserXpTransactionEntity> findTop10ByUserIdOrderByIdDesc(Long userId);

	@org.springframework.data.jpa.repository.Query("SELECT tx.user.id, COALESCE(SUM(tx.xpAmount), 0) FROM UserXpTransactionEntity tx WHERE tx.user.id IN :userIds AND tx.createdAt >= :startDate AND tx.createdAt <= :endDate GROUP BY tx.user.id")
	List<Object[]> sumXpByUserIdsBetweenDates(
			@org.springframework.data.repository.query.Param("userIds") java.util.Collection<Long> userIds,
			@org.springframework.data.repository.query.Param("startDate") java.time.Instant startDate,
			@org.springframework.data.repository.query.Param("endDate") java.time.Instant endDate
	);
}
