package com.hsk.content.repository;

import com.hsk.content.domain.VocabSetEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VocabSetRepository extends JpaRepository<VocabSetEntity, Long> {

	List<VocabSetEntity> findAllByTeacherIdOrderByCreatedAtDesc(Long teacherId);

	List<VocabSetEntity> findByTeacherIdAndFolderIdOrderByCreatedAtDesc(Long teacherId, Long folderId);

	List<VocabSetEntity> findByTeacherIdAndFolderIdIsNullOrderByCreatedAtDesc(Long teacherId);

	List<VocabSetEntity> findByFolderId(Long folderId);

	long countByFolderId(Long folderId);

	List<VocabSetEntity> findByIsPublicTrueOrderByCreatedAtDesc();

	Optional<VocabSetEntity> findByShareCode(String shareCode);

	Optional<VocabSetEntity> findByIdAndTeacherId(Long id, Long teacherId);
}
