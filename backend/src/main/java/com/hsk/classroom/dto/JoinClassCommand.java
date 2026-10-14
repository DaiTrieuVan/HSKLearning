package com.hsk.classroom.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * HTT-02-CN-003: Yêu cầu tham gia lớp học bằng mã code 6 ký tự (QTN-05).
 */
@Schema(description = "Yêu cầu tham gia lớp học bằng mã")
public record JoinClassCommand(
	@NotBlank(message = "Mã lớp không được để trống")
	@Pattern(regexp = "^[A-Za-z0-9]{6}$", message = "Mã lớp phải gồm đúng 6 ký tự chữ hoặc số")
	String code
) {}
