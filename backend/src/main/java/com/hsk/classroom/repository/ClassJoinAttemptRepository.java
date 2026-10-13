package com.hsk.classroom.repository;

import java.time.Instant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hsk.classroom.domain.ClassJoinAttemptEntity;

public interface ClassJoinAttemptRepository extends JpaRepository<ClassJoinAttemptEntity, Long> {

	@Query("""
		SELECT COUNT(a) FROM ClassJoinAttemptEntity a
		WHERE a.student.id = :studentId
		  AND a.successful = false
		  AND a.createdAt >= :since
	""")
	long countFailedAttemptsSince(
			@Param("studentId") Long studentId,
			@Param("since") Instant since);
}
