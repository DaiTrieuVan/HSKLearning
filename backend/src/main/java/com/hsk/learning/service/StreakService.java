package com.hsk.learning.service;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiException;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.learning.domain.UserStreakEntity;
import com.hsk.learning.dto.StreakResponse;
import com.hsk.learning.repository.UserStreakRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StreakService {

	public static final ZoneId VN_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

	private final UserStreakRepository userStreakRepository;
	private final UserRepository userRepository;

	@Transactional(readOnly = true)
	public StreakResponse getStreakStatus(Long userId) {
		LocalDate todayVn = LocalDate.now(VN_ZONE);
		return getStreakStatusForDate(userId, todayVn);
	}

	@Transactional(readOnly = true)
	public StreakResponse getStreakStatusForDate(Long userId, LocalDate referenceDate) {
		if (referenceDate == null) {
			referenceDate = LocalDate.now(VN_ZONE);
		}

		UserStreakEntity streakEntity = userStreakRepository.findByUserId(userId).orElse(null);
		if (streakEntity == null) {
			return new StreakResponse(
					0,
					0,
					false,
					null,
					referenceDate,
					"Hãy hoàn thành mục tiêu hôm nay để bắt đầu chuỗi ngày học đầu tiên!"
			);
		}

		int effectiveStreak = streakEntity.getEffectiveStreak(referenceDate);
		boolean completedToday = streakEntity.isCompletedOn(referenceDate);

		String message;
		if (completedToday) {
			message = String.format("Tuyệt vời! Bạn đã duy trì chuỗi học %d ngày liên tiếp hôm nay.", effectiveStreak);
		} else if (effectiveStreak > 0) {
			message = String.format("Bạn đang có chuỗi %d ngày! Hoàn thành mục tiêu hôm nay để duy trì chuỗi.", effectiveStreak);
		} else {
			message = "Chuỗi ngày học đang là 0 ngày. Hoàn thành mục tiêu hôm nay để khởi động lại chuỗi streak!";
		}

		return new StreakResponse(
				effectiveStreak,
				streakEntity.getLongestStreak(),
				completedToday,
				streakEntity.getLastCompletedDate(),
				referenceDate,
				message
		);
	}

	@Transactional
	public StreakResponse recordDailyGoalCompletion(UserEntity user, LocalDate completedDate) {
		if (completedDate == null) {
			completedDate = LocalDate.now(VN_ZONE);
		}

		LocalDate finalCompletedDate = completedDate;
		UserStreakEntity streakEntity = userStreakRepository.findByUserId(user.getId())
				.orElseGet(() -> new UserStreakEntity(user));

		streakEntity.recordCompletion(finalCompletedDate);
		streakEntity = userStreakRepository.save(streakEntity);

		return getStreakStatusForDate(user.getId(), finalCompletedDate);
	}

	@Transactional
	public StreakResponse recordDailyGoalCompletion(Long userId, LocalDate completedDate) {
		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
		return recordDailyGoalCompletion(user, completedDate);
	}
}
