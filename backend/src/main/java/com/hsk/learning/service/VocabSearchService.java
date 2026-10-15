package com.hsk.learning.service;

import com.hsk.content.domain.LessonVocabularyEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.content.util.PinyinUtils;
import com.hsk.learning.dto.VocabLessonRefResponse;
import com.hsk.learning.dto.VocabSearchResultItem;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VocabSearchService {

	private final VocabularyRepository vocabularyRepository;
	private final LessonVocabularyRepository lessonVocabularyRepository;

	public VocabSearchService(
			VocabularyRepository vocabularyRepository,
			LessonVocabularyRepository lessonVocabularyRepository) {
		this.vocabularyRepository = vocabularyRepository;
		this.lessonVocabularyRepository = lessonVocabularyRepository;
	}

	@Transactional(readOnly = true)
	public List<VocabSearchResultItem> searchVocabularies(Long currentUserId, String query) {
		if (query == null || query.trim().isEmpty()) {
			return Collections.emptyList();
		}

		String trimmedQuery = query.trim();
		String normalizedPinyin = PinyinUtils.normalizeForSearch(trimmedQuery);

		// Tìm kiếm theo chữ Hán, pinyin chuẩn hóa hoặc nghĩa tiếng Việt
		List<VocabularyEntity> matchedVocabs = vocabularyRepository.searchVocabularies(
				currentUserId, trimmedQuery, normalizedPinyin);

		if (matchedVocabs.isEmpty()) {
			return Collections.emptyList();
		}

		List<Long> vocabIds = matchedVocabs.stream().map(VocabularyEntity::getId).toList();
		List<LessonVocabularyEntity> lessonMappings = lessonVocabularyRepository.findAllByVocabularyIdIn(vocabIds);
		Map<Long, List<LessonVocabularyEntity>> lessonMap = lessonMappings.stream()
				.collect(Collectors.groupingBy(m -> m.getVocabulary().getId()));

		List<VocabSearchResultItem> results = new ArrayList<>();

		for (VocabularyEntity v : matchedVocabs) {
			List<LessonVocabularyEntity> mappings = lessonMap.getOrDefault(v.getId(), Collections.emptyList());

			// Lọc chỉ lấy các bài học công khai (không bị ẩn)
			List<VocabLessonRefResponse> visibleLessons = mappings.stream()
					.filter(m -> !m.getLesson().isHidden()
							&& (m.getLesson().getHskLevel() == null || !m.getLesson().getHskLevel().isHidden()))
					.map(m -> new VocabLessonRefResponse(
							m.getLesson().getId(),
							m.getLesson().getTitle(),
							m.getSortOrder(),
							m.getLesson().getHskLevel() != null ? m.getLesson().getHskLevel().getId() : null,
							m.getLesson().getHskLevel() != null ? m.getLesson().getHskLevel().getTitle() : null,
							m.getLesson().getHskLevel() != null ? m.getLesson().getHskLevel().getLevelNumber() : null
					))
					.toList();

			// TC-05 & CV-04: Từ thuộc bài học đang ẩn -> không xuất hiện trong kết quả
			if (!mappings.isEmpty() && visibleLessons.isEmpty()) {
				continue;
			}

			results.add(new VocabSearchResultItem(
					v.getId(),
					v.getHanzi(),
					v.getPinyin(),
					v.getMeaning(),
					v.getPartOfSpeech(),
					v.getAudioUrl(),
					v.getExampleSentence(),
					v.getExamplePinyin(),
					v.getExampleMeaning(),
					v.getHskLevel() != null ? v.getHskLevel().getId() : null,
					v.getHskLevel() != null ? v.getHskLevel().getTitle() : null,
					visibleLessons
			));
		}

		return results;
	}
}
