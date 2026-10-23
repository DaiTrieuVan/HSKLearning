package com.hsk.assignment.dto;

import jakarta.validation.constraints.NotNull;
import java.time.Instant;

/**
 * DTO request kéo dài hạn nộp của một lần giao bài (HTT-06-CN-010 / QTN-21).
 * Chỉ cho phép kéo dài (newDueTime phải sau dueTime hiện tại), không rút ngắn.
 */
public record ExtendAssignmentDueDateRequest(
        @NotNull(message = "Hạn nộp mới không được để trống")
        Instant newDueTime
) {}
