package com.hsk.learning.service;

import com.hsk.account.domain.UserEntity;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.learning.domain.VocabPracticeSessionEntity;
import com.hsk.learning.dto.WritingCharStrokeDto;
import com.hsk.learning.dto.WritingSessionResponse;
import com.hsk.learning.dto.WritingSubmitRequest;
import com.hsk.learning.dto.WritingSubmitResponse;
import com.hsk.learning.dto.WritingWordItemDto;
import com.hsk.writing.dto.HanziStrokeDetailResponse;
import com.hsk.writing.service.HanziWritingService;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Generates Hanzi writing practice sessions (TRACE / RECALL / PDF) and records
 * mastery + XP outcomes into {@code vocab_learning} and {@code vocab_practice_sessions}.
 */
@Service
public class VocabWritingService {

	public static final String MODE_TRACE = "TRACE";
	public static final String MODE_RECALL = "RECALL";
	public static final String MODE_PDF = "PDF";

	private static final Set<String> VALID_GENERATE_MODES = Set.of(MODE_TRACE, MODE_RECALL, MODE_PDF);
	private static final Set<String> VALID_SUBMIT_MODES = Set.of(MODE_TRACE, MODE_RECALL);

	public static final int MAX_PDF_WORDS = 100;
	private static final int XP_PER_CLEAN_WORD = 2;
	private static final int XP_COMPLETION_BONUS = 10;
	private static final int COMPLETION_THRESHOLD_PERCENT = 50;

	private final FlashcardLearningService flashcardLearningService;
	private final PracticeSessionSupport practiceSessionSupport;
	private final HanziWritingService hanziWritingService;

	public VocabWritingService(
			FlashcardLearningService flashcardLearningService,
			PracticeSessionSupport practiceSessionSupport,
			HanziWritingService hanziWritingService) {
		this.flashcardLearningService = flashcardLearningService;
		this.practiceSessionSupport = practiceSessionSupport;
		this.hanziWritingService = hanziWritingService;
	}

	/**
	 * Builds a writing session outside a holding DB transaction so batch stroke resolution
	 * never holds DB connections during lazy remote MakeMeAHanzi caching.
	 */
	public WritingSessionResponse generateWritingSession(
			Long currentUserId,
			Long lessonId,
			Long vocabSetId,
			String filterStatus,
			String order,
			Integer limit,
			String mode) {
		String normalizedMode = normalizeMode(mode, VALID_GENERATE_MODES);
		String vocabSetTitle = practiceSessionSupport.resolveVocabSetTitle(vocabSetId);

		Integer effectiveLimit = limit;
		if (MODE_PDF.equals(normalizedMode)) {
			effectiveLimit = (limit != null) ? Math.min(Math.max(1, limit), MAX_PDF_WORDS) : MAX_PDF_WORDS;
		}

		List<VocabularyEntity> filtered = flashcardLearningService.findFilteredVocabularies(
				currentUserId, lessonId, vocabSetId, false, filterStatus, order, effectiveLimit);

		List<WordCharacters> wordCharsList = new ArrayList<>(filtered.size());
		Set<String> uniqueHanChars = new LinkedHashSet<>();
		for (VocabularyEntity vocab : filtered) {
			List<String> hanChars = extractHanCharacters(vocab.getHanzi());
			if (!hanChars.isEmpty()) {
				wordCharsList.add(new WordCharacters(vocab, hanChars));
				uniqueHanChars.addAll(hanChars);
			}
		}

		if (wordCharsList.isEmpty()) {
			return new WritingSessionResponse(vocabSetId, vocabSetTitle, normalizedMode, 0, Collections.emptyList());
		}

		Map<String, HanziStrokeDetailResponse> strokeMap = hanziWritingService.resolveStrokesBatch(uniqueHanChars);

		List<WritingWordItemDto> words = new ArrayList<>(wordCharsList.size());
		for (WordCharacters entry : wordCharsList) {
			VocabularyEntity vocab = entry.vocab();
			List<WritingCharStrokeDto> charDtos = new ArrayList<>(entry.chars().size());
			for (String ch : entry.chars()) {
				HanziStrokeDetailResponse detail = strokeMap.get(ch);
				if (detail != null) {
					charDtos.add(new WritingCharStrokeDto(
							ch,
							detail.strokeCount(),
							detail.strokes(),
							detail.medians(),
							true
					));
				} else {
					charDtos.add(new WritingCharStrokeDto(
							ch,
							0,
							Collections.emptyList(),
							Collections.emptyList(),
							false
					));
				}
			}
			words.add(new WritingWordItemDto(
					vocab.getId(),
					vocab.getHanzi(),
					vocab.getPinyin(),
					vocab.getMeaning(),
					vocab.getPartOfSpeech(),
					vocab.getAudioUrl(),
					vocab.getExampleSentence(),
					vocab.getExamplePinyin(),
					vocab.getExampleMeaning(),
					charDtos
			));
		}

		return new WritingSessionResponse(
				vocabSetId,
				vocabSetTitle,
				normalizedMode,
				words.size(),
				words
		);
	}

