package com.hsk.common.security;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.hsk.account.domain.RoleCode;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

/**
 * HTT-01-CN-004: Generates and verifies HMAC-SHA signed JSON Web Tokens for stateless authentication.
 */
@Service
public class JwtService {

	private final SecretKey signingKey;

	private final long expirationHours;

	public JwtService(
			@Value("${app.jwt.secret:default-secret-key-that-is-at-least-32-bytes-long-for-hsk-dev-2026!}") String secret,
			@Value("${app.jwt.expiration-hours:24}") long expirationHours) {
		// Ensure secret has sufficient length for HS256 (>= 256 bits / 32 bytes)
		byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
		if (keyBytes.length < 32) {
			secret = (secret + "default-padding-long-enough-32-bytes!").substring(0, 32);
			keyBytes = secret.getBytes(StandardCharsets.UTF_8);
		}
		this.signingKey = Keys.hmacShaKeyFor(keyBytes);
		this.expirationHours = expirationHours;
	}

	public String generateToken(Long userId, String email, String fullName, Set<RoleCode> roles) {
		Instant now = Instant.now();
		Instant expiry = now.plus(expirationHours, ChronoUnit.HOURS);

		List<String> roleNames = roles.stream().map(RoleCode::name).collect(Collectors.toList());

		return Jwts.builder()
				.subject(email)
				.claim("uid", userId)
				.claim("name", fullName)
				.claim("roles", roleNames)
				.issuedAt(Date.from(now))
				.expiration(Date.from(expiry))
				.signWith(signingKey)
				.compact();
	}

	public Claims parseClaims(String token) {
		try {
			return Jwts.parser()
					.verifyWith(signingKey)
					.build()
					.parseSignedClaims(token)
					.getPayload();
		}
		catch (JwtException | IllegalArgumentException ex) {
			return null;
		}
	}

	public boolean isTokenValid(String token) {
		Claims claims = parseClaims(token);
		return claims != null && claims.getExpiration().after(new Date());
	}
}
