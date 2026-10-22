package com.hsk.learning.service;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.domain.DailyChallengeHistoryEntity;
import com.hsk.learning.dto.DailyChallengeResponse;
import com.hsk.learning.repository.DailyChallengeHistoryRepository;
import com.hsk.learning.repository.LessonProgressRepository;
import com.hsk.learning.repository.VocabLearningRepository;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DailyChallengeService {

	public static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
	public static final int TARGET_LESSONS = 2;
	public static final int TARGET_VOCABS = 10;
	public static final int TARGET_EXERCISES = 1;
	public static final int REWARD_XP = 50;

	private final DailyChallengeHistoryRepository dailyChallengeHistoryRepository;
	private final LessonProgressRepository lessonProgressRepository;
	private final VocabLearningRepository vocabLearningRepository;
	private final AssignmentSubmissionRepository assignmentSubmissionRepository;
	private final UserRepository userRepository;
	private final StreakService streakService;
	private final XpLevelService xpLevelService;

	public DailyChallengeService(
			DailyChallengeHistoryRepository dailyChallengeHistoryRepository,
			LessonProgressRepository lessonProgressRepository,
			VocabLearningRepository vocabLearningRepository,
			AssignmentSubmissionRepository assignmentSubmissionRepository,
			UserRepository userRepository,
			StreakService streakService,
			XpLevelService xpLevelService
	) {
		this.dailyChallengeHistoryRepository = dailyChallengeHistoryRepository;
		this.lessonProgressRepository = lessonProgressRepository;
		this.vocabLearningRepository = vocabLearningRepository;
		this.assignmentSubmissionRepository = assignmentSubmissionRepository;
		this.userRepository = userRepository;
		this.streakService = streakService;
		this.xpLevelService = xpLevelService;
	}

	@Transactional
	public DailyChallengeResponse getDailyChallenge(Long userId) {
		LocalDate todayVn = LocalDate.now(VN_ZONE);
		return getDailyChallengeForDate(userId, todayVn);
	}

	@Transactional
	public DailyChallengeResponse getDailyChallengeForDate(Long userId, LocalDate date) {
		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		Instant startOfDay = date.atStartOfDay(VN_ZONE).toInstant();
		Instant endOfDay = date.atTime(LocalTime.MAX).atZone(VN_ZONE).toInstant();

		long completedLessons = lessonProgressRepository.countCompletedLessonsInRange(userId, startOfDay, endOfDay);
		long reviewedVocabs = vocabLearningRepository.countReviewedVocabsInRange(userId, startOfDay, endOfDay);
		long completedExercises = assignmentSubmissionRepository.countCompletedSubmissionsInRange(userId, startOfDay, endOfDay);

		boolean allMet = (completedLessons >= TARGET_LESSONS)
				&& (reviewedVocabs >= TARGET_VOCABS)
				&& (completedExercises >= TARGET_EXERCISES);

		DailyChallengeHistoryEntity history = dailyChallengeHistoryRepository
				.findByUserIdAndChallengeDate(userId, date)
				.orElseGet(() -> new DailyChallengeHistoryEntity(user, date, REWARD_XP));

		if (allMet) {
			history.markCompleted();
			// HTT-08-CN-003-TC-03 & TC-04 & HTT-08-CN-005-TC-02: Idempotent - chỉ cộng 50 XP 1 lần duy nhất trong ngày
			if (history.claimReward()) {
				xpLevelService.awardXp(
						user,
						REWARD_XP,
						"DAILY_CHALLENGE",
						"challenge:" + date,
						"Hoàn thành Thử thách hằng ngày (" + date + ")"
				);
			}
			// HTT-08-CN-004: Tự động ghi nhận chuỗi ngày học streak khi hoàn thành mục tiêu ngày
			streakService.recordDailyGoalCompletion(user, date);
		}

		history = dailyChallengeHistoryRepository.save(history);

		double lessonProg = Math.min(1.0, (double) completedLessons / TARGET_LESSONS);
		double vocabProg = Math.min(1.0, (double) reviewedVocabs / TARGET_VOCABS);
		double exerciseProg = Math.min(1.0, (double) completedExercises / TARGET_EXERCISES);
		int progressPercent = (int) Math.round(((lessonProg + vocabProg + exerciseProg) / 3.0) * 100);

		return new DailyChallengeResponse(
				date,
				TARGET_LESSONS,
				completedLessons,
				TARGET_VOCABS,
				reviewedVocabs,
				TARGET_EXERCISES,
				completedExercises,
				history.isCompleted(),
				REWARD_XP,
				history.isRewardClaimed(),
				progressPercent,
				user.getTotalXp()
		);
	}
}