	@Transactional
	public WritingSubmitResponse submitWriting(Long currentUserId, WritingSubmitRequest request) {
		UserEntity user = practiceSessionSupport.requireUser(currentUserId);
		String normalizedMode = normalizeMode(request.mode(), VALID_SUBMIT_MODES);
		String idempotencyKey = practiceSessionSupport.normalizeIdempotencyKey(request.idempotencyKey());

		Optional<VocabPracticeSessionEntity> existing = practiceSessionSupport
				.findExistingSession(currentUserId, idempotencyKey);
		if (existing.isPresent()) {
			VocabPracticeSessionEntity prev = existing.get();
			int prevAccuracy = PracticeSessionSupport.computeAccuracyPercent(prev.getCorrectCount(), prev.getTotalCount());
			int baseXp = prev.getCorrectCount() * XP_PER_CLEAN_WORD;
			int bonusXp = Math.max(0, prev.getXpEarned() - baseXp);
			return new WritingSubmitResponse(
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

		for (WritingSubmitRequest.WritingResultItemRequest item : request.results()) {
			if (item.completedCleanly()) {
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
		int baseXp = cleanCorrectCount * XP_PER_CLEAN_WORD;
		int completionBonusXp = (cleanCorrectCount > 0 && accuracyPercent >= COMPLETION_THRESHOLD_PERCENT)
				? XP_COMPLETION_BONUS
				: 0;
		int xpEarned = baseXp + completionBonusXp;

		String modeLabel = MODE_RECALL.equals(normalizedMode) ? "Viết nhớ" : "Đồ nét";
		VocabPracticeSessionEntity savedSession = practiceSessionSupport.recordSessionAndAwardXp(
				user,
				request.vocabSetId(),
				"WRITING",
				normalizedMode,
				cleanCorrectCount,
				totalCount,
				xpEarned,
				request.durationSeconds(),
				idempotencyKey,
				"VOCAB_WRITING",
				"writing-session:",
				"Luyện tập Viết chữ · " + modeLabel + " (" + cleanCorrectCount + "/" + totalCount + " từ đạt)"
		);

		return new WritingSubmitResponse(
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

	private static String normalizeMode(String mode, Set<String> allowedModes) {
		if (mode == null || mode.isBlank()) {
			return MODE_TRACE;
		}
		String upper = mode.trim().toUpperCase(Locale.ROOT);
		if (!allowedModes.contains(upper)) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED, "Chế độ viết chữ không hợp lệ");
		}
		return upper;
	}

	private static List<String> extractHanCharacters(String rawHanzi) {
		if (rawHanzi == null || rawHanzi.isBlank()) {
			return Collections.emptyList();
		}
		List<String> chars = new ArrayList<>();
		int length = rawHanzi.length();
		for (int offset = 0; offset < length; ) {
			int cp = rawHanzi.codePointAt(offset);
			if (Character.UnicodeScript.of(cp) == Character.UnicodeScript.HAN) {
				chars.add(new String(Character.toChars(cp)));
			}
			offset += Character.charCount(cp);
		}
		return chars;
	}

	private record WordCharacters(VocabularyEntity vocab, List<String> chars) {}
}

