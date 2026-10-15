package com.hsk.learning.service;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.LessonEntity;
import com.hsk.content.domain.LessonVocabularyEntity;
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.domain.VocabSetItemEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.learning.domain.FlashcardResult;
import com.hsk.learning.domain.VocabLearningEntity;
import com.hsk.learning.dto.FlashcardCardResponse;
import com.hsk.learning.dto.FlashcardReviewResponse;
import com.hsk.learning.dto.FlashcardSessionSummaryResponse;
import com.hsk.learning.dto.ReviewFlashcardCommand;
import com.hsk.learning.repository.VocabLearningRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FlashcardLearningService {

	private final VocabLearningRepository vocabLearningRepository;
	private final LessonVocabularyRepository lessonVocabularyRepository;
	private final VocabSetItemRepository vocabSetItemRepository;
	private final VocabularyRepository vocabularyRepository;
	private final UserRepository userRepository;
	private final LessonRepository lessonRepository;
	private final VocabSetRepository vocabSetRepository;

	public FlashcardLearningService(
			VocabLearningRepository vocabLearningRepository,
			LessonVocabularyRepository lessonVocabularyRepository,
			VocabSetItemRepository vocabSetItemRepository,
			VocabularyRepository vocabularyRepository,
			UserRepository userRepository,
			LessonRepository lessonRepository,
			VocabSetRepository vocabSetRepository) {
		this.vocabLearningRepository = vocabLearningRepository;
		this.lessonVocabularyRepository = lessonVocabularyRepository;
		this.vocabSetItemRepository = vocabSetItemRepository;
		this.vocabularyRepository = vocabularyRepository;
		this.userRepository = userRepository;
		this.lessonRepository = lessonRepository;
		this.vocabSetRepository = vocabSetRepository;
	}

	@Transactional(readOnly = true)
	public List<FlashcardCardResponse> getFlashcards(Long currentUserId, Long lessonId, Long vocabSetId, Boolean onlyForgotten) {
		List<VocabularyEntity> vocabs = getAccessibleVocabularies(lessonId, vocabSetId);
		if (vocabs.isEmpty()) {
			return Collections.emptyList();
		}

		List<Long> vocabIds = vocabs.stream().map(VocabularyEntity::getId).toList();
		Map<Long, FlashcardResult> resultMap = vocabLearningRepository
				.findAllById_UserIdAndId_VocabularyIdIn(currentUserId, vocabIds)
				.stream()
				.collect(Collectors.toMap(vl -> vl.getId().getVocabularyId(), VocabLearningEntity::getLastResult));

		if (Boolean.TRUE.equals(onlyForgotten)) {
			vocabs = vocabs.stream()
					.filter(v -> resultMap.get(v.getId()) == FlashcardResult.FORGOTTEN)
					.toList();
		}

		return vocabs.stream().map(v -> new FlashcardCardResponse(
				v.getId(),
				v.getHanzi(),
				v.getPinyin(),
				v.getMeaning(),
				v.getPartOfSpeech(),
				v.getAudioUrl(),
				v.getExampleSentence(),
				v.getExamplePinyin(),
				v.getExampleMeaning(),
				resultMap.get(v.getId())
		)).toList();
	}

	@Transactional
	public FlashcardReviewResponse reviewCard(Long currentUserId, ReviewFlashcardCommand command) {
		UserEntity user = userRepository.findById(currentUserId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		VocabularyEntity vocab = vocabularyRepository.findById(command.vocabularyId())
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND));

		VocabLearningEntity learning = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(currentUserId, command.vocabularyId())
				.orElseGet(() -> new VocabLearningEntity(user, vocab, command.result()));

		learning.recordReview(command.result());
		learning = vocabLearningRepository.save(learning);

		return new FlashcardReviewResponse(
				command.vocabularyId(),
				learning.getLastResult(),
				learning.getRepetitionLevel(),
				learning.getIntervalDays(),
				learning.getUpdatedAt()
		);
	}

	@Transactional(readOnly = true)
	public FlashcardSessionSummaryResponse getSessionSummary(Long currentUserId, Long lessonId, Long vocabSetId) {
		List<VocabularyEntity> vocabs = getAccessibleVocabularies(lessonId, vocabSetId);
		if (vocabs.isEmpty()) {
			return new FlashcardSessionSummaryResponse(0, 0, 0, 0, Collections.emptyList());
		}

		List<Long> vocabIds = vocabs.stream().map(VocabularyEntity::getId).toList();
		Map<Long, FlashcardResult> resultMap = vocabLearningRepository
				.findAllById_UserIdAndId_VocabularyIdIn(currentUserId, vocabIds)
				.stream()
				.collect(Collectors.toMap(vl -> vl.getId().getVocabularyId(), VocabLearningEntity::getLastResult));

		int rememberedCount = 0;
		int forgottenCount = 0;
		int unreviewedCount = 0;
		List<Long> forgottenIds = new ArrayList<>();

		for (VocabularyEntity v : vocabs) {
			FlashcardResult res = resultMap.get(v.getId());
			if (res == FlashcardResult.REMEMBERED) {
				rememberedCount++;
			} else if (res == FlashcardResult.FORGOTTEN) {
				forgottenCount++;
				forgottenIds.add(v.getId());
			} else {
				unreviewedCount++;
			}
		}

		return new FlashcardSessionSummaryResponse(
				vocabs.size(),
				rememberedCount,
				forgottenCount,
				unreviewedCount,
				forgottenIds
		);
	}

	private List<VocabularyEntity> getAccessibleVocabularies(Long lessonId, Long vocabSetId) {
		if (lessonId == null && vocabSetId == null) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED);
		}

		if (lessonId != null) {
			LessonEntity lesson = lessonRepository.findById(lessonId)
					.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND));
			if (lesson.isHidden()) {
				throw new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND);
			}
			return lessonVocabularyRepository.findAllByLessonIdOrderBySortOrderAsc(lessonId)
					.stream()
					.map(LessonVocabularyEntity::getVocabulary)
					.filter(v -> !v.isHidden())
					.toList();
		} else {
			VocabSetEntity vocabSet = vocabSetRepository.findById(vocabSetId)
					.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND));
			return vocabSetItemRepository.findAllByVocabSetIdOrderBySortOrderAsc(vocabSetId)
					.stream()
					.map(VocabSetItemEntity::getVocabulary)
					.filter(v -> !v.isHidden())
					.toList();
		}
	}
}
