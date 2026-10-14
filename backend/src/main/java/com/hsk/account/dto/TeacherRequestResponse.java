package com.hsk.account.dto;

import java.time.Instant;

import com.hsk.account.domain.TeacherRequestEntity;
import com.hsk.account.domain.TeacherRequestStatus;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Phản hồi chi tiết về yêu cầu nâng quyền giáo viên (HTT-01-CN-002, HTT-01-CN-003).
 */
@Schema(description = "Thông tin yêu cầu nâng quyền giáo viên")
public record TeacherRequestResponse(
	Long id,
	Long userId,
	String userEmail,
	String userFullName,
	String teachingInfo,
	TeacherRequestStatus status,
	Instant createdAt,
	Instant reviewedAt,
	String rejectReason
) {
	public static TeacherRequestResponse from(TeacherRequestEntity entity) {
		return new TeacherRequestResponse(
			entity.getId(),
			entity.getUser().getId(),
			entity.getUser().getEmail(),
			entity.getUser().getFullName(),
			entity.getTeachingInfo(),
			entity.getStatus(),
			entity.getCreatedAt(),
			entity.getReviewedAt(),
			entity.getRejectReason()
		);
	}
}
