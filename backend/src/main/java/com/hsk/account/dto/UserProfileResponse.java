package com.hsk.account.dto;

import java.time.Instant;
import java.util.List;

import com.hsk.account.domain.UiMode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserStatus;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Hồ sơ cá nhân người dùng")
public record UserProfileResponse(
	Long id,
	String email,
	String fullName,
	String avatarUrl,
	UserStatus status,
	List<String> roles,
	UiMode lastMode,
	Instant createdAt
) {
	public static UserProfileResponse from(UserEntity user, List<String> roles) {
		return new UserProfileResponse(
			user.getId(),
			user.getEmail(),
			user.getFullName(),
			user.getAvatarUrl(),
			user.getStatus(),
			roles,
			user.getLastMode(),
			user.getCreatedAt()
		);
	}
}
