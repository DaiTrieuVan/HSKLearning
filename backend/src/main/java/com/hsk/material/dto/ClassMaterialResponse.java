package com.hsk.material.dto;

import java.time.Instant;

import com.hsk.material.domain.MaterialFileType;
import com.hsk.material.domain.MaterialStatus;

public record ClassMaterialResponse(
		Long materialId,
		Long classId,
		String title,
		String description,
		Integer hskLevel,
		MaterialFileType fileType,
		String originalFilename,
		long fileSizeBytes,
		int totalPages,
		MaterialStatus status,
		boolean allowDownload,
		boolean canDownload,
		String note,
		String teacherName,
		Instant sharedAt
) {
}
