package com.hsk.progress.service;

import com.hsk.assignment.domain.AssignmentEntity;
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.LessonEntity;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.learning.domain.LessonProgressEntity;
import com.hsk.learning.repository.LessonProgressRepository;
import com.hsk.progress.dto.AssignmentHistoryItemDto;
import com.hsk.progress.dto.HskLevelProgressDto;
import com.hsk.progress.dto.PersonalProgressResponse;
import com.hsk.progress.dto.RecentActivityDto;
import com.hsk.progress.dto.SubmissionAttemptItemDto;
import com.hsk.progress.dto.SubmissionHistoryResponse;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service xử lý tính toán tiến độ học cá nhân (HTT-07-CN-001, QTN-02).
 */
@Service
public class ProgressService {

	private final UserRepository userRepository;
	private final HskLevelRepository hskLevelRepository;
	private final LessonRepository lessonRepository;
	private final LessonProgressRepository lessonProgressRepository;
	private final LessonVocabularyRepository lessonVocabularyRepository;
	private final AssignmentSubmissionRepository assignmentSubmissionRepository;

	public ProgressService(
			UserRepository userRepository,
			HskLevelRepository hskLevelRepository,
			LessonRepository lessonRepository,
			LessonProgressRepository lessonProgressRepository,
			LessonVocabularyRepository lessonVocabularyRepository,
			AssignmentSubmissionRepository assignmentSubmissionRepository
	) {
		this.userRepository = userRepository;
		this.hskLevelRepository = hskLevelRepository;
		this.lessonRepository = lessonRepository;
		this.lessonProgressRepository = lessonProgressRepository;
		this.lessonVocabularyRepository = lessonVocabularyRepository;
		this.assignmentSubmissionRepository = assignmentSubmissionRepository;
	}

