package com.hsk.material.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hsk.material.domain.CourseMaterialEntity;
import com.hsk.material.domain.MaterialStatus;

public interface CourseMaterialRepository extends JpaRepository<CourseMaterialEntity, Long> {

	List<CourseMaterialEntity> findByStatusIn(Collection<MaterialStatus> statuses);

	@Query("""
		SELECT m FROM CourseMaterialEntity m
		JOIN FETCH m.teacher
		WHERE m.id = :id
	""")
	Optional<CourseMaterialEntity> findByIdWithTeacher(@Param("id") Long id);

	@Query("""
		SELECT m FROM CourseMaterialEntity m
		JOIN FETCH m.teacher
		WHERE m.teacher.id = :teacherId
		ORDER BY m.createdAt DESC
	""")
	List<CourseMaterialEntity> findByTeacherIdWithTeacherOrderByCreatedAtDesc(@Param("teacherId") Long teacherId);
}

