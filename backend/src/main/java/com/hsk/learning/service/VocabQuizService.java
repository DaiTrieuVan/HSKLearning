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
import com.hsk.learning.dto.QuizOptionDto;
import com.hsk.learning.dto.QuizQuestionDto;
import com.hsk.learning.dto.QuizSessionResponse;
import com.hsk.learning.dto.QuizSubmitRequest;
import com.hsk.learning.dto.QuizSubmitResponse;
import com.hsk.learning.repository.VocabLearningRepository;
import com.hsk.learning.repository.VocabPracticeSessionRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VocabQuizService {

	private static final String MODE_HANZI_TO_MEANING = "HANZI_TO_MEANING";
	private static final String MODE_MEANING_TO_HANZI = "MEANING_TO_HANZI";
	private static final String MODE_MIXED = "MIXED";
	private static final String MODE_CONTEXT = "CONTEXT";
	private static final Set<String> VALID_MODES = Set.of(
			MODE_HANZI_TO_MEANING,
			MODE_MEANING_TO_HANZI,
			MODE_MIXED,
			MODE_CONTEXT
	);

	// Tách câu ví dụ tiếng Trung và phần dịch trong ngoặc khi người dùng lưu gộp trong exampleSentence
	private static final Pattern TRAILING_TRANSLATION_PATTERN =
			Pattern.compile("^(.*?)[\\s]*[（(]([^()（）]{3,})[)）]\\s*$");

	private static final int DISTRACTOR_COUNT = 3;
	private static final int XP_PER_CORRECT_ANSWER = 2;
	private static final int XP_COMPLETION_BONUS = 10;
	private static final int COMPLETION_THRESHOLD_PERCENT = 50;

	private final FlashcardLearningService flashcardLearningService;
	private final VocabularyRepository vocabularyRepository;
	private final VocabSetRepository vocabSetRepository;
	private final VocabLearningRepository vocabLearningRepository;
	private final VocabPracticeSessionRepository practiceSessionRepository;
	private final UserRepository userRepository;
	private final XpLevelService xpLevelService;

	public VocabQuizService(
			FlashcardLearningService flashcardLearningService,
			VocabularyRepository vocabularyRepository,
			VocabSetRepository vocabSetRepository,
			VocabLearningRepository vocabLearningRepository,
			VocabPracticeSessionRepository practiceSessionRepository,
			UserRepository userRepository,
			XpLevelService xpLevelService) {
		this.flashcardLearningService = flashcardLearningService;
		this.vocabularyRepository = vocabularyRepository;
		this.vocabSetRepository = vocabSetRepository;
		this.vocabLearningRepository = vocabLearningRepository;
		this.practiceSessionRepository = practiceSessionRepository;
		this.userRepository = userRepository;
		this.xpLevelService = xpLevelService;
	}

	@Transactional(readOnly = true)
	public QuizSessionResponse generateQuiz(
			Long currentUserId,
			Long lessonId,
			Long vocabSetId,
			String filterStatus,
			String order,
			Integer limit,
			String mode) {
		String normalizedMode = normalizeMode(mode);
		String vocabSetTitle = resolveVocabSetTitle(vocabSetId);

		List<VocabularyEntity> targets = flashcardLearningService.findFilteredVocabularies(
				currentUserId, lessonId, vocabSetId, false, filterStatus, order, limit);

		if (targets.isEmpty()) {
			return new QuizSessionResponse(vocabSetId, vocabSetTitle, normalizedMode, 0, Collections.emptyList());
		}

		List<List<VocabularyEntity>> distractorTiers = buildDistractorTiers(currentUserId, lessonId, vocabSetId);
		List<String> mixedModes = buildMixedModePlan(targets.size());

		List<QuizQuestionDto> questions = new ArrayList<>(targets.size());
		for (int i = 0; i < targets.size(); i++) {
			VocabularyEntity target = targets.get(i);
			String plannedMode = MODE_MIXED.equals(normalizedMode) ? mixedModes.get(i) : normalizedMode;
			questions.add(buildQuestion(target, plannedMode, distractorTiers));
		}

		return new QuizSessionResponse(vocabSetId, vocabSetTitle, normalizedMode, questions.size(), questions);
	}

	@Transactional
	public QuizSubmitResponse submitQuiz(Long currentUserId, QuizSubmitRequest request) {
		UserEntity user = userRepository.findById(currentUserId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		String normalizedMode = normalizeMode(request.mode());
		String idempotencyKey = (request.idempotencyKey() != null && !request.idempotencyKey().isBlank())
				? request.idempotencyKey().trim()
				: null;

		if (idempotencyKey != null) {
			Optional<VocabPracticeSessionEntity> existing = practiceSessionRepository
					.findByUser_IdAndIdempotencyKey(currentUserId, idempotencyKey);
			if (existing.isPresent()) {
				VocabPracticeSessionEntity prev = existing.get();
				int prevAccuracy = prev.getTotalCount() > 0
						? (int) Math.round((prev.getCorrectCount() * 100.0) / prev.getTotalCount())
						: 0;
				return new QuizSubmitResponse(
						prev.getId(),
						prev.getCorrectCount(),
						prev.getTotalCount(),
						prevAccuracy,
						prev.getXpEarned(),
						user.getTotalXp(),
						true,
						prev.getCompletedAt()
				);
			}
		}

		// Gom ID duy nhất để batch-fetch tránh N+1 query
		Map<Long, Boolean> latestResultByVocab = new LinkedHashMap<>();
		for (QuizSubmitRequest.QuizAnswerItemRequest answer : request.answers()) {
			latestResultByVocab.put(answer.vocabularyId(), answer.correct());
		}

		Map<Long, VocabularyEntity> vocabMap = vocabularyRepository.findAllById(latestResultByVocab.keySet())
				.stream()
				.collect(Collectors.toMap(VocabularyEntity::getId, v -> v));

		if (vocabMap.size() != latestResultByVocab.size()) {
			throw new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND);
		}

		Map<Long, VocabLearningEntity> learningMap = vocabLearningRepository
				.findAllById_UserIdAndId_VocabularyIdIn(currentUserId, latestResultByVocab.keySet())
				.stream()
				.collect(Collectors.toMap(vl -> vl.getId().getVocabularyId(), vl -> vl));

		List<VocabLearningEntity> learningsToSave = new ArrayList<>(latestResultByVocab.size());
		for (Map.Entry<Long, Boolean> entry : latestResultByVocab.entrySet()) {
			Long vocabId = entry.getKey();
			boolean correct = Boolean.TRUE.equals(entry.getValue());
			FlashcardResult reviewResult = correct ? FlashcardResult.REMEMBERED : FlashcardResult.FORGOTTEN;

			VocabularyEntity vocab = vocabMap.get(vocabId);
			VocabLearningEntity learning = learningMap.get(vocabId);
			if (learning == null) {
				learning = new VocabLearningEntity(user, vocab, reviewResult);
				learning.setMastered(correct);
			} else {
				learning.recordReview(reviewResult);
				learning.setMastered(correct);
			}
			learningsToSave.add(learning);
		}
		vocabLearningRepository.saveAll(learningsToSave);

		int totalCount = request.answers().size();
		int correctCount = (int) request.answers().stream().filter(QuizSubmitRequest.QuizAnswerItemRequest::correct).count();
		int accuracyPercent = totalCount > 0 ? (int) Math.round((correctCount * 100.0) / totalCount) : 0;

		int xpEarned = 0;
		if (correctCount > 0) {
			xpEarned = correctCount * XP_PER_CORRECT_ANSWER;
			if (accuracyPercent >= COMPLETION_THRESHOLD_PERCENT) {
				xpEarned += XP_COMPLETION_BONUS;
			}
		}

		Long resolvedSetId = null;
		String resolvedSetTitle = "Tất cả bộ từ";
		if (request.vocabSetId() != null) {
			Optional<VocabSetEntity> setOpt = vocabSetRepository.findById(request.vocabSetId());
			if (setOpt.isPresent()) {
				resolvedSetId = setOpt.get().getId();
				resolvedSetTitle = setOpt.get().getTitle();
			}
		}

		VocabPracticeSessionEntity session = new VocabPracticeSessionEntity(
				user,
				resolvedSetId,
				resolvedSetTitle,
				"QUIZ",
				normalizedMode,
				correctCount,
				totalCount,
				xpEarned,
				request.durationSeconds(),
				idempotencyKey
		);
		VocabPracticeSessionEntity savedSession = practiceSessionRepository.save(session);

		if (xpEarned > 0) {
			xpLevelService.awardXp(
					user,
					xpEarned,
					"VOCAB_QUIZ",
					"quiz-session:" + savedSession.getId(),
					"Luyện tập Trắc nghiệm (" + correctCount + "/" + totalCount + " câu đúng)"
			);
		}

		return new QuizSubmitResponse(
				savedSession.getId(),
				correctCount,
				totalCount,
				accuracyPercent,
				xpEarned,
				user.getTotalXp(),
				false,
				savedSession.getCompletedAt()
		);
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

	private String normalizeMode(String mode) {
		if (mode == null || mode.isBlank()) {
			return MODE_HANZI_TO_MEANING;
		}
		String upper = mode.trim().toUpperCase(Locale.ROOT);
		if (!VALID_MODES.contains(upper)) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED);
		}
		return upper;
	}

	private String resolveVocabSetTitle(Long vocabSetId) {
		if (vocabSetId == null) {
			return "Tất cả bộ từ";
		}
		return vocabSetRepository.findById(vocabSetId)
				.map(VocabSetEntity::getTitle)
				.orElse("Bộ từ vựng");
	}

	private List<String> buildMixedModePlan(int count) {
		List<String> plan = new ArrayList<>(count);
		for (int i = 0; i < count; i++) {
			plan.add(i % 2 == 0 ? MODE_HANZI_TO_MEANING : MODE_MEANING_TO_HANZI);
		}
		Collections.shuffle(plan);
		return plan;
	}

	/**
	 * Chuẩn bị các tầng từ vựng làm đáp án nhiễu theo thứ tự ưu tiên:
	 * Tầng 1: Cùng bộ từ/bài học -> Tầng 2: Các bộ từ khác của học sinh -> Tầng 3: Kho từ HSK chung.
	 */
	private List<List<VocabularyEntity>> buildDistractorTiers(Long userId, Long lessonId, Long vocabSetId) {
		List<List<VocabularyEntity>> tiers = new ArrayList<>();
		List<VocabularyEntity> primaryPool = new ArrayList<>(
				flashcardLearningService.getAccessibleVocabularies(userId, lessonId, vocabSetId)
		);
		tiers.add(primaryPool);

		if (primaryPool.size() < 8 && (lessonId != null || vocabSetId != null)) {
			tiers.add(new ArrayList<>(flashcardLearningService.getAccessibleVocabularies(userId, null, null)));
		}

		int totalCount = tiers.stream().mapToInt(List::size).sum();
		if (totalCount < 12) {
			tiers.add(new ArrayList<>(
					vocabularyRepository.findAllByOwnerIdIsNullAndHiddenFalseOrderByIdAsc(PageRequest.of(0, 60))
			));
		}
		return tiers;
	}

	private QuizQuestionDto buildQuestion(
			VocabularyEntity target,
			String plannedMode,
			List<List<VocabularyEntity>> distractorTiers) {
		ExampleParts exParts = parseExample(target);
		String effectiveMode = plannedMode;
		String maskedSentence = null;

		if (MODE_CONTEXT.equals(plannedMode)) {
			String hanzi = target.getHanzi() != null ? target.getHanzi().trim() : "";
			if (exParts.chineseSentence() != null && !hanzi.isBlank() && exParts.chineseSentence().contains(hanzi)) {
				maskedSentence = exParts.chineseSentence().replace(hanzi, " ____ ").replaceAll("\\s{2,}", " ").trim();
			} else {
				// Phương án A đã chốt: tự fallback sang Nghĩa -> Từ khi từ chưa có ví dụ chứa chính xác hanzi
				effectiveMode = MODE_MEANING_TO_HANZI;
			}
		}

		List<QuizOptionDto> options = buildOptions(target, effectiveMode, distractorTiers);

		return new QuizQuestionDto(
				target.getId(),
				effectiveMode,
				target.getHanzi(),
				target.getPinyin(),
				target.getMeaning(),
				target.getPartOfSpeech(),
				target.getAudioUrl(),
				exParts.chineseSentence(),
				target.getExamplePinyin(),
				exParts.vietnameseMeaning(),
				maskedSentence,
				options
		);
	}

	private List<QuizOptionDto> buildOptions(
			VocabularyEntity target,
			String effectiveMode,
			List<List<VocabularyEntity>> distractorTiers) {
		boolean showMeaningAsOption = MODE_HANZI_TO_MEANING.equals(effectiveMode);
		List<QuizOptionDto> options = new ArrayList<>(4);

		options.add(new QuizOptionDto(
				target.getId(),
				showMeaningAsOption ? target.getMeaning() : target.getHanzi(),
				showMeaningAsOption ? null : target.getPinyin(),
				true
		));

		Set<Long> usedIds = new HashSet<>();
		usedIds.add(target.getId());

		Set<String> usedLabels = new HashSet<>();
		String targetKey = normalizeOptionKey(showMeaningAsOption ? target.getMeaning() : target.getHanzi());
		if (targetKey != null) {
			usedLabels.add(targetKey);
		}

		for (List<VocabularyEntity> tier : distractorTiers) {
			if (options.size() >= DISTRACTOR_COUNT + 1) {
				break;
			}
			List<VocabularyEntity> shuffled = new ArrayList<>(tier);
			Collections.shuffle(shuffled);
			for (VocabularyEntity candidate : shuffled) {
				if (options.size() >= DISTRACTOR_COUNT + 1) {
					break;
				}
				if (usedIds.contains(candidate.getId())) {
					continue;
				}
				String rawLabel = showMeaningAsOption ? candidate.getMeaning() : candidate.getHanzi();
				String normKey = normalizeOptionKey(rawLabel);
				if (normKey == null || usedLabels.contains(normKey)) {
					continue;
				}
				usedIds.add(candidate.getId());
				usedLabels.add(normKey);
				options.add(new QuizOptionDto(
						candidate.getId(),
						rawLabel.trim(),
						showMeaningAsOption ? null : candidate.getPinyin(),
						false
				));
			}
		}

		Collections.shuffle(options);
		return options;
	}

	private String normalizeOptionKey(String raw) {
		if (raw == null || raw.isBlank()) {
			return null;
		}
		return raw.trim().toLowerCase(Locale.ROOT);
	}

	private ExampleParts parseExample(VocabularyEntity vocab) {
		String rawSentence = vocab.getExampleSentence() != null ? vocab.getExampleSentence().trim() : null;
		String rawMeaning = vocab.getExampleMeaning() != null ? vocab.getExampleMeaning().trim() : null;
		if (rawSentence != null && rawSentence.isBlank()) {
			rawSentence = null;
		}
		if (rawMeaning != null && rawMeaning.isBlank()) {
			rawMeaning = null;
		}

		if (rawSentence != null && rawMeaning == null) {
			Matcher matcher = TRAILING_TRANSLATION_PATTERN.matcher(rawSentence);
			if (matcher.matches()) {
				String zhPart = matcher.group(1).trim();
				String viPart = matcher.group(2).trim();
				if (!zhPart.isEmpty()) {
					return new ExampleParts(zhPart, viPart);
				}
			}
		}
		return new ExampleParts(rawSentence, rawMeaning);
	}

	private record ExampleParts(String chineseSentence, String vietnameseMeaning) {}
}
