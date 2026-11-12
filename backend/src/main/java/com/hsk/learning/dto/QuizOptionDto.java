package com.hsk.learning.dto;

public record QuizOptionDto(
		Long id,
		String label,
		String subLabel,
		boolean correct
) {}
