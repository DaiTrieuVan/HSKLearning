package com.hsk.account.dto;

import com.hsk.account.domain.UiMode;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

/**
 * HTT-01-CN-009: Yêu cầu chuyển đổi chế độ làm việc (STUDENT ⇄ TEACHER).
 */
@Schema(description = "Yêu cầu chuyển đổi chế độ làm việc")
public record SwitchModeRequest(
	@NotNull(message = "Chế độ làm việc không được để trống")
	UiMode mode
) {}
