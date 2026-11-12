package com.hsk.material.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateMaterialRequest(
		@NotBlank(message = "Tiêu đề giáo trình không được để trống")
		@Size(max = 200, message = "Tiêu đề tối đa 200 ký tự")
		String title,

		@Size(max = 2000, message = "Mô tả tối đa 2000 ký tự")
		String description,

		@Min(value = 1, message = "Cấp HSK từ 1 đến 6")
		@Max(value = 6, message = "Cấp HSK từ 1 đến 6")
		Integer hskLevel,

		Boolean defaultAllowDownload
) {
}
