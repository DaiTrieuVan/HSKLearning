package com.hsk.question.dto;

import java.util.List;

public record BulkDeleteQuestionsRequest(List<Long> questionIds) {}