	/**
	 * Lấy tiến độ học cá nhân của học sinh đang đăng nhập (TC-01..TC-05).
	 */
	@Transactional(readOnly = true)
	public PersonalProgressResponse getPersonalProgress(Long userId) {
		// QTN-02 & TC-05: Chỉ truy vấn và trả về dữ liệu của chính học sinh đang gọi
		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		// 1. Tiến độ bài học & từ vựng theo từng cấp độ HSK (TC-01, TC-04)
		List<HskLevelEntity> visibleLevels = hskLevelRepository.findAllByHiddenFalseOrderByLevelNumberAsc();
		Set<Long> completedLessonIds = lessonProgressRepository.findCompletedLessonIdsByUserId(userId);

		List<HskLevelProgressDto> levelProgressList = new ArrayList<>();
		int totalLessonsCompleted = 0;
		int totalLessonsOverall = 0;
		int totalVocabLearned = 0;

		for (HskLevelEntity level : visibleLevels) {
			// TC-04: Bỏ qua bài học ẩn, chỉ tính bài hiển thị
			List<LessonEntity> visibleLessons = lessonRepository
					.findAllByHskLevelIdAndHiddenFalseOrderBySortOrderAsc(level.getId());

			int totalLessonsInLevel = visibleLessons.size();
			int completedLessonsInLevel = 0;
			int totalVocabInLevel = 0;
			int vocabLearnedInLevel = 0;

			for (LessonEntity lesson : visibleLessons) {
				int vocabCount = lessonVocabularyRepository.findAllByLessonIdOrderBySortOrderAsc(lesson.getId()).size();
				totalVocabInLevel += vocabCount;

				if (completedLessonIds.contains(lesson.getId())) {
					completedLessonsInLevel++;
					vocabLearnedInLevel += vocabCount;
				}
			}

			double progressPercent = totalLessonsInLevel == 0 ? 0.0
					: Math.round(((completedLessonsInLevel * 100.0) / totalLessonsInLevel) * 10.0) / 10.0;

			totalLessonsCompleted += completedLessonsInLevel;
			totalLessonsOverall += totalLessonsInLevel;
			totalVocabLearned += vocabLearnedInLevel;

			levelProgressList.add(new HskLevelProgressDto(
					level.getId(),
					level.getCode(),
					level.getTitle(),
					level.getLevelNumber(),
					completedLessonsInLevel,
					totalLessonsInLevel,
					progressPercent,
					vocabLearnedInLevel,
					totalVocabInLevel
			));
		}

		// 2. Điểm trung bình bài tập đã nộp (TC-02, TC-03)
		List<AssignmentSubmissionEntity> submissions = assignmentSubmissionRepository
				.findByStudent_IdAndStatusIn(userId, List.of(SubmissionStatus.SUBMITTED, SubmissionStatus.AUTO_SUBMITTED));

		// Nhóm theo AssignmentId để lấy phần trăm điểm tốt nhất của mỗi bài tập
		Map<Long, Double> assignmentScores = new HashMap<>();
		Map<Long, AssignmentSubmissionEntity> latestSubmissions = new HashMap<>();

		for (AssignmentSubmissionEntity sub : submissions) {
			if (sub.getAssignment() == null) continue;
			Long aId = sub.getAssignment().getId();
			BigDecimal maxPoints = sub.getAssignment().getTotalPoints();
			BigDecimal earnedPoints = sub.getAdjustedScore() != null ? sub.getAdjustedScore() : sub.getScore();

			if (maxPoints != null && maxPoints.compareTo(BigDecimal.ZERO) > 0 && earnedPoints != null) {
				double percentage = (earnedPoints.doubleValue() / maxPoints.doubleValue()) * 100.0;
				assignmentScores.merge(aId, percentage, Math::max);
			}

			// Lưu submission mới nhất để hiển thị hoạt động gần đây
			latestSubmissions.compute(aId, (k, oldSub) -> {
				if (oldSub == null) return sub;
				if (sub.getSubmittedAt() != null && oldSub.getSubmittedAt() != null) {
					return sub.getSubmittedAt().isAfter(oldSub.getSubmittedAt()) ? sub : oldSub;
				}
				return sub;
			});
		}

		Double averageScorePercentage = null;
		if (!assignmentScores.isEmpty()) {
			double sum = assignmentScores.values().stream().mapToDouble(Double::doubleValue).sum();
			double avg = sum / assignmentScores.size();
			averageScorePercentage = Math.round(avg * 10.0) / 10.0; // TC-02: 82.5%
		}

		int totalAssignmentsSubmitted = assignmentScores.size();

		// 3. Hoạt động học tập gần đây
		List<RecentActivityDto> recentActivities = new ArrayList<>();

		// Thêm bài học đã hoàn thành gần đây
		List<LessonProgressEntity> lessonProgresses = lessonProgressRepository.findAllByUserId(userId);
		for (LessonProgressEntity lp : lessonProgresses) {
			if (lp.getLesson() != null && !lp.getLesson().isHidden()) {
				String levelName = lp.getLesson().getHskLevel() != null ? lp.getLesson().getHskLevel().getTitle() : "";
				recentActivities.add(new RecentActivityDto(
						"LESSON_COMPLETED",
						lp.getLesson().getTitle(),
						levelName,
						null,
						lp.getCompletedAt()
				));
			}
		}

		// Thêm bài tập đã nộp gần đây
		for (AssignmentSubmissionEntity sub : latestSubmissions.values()) {
			if (sub.getAssignment() != null) {
				BigDecimal maxPoints = sub.getAssignment().getTotalPoints();
				BigDecimal earnedPoints = sub.getAdjustedScore() != null ? sub.getAdjustedScore() : sub.getScore();
				Double percentage = null;
				if (maxPoints != null && maxPoints.compareTo(BigDecimal.ZERO) > 0 && earnedPoints != null) {
					percentage = Math.round((earnedPoints.doubleValue() / maxPoints.doubleValue() * 100.0) * 10.0) / 10.0;
				}
				recentActivities.add(new RecentActivityDto(
						"ASSIGNMENT_SUBMITTED",
						sub.getAssignment().getTitle(),
						"Bài tập trên lớp",
						percentage,
						sub.getSubmittedAt()
				));
			}
		}

		// Sắp xếp theo mốc thời gian giảm dần và lấy tối đa 6 hoạt động
		recentActivities.sort((a, b) -> {
			if (a.timestamp() == null) return 1;
			if (b.timestamp() == null) return -1;
			return b.timestamp().compareTo(a.timestamp());
		});
		if (recentActivities.size() > 6) {
			recentActivities = recentActivities.subList(0, 6);
		}

		return new PersonalProgressResponse(
				totalLessonsCompleted,
				totalLessonsOverall,
				totalVocabLearned,
				averageScorePercentage,
				totalAssignmentsSubmitted,
				levelProgressList,
				recentActivities
		);
	}

