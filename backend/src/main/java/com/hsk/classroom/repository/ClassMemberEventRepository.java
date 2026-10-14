package com.hsk.classroom.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hsk.classroom.domain.ClassMemberEventEntity;

public interface ClassMemberEventRepository extends JpaRepository<ClassMemberEventEntity, Long> {

	List<ClassMemberEventEntity> findByClassroom_IdOrderByCreatedAtDesc(Long classId);

	List<ClassMemberEventEntity> findByClassroom_IdAndStudent_IdOrderByCreatedAtDesc(Long classId, Long studentId);
}
