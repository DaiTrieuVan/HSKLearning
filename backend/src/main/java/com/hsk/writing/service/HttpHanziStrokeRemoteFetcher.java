package com.hsk.writing.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Fetches MakeMeAHanzi / HanziWriter JSON stroke payloads over HTTPS with bounded
 * timeouts and strict SVG payload validation so missing DB characters populate lazily.
 */
@Component
public class HttpHanziStrokeRemoteFetcher implements HanziStrokeRemoteFetcher {

	private static final Logger log = LoggerFactory.getLogger(HttpHanziStrokeRemoteFetcher.class);
	private static final String DEFAULT_CDN_TEMPLATE = "https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/%s.json";
	private static final String DEFAULT_SOURCE = "MakeMeAHanzi / HanziWriter";
	private static final String DEFAULT_LICENSE = "MIT / Arphic PL";

	private final boolean enabled;
	private final String cdnUrlTemplate;
	private final HttpClient httpClient;
	private final ObjectMapper objectMapper;

	public HttpHanziStrokeRemoteFetcher(
			@Value("${app.writing.remote-stroke-fetch-enabled:true}") boolean enabled,
			@Value("${app.writing.remote-stroke-cdn-template:" + DEFAULT_CDN_TEMPLATE + "}") String cdnUrlTemplate) {
		this.enabled = enabled;
		this.cdnUrlTemplate = cdnUrlTemplate;
		this.httpClient = HttpClient.newBuilder()
				.connectTimeout(Duration.ofSeconds(3))
				.followRedirects(HttpClient.Redirect.NORMAL)
				.build();
		this.objectMapper = new ObjectMapper();
	}

	@Override
	public boolean isEnabled() {
		return enabled;
	}

	@Override
	public Optional<RemoteStrokePayload> fetchStrokeData(String singleHanzi) {
		if (!enabled || singleHanzi == null || singleHanzi.isBlank()) {
			return Optional.empty();
		}
		try {
			String encodedChar = URLEncoder.encode(singleHanzi, StandardCharsets.UTF_8);
			String url = String.format(cdnUrlTemplate, encodedChar);
			HttpRequest request = HttpRequest.newBuilder()
					.uri(URI.create(url))
					.timeout(Duration.ofSeconds(5))
					.header("Accept", "application/json")
					.GET()
					.build();

			HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
			if (response.statusCode() != 200 || response.body() == null || response.body().isBlank()) {
				return Optional.empty();
			}

			HanziWriterJson parsed = objectMapper.readValue(response.body(), HanziWriterJson.class);
			if (!isValidPayload(parsed)) {
				return Optional.empty();
			}

			return Optional.of(new RemoteStrokePayload(
					singleHanzi,
					parsed.strokes(),
					parsed.medians(),
					DEFAULT_SOURCE,
					DEFAULT_LICENSE
			));
		} catch (InterruptedException ex) {
			Thread.currentThread().interrupt();
			return Optional.empty();
		} catch (Exception ex) {
			log.debug("Could not fetch remote stroke data for '{}': {}", singleHanzi, ex.getMessage());
			return Optional.empty();
		}
	}

	private static boolean isValidPayload(HanziWriterJson payload) {
		if (payload == null || payload.strokes() == null || payload.medians() == null) {
			return false;
		}
		if (payload.strokes().isEmpty() || payload.strokes().size() != payload.medians().size()) {
			return false;
		}
		for (String path : payload.strokes()) {
			if (path == null || path.isBlank()) {
				return false;
			}
			String lower = path.toLowerCase();
			if (path.contains("<") || path.contains(">") || lower.contains("script")) {
				return false;
			}
		}
		return true;
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	private record HanziWriterJson(
			List<String> strokes,
			List<List<List<Integer>>> medians
	) {}
}

