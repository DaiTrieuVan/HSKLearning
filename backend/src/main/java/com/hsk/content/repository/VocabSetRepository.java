package com.hsk.content.repository;

import com.hsk.content.domain.VocabSetEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VocabSetRepository extends JpaRepository<VocabSetEntity, Long> {

	List<VocabSetEntity> findAllByTeacherIdOrderByCreatedAtDesc(Long teacherId);
}
