package com.hsk.common.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

/**
 * Baseline OpenAPI document consumed by the frontend team.
 *
 * <p>Rendered at {@code /v3/api-docs} (JSON), {@code /v3/api-docs.yaml} and the Swagger UI at
 * {@code /swagger-ui.html}. Each story also freezes a snapshot of this document under
 * {@code docs/api/openapi} so the delivered contract never moves underneath the frontend.
 */
@Configuration(proxyBeanMethods = false)
public class OpenApiConfig {

	@Bean
	public OpenAPI hskOpenApi(@Value("${app.openapi.server-url:http://localhost:8080}") String serverUrl) {
		Info info = new Info()
				.title("HSK Learning API")
				.version("v0.1")
				.description("""
						Backend API của nền tảng học tiếng Trung theo lộ trình HSK.

						**Quy ước chung**
						- Mọi endpoint nằm dưới `/api/v1`.
						- Body và response dùng `camelCase`; mọi lỗi đi kèm envelope thống nhất (`code`, `message`, `path`, `timestamp`, `fields`).
						- `message` là tiếng Việt để hiển thị trực tiếp; `code` là mã ổn định để frontend map logic.
						- Từ HTT-01-CN-004, các endpoint cần đăng nhập dùng access token qua header `Authorization: Bearer <token>`, refresh token qua cookie httpOnly.
						""")
				.license(new License().name("Internal"));

		// The url is declared explicitly: under MockMvc springdoc would otherwise render the bare
		// "http://localhost" default, which is useless to a client code generator.
		return new OpenAPI().info(info)
				.servers(List.of(new Server().url(serverUrl).description("Máy chủ dev cục bộ")));
	}
}
