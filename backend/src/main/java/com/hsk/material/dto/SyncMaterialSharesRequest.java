package com.hsk.material.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record SyncMaterialSharesRequest(
		@NotNull(message = "Danh sách chia sẻ không được null")
		@Valid
		List<MaterialShareItemRequest> shares
) {
}
