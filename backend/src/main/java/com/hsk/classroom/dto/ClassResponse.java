package com.hsk.classroom.dto;

import java.time.Instant;

import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassStatus;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * HTT-02: DTO thông tin chi tiết lớp học.
 */
@Schema(description = "Thông tin chi tiết lớp học")
public record ClassResponse(
	Long id,
	Long teacherId,
	String teacherName,
	String teacherEmail,
	String title,
	String description,
	String joinCode,
	ClassStatus status,
	long memberCount,
	Instant createdAt,
	Instant updatedAt
) {
	public static ClassResponse of(ClassEntity entity, long memberCount) {
		return new ClassResponse(
			entity.getId(),
			entity.getTeacher().getId(),
			entity.getTeacher().getFullName(),
			entity.getTeacher().getEmail(),
			entity.getTitle(),
			entity.getDescription(),
			entity.getJoinCode(),
			entity.getStatus(),
			memberCount,
			entity.getCreatedAt(),
			entity.getUpdatedAt()
		);
	}
}
