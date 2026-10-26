package com.hsk.assignment.repository;

import com.hsk.assignment.domain.AssignmentEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository cho AssignmentEntity (HTT-06-CN-001).
 */
@Repository
public interface AssignmentRepository extends JpaRepository<AssignmentEntity, Long> {

	List<AssignmentEntity> findByClassroom_IdOrderByCreatedAtDesc(Long classId);
	List<AssignmentEntity> findByClassroom_IdAndStatusNotOrderByCreatedAtAsc(Long classId, com.hsk.assignment.domain.AssignmentStatus status);

	List<AssignmentEntity> findByTeacher_IdOrderByCreatedAtDesc(Long teacherId);

	boolean existsByExercise_Id(Long exerciseId);

	java.util.Optional<AssignmentEntity> findFirstByExercise_Id(Long exerciseId);
}
