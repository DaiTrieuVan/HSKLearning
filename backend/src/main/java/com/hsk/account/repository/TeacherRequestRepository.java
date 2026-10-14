package com.hsk.account.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hsk.account.domain.TeacherRequestEntity;
import com.hsk.account.domain.TeacherRequestStatus;

public interface TeacherRequestRepository extends JpaRepository<TeacherRequestEntity, Long> {

	boolean existsByUser_IdAndStatus(Long userId, TeacherRequestStatus status);

	@Query("SELECT r FROM TeacherRequestEntity r JOIN FETCH r.user WHERE r.status = :status ORDER BY r.createdAt DESC")
	List<TeacherRequestEntity> findByStatusWithUser(@Param("status") TeacherRequestStatus status);

	@Query("SELECT r FROM TeacherRequestEntity r JOIN FETCH r.user ORDER BY r.createdAt DESC")
	List<TeacherRequestEntity> findAllWithUser();

	Optional<TeacherRequestEntity> findTopByUser_IdOrderByCreatedAtDesc(Long userId);
}
