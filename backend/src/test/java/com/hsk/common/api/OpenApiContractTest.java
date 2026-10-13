package com.hsk.common.api;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Set;
import java.util.stream.Collectors;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;

/**
 * Protects the deliverable the frontend team builds against: the OpenAPI document itself.
 *
 * <p>A generated contract is only trustworthy when it is verified, so this class checks that the
 * document advertises the registration path, the Vietnamese summary and every error code, and that
 * the schema never exposes password material. It also writes the rendered document to
 * {@code target/openapi} so it can be frozen into {@code docs/api} without a database.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class OpenApiContractTest {

	private static final Path SNAPSHOT = Path.of("target", "openapi", "HTT-01-CN-001.yaml");

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private RequestMappingHandlerMapping handlerMapping;

	@Autowired
	private Environment environment;

	@Test
	@DisplayName("Tài liệu OpenAPI quảng bá endpoint đăng ký và đủ các mã lỗi")
	void advertisesRegistrationEndpoint() throws Exception {
		String json = this.mockMvc.perform(get("/v3/api-docs")).andExpect(status().isOk()).andReturn()
				.getResponse().getContentAsString(StandardCharsets.UTF_8);

		assertThat(json).contains("/api/v1/auth/register");
		assertThat(json).contains("Đăng ký tài khoản học sinh");
		// The frontend switches on these strings, so they belong to the contract.
		assertThat(json).contains("EMAIL_ALREADY_IN_USE");
		assertThat(json).contains("VALIDATION_FAILED");
		assertThat(json).contains("PASSWORD_CONFIRMATION_MISMATCH");
		assertThat(json).contains("MALFORMED_REQUEST_BODY");
	}

	@Test
	@DisplayName("Schema công khai không được lộ passwordHash")
	void neverExposesPasswordMaterial() throws Exception {
		String json = this.mockMvc.perform(get("/v3/api-docs")).andReturn()
				.getResponse().getContentAsString(StandardCharsets.UTF_8);

		assertThat(json).doesNotContain("passwordHash");
	}

	@Test
	@DisplayName("Story này chỉ thêm đúng một route nghiệp vụ dưới /api")
	void registersExactlyTheDocumentedRoute() {
		// springdoc registers its own handlers (/v3/api-docs, swagger-ui), so only business
		// routes under /api are compared.
		assertThat(mappedRoutes()).containsExactly("POST /api/v1/auth/register");
	}

	@Test
	@DisplayName("backend/.env được nạp qua spring.config.import, CORS đọc từ file")
	void loadsLocalEnvFile() {
		// The import is optional by design, so only assert what the file promises when it exists.
		if (Files.isRegularFile(Path.of(".env"))) {
			assertThat(this.environment.getProperty("DB_URL")).isNotBlank();
			assertThat(this.environment.getProperty("DB_USERNAME")).isEqualTo("hsk_app");
			assertThat(this.environment.getProperty("app.cors.allowed-origins"))
					.contains("http://localhost:5173");
		}
	}

	@Test
	@DisplayName("Render snapshot OpenAPI để đóng băng vào docs/api")
	void writeOpenApiSnapshot() throws Exception {
		String yaml = this.mockMvc.perform(get("/v3/api-docs.yaml")).andExpect(status().isOk()).andReturn()
				.getResponse().getContentAsString(StandardCharsets.UTF_8);

		// Pinned server url: without it the published contract says bare "http://localhost" and the
		// frontend has to guess the port.
		assertThat(yaml).contains("url: http://localhost:8080");
		// Media type must be concrete, or client generators emit "any" responses.
		assertThat(yaml).contains("application/json");

		Files.createDirectories(SNAPSHOT.getParent());
		Files.writeString(SNAPSHOT, yaml, StandardCharsets.UTF_8);
		assertThat(Files.readString(SNAPSHOT, StandardCharsets.UTF_8)).contains("/api/v1/auth/register");
	}

	/**
	 * Business routes only, as "METHOD /path". Spring Boot's error dispatch route
	 * ({@code /error}) and springdoc's own endpoints are filtered out, so a new handler under
	 * {@code /api} is what makes this assertion fail.
	 */
	private Set<String> mappedRoutes() {
		return this.handlerMapping.getHandlerMethods().entrySet().stream()
				.filter(entry -> entry.getValue().getBeanType().getPackageName().startsWith("com.hsk"))
				.flatMap(entry -> entry.getKey().getPatternValues().stream().filter(path -> path.startsWith("/api/"))
						.map(path -> entry.getKey().getMethodsCondition().getMethods().stream()
								.map(method -> method + " " + path)
								.findFirst().orElse("ANY " + path)))
				.collect(Collectors.toSet());
	}
}
