package com.hsk.learning.service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hsk.account.domain.UserEntity;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.dto.ClassLeaderboardEntry;
import com.hsk.learning.dto.ClassLeaderboardResponse;
import com.hsk.learning.repository.UserXpTransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClassLeaderboardService {

	public static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

	private final ClassRepository classRepository;
	private final ClassMemberRepository classMemberRepository;
	private final UserXpTransactionRepository userXpTransactionRepository;

	@Transactional(readOnly = true)
	public ClassLeaderboardResponse getClassWeeklyLeaderboard(Long classId, Long currentUserId) {
		ClassEntity classroom = classRepository.findById(classId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND, "Không tìm thấy lớp học"));

		boolean isTeacher = classroom.getTeacher() != null && classroom.getTeacher().getId().equals(currentUserId);
		if (!isTeacher) {
			var memberOpt = classMemberRepository.findByClassroom_IdAndStudent_Id(classId, currentUserId);
			if (memberOpt.isEmpty() || memberOpt.get().getStatus() != ClassMemberStatus.ACTIVE) {
				throw new ApiException(ApiErrorCode.FORBIDDEN, "Bạn không có quyền xem bảng xếp hạng lớp học này");
			}
		}

		// Calculate Vietnam timezone Monday 00:00 to Sunday 23:59:59.999999999
		ZonedDateTime nowInVn = ZonedDateTime.now(VIETNAM_ZONE);
		LocalDate mondayThisWeek = nowInVn.toLocalDate().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
		Instant startOfWeek = mondayThisWeek.atStartOfDay(VIETNAM_ZONE).toInstant();
		Instant endOfWeek = mondayThisWeek.plusDays(6).atTime(LocalTime.MAX).atZone(VIETNAM_ZONE).toInstant();

		List<ClassMemberEntity> activeMembers = classMemberRepository.findByClassroomIdAndStatusWithStudent(
				classId,
				ClassMemberStatus.ACTIVE
		);

		if (activeMembers.isEmpty()) {
			return new ClassLeaderboardResponse(
					classroom.getId(),
					classroom.getTitle(),
					startOfWeek,
					endOfWeek,
					0,
					null,
					null,
					Collections.emptyList()
			);
		}

		List<Long> studentIds = activeMembers.stream()
				.map(m -> m.getStudent().getId())
				.toList();

		List<Object[]> xpResults = userXpTransactionRepository.sumXpByUserIdsBetweenDates(
				studentIds,
				startOfWeek,
				endOfWeek
		);

		Map<Long, Integer> xpMap = new HashMap<>();
		for (Object[] row : xpResults) {
			Long uid = ((Number) row[0]).longValue();
			int xp = ((Number) row[1]).intValue();
			xpMap.put(uid, xp);
		}

		record MemberXp(UserEntity student, int weeklyXp) {}

		List<MemberXp> memberXpList = new ArrayList<>(activeMembers.stream()
				.map(m -> new MemberXp(m.getStudent(), xpMap.getOrDefault(m.getStudent().getId(), 0)))
				.toList());

		// Sort by weeklyXp DESC, then by display name ASC
		memberXpList.sort(
				Comparator.comparingInt(MemberXp::weeklyXp).reversed()
						.thenComparing(m -> getDisplayName(m.student()), String.CASE_INSENSITIVE_ORDER)
		);

		List<ClassLeaderboardEntry> leaderboard = new ArrayList<>();
		int currentRank = 1;
		Integer currentUserRank = null;
		Integer currentUserWeeklyXp = null;

		for (int i = 0; i < memberXpList.size(); i++) {
			MemberXp item = memberXpList.get(i);
			if (i > 0 && item.weeklyXp() < memberXpList.get(i - 1).weeklyXp()) {
				currentRank = i + 1;
			}

			var levelInfo = XpLevelService.calculateLevel(item.student().getTotalXp());
			boolean isCurrent = item.student().getId().equals(currentUserId);

			if (isCurrent) {
				currentUserRank = currentRank;
				currentUserWeeklyXp = item.weeklyXp();
			}

			leaderboard.add(new ClassLeaderboardEntry(
					currentRank,
					item.student().getId(),
					getDisplayName(item.student()),
					item.student().getAvatarUrl(),
					item.weeklyXp(),
					levelInfo.level(),
					levelInfo.title(),
					isCurrent
			));
		}

		return new ClassLeaderboardResponse(
				classroom.getId(),
				classroom.getTitle(),
				startOfWeek,
				endOfWeek,
				activeMembers.size(),
				currentUserRank,
				currentUserWeeklyXp,
				leaderboard
		);
	}

	private String getDisplayName(UserEntity user) {
		if (user.getFullName() != null && !user.getFullName().isBlank()) {
			return user.getFullName();
		}
		return "Học sinh";
	}
}
