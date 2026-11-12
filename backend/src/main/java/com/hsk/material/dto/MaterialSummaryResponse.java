package com.hsk.material.dto;

import java.time.Instant;

import com.hsk.material.domain.MaterialFileType;
import com.hsk.material.domain.MaterialStatus;

public record MaterialSummaryResponse(
		Long id,
		Long teacherId,
		String teacherName,
		String title,
		String description,
		Integer hskLevel,
		MaterialFileType fileType,
		String originalFilename,
		long fileSizeBytes,
		int totalPages,
		MaterialStatus status,
		String errorMessage,
		boolean defaultAllowDownload,
		long sharedClassCount,
		Instant createdAt,
		Instant updatedAt
) {
}
