package com.hsk.writing.repository;

import com.hsk.writing.domain.HanziStrokeDataEntity;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository truy vấn dữ liệu nét chữ Hán (HTT-10-CN-002).
 */
@Repository
public interface HanziStrokeDataRepository extends JpaRepository<HanziStrokeDataEntity, Long> {

	Optional<HanziStrokeDataEntity> findByHanzi(String hanzi);

	boolean existsByHanzi(String hanzi);

	List<HanziStrokeDataEntity> findByHanziIn(Collection<String> hanzis);
}