	/**
	 * Lấy lịch sử làm bài và điểm số của học sinh (HTT-07-CN-002, TC-01..TC-05).
	 */
	@Transactional(readOnly = true)
	public SubmissionHistoryResponse getSubmissionHistory(Long userId) {
		// QTN-02 & TC-05: Bảo mật dữ liệu, học sinh chỉ xem lịch sử của chính mình
		userRepository.findById(userId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		// TC-01: Lấy tất cả bài nộp hợp lệ của học sinh kèm assignment và classroom đã fetch join
		List<AssignmentSubmissionEntity> submissions = assignmentSubmissionRepository.findStudentSubmissionHistory(
				userId,
				List.of(SubmissionStatus.SUBMITTED, SubmissionStatus.AUTO_SUBMITTED)
		);

		// TC-04: Dữ liệu rỗng khi học sinh chưa nộp bài nào
		if (submissions.isEmpty()) {
			return new SubmissionHistoryResponse(0, 0, null, Collections.emptyList());
		}

		// Nhóm theo AssignmentId (duy trì thứ tự xuất hiện của assignment dựa theo bài nộp mới nhất)
		Map<Long, List<AssignmentSubmissionEntity>> groupedByAssignment = new LinkedHashMap<>();
		for (AssignmentSubmissionEntity sub : submissions) {
			if (sub.getAssignment() == null) continue;
			groupedByAssignment.computeIfAbsent(sub.getAssignment().getId(), k -> new ArrayList<>()).add(sub);
		}

		List<AssignmentHistoryItemDto> assignmentHistoryItems = new ArrayList<>();
		List<Double> assignmentPercentages = new ArrayList<>();
		int totalSubmissionsCount = 0;

		for (Map.Entry<Long, List<AssignmentSubmissionEntity>> entry : groupedByAssignment.entrySet()) {
			List<AssignmentSubmissionEntity> subList = entry.getValue();
			if (subList.isEmpty()) continue;

			AssignmentEntity assignment = subList.get(0).getAssignment();
			ClassEntity classroom = assignment.getClassroom();
			BigDecimal totalPoints = assignment.getTotalPoints() != null ? assignment.getTotalPoints() : BigDecimal.ZERO;

			// TC-03 & QTN-13: Tìm điểm cao nhất trong các lượt hợp lệ (tính theo adjustedScore nếu có)
			BigDecimal maxEffectiveScore = null;
			Long bestSubmissionId = null;

			for (AssignmentSubmissionEntity sub : subList) {
				BigDecimal effectiveScore = sub.getAdjustedScore() != null ? sub.getAdjustedScore() : sub.getScore();
				if (effectiveScore != null) {
					if (maxEffectiveScore == null || effectiveScore.compareTo(maxEffectiveScore) > 0) {
						maxEffectiveScore = effectiveScore;
						bestSubmissionId = sub.getId();
					}
				}
			}

			// Tạo danh sách attempt items
			List<SubmissionAttemptItemDto> attemptDtos = new ArrayList<>();
			Instant latestSubmittedAt = null;

			// Sắp xếp các lượt làm bài của assignment theo attemptNumber giảm dần (lượt mới nhất trước)
			subList.sort((a, b) -> Integer.compare(
					b.getAttemptNumber() != null ? b.getAttemptNumber() : 0,
					a.getAttemptNumber() != null ? a.getAttemptNumber() : 0
			));

			for (AssignmentSubmissionEntity sub : subList) {
				totalSubmissionsCount++;
				if (latestSubmittedAt == null || (sub.getSubmittedAt() != null && sub.getSubmittedAt().isAfter(latestSubmittedAt))) {
					latestSubmittedAt = sub.getSubmittedAt();
				}

				BigDecimal effectiveScore = sub.getAdjustedScore() != null ? sub.getAdjustedScore() : sub.getScore();
				Double percentage = null;
				if (totalPoints.compareTo(BigDecimal.ZERO) > 0 && effectiveScore != null) {
					percentage = Math.round((effectiveScore.doubleValue() / totalPoints.doubleValue() * 100.0) * 10.0) / 10.0;
				}

				boolean isBest = sub.getId().equals(bestSubmissionId);

				attemptDtos.add(new SubmissionAttemptItemDto(
						sub.getId(),
						sub.getAttemptNumber(),
						sub.getStatus(),
						sub.getScore(),
						sub.getAdjustedScore(),
						sub.getAdjustReason(),
						effectiveScore,
						percentage,
						isBest,
						sub.getSubmittedAt(),
						sub.getStartedAt()
				));
			}

			Double bestPercentage = null;
			if (totalPoints.compareTo(BigDecimal.ZERO) > 0 && maxEffectiveScore != null) {
				bestPercentage = Math.round((maxEffectiveScore.doubleValue() / totalPoints.doubleValue() * 100.0) * 10.0) / 10.0;
				assignmentPercentages.add(bestPercentage);
			}

			assignmentHistoryItems.add(new AssignmentHistoryItemDto(
					assignment.getId(),
					assignment.getTitle(),
					classroom != null ? classroom.getId() : null,
					classroom != null ? classroom.getTitle() : null,
					totalPoints,
					maxEffectiveScore,
					bestPercentage,
					latestSubmittedAt,
					attemptDtos.size(),
					attemptDtos
			));
		}

		// TC-01: Bài mới nhất ở trên cùng
		assignmentHistoryItems.sort((a, b) -> {
			if (a.latestSubmittedAt() == null) return 1;
			if (b.latestSubmittedAt() == null) return -1;
			return b.latestSubmittedAt().compareTo(a.latestSubmittedAt());
		});

		Double averageScorePercentage = null;
		if (!assignmentPercentages.isEmpty()) {
			double sum = assignmentPercentages.stream().mapToDouble(Double::doubleValue).sum();
			averageScorePercentage = Math.round((sum / assignmentPercentages.size()) * 10.0) / 10.0;
		}

		return new SubmissionHistoryResponse(
				assignmentHistoryItems.size(),
				totalSubmissionsCount,
				averageScorePercentage,
				assignmentHistoryItems
		);
	}
}
