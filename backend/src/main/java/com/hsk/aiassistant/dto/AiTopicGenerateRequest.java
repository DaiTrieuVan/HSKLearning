package com.hsk.aiassistant.dto;

import jakarta.validation.constraints.NotBlank;

public record AiTopicGenerateRequest(
	@NotBlank(message = "Chủ đề không được để trống")
	String topic,

	Integer count
) {}
