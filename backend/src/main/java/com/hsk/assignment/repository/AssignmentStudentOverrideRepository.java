package com.hsk.assignment.repository;

import com.hsk.assignment.domain.AssignmentStudentOverrideEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository truy xuất cấu hình ngoại lệ gia hạn và làm lại (HTT-06-CN-008).
 */
@Repository
public interface AssignmentStudentOverrideRepository extends JpaRepository<AssignmentStudentOverrideEntity, Long> {

	Optional<AssignmentStudentOverrideEntity> findByAssignment_IdAndStudent_Id(Long assignmentId, Long studentId);

	List<AssignmentStudentOverrideEntity> findByAssignment_Id(Long assignmentId);

	List<AssignmentStudentOverrideEntity> findByAssignment_Classroom_IdAndStudent_Id(Long classId, Long studentId);
}
