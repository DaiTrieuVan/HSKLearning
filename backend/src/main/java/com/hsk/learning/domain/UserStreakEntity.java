package com.hsk.learning.domain;

import com.hsk.account.domain.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(
		name = "user_streaks",
		uniqueConstraints = {
				@UniqueConstraint(name = "uq_user_streaks_user_id", columnNames = {"user_id"})
		}
)
@Getter
@Setter
@NoArgsConstructor
public class UserStreakEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	@org.hibernate.annotations.OnDelete(action = org.hibernate.annotations.OnDeleteAction.CASCADE)
	private UserEntity user;

	@Column(name = "current_streak", nullable = false)
	private int currentStreak = 0;

	@Column(name = "longest_streak", nullable = false)
	private int longestStreak = 0;

	@Column(name = "last_completed_date")
	private LocalDate lastCompletedDate;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public UserStreakEntity(UserEntity user) {
		this.user = user;
		this.currentStreak = 0;
		this.longestStreak = 0;
	}

	/**
	 * Ghi nhận hoàn thành mục tiêu ngày vào streak.
	 * Idempotent: Nếu đã hoàn thành trong cùng ngày, không tăng thêm.
	 *
	 * @param completedDate Ngày hoàn thành theo múi giờ Asia/Ho_Chi_Minh
	 * @return true nếu streak được tăng mới, false nếu ngày này đã được tính rồi
	 */
	public boolean recordCompletion(LocalDate completedDate) {
		if (this.lastCompletedDate != null && this.lastCompletedDate.equals(completedDate)) {
			// TC-04: Đã tính cho ngày này rồi, không tăng thêm
			return false;
		}

		if (this.lastCompletedDate == null) {
			// TC-01: Ngày đầu tiên
			this.currentStreak = 1;
		} else if (this.lastCompletedDate.equals(completedDate.minusDays(1))) {
			// TC-02: Hoàn thành ngày kế tiếp liên tiếp
			this.currentStreak += 1;
		} else {
			// TC-08: Bỏ lỡ ngày hôm qua (hoặc nghỉ nhiều ngày), bắt đầu lại chuỗi mới = 1
			this.currentStreak = 1;
		}

		this.longestStreak = Math.max(this.longestStreak, this.currentStreak);
		this.lastCompletedDate = completedDate;
		return true;
	}

	/**
	 * Tính streak thực tế có hiệu lực tại ngày tham chiếu (mặc định hôm nay).
	 * TC-05: Nếu bỏ lỡ một ngày (lastCompletedDate < referenceDate - 1 ngày) -> streak về 0.
	 * TC-06: Nếu hôm nay chưa hoàn thành nhưng hôm qua đã hoàn thành -> vẫn giữ currentStreak.
	 */
	public int getEffectiveStreak(LocalDate referenceDate) {
		if (this.lastCompletedDate == null) {
			return 0;
		}

		if (this.lastCompletedDate.equals(referenceDate)) {
			return this.currentStreak;
		}

		if (this.lastCompletedDate.equals(referenceDate.minusDays(1))) {
			// TC-06: Hôm qua xong, hôm nay chưa xong -> chuỗi vẫn còn bảo lưu trong ngày hôm nay
			return this.currentStreak;
		}

		// TC-05: Qua hết ngày hôm qua mà không hoàn thành -> Streak về 0
		return 0;
	}

	public boolean isCompletedOn(LocalDate referenceDate) {
		return this.lastCompletedDate != null && this.lastCompletedDate.equals(referenceDate);
	}
}
