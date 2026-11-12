package com.hsk.content.repository;

import com.hsk.content.domain.VocabFolderEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VocabFolderRepository extends JpaRepository<VocabFolderEntity, Long> {

	List<VocabFolderEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

	Optional<VocabFolderEntity> findByIdAndUserId(Long id, Long userId);

	boolean existsByIdAndUserId(Long id, Long userId);
}
