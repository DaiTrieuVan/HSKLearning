package com.hsk.material.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateClassMaterialDownloadRequest(
		@NotNull(message = "Thiếu trạng thái cho phép tải")
		Boolean allowDownload
) {
}
