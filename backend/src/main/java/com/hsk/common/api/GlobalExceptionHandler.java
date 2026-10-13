package com.hsk.common.api;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import jakarta.validation.ConstraintViolationException;

/**
 * Turns every exception leaving a controller into the shared {@link ErrorResponse} envelope.
 *
 * <p>Registered as a plain {@code @RestControllerAdvice} (no {@code @Order}): the whole REST API
 * runs through it. Because the error body is rendered by our own envelope rather than by Spring's
 * default {@code ProblemDetail}, the {@code message} stays Vietnamese and {@code code} stays stable.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	private final org.springframework.beans.factory.ObjectProvider<com.hsk.common.audit.AuditLogService> auditLogServiceProvider;
	private final org.springframework.beans.factory.ObjectProvider<com.hsk.account.repository.UserRepository> userRepositoryProvider;

	public GlobalExceptionHandler(
			org.springframework.beans.factory.ObjectProvider<com.hsk.common.audit.AuditLogService> auditLogServiceProvider,
			org.springframework.beans.factory.ObjectProvider<com.hsk.account.repository.UserRepository> userRepositoryProvider) {
		this.auditLogServiceProvider = auditLogServiceProvider;
		this.userRepositoryProvider = userRepositoryProvider;
	}

	/** HTT-01-CN-001-CV-04: business rules surface as their own error code. */
	@ExceptionHandler(ApiException.class)
	public ResponseEntity<ErrorResponse> handleApiException(ApiException exception, WebRequest request) {
		log.debug("Rejected request {} : {} ({})", pathOf(request), exception.code(), exception.getMessage());
		return build(exception.code(), exception.getMessage(), pathOf(request), exception.fieldErrors());
	}

	/** Bean validation on the request body (@NotBlank/@Size/@Email/@Pattern). */
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException exception,
			WebRequest request) {
		Map<String, String> fields = new LinkedHashMap<>();
		exception.getBindingResult().getFieldErrors()
				.forEach(error -> fields.putIfAbsent(error.getField(), error.getDefaultMessage()));
		return build(ApiErrorCode.VALIDATION_FAILED, pathOf(request), fields);
	}

	/** Constraint violations raised outside the request body (e.g. on method parameters). */
	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException exception,
			WebRequest request) {
		Map<String, String> fields = new LinkedHashMap<>();
		exception.getConstraintViolations().forEach(violation -> {
			String property = violation.getPropertyPath().toString();
			fields.putIfAbsent(property.substring(property.lastIndexOf('.') + 1), violation.getMessage());
		});
		return build(ApiErrorCode.VALIDATION_FAILED, pathOf(request), fields);
	}

	/**
	 * The body was absent or not valid JSON. Kept distinct from {@code VALIDATION_FAILED} so the
	 * frontend does not try to display field errors it cannot have.
	 */
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ErrorResponse> handleUnreadableBody(HttpMessageNotReadableException exception,
			WebRequest request) {
		log.debug("Unreadable request body for {}", pathOf(request));
		return build(ApiErrorCode.MALFORMED_REQUEST_BODY, pathOf(request), Map.of());
	}

	/**
	 * Safety net for the unique constraints we do not pre-check (see QTN-04, where the join code is
	 * regenerated instead of reaching this handler).
	 */
	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException exception,
			WebRequest request) {
		log.warn("Data integrity violation on {}", pathOf(request), exception);
		return build(ApiErrorCode.RESOURCE_ALREADY_EXISTS, pathOf(request), Map.of());
	}

	/**
	 * HTT-01-CN-007 & HTT-01-CN-007-CV-04 / TC-11: Forbidden access attempt by unprivileged role / unauthorized resource.
	 * Ghi nhận AuditLog cho sự cố truy cập trái phép.
	 */
	@ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
	public ResponseEntity<ErrorResponse> handleAccessDenied(
			org.springframework.security.access.AccessDeniedException exception,
			WebRequest request) {
		log.warn("Access denied on {}: {}", pathOf(request), exception.getMessage());
		try {
			org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
			if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
				String email = auth.getName();
				com.hsk.account.repository.UserRepository userRepo = userRepositoryProvider.getIfAvailable();
				com.hsk.common.audit.AuditLogService auditService = auditLogServiceProvider.getIfAvailable();
				if (userRepo != null && auditService != null) {
					userRepo.findByEmailIgnoreCase(email).ifPresent(user -> {
						auditService.record(
								user,
								"UNAUTHORIZED_ACCESS_ATTEMPT",
								"SECURITY",
								pathOf(request),
								"Truy cập trái phép vào tài nguyên: " + pathOf(request)
						);
					});
				}
			}
		} catch (Exception ex) {
			log.warn("Failed to record audit log for access denial: {}", ex.getMessage());
		}
		return build(ApiErrorCode.FORBIDDEN, pathOf(request), Map.of());
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleUnexpected(Exception exception, WebRequest request) {
		log.error("Unhandled exception on {}", pathOf(request), exception);
		return build(ApiErrorCode.INTERNAL_ERROR, pathOf(request), Map.of());
	}

	private ResponseEntity<ErrorResponse> build(ApiErrorCode code, String path, Map<String, String> fields) {
		return build(code, code.message(), path, fields);
	}

	private ResponseEntity<ErrorResponse> build(ApiErrorCode code, String message, String path,
			Map<String, String> fields) {
		ErrorResponse body = new ErrorResponse(code.name(), message, path, Instant.now(),
				fields.isEmpty() ? null : fields);
		return ResponseEntity.status(code.status()).body(body);
	}

	private String pathOf(WebRequest request) {
		String path = request.getDescription(false);
		if (path.startsWith("uri=")) {
			return path.substring(4);
		}
		if (path.startsWith("uri:")) {
			return path.substring(4);
		}
		return path;
	}
}
