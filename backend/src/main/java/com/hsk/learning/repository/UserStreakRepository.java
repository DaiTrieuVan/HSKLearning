package com.hsk.learning.repository;

import com.hsk.learning.domain.UserStreakEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserStreakRepository extends JpaRepository<UserStreakEntity, Long> {

	Optional<UserStreakEntity> findByUserId(Long userId);
}
