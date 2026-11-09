package com.hsk.aiassistant.dto;

import java.util.List;

public record AiVocabAutofillRequest(
	List<String> words
) {}
