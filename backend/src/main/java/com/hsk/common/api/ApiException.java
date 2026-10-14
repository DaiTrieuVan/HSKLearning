package com.hsk.common.api;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Business rule violation turned into a REST error.
 *
 * <p>Carries an {@link ApiErrorCode} plus optional per-field messages, so a single exception
 * type can describe both "the email is taken" and "these two inputs are wrong".
 */
public class ApiException extends RuntimeException {

	private final ApiErrorCode code;

	private final Map<String, String> fieldErrors;

	public ApiException(ApiErrorCode code) {
		this(code, code.message(), Map.of());
	}

	/** Same code but a more specific user facing message (e.g. naming the offending value). */
	public ApiException(ApiErrorCode code, String message) {
		this(code, message, Map.of());
	}

	/** Field level error: the message is repeated in {@code fields} so the frontend can render it inline. */
	public ApiException(ApiErrorCode code, String field, String message) {
		this(code, message, Map.of(field, message));
	}

	private ApiException(ApiErrorCode code, String message, Map<String, String> fieldErrors) {
		super(message);
		this.code = code;
		this.fieldErrors = Collections.unmodifiableMap(new LinkedHashMap<>(fieldErrors));
	}

	public ApiErrorCode code() {
		return this.code;
	}

	public Map<String, String> fieldErrors() {
		return this.fieldErrors;
	}
}
