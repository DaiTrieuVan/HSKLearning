package com.hsk.exercise.dto.hsk30;

import java.util.List;

public record Hsk30SubmitExamRequest(
		List<Hsk30StudentAnswerDto> answers,
		Integer timeSpentSeconds
) {
}
