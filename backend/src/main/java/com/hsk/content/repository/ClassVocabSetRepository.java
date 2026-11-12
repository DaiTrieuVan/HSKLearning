package com.hsk.content.repository;

import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.content.domain.ClassVocabSetEntity;
import com.hsk.content.domain.ClassVocabSetId;
import com.hsk.content.domain.VocabSetEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassVocabSetRepository extends JpaRepository<ClassVocabSetEntity, ClassVocabSetId> {

	List<ClassVocabSetEntity> findAllByClassroomId(Long classId);

	List<ClassVocabSetEntity> findAllByVocabSetId(Long vocabSetId);

	void deleteByClassroomIdAndVocabSetId(Long classId, Long vocabSetId);

	@Query("""
		SELECT DISTINCT cvs.vocabSet.id FROM ClassVocabSetEntity cvs
		JOIN ClassMemberEntity cm ON cm.classroom.id = cvs.classroom.id
		WHERE cm.student.id = :studentId
		  AND cm.status = :memberStatus
	""")
	List<Long> findVocabSetIdsForActiveStudent(
			@Param("studentId") Long studentId,
			@Param("memberStatus") ClassMemberStatus memberStatus
	);

	@Query("""
		SELECT DISTINCT cvs.vocabSet FROM ClassVocabSetEntity cvs
		JOIN ClassMemberEntity cm ON cm.classroom.id = cvs.classroom.id
		WHERE cm.student.id = :studentId
		  AND cm.status = :memberStatus
		ORDER BY cvs.vocabSet.createdAt DESC
	""")
	List<VocabSetEntity> findVocabSetsForActiveStudent(
			@Param("studentId") Long studentId,
			@Param("memberStatus") ClassMemberStatus memberStatus
	);
}
