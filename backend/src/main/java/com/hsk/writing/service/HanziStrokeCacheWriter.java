package com.hsk.writing.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.writing.domain.HanziStrokeDataEntity;
import com.hsk.writing.repository.HanziStrokeDataRepository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * Isolates short database read/write transactions for cached Hanzi stroke payloads
 * so external fetches never hold database locks or connections.
 */
@Service
public class HanziStrokeCacheWriter {

	private static final Logger log = LoggerFactory.getLogger(HanziStrokeCacheWriter.class);

	private final HanziStrokeDataRepository hanziStrokeDataRepository;
	private final ObjectMapper objectMapper;

	public HanziStrokeCacheWriter(HanziStrokeDataRepository hanziStrokeDataRepository) {
		this.hanziStrokeDataRepository = hanziStrokeDataRepository;
		this.objectMapper = new ObjectMapper();
	}

	@Transactional(readOnly = true)
	public Optional<HanziStrokeDataEntity> findByHanzi(String hanzi) {
		return hanziStrokeDataRepository.findByHanzi(hanzi);
	}

	@Transactional(readOnly = true)
	public List<HanziStrokeDataEntity> findByHanziIn(Collection<String> hanzis) {
		return hanziStrokeDataRepository.findByHanziIn(hanzis);
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public HanziStrokeDataEntity saveIfAbsent(HanziStrokeRemoteFetcher.RemoteStrokePayload payload) {
		Optional<HanziStrokeDataEntity> existing = hanziStrokeDataRepository.findByHanzi(payload.hanzi());
		if (existing.isPresent()) {
			return existing.get();
		}
		try {
			String strokesJson = objectMapper.writeValueAsString(payload.strokes());
			String mediansJson = objectMapper.writeValueAsString(payload.medians());
			HanziStrokeDataEntity entity = new HanziStrokeDataEntity(
					payload.hanzi(),
					payload.strokes().size(),
					strokesJson,
					mediansJson,
					payload.source(),
					payload.license()
			);
			return hanziStrokeDataRepository.saveAndFlush(entity);
		} catch (Exception ex) {
			log.debug("Failed to cache stroke data for '{}': {}", payload.hanzi(), ex.getMessage());
			throw new IllegalStateException("Could not persist cached stroke payload", ex);
		}
	}
}

