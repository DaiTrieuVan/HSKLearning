package com.hsk.classroom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassStatus;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {

	Optional<ClassEntity> findByJoinCode(String joinCode);

	boolean existsByJoinCode(String joinCode);

	List<ClassEntity> findByTeacher_IdOrderByCreatedAtDesc(Long teacherId);

	List<ClassEntity> findByTeacher_IdAndStatusOrderByCreatedAtDesc(Long teacherId, ClassStatus status);

	@Query("""
		SELECT c FROM ClassEntity c
		JOIN ClassMemberEntity cm ON cm.classroom.id = c.id
		WHERE cm.student.id = :studentId AND cm.status = 'ACTIVE'
		ORDER BY cm.joinedAt DESC
	""")
	List<ClassEntity> findEnrolledClassesByStudentId(@Param("studentId") Long studentId);
}
