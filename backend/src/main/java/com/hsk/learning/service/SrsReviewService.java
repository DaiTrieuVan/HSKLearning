package com.hsk.learning.service;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.learning.domain.VocabLearningEntity;
import com.hsk.learning.dto.SrsCardResponse;
import com.hsk.learning.dto.SrsReviewRequest;
import com.hsk.learning.dto.SrsReviewResultResponse;
import com.hsk.learning.dto.SrsSummaryResponse;
import com.hsk.learning.repository.VocabLearningRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SrsReviewService {

	private final VocabLearningRepository vocabLearningRepository;
	private final VocabularyRepository vocabularyRepository;
	private final UserRepository userRepository;

	public SrsReviewService(
			VocabLearningRepository vocabLearningRepository,
			VocabularyRepository vocabularyRepository,
			UserRepository userRepository
	) {
		this.vocabLearningRepository = vocabLearningRepository;
		this.vocabularyRepository = vocabularyRepository;
		this.userRepository = userRepository;
	}

	@Transactional(readOnly = true)
	public List<SrsCardResponse> getDueCards(Long currentUserId) {
		Instant now = Instant.now();
		List<VocabLearningEntity> dueCards = vocabLearningRepository.findDueReviewCards(currentUserId, now);

		return dueCards.stream().map(learning -> {
			VocabularyEntity vocab = learning.getVocabulary();
			return new SrsCardResponse(
					vocab.getId(),
					vocab.getHanzi(),
					vocab.getPinyin(),
					vocab.getMeaning(),
					vocab.getPartOfSpeech(),
					vocab.getAudioUrl(),
					vocab.getExampleSentence(),
					vocab.getExamplePinyin(),
					vocab.getExampleMeaning(),
					learning.getRepetitionLevel(),
					learning.getIntervalDays(),
					learning.getNextReviewAt()
			);
		}).toList();
	}

	@Transactional(readOnly = true)
	public SrsSummaryResponse getSummary(Long currentUserId) {
		Instant now = Instant.now();
		long dueToday = vocabLearningRepository.countDueReviewCards(currentUserId, now);
		long mastered = vocabLearningRepository.countMasteredCards(currentUserId);
		long total = vocabLearningRepository.countById_UserId(currentUserId);
		long learning = Math.max(0, total - mastered);

		return new SrsSummaryResponse(dueToday, mastered, learning);
	}

	@Transactional
	public SrsReviewResultResponse submitReview(Long currentUserId, SrsReviewRequest request) {
		UserEntity user = userRepository.findById(currentUserId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		VocabularyEntity vocab = vocabularyRepository.findById(request.vocabularyId())
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND));

		VocabLearningEntity learning = vocabLearningRepository
				.findById_UserIdAndId_VocabularyId(currentUserId, request.vocabularyId())
				.orElseGet(() -> new VocabLearningEntity(user, vocab));

		learning.recordSrsReview(request.result());
		learning = vocabLearningRepository.save(learning);

		long remainingDue = vocabLearningRepository.countDueReviewCards(currentUserId, Instant.now());

		return new SrsReviewResultResponse(
				vocab.getId(),
				learning.getRepetitionLevel(),
				learning.getIntervalDays(),
				learning.getNextReviewAt(),
				remainingDue
		);
	}
}
