package com.hsk.content.repository;

import com.hsk.content.domain.ClassVocabSetEntity;
import com.hsk.content.domain.ClassVocabSetId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassVocabSetRepository extends JpaRepository<ClassVocabSetEntity, ClassVocabSetId> {

	List<ClassVocabSetEntity> findAllByClassroomId(Long classId);

	List<ClassVocabSetEntity> findAllByVocabSetId(Long vocabSetId);

	void deleteByClassroomIdAndVocabSetId(Long classId, Long vocabSetId);
}
