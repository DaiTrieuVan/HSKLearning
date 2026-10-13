package com.hsk.common.security;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * HTT-01-CN-004 & HTT-01-CN-007: Trích xuất Bearer JWT và kiểm tra tính hợp lệ của tài khoản.
 * HTT-01-CN-007-TC-08: Nếu tài khoản bị khóa trong khi phiên còn hiệu lực, từ chối ngay với mã ACCOUNT_LOCKED (403).
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtService jwtService;

	private final UserRepository userRepository;

	public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
		this.jwtService = jwtService;
		this.userRepository = userRepository;
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
				Optional<UserEntity> userOpt = userRepository.findByEmailIgnoreCase(email);

				// HTT-01-CN-007-TC-08: Tài khoản bị khóa giữa chừng
				if (userOpt.isPresent() && userOpt.get().isPermanentlyLocked()) {
					response.setStatus(HttpServletResponse.SC_FORBIDDEN);
					response.setContentType("application/json;charset=UTF-8");
					response.getWriter().write("""
						{"code":"ACCOUNT_LOCKED","message":"Tài khoản đã bị quản trị viên khóa, vui lòng liên hệ quản trị viên"}
						""");
					return;
				}

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
