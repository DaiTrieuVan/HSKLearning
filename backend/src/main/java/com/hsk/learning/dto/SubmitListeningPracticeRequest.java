package com.hsk.learning.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public record SubmitListeningPracticeRequest(
		@NotNull List<ListeningAnswerItemDto> answers
) {
}
