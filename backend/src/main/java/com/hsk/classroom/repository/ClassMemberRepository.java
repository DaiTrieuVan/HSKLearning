package com.hsk.classroom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberStatus;

public interface ClassMemberRepository extends JpaRepository<ClassMemberEntity, Long> {

	Optional<ClassMemberEntity> findByClassroom_IdAndStudent_Id(Long classId, Long studentId);

	long countByClassroom_IdAndStatus(Long classId, ClassMemberStatus status);

	List<ClassMemberEntity> findByClassroom_IdAndStatusOrderByJoinedAtDesc(Long classId, ClassMemberStatus status);

	List<ClassMemberEntity> findByClassroom_IdOrderByJoinedAtDesc(Long classId);

	@Query("SELECT cm FROM ClassMemberEntity cm JOIN FETCH cm.student WHERE cm.classroom.id = :classId")
	List<ClassMemberEntity> findByClassroomIdWithStudent(@Param("classId") Long classId);

	@Query("SELECT cm FROM ClassMemberEntity cm JOIN FETCH cm.student WHERE cm.classroom.id = :classId AND cm.status = :status")
	List<ClassMemberEntity> findByClassroomIdAndStatusWithStudent(
			@Param("classId") Long classId,
			@Param("status") ClassMemberStatus status
	);
}
