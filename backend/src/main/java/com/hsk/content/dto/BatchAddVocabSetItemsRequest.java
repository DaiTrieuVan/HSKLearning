package com.hsk.content.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record BatchAddVocabSetItemsRequest(
    @NotEmpty(message = "Danh sách ID từ vựng không được rỗng")
    List<Long> vocabularyIds
) {}
