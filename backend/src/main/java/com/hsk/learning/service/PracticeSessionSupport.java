package com.hsk.learning.service;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.learning.domain.FlashcardResult;
import com.hsk.learning.domain.VocabLearningEntity;
import com.hsk.learning.domain.VocabPracticeSessionEntity;
import com.hsk.learning.dto.PracticeSessionHistoryItemDto;
import com.hsk.learning.repository.VocabLearningRepository;
import com.hsk.learning.repository.VocabPracticeSessionRepository;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Tiện ích dùng chung cho tất cả game luyện tập từ vựng (Quiz, Match, Writing, Typing, Dictation):
 * kiểm tra idempotency, cập nhật hàng loạt VocabLearningEntity, lưu phiên chơi và cộng XP.
 */
@Service
public class PracticeSessionSupport {

	public record VocabMasteryUpdate(Long vocabularyId, boolean remembered, boolean mastered) {}

	public record ResolvedSet(Long vocabSetId, String title) {}

	private final UserRepository userRepository;
	private final VocabularyRepository vocabularyRepository;
	private final VocabSetRepository vocabSetRepository;
	private final VocabLearningRepository vocabLearningRepository;
	private final VocabPracticeSessionRepository practiceSessionRepository;
	private final XpLevelService xpLevelService;

	public PracticeSessionSupport(
			UserRepository userRepository,
			VocabularyRepository vocabularyRepository,
			VocabSetRepository vocabSetRepository,
			VocabLearningRepository vocabLearningRepository,
			VocabPracticeSessionRepository practiceSessionRepository,
			XpLevelService xpLevelService) {
		this.userRepository = userRepository;
		this.vocabularyRepository = vocabularyRepository;
		this.vocabSetRepository = vocabSetRepository;
		this.vocabLearningRepository = vocabLearningRepository;
		this.practiceSessionRepository = practiceSessionRepository;
		this.xpLevelService = xpLevelService;
	}

	public UserEntity requireUser(Long currentUserId) {
		return userRepository.findById(currentUserId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	public String normalizeIdempotencyKey(String rawKey) {
		if (rawKey == null || rawKey.isBlank()) {
			return null;
		}
		return rawKey.trim();
	}

	public Optional<VocabPracticeSessionEntity> findExistingSession(Long userId, String normalizedIdempotencyKey) {
		if (normalizedIdempotencyKey == null) {
			return Optional.empty();
		}
		return practiceSessionRepository.findByUser_IdAndIdempotencyKey(userId, normalizedIdempotencyKey);
	}

	public String resolveVocabSetTitle(Long vocabSetId) {
		if (vocabSetId == null) {
			return "Tất cả bộ từ";
		}
		return vocabSetRepository.findById(vocabSetId)
				.map(VocabSetEntity::getTitle)
				.orElse("Bộ từ vựng");
	}

	public ResolvedSet resolveExistingVocabSet(Long requestedSetId) {
		if (requestedSetId == null) {
			return new ResolvedSet(null, "Tất cả bộ từ");
		}
		Optional<VocabSetEntity> setOpt = vocabSetRepository.findById(requestedSetId);
		if (setOpt.isPresent()) {
			return new ResolvedSet(setOpt.get().getId(), setOpt.get().getTitle());
		}
		return new ResolvedSet(null, "Tất cả bộ từ");
	}

	@Transactional
	public void syncVocabLearnings(UserEntity user, List<VocabMasteryUpdate> updates) {
		if (updates == null || updates.isEmpty()) {
			return;
		}
		Map<Long, VocabMasteryUpdate> deduplicated = new LinkedHashMap<>();
		for (VocabMasteryUpdate item : updates) {
			deduplicated.put(item.vocabularyId(), item);
		}

		Map<Long, VocabularyEntity> vocabMap = vocabularyRepository.findAllById(deduplicated.keySet())
				.stream()
				.collect(Collectors.toMap(VocabularyEntity::getId, v -> v));

		if (vocabMap.size() != deduplicated.size()) {
			throw new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND);
		}

		Map<Long, VocabLearningEntity> learningMap = vocabLearningRepository
				.findAllById_UserIdAndId_VocabularyIdIn(user.getId(), deduplicated.keySet())
				.stream()
				.collect(Collectors.toMap(vl -> vl.getId().getVocabularyId(), vl -> vl));

		List<VocabLearningEntity> toSave = new ArrayList<>(deduplicated.size());
		for (VocabMasteryUpdate update : deduplicated.values()) {
			FlashcardResult reviewResult = update.remembered() ? FlashcardResult.REMEMBERED : FlashcardResult.FORGOTTEN;
			VocabularyEntity vocab = vocabMap.get(update.vocabularyId());
			VocabLearningEntity learning = learningMap.get(update.vocabularyId());
			if (learning == null) {
				learning = new VocabLearningEntity(user, vocab, reviewResult);
				learning.setMastered(update.mastered());
			} else {
				learning.recordReview(reviewResult);
				learning.setMastered(update.mastered());
			}
			toSave.add(learning);
		}
		vocabLearningRepository.saveAll(toSave);
	}

	@Transactional
	public VocabPracticeSessionEntity recordSessionAndAwardXp(
			UserEntity user,
			Long requestedSetId,
			String gameType,
			String gameMode,
			int correctCount,
			int totalCount,
			int xpEarned,
			int durationSeconds,
			String normalizedIdempotencyKey,
			String xpSourceType,
			String xpSourcePrefix,
			String xpDescription) {
		ResolvedSet resolvedSet = resolveExistingVocabSet(requestedSetId);

		VocabPracticeSessionEntity session = new VocabPracticeSessionEntity(
				user,
				resolvedSet.vocabSetId(),
				resolvedSet.title(),
				gameType,
				gameMode,
				correctCount,
				totalCount,
				xpEarned,
				durationSeconds,
				normalizedIdempotencyKey
		);
		VocabPracticeSessionEntity savedSession = practiceSessionRepository.save(session);

		if (xpEarned > 0) {
			xpLevelService.awardXp(
					user,
					xpEarned,
					xpSourceType,
					xpSourcePrefix + savedSession.getId(),
					xpDescription
			);
		}
		return savedSession;
	}

	@Transactional(readOnly = true)
	public List<PracticeSessionHistoryItemDto> getPracticeHistory(Long currentUserId, int limit) {
		int safeLimit = Math.max(1, Math.min(limit, 30));
		return practiceSessionRepository
				.findByUser_IdOrderByCompletedAtDescIdDesc(currentUserId, PageRequest.of(0, safeLimit))
				.stream()
				.map(s -> {
					int acc = s.getTotalCount() > 0
							? (int) Math.round((s.getCorrectCount() * 100.0) / s.getTotalCount())
							: 0;
					return new PracticeSessionHistoryItemDto(
							s.getId(),
							s.getVocabSetId(),
							s.getVocabSetTitle(),
							s.getGameType(),
							s.getGameMode(),
							s.getCorrectCount(),
							s.getTotalCount(),
							acc,
							s.getXpEarned(),
							s.getDurationSeconds(),
							s.getCompletedAt()
					);
				})
				.toList();
	}

	public static int computeAccuracyPercent(int correctCount, int totalCount) {
		if (totalCount <= 0) {
			return 0;
		}
		return (int) Math.round((correctCount * 100.0) / totalCount);
	}
}
