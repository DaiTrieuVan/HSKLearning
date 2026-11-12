package com.hsk.material.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MaterialShareItemRequest(
		@NotNull(message = "Thiếu mã lớp học")
		Long classId,

		boolean allowDownload,

		@Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
		String note
) {
}
