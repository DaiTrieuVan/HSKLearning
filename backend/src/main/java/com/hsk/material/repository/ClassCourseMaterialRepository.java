package com.hsk.material.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hsk.material.domain.ClassCourseMaterialEntity;

public interface ClassCourseMaterialRepository extends JpaRepository<ClassCourseMaterialEntity, Long> {

	Optional<ClassCourseMaterialEntity> findByClassroom_IdAndMaterial_Id(Long classId, Long materialId);

	@Query("""
		SELECT ccm FROM ClassCourseMaterialEntity ccm
		JOIN FETCH ccm.classroom
		WHERE ccm.material.id = :materialId
		ORDER BY ccm.sharedAt DESC
	""")
	List<ClassCourseMaterialEntity> findByMaterialIdWithClassroom(@Param("materialId") Long materialId);

	@Query("""
		SELECT ccm FROM ClassCourseMaterialEntity ccm
		JOIN FETCH ccm.material m
		JOIN FETCH m.teacher
		WHERE ccm.classroom.id = :classId
		ORDER BY ccm.sharedAt DESC
	""")
	List<ClassCourseMaterialEntity> findByClassroomIdWithMaterialAndTeacher(@Param("classId") Long classId);

	@Query("""
		SELECT ccm.material.id, COUNT(ccm)
		FROM ClassCourseMaterialEntity ccm
		WHERE ccm.material.id IN :materialIds
		GROUP BY ccm.material.id
	""")
	List<Object[]> countSharesByMaterialIds(@Param("materialIds") Collection<Long> materialIds);

	@Query("""
		SELECT COUNT(ccm) > 0
		FROM ClassCourseMaterialEntity ccm
		JOIN ClassMemberEntity cm ON cm.classroom.id = ccm.classroom.id
		WHERE ccm.material.id = :materialId
		  AND cm.student.id = :studentId
		  AND cm.status = com.hsk.classroom.domain.ClassMemberStatus.ACTIVE
	""")
	boolean existsActiveStudentAccess(
			@Param("materialId") Long materialId,
			@Param("studentId") Long studentId
	);

	@Query("""
		SELECT COUNT(ccm) > 0
		FROM ClassCourseMaterialEntity ccm
		JOIN ClassMemberEntity cm ON cm.classroom.id = ccm.classroom.id
		WHERE ccm.material.id = :materialId
		  AND cm.student.id = :studentId
		  AND cm.status = com.hsk.classroom.domain.ClassMemberStatus.ACTIVE
		  AND ccm.allowDownload = true
	""")
	boolean existsActiveStudentDownloadAccess(
			@Param("materialId") Long materialId,
			@Param("studentId") Long studentId
	);

	void deleteByClassroom_IdAndMaterial_Id(Long classId, Long materialId);
}
