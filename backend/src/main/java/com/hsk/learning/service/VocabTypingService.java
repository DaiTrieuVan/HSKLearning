package com.hsk.learning.service;

import com.hsk.account.domain.UserEntity;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.learning.domain.VocabPracticeSessionEntity;
import com.hsk.learning.dto.TypingSessionResponse;
import com.hsk.learning.dto.TypingSubmitRequest;
import com.hsk.learning.dto.TypingSubmitResponse;
import com.hsk.learning.dto.TypingWordItemDto;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Generates typing practice sessions (WORD / PINYIN) and records mastery + XP outcomes
 * into {@code vocab_learning} and {@code vocab_practice_sessions}.
 */
@Service
public class VocabTypingService {

	public static final String MODE_WORD = "WORD";
	public static final String MODE_PINYIN = "PINYIN";
	private static final Set<String> VALID_MODES = Set.of(MODE_WORD, MODE_PINYIN);

	private static final int XP_PER_CORRECT_WORD = 2;
	private static final int XP_COMPLETION_BONUS = 10;
	private static final int COMPLETION_THRESHOLD_PERCENT = 50;

	private final FlashcardLearningService flashcardLearningService;
	private final PracticeSessionSupport practiceSessionSupport;

	public VocabTypingService(
			FlashcardLearningService flashcardLearningService,
			PracticeSessionSupport practiceSessionSupport) {
		this.flashcardLearningService = flashcardLearningService;
		this.practiceSessionSupport = practiceSessionSupport;
	}

	@Transactional(readOnly = true)
	public TypingSessionResponse generateTypingSession(
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

		List<TypingWordItemDto> items = filtered.stream()
				.filter(vocab -> hasRequiredFields(vocab, normalizedMode))
				.map(vocab -> {
					PracticeSessionSupport.ParsedExample example = PracticeSessionSupport.parseExample(vocab);
					return new TypingWordItemDto(
							vocab.getId(),
							vocab.getHanzi(),
							vocab.getPinyin(),
							vocab.getPinyinSearch(),
							vocab.getMeaning(),
							vocab.getPartOfSpeech(),
							vocab.getAudioUrl(),
							example.chineseSentence(),
							example.maskedSentence(),
							vocab.getExamplePinyin(),
							example.vietnameseMeaning()
					);
				})
				.toList();

		if (items.isEmpty()) {
			return new TypingSessionResponse(vocabSetId, vocabSetTitle, normalizedMode, 0, Collections.emptyList());
		}

		return new TypingSessionResponse(vocabSetId, vocabSetTitle, normalizedMode, items.size(), items);
	}

	@Transactional
	public TypingSubmitResponse submitTyping(Long currentUserId, TypingSubmitRequest request) {
		UserEntity user = practiceSessionSupport.requireUser(currentUserId);
		String normalizedMode = normalizeMode(request.mode());
		String idempotencyKey = practiceSessionSupport.normalizeIdempotencyKey(request.idempotencyKey());

		Optional<VocabPracticeSessionEntity> existing = practiceSessionSupport
				.findExistingSession(currentUserId, idempotencyKey);
		if (existing.isPresent()) {
			VocabPracticeSessionEntity prev = existing.get();
			int prevAccuracy = PracticeSessionSupport.computeAccuracyPercent(prev.getCorrectCount(), prev.getTotalCount());
			int baseXp = prev.getCorrectCount() * XP_PER_CORRECT_WORD;
			int bonusXp = Math.max(0, prev.getXpEarned() - baseXp);
			return new TypingSubmitResponse(
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
		int correctCount = 0;

		for (TypingSubmitRequest.TypingResultItemRequest item : request.results()) {
			if (item.correct()) {
				correctCount++;
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
		int accuracyPercent = PracticeSessionSupport.computeAccuracyPercent(correctCount, totalCount);
		int baseXp = correctCount * XP_PER_CORRECT_WORD;
		int completionBonusXp = (correctCount > 0 && accuracyPercent >= COMPLETION_THRESHOLD_PERCENT)
				? XP_COMPLETION_BONUS
				: 0;
		int xpEarned = baseXp + completionBonusXp;

		VocabPracticeSessionEntity savedSession = practiceSessionSupport.recordSessionAndAwardXp(
				user,
				request.vocabSetId(),
				"TYPING",
				"TYPE_" + normalizedMode,
				correctCount,
				totalCount,
				xpEarned,
				request.durationSeconds(),
				idempotencyKey,
				"VOCAB_TYPING",
				"typing-session:",
				"Luyện tập Gõ từ (" + correctCount + "/" + totalCount + " câu đúng)"
		);

		return new TypingSubmitResponse(
				savedSession.getId(),
				correctCount,
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
			return MODE_WORD;
		}
		String upper = mode.trim().toUpperCase(Locale.ROOT);
		if (!VALID_MODES.contains(upper)) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED);
		}
		return upper;
	}

	private boolean hasRequiredFields(VocabularyEntity vocab, String mode) {
		if (vocab.getHanzi() == null || vocab.getHanzi().isBlank()) {
			return false;
		}
		if (MODE_PINYIN.equals(mode)) {
			return vocab.getPinyin() != null && !vocab.getPinyin().isBlank();
		}
		return vocab.getMeaning() != null && !vocab.getMeaning().isBlank();
	}
}
