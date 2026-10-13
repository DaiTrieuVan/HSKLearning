package com.hsk.common.security;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * HTT-01-CN-004: Extracts Bearer JWT from Authorization header and sets the Spring SecurityContext.
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtService jwtService;

	public JwtAuthenticationFilter(JwtService jwtService) {
		this.jwtService = jwtService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String authHeader = request.getHeader("Authorization");

		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
			Claims claims = jwtService.parseClaims(token);

			if (claims != null && SecurityContextHolder.getContext().getAuthentication() == null) {
				String email = claims.getSubject();
				@SuppressWarnings("unchecked")
				List<String> roles = (List<String>) claims.get("roles");

				List<SimpleGrantedAuthority> authorities = roles == null ? List.of()
						: roles.stream()
								.map(r -> new SimpleGrantedAuthority("ROLE_" + r))
								.collect(Collectors.toList());

				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
						email, null, authorities);

				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		}

		filterChain.doFilter(request, response);
	}
}
