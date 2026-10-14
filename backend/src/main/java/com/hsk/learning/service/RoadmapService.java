package com.hsk.learning.service;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.LessonEntity;
import com.hsk.content.repository.GrammarPointRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.learning.domain.LessonProgressEntity;
import com.hsk.learning.domain.LessonProgressId;
import com.hsk.learning.dto.RoadmapLessonDto;
import com.hsk.learning.dto.RoadmapLevelDto;
import com.hsk.learning.dto.RoadmapResponse;
import com.hsk.learning.repository.LessonProgressRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoadmapService {

	private final HskLevelRepository levelRepository;
	private final LessonRepository lessonRepository;
	private final LessonVocabularyRepository lessonVocabularyRepository;
	private final GrammarPointRepository grammarPointRepository;
	private final LessonProgressRepository lessonProgressRepository;
	private final UserRepository userRepository;

	public RoadmapService(
			HskLevelRepository levelRepository,
			LessonRepository lessonRepository,
			LessonVocabularyRepository lessonVocabularyRepository,
			GrammarPointRepository grammarPointRepository,
			LessonProgressRepository lessonProgressRepository,
			UserRepository userRepository) {
		this.levelRepository = levelRepository;
		this.lessonRepository = lessonRepository;
		this.lessonVocabularyRepository = lessonVocabularyRepository;
		this.grammarPointRepository = grammarPointRepository;
		this.lessonProgressRepository = lessonProgressRepository;
		this.userRepository = userRepository;
	}

	@Transactional(readOnly = true)
	public RoadmapResponse getRoadmap(Long userId) {
		// HTT-04-CN-001-TC-03: Cấp độ đang ẩn không xuất hiện
		List<HskLevelEntity> visibleLevels = levelRepository.findAllByHiddenFalseOrderByLevelNumberAsc();

		// HTT-04-CN-001 & QTN-02: Lấy tiến độ của chính user này
		Map<Long, Instant> completedMap = new HashMap<>();
		if (userId != null) {
			List<LessonProgressEntity> progressList = lessonProgressRepository.findAllByUserId(userId);
			for (LessonProgressEntity lp : progressList) {
				completedMap.put(lp.getLesson().getId(), lp.getCompletedAt());
			}
		}

		List<RoadmapLevelDto> levelDtos = new ArrayList<>();
		int totalCompletedAllLevels = 0;
		int totalLessonsAllLevels = 0;

		for (HskLevelEntity level : visibleLevels) {
			// HTT-04-CN-001-TC-03: Bài học đang ẩn không xuất hiện và không tính vào tiến độ
			List<LessonEntity> visibleLessons = lessonRepository.findAllByHskLevelIdAndHiddenFalseOrderBySortOrderAsc(level.getId());

			List<RoadmapLessonDto> lessonDtos = new ArrayList<>();
			int completedInLevel = 0;

			for (LessonEntity lesson : visibleLessons) {
				boolean isCompleted = completedMap.containsKey(lesson.getId());
				Instant completedAt = completedMap.get(lesson.getId());
				if (isCompleted) {
					completedInLevel++;
				}

				int vocabCount = lessonVocabularyRepository.findAllByLessonIdOrderBySortOrderAsc(lesson.getId()).size();
				int grammarCount = grammarPointRepository.findAllByLessonIdOrderBySortOrderAsc(lesson.getId()).size();

				lessonDtos.add(new RoadmapLessonDto(
						lesson.getId(),
						lesson.getTitle(),
						lesson.getDescription(),
						lesson.getSortOrder(),
						vocabCount,
						grammarCount,
						isCompleted,
						completedAt
				));
			}

			int totalInLevel = visibleLessons.size();
			// HTT-04-CN-001-TC-02: Tính phần trăm tiến độ
			// HTT-04-CN-001-TC-04: Cấp độ chưa có bài -> progressPercent = 0, available = false
			int progressPercent = totalInLevel == 0 ? 0 : (int) Math.round((completedInLevel * 100.0) / totalInLevel);
			boolean available = totalInLevel > 0;

			totalCompletedAllLevels += completedInLevel;
			totalLessonsAllLevels += totalInLevel;

			levelDtos.add(new RoadmapLevelDto(
					level.getId(),
					level.getCode(),
					level.getTitle(),
					level.getLevelNumber(),
					level.getDescription(),
					level.getTargetVocabCount(),
					totalInLevel,
					completedInLevel,
					progressPercent,
					available,
					lessonDtos
			));
		}

		int overallProgressPercent = totalLessonsAllLevels == 0 ? 0 : (int) Math.round((totalCompletedAllLevels * 100.0) / totalLessonsAllLevels);

		return new RoadmapResponse(totalCompletedAllLevels, overallProgressPercent, levelDtos);
	}

	@Transactional
	public void markLessonCompleted(Long userId, Long lessonId) {
		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
		LessonEntity lesson = lessonRepository.findById(lessonId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));

		if (lesson.isHidden()) {
			throw new ApiException(ApiErrorCode.LESSON_NOT_FOUND);
		}

		if (!lessonProgressRepository.existsByIdUserIdAndIdLessonId(userId, lessonId)) {
			LessonProgressEntity progress = new LessonProgressEntity(user, lesson);
			lessonProgressRepository.save(progress);
		}
	}

	@Transactional
	public void unmarkLessonCompleted(Long userId, Long lessonId) {
		lessonProgressRepository.deleteById(new LessonProgressId(userId, lessonId));
	}
}
