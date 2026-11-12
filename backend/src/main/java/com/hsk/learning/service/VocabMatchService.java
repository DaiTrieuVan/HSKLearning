package com.hsk.learning.service;

import com.hsk.account.domain.UserEntity;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.learning.domain.VocabPracticeSessionEntity;
import com.hsk.learning.dto.MatchCardSideDto;
import com.hsk.learning.dto.MatchPairItemDto;
import com.hsk.learning.dto.MatchRoundDto;
import com.hsk.learning.dto.MatchSessionResponse;
import com.hsk.learning.dto.MatchSubmitRequest;
import com.hsk.learning.dto.MatchSubmitResponse;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VocabMatchService {

	public static final String MODE_MATCH_MEANING = "MATCH_MEANING";
	public static final String MODE_MATCH_PINYIN = "MATCH_PINYIN";
	private static final Set<String> VALID_MODES = Set.of(MODE_MATCH_MEANING, MODE_MATCH_PINYIN);

	public static final int MAX_PAIRS_PER_ROUND = 8;
	public static final int MAX_HEARTS = 5;
	private static final int XP_PER_CLEAN_MATCH = 2;
	private static final int XP_COMPLETION_BONUS = 10;

	private final FlashcardLearningService flashcardLearningService;
	private final PracticeSessionSupport practiceSessionSupport;

	public VocabMatchService(
			FlashcardLearningService flashcardLearningService,
			PracticeSessionSupport practiceSessionSupport) {
		this.flashcardLearningService = flashcardLearningService;
		this.practiceSessionSupport = practiceSessionSupport;
	}

	@Transactional(readOnly = true)
	public MatchSessionResponse generateMatchSession(
			Long currentUserId,
			Long lessonId,
			Long vocabSetId,
			String filterStatus,
			String order,
			Integer limit,
			String mode) {
		String normalizedMode = normalizeMode(mode);
		String vocabSetTitle = practiceSessionSupport.resolveVocabSetTitle(vocabSetId);

		List<VocabularyEntity> filtered = flashcardLearningService.findFilteredVocabularies(
				currentUserId, lessonId, vocabSetId, false, filterStatus, order, limit);

		List<VocabularyEntity> eligible = filtered.stream()
				.filter(v -> hasRequiredFields(v, normalizedMode))
				.toList();

		if (eligible.isEmpty()) {
			return new MatchSessionResponse(vocabSetId, vocabSetTitle, normalizedMode, 0, MAX_HEARTS, Collections.emptyList());
		}

		List<List<VocabularyEntity>> buckets = packCollisionFreeRounds(eligible, normalizedMode);
		List<MatchRoundDto> rounds = new ArrayList<>(buckets.size());
		for (int i = 0; i < buckets.size(); i++) {
			rounds.add(buildRound(i + 1, buckets.get(i), normalizedMode));
		}

		return new MatchSessionResponse(
				vocabSetId,
				vocabSetTitle,
				normalizedMode,
				eligible.size(),
				MAX_HEARTS,
				rounds
		);
	}

	@Transactional
	public MatchSubmitResponse submitMatch(Long currentUserId, MatchSubmitRequest request) {
		UserEntity user = practiceSessionSupport.requireUser(currentUserId);
		String normalizedMode = normalizeMode(request.mode());
		String idempotencyKey = practiceSessionSupport.normalizeIdempotencyKey(request.idempotencyKey());

		Optional<VocabPracticeSessionEntity> existing = practiceSessionSupport
				.findExistingSession(currentUserId, idempotencyKey);
		if (existing.isPresent()) {
			VocabPracticeSessionEntity prev = existing.get();
			int prevAccuracy = PracticeSessionSupport.computeAccuracyPercent(prev.getCorrectCount(), prev.getTotalCount());
			int baseXp = prev.getCorrectCount() * XP_PER_CLEAN_MATCH;
			int bonusXp = Math.max(0, prev.getXpEarned() - baseXp);
			return new MatchSubmitResponse(
					prev.getId(),
					prev.getCorrectCount(),
					prev.getTotalCount(),
					prevAccuracy,
					prev.getXpEarned(),
					baseXp,
					bonusXp,
					user.getTotalXp(),
					true,
					prev.getCompletedAt()
			);
		}

		List<PracticeSessionSupport.VocabMasteryUpdate> updates = new ArrayList<>(request.results().size());
		int cleanCorrectCount = 0;
		boolean allMatched = true;

		for (MatchSubmitRequest.MatchResultItemRequest item : request.results()) {
			if (!item.matched()) {
				allMatched = false;
			}
			boolean cleanlyMatched = item.matched() && item.mistakesCount() == 0;
			if (cleanlyMatched) {
				cleanCorrectCount++;
				updates.add(new PracticeSessionSupport.VocabMasteryUpdate(
						item.vocabularyId(),
						true,
						item.markMastered()
				));
			} else {
				updates.add(new PracticeSessionSupport.VocabMasteryUpdate(
						item.vocabularyId(),
						false,
						false
				));
			}
		}

		practiceSessionSupport.syncVocabLearnings(user, updates);

		int totalCount = request.results().size();
		int accuracyPercent = PracticeSessionSupport.computeAccuracyPercent(cleanCorrectCount, totalCount);
		boolean completedCleanly = allMatched && !request.timedOut() && request.remainingHearts() > 0;

		int baseXp = cleanCorrectCount * XP_PER_CLEAN_MATCH;
		int completionBonusXp = (cleanCorrectCount > 0 && completedCleanly) ? XP_COMPLETION_BONUS : 0;
		int xpEarned = baseXp + completionBonusXp;

		VocabPracticeSessionEntity savedSession = practiceSessionSupport.recordSessionAndAwardXp(
				user,
				request.vocabSetId(),
				"MATCH",
				normalizedMode,
				cleanCorrectCount,
				totalCount,
				xpEarned,
				request.durationSeconds(),
				idempotencyKey,
				"VOCAB_MATCH",
				"match-session:",
				"Luyện tập Nối từ (" + cleanCorrectCount + "/" + totalCount + " cặp đúng)"
		);

		return new MatchSubmitResponse(
				savedSession.getId(),
				cleanCorrectCount,
				totalCount,
				accuracyPercent,
				xpEarned,
				baseXp,
				completionBonusXp,
				user.getTotalXp(),
				false,
				savedSession.getCompletedAt()
		);
	}

	private String normalizeMode(String mode) {
		if (mode == null || mode.isBlank()) {
			return MODE_MATCH_MEANING;
		}
		String upper = mode.trim().toUpperCase(Locale.ROOT);
		if (!VALID_MODES.contains(upper)) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED);
		}
		return upper;
	}

	private boolean hasRequiredFields(VocabularyEntity v, String mode) {
		if (v.getHanzi() == null || v.getHanzi().isBlank()) {
			return false;
		}
		if (MODE_MATCH_PINYIN.equals(mode)) {
			return v.getPinyin() != null && !v.getPinyin().isBlank();
		}
		return v.getMeaning() != null && !v.getMeaning().isBlank();
	}

	/**
	 * Chia từ vựng thành từng lượt (tối đa 8 cặp/lượt) sao cho trong cùng 1 bảng
	 * không bao giờ xuất hiện 2 từ trùng chữ Hán hoặc trùng nhãn đáp án (Pinyin / Nghĩa).
	 */
	private List<List<VocabularyEntity>> packCollisionFreeRounds(List<VocabularyEntity> vocabs, String mode) {
		List<List<VocabularyEntity>> buckets = new ArrayList<>();
		List<Set<String>> usedLeftKeys = new ArrayList<>();
		List<Set<String>> usedRightKeys = new ArrayList<>();

		for (VocabularyEntity v : vocabs) {
			String leftKey = normalizeKey(v.getHanzi());
			String rightKey = normalizeKey(MODE_MATCH_PINYIN.equals(mode) ? v.getPinyin() : v.getMeaning());

			boolean placed = false;
			for (int i = 0; i < buckets.size(); i++) {
				if (buckets.get(i).size() < MAX_PAIRS_PER_ROUND
						&& !usedLeftKeys.get(i).contains(leftKey)
						&& !usedRightKeys.get(i).contains(rightKey)) {
					buckets.get(i).add(v);
					usedLeftKeys.get(i).add(leftKey);
					usedRightKeys.get(i).add(rightKey);
					placed = true;
					break;
				}
			}

			if (!placed) {
				List<VocabularyEntity> newBucket = new ArrayList<>();
				newBucket.add(v);
				buckets.add(newBucket);

				Set<String> leftSet = new HashSet<>();
				leftSet.add(leftKey);
				usedLeftKeys.add(leftSet);

				Set<String> rightSet = new HashSet<>();
				rightSet.add(rightKey);
				usedRightKeys.add(rightSet);
			}
		}

		return buckets;
	}

	private MatchRoundDto buildRound(int roundIndex, List<VocabularyEntity> items, String mode) {
		List<MatchPairItemDto> pairs = items.stream()
				.map(v -> new MatchPairItemDto(
						v.getId(),
						v.getHanzi(),
						v.getPinyin(),
						v.getMeaning(),
						v.getPartOfSpeech(),
						v.getAudioUrl()
				))
				.toList();

		boolean isMeaningMode = MODE_MATCH_MEANING.equals(mode);

		List<MatchCardSideDto> leftCards = new ArrayList<>(items.size());
		List<MatchCardSideDto> rightCards = new ArrayList<>(items.size());

		for (VocabularyEntity v : items) {
			leftCards.add(new MatchCardSideDto(
					v.getId(),
					v.getHanzi().trim(),
					isMeaningMode ? v.getPinyin() : null
			));
			rightCards.add(new MatchCardSideDto(
					v.getId(),
					isMeaningMode ? v.getMeaning().trim() : v.getPinyin().trim(),
					null
			));
		}

		Collections.shuffle(leftCards);
		Collections.shuffle(rightCards);

		// Tránh trường hợp 2 cột xếp thẳng hàng 1-1 y hệt nhau khi có >= 2 thẻ
		if (leftCards.size() >= 2 && isExactParallelOrder(leftCards, rightCards)) {
			Collections.rotate(rightCards, 1);
		}

		return new MatchRoundDto(roundIndex, pairs.size(), pairs, leftCards, rightCards);
	}

	private boolean isExactParallelOrder(List<MatchCardSideDto> left, List<MatchCardSideDto> right) {
		for (int i = 0; i < left.size(); i++) {
			if (!Objects.equals(left.get(i).vocabularyId(), right.get(i).vocabularyId())) {
				return false;
			}
		}
		return true;
	}

	private String normalizeKey(String value) {
		return value != null ? value.trim().toLowerCase(Locale.ROOT) : "";
	}
}
