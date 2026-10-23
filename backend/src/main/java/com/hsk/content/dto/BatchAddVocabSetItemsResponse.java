package com.hsk.content.dto;

public record BatchAddVocabSetItemsResponse(
    int addedCount,
    int totalRequested
) {}
