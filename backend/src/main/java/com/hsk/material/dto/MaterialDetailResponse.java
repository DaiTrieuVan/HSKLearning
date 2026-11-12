package com.hsk.material.dto;

import java.time.Instant;
import java.util.List;

import com.hsk.material.domain.MaterialFileType;
import com.hsk.material.domain.MaterialStatus;

public record MaterialDetailResponse(
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
		boolean canDownload,
		boolean owner,
		List<MaterialPageDto> pages,
		Instant createdAt,
		Instant updatedAt
) {
}
