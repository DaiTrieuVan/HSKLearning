package com.hsk.content.repository;

import com.hsk.content.domain.HskLevelEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HskLevelRepository extends JpaRepository<HskLevelEntity, Long> {

	Optional<HskLevelEntity> findByCode(String code);

	Optional<HskLevelEntity> findByLevelNumber(Integer levelNumber);

	List<HskLevelEntity> findAllByOrderByLevelNumberAsc();

	List<HskLevelEntity> findAllByHiddenFalseOrderByLevelNumberAsc();
}
