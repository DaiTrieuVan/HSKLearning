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
import com.hsk.learning.dto.LessonProgressResponse;
import com.hsk.learning.dto.RoadmapLessonDto;
import com.hsk.learning.dto.RoadmapLevelDto;
import com.hsk.learning.dto.RoadmapResponse;
import com.hsk.learning.repository.LessonProgressRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
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
	private final XpLevelService xpLevelService;

	public RoadmapService(
			HskLevelRepository levelRepository,
			LessonRepository lessonRepository,
			LessonVocabularyRepository lessonVocabularyRepository,
			GrammarPointRepository grammarPointRepository,
			LessonProgressRepository lessonProgressRepository,
			UserRepository userRepository,
			XpLevelService xpLevelService) {
		this.levelRepository = levelRepository;
		this.lessonRepository = lessonRepository;
		this.lessonVocabularyRepository = lessonVocabularyRepository;
		this.grammarPointRepository = grammarPointRepository;
		this.lessonProgressRepository = lessonProgressRepository;
		this.userRepository = userRepository;
		this.xpLevelService = xpLevelService;
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

	@Transactional(readOnly = true)
	public LessonProgressResponse getLessonProgress(Long userId, Long lessonId) {
		LessonEntity lesson = lessonRepository.findById(lessonId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));

		if (lesson.isHidden()) {
			throw new ApiException(ApiErrorCode.LESSON_NOT_FOUND);
		}

		Long levelId = lesson.getHskLevel() != null ? lesson.getHskLevel().getId() : null;
		Optional<LessonProgressEntity> progressOpt = lessonProgressRepository.findByIdUserIdAndIdLessonId(userId, lessonId);
		boolean completed = progressOpt.isPresent();
		Instant completedAt = progressOpt.map(LessonProgressEntity::getCompletedAt).orElse(null);

		int totalInLevel = 0;
		int completedInLevel = 0;
		int progressPercent = 0;

		if (levelId != null) {
			List<LessonEntity> visibleLessons = lessonRepository.findAllByHskLevelIdAndHiddenFalseOrderBySortOrderAsc(levelId);
			totalInLevel = visibleLessons.size();
			Set<Long> completedIds = lessonProgressRepository.findCompletedLessonIdsByUserId(userId);
			for (LessonEntity l : visibleLessons) {
				if (completedIds.contains(l.getId())) {
					completedInLevel++;
				}
			}
			progressPercent = totalInLevel == 0 ? 0 : (int) Math.round((completedInLevel * 100.0) / totalInLevel);
		}

		return new LessonProgressResponse(
				lessonId,
				levelId,
				completed,
				completedAt,
				completedInLevel,
				totalInLevel,
				progressPercent
		);
	}

	@Transactional
	public LessonProgressResponse markLessonCompleted(Long userId, Long lessonId) {
		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
		LessonEntity lesson = lessonRepository.findById(lessonId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));

		if (lesson.isHidden()) {
			throw new ApiException(ApiErrorCode.LESSON_NOT_FOUND);
		}

		Optional<LessonProgressEntity> existingOpt = lessonProgressRepository.findByIdUserIdAndIdLessonId(userId, lessonId);
		Instant completedAt;
		if (existingOpt.isPresent()) {
			// HTT-04-CN-004-TC-02: Dữ liệu trùng lặp (Idempotent) -> giữ nguyên mốc thời gian cũ, không ghi đè
			completedAt = existingOpt.get().getCompletedAt();
		} else {
			// HTT-04-CN-004-TC-01 & TC-04: Lưu mới với thời điểm hoàn thành
			LessonProgressEntity progress = new LessonProgressEntity(user, lesson);
			LessonProgressEntity saved = lessonProgressRepository.saveAndFlush(progress);
			completedAt = saved.getCompletedAt();

			// HTT-08-CN-005-TC-01: Hoàn thành bài học thưởng +10 XP (Idempotent)
			xpLevelService.awardXp(user, 10, "LESSON_COMPLETION", "lesson:" + lessonId, "Hoàn thành bài học: " + lesson.getTitle());
		}

		Long levelId = lesson.getHskLevel() != null ? lesson.getHskLevel().getId() : null;
		int totalInLevel = 0;
		int completedInLevel = 0;
		int progressPercent = 0;

		if (levelId != null) {
			List<LessonEntity> visibleLessons = lessonRepository.findAllByHskLevelIdAndHiddenFalseOrderBySortOrderAsc(levelId);
			totalInLevel = visibleLessons.size();
			Set<Long> completedIds = lessonProgressRepository.findCompletedLessonIdsByUserId(userId);
			for (LessonEntity l : visibleLessons) {
				if (completedIds.contains(l.getId()) || l.getId().equals(lessonId)) {
					completedInLevel++;
				}
			}
			progressPercent = totalInLevel == 0 ? 0 : (int) Math.round((completedInLevel * 100.0) / totalInLevel);
		}

		return new LessonProgressResponse(
				lessonId,
				levelId,
				true,
				completedAt,
				completedInLevel,
				totalInLevel,
				progressPercent
		);
	}

	@Transactional
	public LessonProgressResponse unmarkLessonCompleted(Long userId, Long lessonId) {
		LessonEntity lesson = lessonRepository.findById(lessonId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));

		lessonProgressRepository.deleteById(new LessonProgressId(userId, lessonId));

		Long levelId = lesson.getHskLevel() != null ? lesson.getHskLevel().getId() : null;
		int totalInLevel = 0;
		int completedInLevel = 0;
		int progressPercent = 0;

		if (levelId != null) {
			List<LessonEntity> visibleLessons = lessonRepository.findAllByHskLevelIdAndHiddenFalseOrderBySortOrderAsc(levelId);
			totalInLevel = visibleLessons.size();
			Set<Long> completedIds = lessonProgressRepository.findCompletedLessonIdsByUserId(userId);
			for (LessonEntity l : visibleLessons) {
				if (completedIds.contains(l.getId()) && !l.getId().equals(lessonId)) {
					completedInLevel++;
				}
			}
			progressPercent = totalInLevel == 0 ? 0 : (int) Math.round((completedInLevel * 100.0) / totalInLevel);
		}

		return new LessonProgressResponse(
				lessonId,
				levelId,
				false,
				null,
				completedInLevel,
				totalInLevel,
				progressPercent
		);
	}
}
