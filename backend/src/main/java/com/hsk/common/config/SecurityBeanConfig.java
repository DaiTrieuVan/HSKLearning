package com.hsk.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Password hashing for accounts.
 *
 * <p>Only {@code spring-security-crypto} is on the classpath at this story: the full security
 * starter with its filter chain arrives in HTT-01-CN-004 (login + JWT), so registration stays
 * publicly reachable without any permit-all rules.
 */
@Configuration(proxyBeanMethods = false)
public class SecurityBeanConfig {

	/**
	 * BCrypt with the default strength of 10. The 72 byte input limit is the reason
	 * {@code RegisterStudentRequest} caps passwords at 72 characters: BCrypt silently ignores
	 * anything beyond that, so accepting longer passwords would mean two different passwords
	 * unlocking the same account.
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
