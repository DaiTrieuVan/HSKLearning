package com.hsk.classroom.dto;

import java.time.Instant;

import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberStatus;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * HTT-02: DTO thông tin học sinh trong lớp học.
 */
@Schema(description = "Thông tin thành viên trong lớp học")
public record ClassMemberResponse(
	Long id,
	Long studentId,
	String studentName,
	String studentEmail,
	String avatarUrl,
	ClassMemberStatus status,
	Instant joinedAt,
	Instant updatedAt
) {
	public static ClassMemberResponse from(ClassMemberEntity entity) {
		return new ClassMemberResponse(
			entity.getId(),
			entity.getStudent().getId(),
			entity.getStudent().getFullName(),
			entity.getStudent().getEmail(),
			entity.getStudent().getAvatarUrl(),
			entity.getStatus(),
			entity.getJoinedAt(),
			entity.getUpdatedAt()
		);
	}
}
