package com.hsk.learning.service;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.domain.UserXpTransactionEntity;
import com.hsk.learning.dto.UserLevelResponse;
import com.hsk.learning.dto.XpTransactionResponse;
import com.hsk.learning.repository.UserXpTransactionRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class XpLevelService {

	public record LevelInfo(int level, String title, int currentThreshold, int nextThreshold) {}

	private static final int[] LEVEL_THRESHOLDS = {0, 100, 250, 450, 700, 1000, 1500, 2500, 5000};
	private static final String[] LEVEL_TITLES = {
			"Tân thủ",
			"Tập sự",
			"Chăm chỉ",
			"Tiến bộ",
			"Thành thạo",
			"Tinh hoa",
			"Bậc thầy",
			"Cao thủ",
			"Huyền thoại"
	};

	private final UserXpTransactionRepository userXpTransactionRepository;
	private final UserRepository userRepository;

	public static LevelInfo calculateLevel(int totalXp) {
		int level = 1;
		for (int i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
			if (totalXp >= LEVEL_THRESHOLDS[i]) {
				level = i + 1;
				break;
			}
		}

		String title = (level <= LEVEL_TITLES.length) ? LEVEL_TITLES[level - 1] : "Huyền thoại";
		int currentThreshold = LEVEL_THRESHOLDS[level - 1];
		int nextThreshold = (level < LEVEL_THRESHOLDS.length) ? LEVEL_THRESHOLDS[level] : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 2000;

		return new LevelInfo(level, title, currentThreshold, nextThreshold);
	}

	@Transactional(readOnly = true)
	public UserLevelResponse getUserLevel(Long userId) {
		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
		return buildUserLevelResponse(user, false);
	}

	/**
	 * Cộng điểm XP cho người dùng có bảo vệ Idempotent.
	 * TC-04: Nếu cùng sourceType và sourceId đã tồn tại cho user này thì không cộng lần hai.
	 * TC-05: Lưu nhật ký giao dịch XP.
	 *
	 * @return true nếu được cộng XP, false nếu hoạt động này đã được tính trước đó
	 */
	@Transactional
	public boolean awardXp(UserEntity user, int amount, String sourceType, String sourceId, String description) {
		if (amount <= 0) {
			return false;
		}

		// TC-04: Idempotency check
		if (sourceId != null && userXpTransactionRepository.existsByUserIdAndSourceTypeAndSourceId(user.getId(), sourceType, sourceId)) {
			return false;
		}

		int oldLevel = calculateLevel(user.getTotalXp()).level();

		// TC-05: Lưu lịch sử giao dịch XP
		UserXpTransactionEntity transaction = new UserXpTransactionEntity(
				user,
				amount,
				sourceType,
				sourceId,
				description
		);
		userXpTransactionRepository.save(transaction);

		// Cộng tổng XP
		user.addXp(amount);
		userRepository.save(user);

		int newLevel = calculateLevel(user.getTotalXp()).level();
		return true;
	}

	@Transactional
	public boolean awardXp(Long userId, int amount, String sourceType, String sourceId, String description) {
		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
		return awardXp(user, amount, sourceType, sourceId, description);
	}

	@Transactional(readOnly = true)
	public Page<XpTransactionResponse> getXpHistory(Long userId, Pageable pageable) {
		return userXpTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
				.map(tx -> new XpTransactionResponse(
						tx.getId(),
						tx.getXpAmount(),
						tx.getSourceType(),
						tx.getSourceId(),
						tx.getDescription(),
						tx.getCreatedAt()
				));
	}

	@Transactional(readOnly = true)
	public List<XpTransactionResponse> getRecentXpHistory(Long userId) {
		return userXpTransactionRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId)
				.stream()
				.map(tx -> new XpTransactionResponse(
						tx.getId(),
						tx.getXpAmount(),
						tx.getSourceType(),
						tx.getSourceId(),
						tx.getDescription(),
						tx.getCreatedAt()
				))
				.toList();
	}

	private UserLevelResponse buildUserLevelResponse(UserEntity user, boolean levelUpJustNow) {
		int totalXp = user.getTotalXp();
		LevelInfo info = calculateLevel(totalXp);

		int xpToNext = Math.max(0, info.nextThreshold() - totalXp);
		int range = info.nextThreshold() - info.currentThreshold();
		int gainedInRange = totalXp - info.currentThreshold();
		int progressPercent = (range > 0) ? Math.min(100, (int) Math.round(((double) gainedInRange / range) * 100)) : 100;

		return new UserLevelResponse(
				info.level(),
				info.title(),
				totalXp,
				info.currentThreshold(),
				info.nextThreshold(),
				xpToNext,
				progressPercent,
				levelUpJustNow
		);
	}
}
