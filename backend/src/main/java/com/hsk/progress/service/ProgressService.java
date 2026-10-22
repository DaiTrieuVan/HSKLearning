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

import com.hsk.account.domain.RoleCode;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.assignment.domain.AssignmentStatus;
import com.hsk.assignment.domain.AssignmentStudentOverrideEntity;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentStudentOverrideRepository;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.progress.dto.AssignmentColumnHeaderDto;
import com.hsk.progress.dto.AssignmentStatisticsResponse;
import com.hsk.progress.dto.CellGradeDto;
import com.hsk.progress.dto.ClassGradebookResponse;
import com.hsk.progress.dto.GradeAttemptDetailDto;
import com.hsk.progress.dto.LateSubmissionItemDto;
import com.hsk.progress.dto.QuestionStatItemDto;
import com.hsk.progress.dto.ScoreDistributionItemDto;
import com.hsk.progress.dto.StudentGradeRowDto;
import com.hsk.progress.dto.UnsubmittedStudentItemDto;
import com.hsk.progress.dto.UnsubmittedStudentsResponse;
import com.hsk.progress.dto.ClassStudentProgressResponse;
import com.hsk.progress.dto.ClassStudentProgressSummaryDto;
import com.hsk.progress.dto.ClassStudentAssignmentItemDto;
import com.hsk.progress.dto.CompletedLessonItemDto;
import com.hsk.assignment.dto.AssignmentSnapshotQuestionDto;
import com.hsk.assignment.dto.StudentAnswerItemDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.RoundingMode;
import java.util.stream.Collectors;

/**
 * Service xử lý tính toán tiến độ học cá nhân (HTT-07-CN-001, QTN-02), bảng điểm lớp (HTT-07-CN-003, QTN-01, QTN-13)
 * và danh sách học sinh chưa nộp bài & nộp trễ (HTT-07-CN-004, QTN-01).
 */
@Service
public class ProgressService {

	private final UserRepository userRepository;
	private final HskLevelRepository hskLevelRepository;
	private final LessonRepository lessonRepository;
	private final LessonProgressRepository lessonProgressRepository;
	private final LessonVocabularyRepository lessonVocabularyRepository;
	private final AssignmentSubmissionRepository assignmentSubmissionRepository;
	private final ClassRepository classRepository;
	private final ClassMemberRepository classMemberRepository;
	private final AssignmentRepository assignmentRepository;
	private final UserRoleRepository userRoleRepository;
	private final AssignmentStudentOverrideRepository assignmentStudentOverrideRepository;
	private final ObjectMapper objectMapper = new ObjectMapper();

	public ProgressService(
			UserRepository userRepository,
			HskLevelRepository hskLevelRepository,
			LessonRepository lessonRepository,
			LessonProgressRepository lessonProgressRepository,
			LessonVocabularyRepository lessonVocabularyRepository,
			AssignmentSubmissionRepository assignmentSubmissionRepository,
			ClassRepository classRepository,
			ClassMemberRepository classMemberRepository,
			AssignmentRepository assignmentRepository,
			UserRoleRepository userRoleRepository,
			AssignmentStudentOverrideRepository assignmentStudentOverrideRepository
	) {
		this.userRepository = userRepository;
		this.hskLevelRepository = hskLevelRepository;
		this.lessonRepository = lessonRepository;
		this.lessonProgressRepository = lessonProgressRepository;
		this.lessonVocabularyRepository = lessonVocabularyRepository;
		this.assignmentSubmissionRepository = assignmentSubmissionRepository;
		this.classRepository = classRepository;
		this.classMemberRepository = classMemberRepository;
		this.assignmentRepository = assignmentRepository;
		this.userRoleRepository = userRoleRepository;
		this.assignmentStudentOverrideRepository = assignmentStudentOverrideRepository;
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

	/**
	 * Xem bảng điểm của cả lớp theo từng bài tập (HTT-07-CN-003, QTN-01, QTN-13).
	 * Truy vấn tối ưu chống N+1 query (Senior Backend Mode).
	 */
	@Transactional(readOnly = true)
	public ClassGradebookResponse getClassGradebook(Long userId, Long classId) {
		ClassEntity classroom = classRepository.findById(classId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND));

		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom.getTeacher() != null && classroom.getTeacher().getId().equals(userId);

		// QTN-01, TC-07, TC-08: Chỉ giáo viên phụ trách lớp hoặc Admin mới có quyền xem bảng điểm của lớp
		if (!isTeacherOwner && !isAdmin) {
			throw new ApiException(ApiErrorCode.FORBIDDEN, "Bạn không có quyền xem bảng điểm của lớp học này");
		}

		// 1. Lấy danh sách bài tập của lớp (loại bỏ CANCELLED)
		List<AssignmentEntity> assignments = assignmentRepository
				.findByClassroom_IdAndStatusNotOrderByCreatedAtAsc(classId, AssignmentStatus.CANCELLED);

		// 2. Lấy toàn bộ thành viên lớp (bao gồm cả ACTIVE, LEFT, REMOVED - TC-04)
		List<ClassMemberEntity> members = classMemberRepository.findByClassroomIdWithStudent(classId);

		// Deduplicate theo studentId (ưu tiên ACTIVE nếu có nhiều bản ghi)
		Map<Long, ClassMemberEntity> uniqueMembersMap = new LinkedHashMap<>();
		for (ClassMemberEntity cm : members) {
			if (cm.getStudent() != null) {
				Long stuId = cm.getStudent().getId();
				ClassMemberEntity existing = uniqueMembersMap.get(stuId);
				if (existing == null || (existing.getStatus() != ClassMemberStatus.ACTIVE && cm.getStatus() == ClassMemberStatus.ACTIVE)) {
					uniqueMembersMap.put(stuId, cm);
				}
			}
		}

		// Sắp xếp: Học sinh ACTIVE lên trước, sau đó theo họ tên/email
		List<ClassMemberEntity> sortedMembers = uniqueMembersMap.values().stream()
				.sorted(Comparator.comparing((ClassMemberEntity m) -> m.getStatus() == ClassMemberStatus.ACTIVE ? 0 : 1)
						.thenComparing(m -> m.getStudent().getFullName() != null ? m.getStudent().getFullName().toLowerCase() : "")
						.thenComparing(m -> m.getStudent().getEmail().toLowerCase()))
				.toList();

		// 3. Batch fetch toàn bộ submissions của lớp trong 1 câu SQL (tránh N+1 query)
		List<AssignmentSubmissionEntity> submissions = assignmentSubmissionRepository.findSubmissionsByClassroomId(classId);

		// Map: studentId -> (assignmentId -> List<AssignmentSubmissionEntity>)
		Map<Long, Map<Long, List<AssignmentSubmissionEntity>>> submissionMap = new HashMap<>();
		for (AssignmentSubmissionEntity sub : submissions) {
			if (sub.getStudent() != null && sub.getAssignment() != null) {
				Long stuId = sub.getStudent().getId();
				Long asgId = sub.getAssignment().getId();
				submissionMap.computeIfAbsent(stuId, k -> new HashMap<>())
						.computeIfAbsent(asgId, k -> new ArrayList<>())
						.add(sub);
			}
		}

		// Lưu trữ danh sách điểm của từng bài tập để tính assignmentAverageScore
		Map<Long, List<BigDecimal>> assignmentScores = new HashMap<>();

		// 4. Xây dựng từng hàng học sinh (StudentGradeRowDto)
		List<StudentGradeRowDto> studentRows = new ArrayList<>();
		int activeCount = 0;

		for (ClassMemberEntity member : sortedMembers) {
			UserEntity student = member.getStudent();
			Long studentId = student.getId();
			boolean isEnrolled = member.getStatus() == ClassMemberStatus.ACTIVE;
			if (isEnrolled) {
				activeCount++;
			}

			List<CellGradeDto> studentGrades = new ArrayList<>();
			int submittedCountForStudent = 0;
			BigDecimal totalScoreForStudent = BigDecimal.ZERO;

			for (AssignmentEntity assignment : assignments) {
				Long asgId = assignment.getId();
				List<AssignmentSubmissionEntity> studentSubs = submissionMap
						.getOrDefault(studentId, Collections.emptyMap())
						.getOrDefault(asgId, Collections.emptyList());

				// Chỉ xét các lượt hợp lệ (SUBMITTED hoặc AUTO_SUBMITTED) theo QTN-13
				List<AssignmentSubmissionEntity> validSubs = studentSubs.stream()
						.filter(s -> s.getStatus() == SubmissionStatus.SUBMITTED || s.getStatus() == SubmissionStatus.AUTO_SUBMITTED)
						.toList();

				if (validSubs.isEmpty()) {
					boolean inProgress = studentSubs.stream().anyMatch(s -> s.getStatus() == SubmissionStatus.IN_PROGRESS);
					String cellStatus = inProgress ? "IN_PROGRESS" : "NOT_SUBMITTED";
					studentGrades.add(new CellGradeDto(
							asgId,
							false,
							null,
							assignment.getTotalPoints(),
							null,
							false,
							cellStatus,
							studentSubs.size(),
							studentSubs.stream().map(s -> toGradeAttemptDetailDto(s, false, classroom)).toList()
					));
				} else {
					// QTN-13: Điểm trên bảng điểm là điểm cao nhất trong các lượt hợp lệ, tính theo điểm sau điều chỉnh nếu có
					AssignmentSubmissionEntity bestAttempt = validSubs.stream()
							.max(Comparator.comparing((AssignmentSubmissionEntity s) -> s.getEffectiveScore() != null ? s.getEffectiveScore() : BigDecimal.ZERO)
									.thenComparing(AssignmentSubmissionEntity::getAttemptNumber))
							.orElse(validSubs.get(0));

					BigDecimal bestScore = bestAttempt.getEffectiveScore() != null ? bestAttempt.getEffectiveScore() : BigDecimal.ZERO;
					BigDecimal totalPoints = assignment.getTotalPoints() != null && assignment.getTotalPoints().compareTo(BigDecimal.ZERO) > 0
							? assignment.getTotalPoints() : BigDecimal.valueOf(10);
					BigDecimal scorePercentage = bestScore.multiply(BigDecimal.valueOf(100))
							.divide(totalPoints, 2, java.math.RoundingMode.HALF_UP);
					boolean isAdjusted = bestAttempt.getAdjustedScore() != null;

					submittedCountForStudent++;
					totalScoreForStudent = totalScoreForStudent.add(bestScore);
					assignmentScores.computeIfAbsent(asgId, k -> new ArrayList<>()).add(bestScore);

					Long bestAttemptId = bestAttempt.getId();
					List<GradeAttemptDetailDto> attemptDtos = studentSubs.stream()
							.map(s -> toGradeAttemptDetailDto(s, Objects.equals(s.getId(), bestAttemptId), classroom))
							.toList();

					studentGrades.add(new CellGradeDto(
							asgId,
							true,
							bestScore,
							assignment.getTotalPoints(),
							scorePercentage,
							isAdjusted,
							bestAttempt.getStatus().name(),
							studentSubs.size(),
							attemptDtos
					));
				}
			}

			BigDecimal studentAvg = null;
			if (submittedCountForStudent > 0) {
				studentAvg = totalScoreForStudent.divide(BigDecimal.valueOf(submittedCountForStudent), 2, java.math.RoundingMode.HALF_UP);
			}

			studentRows.add(new StudentGradeRowDto(
					studentId,
					student.getFullName(),
					student.getEmail(),
					student.getAvatarUrl(),
					member.getStatus().name(),
					isEnrolled,
					submittedCountForStudent,
					studentAvg,
					studentGrades
			));
		}

		// 5. Xây dựng tiêu đề cột bài tập (AssignmentColumnHeaderDto)
		List<AssignmentColumnHeaderDto> assignmentHeaders = new ArrayList<>();
		for (AssignmentEntity assignment : assignments) {
			List<BigDecimal> scoresForAsg = assignmentScores.getOrDefault(assignment.getId(), Collections.emptyList());
			int subCount = scoresForAsg.size();
			BigDecimal avgScore = null;
			if (subCount > 0) {
				BigDecimal sum = scoresForAsg.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
				avgScore = sum.divide(BigDecimal.valueOf(subCount), 2, java.math.RoundingMode.HALF_UP);
			}
			assignmentHeaders.add(new AssignmentColumnHeaderDto(
					assignment.getId(),
					assignment.getTitle(),
					assignment.getTotalPoints(),
					assignment.getDueTime(),
					assignment.getCreatedAt(),
					subCount,
					avgScore
			));
		}

		// 6. Tính điểm trung bình của toàn lớp
		BigDecimal classAverageScore = null;
		List<BigDecimal> validStudentAverages = studentRows.stream()
				.map(StudentGradeRowDto::studentAverageScore)
				.filter(Objects::nonNull)
				.toList();
		if (!validStudentAverages.isEmpty()) {
			BigDecimal sum = validStudentAverages.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
			classAverageScore = sum.divide(BigDecimal.valueOf(validStudentAverages.size()), 2, java.math.RoundingMode.HALF_UP);
		}

		String teacherName = classroom.getTeacher() != null ? classroom.getTeacher().getFullName() : null;
		Long teacherId = classroom.getTeacher() != null ? classroom.getTeacher().getId() : null;

		return new ClassGradebookResponse(
				classroom.getId(),
				classroom.getTitle(),
				classroom.getJoinCode(),
				teacherId,
				teacherName,
				sortedMembers.size(),
				activeCount,
				assignments.size(),
				classAverageScore,
				assignmentHeaders,
				studentRows
		);
	}

	private GradeAttemptDetailDto toGradeAttemptDetailDto(AssignmentSubmissionEntity sub, boolean isBestAttempt, ClassEntity classroom) {
		String adjustedByName = null;
		if (sub.getAdjustedScore() != null) {
			if (classroom != null && classroom.getTeacher() != null) {
				adjustedByName = classroom.getTeacher().getFullName();
			}
		}
		return new GradeAttemptDetailDto(
				sub.getId(),
				sub.getAttemptNumber(),
				sub.getScore(),
				sub.getAdjustedScore(),
				sub.getAdjustReason(),
				sub.getAdjustedAt(),
				adjustedByName,
				sub.getEffectiveScore(),
				sub.getStatus().name(),
				sub.getSubmittedAt(),
				isBestAttempt
		);
	}

	/**
	 * Xem danh sách học sinh chưa nộp bài và học sinh nộp trễ (HTT-07-CN-004, QTN-01).
	 * Batch query tối ưu, chống N+1 query (Senior Backend Mode).
	 */
	@Transactional(readOnly = true)
	public UnsubmittedStudentsResponse getUnsubmittedStudents(Long teacherId, Long assignmentId) {
		AssignmentEntity assignment = assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.ASSIGNMENT_NOT_FOUND));

		ClassEntity classroom = assignment.getClassroom();
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(teacherId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom != null && classroom.getTeacher() != null && classroom.getTeacher().getId().equals(teacherId);

		// QTN-01, TC-05: Chỉ giáo viên phụ trách lớp hoặc Admin mới có quyền xem danh sách chưa nộp của bài tập
		if (!isTeacherOwner && !isAdmin) {
			throw new ApiException(ApiErrorCode.FORBIDDEN, "Bạn không có quyền truy cập dữ liệu bài nộp của lớp khác");
		}

		// Lấy danh sách thành viên ACTIVE của lớp (kèm Student)
		List<ClassMemberEntity> activeMembers = classMemberRepository.findByClassroomIdWithStudent(classroom.getId())
				.stream()
				.filter(cm -> cm.getStatus() == ClassMemberStatus.ACTIVE)
				.toList();

		// Batch fetch tất cả submission của assignment để tránh N+1
		List<AssignmentSubmissionEntity> submissions = assignmentSubmissionRepository.findByAssignment_Id(assignmentId);

		// Batch fetch tất cả overrides của assignment
		List<AssignmentStudentOverrideEntity> overrides = assignmentStudentOverrideRepository.findByAssignment_Id(assignmentId);
		Map<Long, AssignmentStudentOverrideEntity> overrideMap = overrides.stream()
				.filter(o -> o.getStudent() != null)
				.collect(Collectors.toMap(o -> o.getStudent().getId(), o -> o, (o1, o2) -> o1));

		// Gom nhóm submission theo studentId
		Map<Long, List<AssignmentSubmissionEntity>> submissionsByStudent = submissions.stream()
				.filter(s -> s.getStudent() != null)
				.collect(Collectors.groupingBy(s -> s.getStudent().getId()));

		Instant now = Instant.now();
		Instant originalDueTime = assignment.getDueTime();
		boolean isAssignmentOverdue = originalDueTime != null && now.isAfter(originalDueTime);

		List<UnsubmittedStudentItemDto> unsubmittedList = new ArrayList<>();
		List<LateSubmissionItemDto> lateList = new ArrayList<>();
		int submittedCount = 0;

		for (ClassMemberEntity member : activeMembers) {
			UserEntity student = member.getStudent();
			Long studentId = student.getId();

			List<AssignmentSubmissionEntity> studentSubs = submissionsByStudent.getOrDefault(studentId, Collections.emptyList());
			AssignmentStudentOverrideEntity studentOverride = overrideMap.get(studentId);
			Instant extendedDueTime = studentOverride != null ? studentOverride.getExtendedDueTime() : null;
			Instant effectiveDueTime = extendedDueTime != null ? extendedDueTime : originalDueTime;

			// Lọc các lượt nộp hợp lệ (SUBMITTED hoặc AUTO_SUBMITTED)
			List<AssignmentSubmissionEntity> validSubs = studentSubs.stream()
					.filter(s -> s.getStatus() == SubmissionStatus.SUBMITTED || s.getStatus() == SubmissionStatus.AUTO_SUBMITTED)
					.toList();

			if (validSubs.isEmpty()) {
				// Học sinh chưa nộp bài
				boolean inProgress = studentSubs.stream().anyMatch(s -> s.getStatus() == SubmissionStatus.IN_PROGRESS);
				String statusStr = inProgress ? "IN_PROGRESS" : "NOT_STARTED";
				Instant startedAt = inProgress ? studentSubs.get(0).getStartedAt() : null;

				// TC-03: Bài đã quá hạn thì gắn nhãn quá hạn (isOverdue = true), chưa đến hạn thì isOverdue = false
				boolean isOverdue = effectiveDueTime != null && now.isAfter(effectiveDueTime);

				unsubmittedList.add(new UnsubmittedStudentItemDto(
						studentId,
						student.getFullName() != null ? student.getFullName() : student.getEmail(),
						student.getEmail(),
						student.getAvatarUrl(),
						statusStr,
						startedAt,
						extendedDueTime != null,
						effectiveDueTime,
						isOverdue
				));
			} else {
				submittedCount++;
				// Học sinh đã nộp bài. Kiểm tra xem có nộp sau hạn gốc không (TC-02)
				AssignmentSubmissionEntity bestOrLatest = validSubs.stream()
						.max(Comparator.comparing((AssignmentSubmissionEntity s) -> s.getEffectiveScore() != null ? s.getEffectiveScore() : BigDecimal.ZERO)
								.thenComparing(AssignmentSubmissionEntity::getAttemptNumber))
						.orElse(validSubs.get(0));

				Instant submittedAt = bestOrLatest.getSubmittedAt();
				boolean isLate = originalDueTime != null && submittedAt != null && submittedAt.isAfter(originalDueTime);

				if (isLate) {
					// TC-02: Học sinh nộp sau hạn gốc hiển thị riêng với nhãn nộp trễ
					lateList.add(new LateSubmissionItemDto(
							studentId,
							student.getFullName() != null ? student.getFullName() : student.getEmail(),
							student.getEmail(),
							student.getAvatarUrl(),
							bestOrLatest.getId(),
							submittedAt,
							originalDueTime,
							extendedDueTime,
							bestOrLatest.getScore(),
							bestOrLatest.getEffectiveScore(),
							bestOrLatest.getStatus().name(),
							true
					));
				}
			}
		}

		// Sắp xếp: học sinh quá hạn lên trước, sau đó theo tên
		unsubmittedList.sort((a, b) -> {
			if (a.isOverdue() != b.isOverdue()) {
				return a.isOverdue() ? -1 : 1;
			}
			return a.fullName().compareToIgnoreCase(b.fullName());
		});

		// Sắp xếp danh sách nộp trễ theo submittedAt mới nhất
		lateList.sort((a, b) -> {
			if (a.submittedAt() == null) return 1;
			if (b.submittedAt() == null) return -1;
			return b.submittedAt().compareTo(a.submittedAt());
		});

		return new UnsubmittedStudentsResponse(
				assignment.getId(),
				assignment.getTitle(),
				classroom.getId(),
				classroom.getTitle(),
				originalDueTime,
				isAssignmentOverdue,
				activeMembers.size(),
				submittedCount,
				unsubmittedList.size(),
				lateList.size(),
				unsubmittedList,
				lateList
		);
	}

	/**
	 * HTT-07-CN-005: Xem thống kê theo bài tập (điểm TB, phân bố điểm, tỷ lệ câu sai).
	 */
	@Transactional(readOnly = true)
	public AssignmentStatisticsResponse getAssignmentStatistics(Long teacherId, Long assignmentId) {
		AssignmentEntity assignment = assignmentRepository.findById(assignmentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.ASSIGNMENT_NOT_FOUND));

		ClassEntity classroom = assignment.getClassroom();

		// TC-05: QTN-01 - Giáo viên chỉ xem được bài tập của lớp do mình phụ trách
		boolean isClassTeacher = classroom.getTeacher().getId().equals(teacherId)
				|| assignment.getTeacher().getId().equals(teacherId);
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(teacherId, RoleCode.ADMIN);
		if (!isClassTeacher && !isAdmin) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}

		// Lấy danh sách thành viên active của lớp
		List<ClassMemberEntity> activeMembers = classMemberRepository.findByClassroomIdWithStudent(classroom.getId())
				.stream()
				.filter(m -> m.getStatus() == ClassMemberStatus.ACTIVE)
				.toList();
		int totalStudents = activeMembers.size();

		// Lấy tất cả submissions của bài tập
		List<AssignmentSubmissionEntity> submissions = assignmentSubmissionRepository.findByAssignment_Id(assignmentId);

		// Gom nhóm theo học sinh và chọn Best Attempt (QTN-13, TC-03)
		Map<Long, List<AssignmentSubmissionEntity>> studentSubmissionsMap = submissions.stream()
				.filter(s -> s.getStatus() == SubmissionStatus.SUBMITTED || s.getStatus() == SubmissionStatus.AUTO_SUBMITTED)
				.collect(Collectors.groupingBy(s -> s.getStudent().getId()));

		List<AssignmentSubmissionEntity> bestSubmissions = new ArrayList<>();
		for (List<AssignmentSubmissionEntity> studentSubs : studentSubmissionsMap.values()) {
			AssignmentSubmissionEntity best = studentSubs.stream().max((s1, s2) -> {
				BigDecimal score1 = s1.getAdjustedScore() != null ? s1.getAdjustedScore() : (s1.getScore() != null ? s1.getScore() : BigDecimal.ZERO);
				BigDecimal score2 = s2.getAdjustedScore() != null ? s2.getAdjustedScore() : (s2.getScore() != null ? s2.getScore() : BigDecimal.ZERO);
				int cmp = score1.compareTo(score2);
				if (cmp != 0) return cmp;
				if (s1.getSubmittedAt() != null && s2.getSubmittedAt() != null) {
					return s1.getSubmittedAt().compareTo(s2.getSubmittedAt());
				}
				return Integer.compare(s1.getAttemptNumber(), s2.getAttemptNumber());
			}).orElse(null);

			if (best != null) {
				bestSubmissions.add(best);
			}
		}

		int submittedCount = bestSubmissions.size();

		// TC-04: Dữ liệu rỗng khi bài tập chưa có bài nộp nào
		if (submittedCount == 0) {
			return new AssignmentStatisticsResponse(
					assignment.getId(),
					assignment.getTitle(),
					classroom.getId(),
					classroom.getTitle(),
					totalStudents,
					0,
					false,
					assignment.getTotalPoints(),
					null,
					null,
					null,
					Collections.emptyList(),
					Collections.emptyList()
			);
		}

		// TC-01: Tính điểm trung bình, cao nhất, thấp nhất (dựa trên Best Attempt của mỗi học sinh)
		List<BigDecimal> effectiveScores = bestSubmissions.stream()
				.map(s -> s.getAdjustedScore() != null ? s.getAdjustedScore() : (s.getScore() != null ? s.getScore() : BigDecimal.ZERO))
				.toList();

		BigDecimal maxScore = effectiveScores.stream().max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
		BigDecimal minScore = effectiveScores.stream().min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
		BigDecimal sumScore = effectiveScores.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal averageScore = sumScore.divide(BigDecimal.valueOf(submittedCount), 1, RoundingMode.HALF_UP);

		// Phân bố phổ điểm theo các khoảng chuẩn (Dưới 5.0, 5.0 - 6.4, 6.5 - 7.9, 8.0 - 10.0)
		BigDecimal t5 = BigDecimal.valueOf(5.0);
		BigDecimal t65 = BigDecimal.valueOf(6.5);
		BigDecimal t8 = BigDecimal.valueOf(8.0);

		long countBelow5 = effectiveScores.stream().filter(s -> s.compareTo(t5) < 0).count();
		long count5To65 = effectiveScores.stream().filter(s -> s.compareTo(t5) >= 0 && s.compareTo(t65) < 0).count();
		long count65To8 = effectiveScores.stream().filter(s -> s.compareTo(t65) >= 0 && s.compareTo(t8) < 0).count();
		long count8To10 = effectiveScores.stream().filter(s -> s.compareTo(t8) >= 0).count();

		List<ScoreDistributionItemDto> distribution = List.of(
				new ScoreDistributionItemDto("BELOW_5", "Dưới 5.0 (Cần cố gắng)", BigDecimal.ZERO, BigDecimal.valueOf(4.9), countBelow5, calcPercentage(countBelow5, submittedCount)),
				new ScoreDistributionItemDto("FROM_5_TO_6_5", "5.0 - 6.4 (Trung bình)", BigDecimal.valueOf(5.0), BigDecimal.valueOf(6.4), count5To65, calcPercentage(count5To65, submittedCount)),
				new ScoreDistributionItemDto("FROM_6_5_TO_8", "6.5 - 7.9 (Khá)", BigDecimal.valueOf(6.5), BigDecimal.valueOf(7.9), count65To8, calcPercentage(count65To8, submittedCount)),
				new ScoreDistributionItemDto("FROM_8_TO_10", "8.0 - 10.0 (Giỏi / Xuất sắc)", BigDecimal.valueOf(8.0), BigDecimal.valueOf(10.0), count8To10, calcPercentage(count8To10, submittedCount))
		);

		// TC-02 & TC-03: Thống kê tỷ lệ câu sai từ snapshotData và câu trả lời trong Best Attempt
		List<AssignmentSnapshotQuestionDto> snapshotQuestions = parseSnapshotQuestions(assignment.getSnapshotData());
		List<List<StudentAnswerItemDto>> studentAnswersList = bestSubmissions.stream()
				.map(s -> parseAnswers(s.getAnswersData()))
				.toList();

		List<QuestionStatItemDto> questionStats = new ArrayList<>();
		for (AssignmentSnapshotQuestionDto q : snapshotQuestions) {
			long correctCount = 0;
			long wrongCount = 0;

			for (List<StudentAnswerItemDto> answers : studentAnswersList) {
				Optional<StudentAnswerItemDto> answerOpt = answers.stream()
						.filter(a -> a.questionId() != null && a.questionId().equals(q.questionId()))
						.findFirst();

				if (answerOpt.isPresent() && Boolean.TRUE.equals(answerOpt.get().isCorrect())) {
					correctCount++;
				} else {
					wrongCount++;
				}
			}

			long totalAnswersForQuestion = correctCount + wrongCount;
			double wrongPercentage = totalAnswersForQuestion > 0
					? Math.round((wrongCount * 100.0 / totalAnswersForQuestion) * 10.0) / 10.0
					: 0.0;

			questionStats.add(new QuestionStatItemDto(
					q.questionId(),
					q.sortOrder(),
					q.type(),
					q.content(),
					q.points(),
					totalAnswersForQuestion,
					correctCount,
					wrongCount,
					wrongPercentage
			));
		}

		// TC-02: Bắt buộc sắp xếp câu có tỷ lệ sai nhiều nhất lên đầu
		questionStats.sort(Comparator.comparingDouble(QuestionStatItemDto::wrongPercentage).reversed()
				.thenComparingInt(QuestionStatItemDto::sortOrder));

		return new AssignmentStatisticsResponse(
				assignment.getId(),
				assignment.getTitle(),
				classroom.getId(),
				classroom.getTitle(),
				totalStudents,
				submittedCount,
				true,
				assignment.getTotalPoints(),
				averageScore,
				maxScore,
				minScore,
				distribution,
				questionStats
		);
	}

	private double calcPercentage(long count, int total) {
		if (total <= 0) return 0.0;
		return Math.round((count * 100.0 / total) * 10.0) / 10.0;
	}

	private List<AssignmentSnapshotQuestionDto> parseSnapshotQuestions(String json) {
		if (json == null || json.trim().isEmpty()) {
			return Collections.emptyList();
		}
		try {
			return objectMapper.readValue(json, new TypeReference<List<AssignmentSnapshotQuestionDto>>() {});
		} catch (JsonProcessingException e) {
			return Collections.emptyList();
		}
	}

	private List<StudentAnswerItemDto> parseAnswers(String json) {
		if (json == null || json.trim().isEmpty()) {
			return Collections.emptyList();
		}
		try {
			return objectMapper.readValue(json, new TypeReference<List<StudentAnswerItemDto>>() {});
		} catch (JsonProcessingException e) {
			return Collections.emptyList();
		}
	}

	/**
	 * Xem tiến độ của từng học sinh trong lớp (HTT-07-CN-006, QTN-01, QTN-13).
	 *
	 * @param teacherId id giáo viên gọi API
	 * @param classId id lớp học
	 * @param studentId id học sinh trong lớp
	 * @return ClassStudentProgressResponse chứa tiến độ bài học HSK, bài tập và điểm số trong lớp
	 */
	@Transactional(readOnly = true)
	public ClassStudentProgressResponse getClassStudentProgress(Long teacherId, Long classId, Long studentId) {
		// 1. Kiểm tra tồn tại lớp học
		ClassEntity classroom = classRepository.findById(classId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND));

		// 2. QTN-01: Kiểm tra quyền giáo viên phụ trách lớp hoặc ADMIN (TC-04)
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(teacherId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom.getTeacher() != null && classroom.getTeacher().getId().equals(teacherId);
		if (!isAdmin && !isTeacherOwner) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}

		// 3. QTN-01 & TC-04: Kiểm tra học sinh có thuộc lớp của giáo viên hay không
		ClassMemberEntity member = classMemberRepository.findByClassroom_IdAndStudent_Id(classId, studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.FORBIDDEN));

		UserEntity student = member.getStudent();
		String studentName = student != null ? student.getFullName() : "N/A";
		String studentEmail = student != null ? student.getEmail() : "N/A";
		String membershipStatus = member.getStatus() != null ? member.getStatus().name() : "ACTIVE";
		Instant joinedAt = member.getJoinedAt();

		// 4. Lấy danh sách bài tập đã công bố của lớp (QTN-01: Chỉ bài tập của lớp này, TC-02)
		List<AssignmentEntity> classAssignments = assignmentRepository
				.findByClassroom_IdAndStatusNotOrderByCreatedAtAsc(classId, AssignmentStatus.CANCELLED);

		// 5. Lấy các bài nộp của học sinh đối với lớp này (tránh N+1)
		List<AssignmentSubmissionEntity> submissions = assignmentSubmissionRepository
				.findByAssignment_Classroom_IdAndStudent_Id(classId, studentId);

		// 6. Lấy các cấu hình override hạn nộp / làm lại của học sinh trong lớp này
		List<AssignmentStudentOverrideEntity> overrides = assignmentStudentOverrideRepository
				.findByAssignment_Classroom_IdAndStudent_Id(classId, studentId);
		Map<Long, AssignmentStudentOverrideEntity> overrideMap = overrides.stream()
				.filter(o -> o.getAssignment() != null)
				.collect(Collectors.toMap(o -> o.getAssignment().getId(), o -> o, (a, b) -> a));

		// Gom nhóm submissions theo assignmentId
		Map<Long, List<AssignmentSubmissionEntity>> submissionsByAssignment = submissions.stream()
				.filter(s -> s.getAssignment() != null)
				.collect(Collectors.groupingBy(s -> s.getAssignment().getId()));

		Instant now = Instant.now();
		List<ClassStudentAssignmentItemDto> assignmentItems = new ArrayList<>();
		List<Double> validPercentages = new ArrayList<>();
		int submittedAssignmentsCount = 0;
		int overdueAssignmentsCount = 0;

		for (AssignmentEntity assignment : classAssignments) {
			Long aId = assignment.getId();
			AssignmentStudentOverrideEntity override = overrideMap.get(aId);
			Instant effectiveDueDate = (override != null && override.getExtendedDueTime() != null)
					? override.getExtendedDueTime()
					: assignment.getDueTime();

			List<AssignmentSubmissionEntity> aSubs = submissionsByAssignment.getOrDefault(aId, Collections.emptyList());
			List<AssignmentSubmissionEntity> submittedList = aSubs.stream()
					.filter(s -> s.getStatus() == SubmissionStatus.SUBMITTED || s.getStatus() == SubmissionStatus.AUTO_SUBMITTED)
					.toList();

			int attemptCount = submittedList.size();

			if (submittedList.isEmpty()) {
				boolean isOverdue = effectiveDueDate != null && now.isAfter(effectiveDueDate);
				if (isOverdue) {
					overdueAssignmentsCount++;
				}
				String status = isOverdue ? "OVERDUE" : "NOT_SUBMITTED";

				assignmentItems.add(new ClassStudentAssignmentItemDto(
						aId,
						assignment.getTitle(),
						effectiveDueDate,
						assignment.getTotalPoints(),
						status,
						0,
						null,
						null,
						null,
						null,
						null,
						false,
						null
				));
			} else {
				submittedAssignmentsCount++;

				// Lọc Best Attempt theo QTN-13
				AssignmentSubmissionEntity bestSub = null;
				BigDecimal bestEffectiveScore = null;

				for (AssignmentSubmissionEntity sub : submittedList) {
					BigDecimal currentEffectiveScore = sub.getAdjustedScore() != null ? sub.getAdjustedScore() : sub.getScore();
					if (bestSub == null) {
						bestSub = sub;
						bestEffectiveScore = currentEffectiveScore;
					} else {
						if (currentEffectiveScore != null && bestEffectiveScore != null) {
							if (currentEffectiveScore.compareTo(bestEffectiveScore) > 0) {
								bestSub = sub;
								bestEffectiveScore = currentEffectiveScore;
							} else if (currentEffectiveScore.compareTo(bestEffectiveScore) == 0) {
								if (sub.getAttemptNumber() > bestSub.getAttemptNumber()) {
									bestSub = sub;
									bestEffectiveScore = currentEffectiveScore;
								}
							}
						} else if (currentEffectiveScore != null) {
							bestSub = sub;
							bestEffectiveScore = currentEffectiveScore;
						}
					}
				}

				boolean isLate = bestSub.getSubmittedAt() != null && effectiveDueDate != null
						&& bestSub.getSubmittedAt().isAfter(effectiveDueDate);

				BigDecimal percentage = null;
				if (bestEffectiveScore != null && assignment.getTotalPoints() != null
						&& assignment.getTotalPoints().compareTo(BigDecimal.ZERO) > 0) {
					double pct = (bestEffectiveScore.doubleValue() / assignment.getTotalPoints().doubleValue()) * 100.0;
					percentage = BigDecimal.valueOf(Math.round(pct * 10.0) / 10.0);
					validPercentages.add(percentage.doubleValue());
				}

				String feedback = bestSub.getAdjustReason();
				String status = isLate ? "LATE" : "SUBMITTED";

				assignmentItems.add(new ClassStudentAssignmentItemDto(
						aId,
						assignment.getTitle(),
						effectiveDueDate,
						assignment.getTotalPoints(),
						status,
						attemptCount,
						bestSub.getScore(),
						bestSub.getAdjustedScore(),
						bestEffectiveScore,
						percentage,
						bestSub.getSubmittedAt(),
						isLate,
						feedback
				));
			}
		}

		// 7. Lấy danh sách bài học HSK đã hoàn thành
		List<LessonProgressEntity> lessonProgresses = lessonProgressRepository.findAllByUserId(studentId);
		List<CompletedLessonItemDto> completedLessons = new ArrayList<>();
		Set<Long> completedLessonIds = new HashSet<>();

		for (LessonProgressEntity lp : lessonProgresses) {
			LessonEntity lesson = lp.getLesson();
			if (lesson != null && !lesson.isHidden()) {
				completedLessonIds.add(lesson.getId());
				String levelCode = lesson.getHskLevel() != null ? lesson.getHskLevel().getCode() : "HSK";
				String levelName = lesson.getHskLevel() != null ? lesson.getHskLevel().getTitle() : "HSK";
				int levelNumber = lesson.getHskLevel() != null ? lesson.getHskLevel().getLevelNumber() : 1;
				completedLessons.add(new CompletedLessonItemDto(
						lesson.getId(),
						lesson.getTitle(),
						levelCode,
						levelName,
						levelNumber,
						lp.getCompletedAt()
				));
			}
		}
		completedLessons.sort(Comparator.comparing(CompletedLessonItemDto::completedAt, Comparator.nullsLast(Comparator.reverseOrder())));

		// 8. Tính tiến độ theo từng cấp độ HSK
		List<HskLevelEntity> visibleLevels = hskLevelRepository.findAllByHiddenFalseOrderByLevelNumberAsc();
		List<HskLevelProgressDto> levelProgressList = new ArrayList<>();

		for (HskLevelEntity level : visibleLevels) {
			List<LessonEntity> visibleLessons = lessonRepository
					.findAllByHskLevelIdAndHiddenFalseOrderBySortOrderAsc(level.getId());
			int totalLessonsInLevel = visibleLessons.size();
			int completedInLevel = 0;
			int totalVocabInLevel = 0;
			int vocabLearnedInLevel = 0;

			for (LessonEntity lesson : visibleLessons) {
				int vocabCount = lessonVocabularyRepository.findAllByLessonIdOrderBySortOrderAsc(lesson.getId()).size();
				totalVocabInLevel += vocabCount;
				if (completedLessonIds.contains(lesson.getId())) {
					completedInLevel++;
					vocabLearnedInLevel += vocabCount;
				}
			}

			double progressPercent = totalLessonsInLevel == 0 ? 0.0
					: Math.round(((completedInLevel * 100.0) / totalLessonsInLevel) * 10.0) / 10.0;

			levelProgressList.add(new HskLevelProgressDto(
					level.getId(),
					level.getCode(),
					level.getTitle(),
					level.getLevelNumber(),
					completedInLevel,
					totalLessonsInLevel,
					progressPercent,
					vocabLearnedInLevel,
					totalVocabInLevel
			));
		}

		// 9. Tính điểm trung bình phần trăm & chỉ số tổng quan
		BigDecimal averageScorePercentage = null;
		if (!validPercentages.isEmpty()) {
			double avg = validPercentages.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
			averageScorePercentage = BigDecimal.valueOf(Math.round(avg * 10.0) / 10.0);
		}

		// TC-03: Dữ liệu rỗng khi học sinh chưa nộp bài nào và chưa học bài nào
		boolean hasActivity = (submittedAssignmentsCount > 0) || (!completedLessons.isEmpty());

		ClassStudentProgressSummaryDto summary = new ClassStudentProgressSummaryDto(
				classAssignments.size(),
				submittedAssignmentsCount,
				overdueAssignmentsCount,
				averageScorePercentage,
				completedLessons.size()
		);

		return new ClassStudentProgressResponse(
				classroom.getId(),
				classroom.getTitle(),
				classroom.getJoinCode(),
				studentId,
				studentName,
				studentEmail,
				membershipStatus,
				joinedAt,
				hasActivity,
				summary,
				assignmentItems,
				completedLessons,
				levelProgressList
		);
	}

	/**
	 * Xuất bảng điểm của lớp ra tệp Excel định dạng .xlsx (HTT-07-CN-007, QTN-01).
	 *
	 * @param userId id giáo viên gọi API
	 * @param classId id lớp học
	 * @param startDate mốc thời gian bắt đầu lọc bài tập (optional)
	 * @param endDate mốc thời gian kết thúc lọc bài tập (optional)
	 * @return byte[] nội dung file Excel .xlsx
	 */
	@Transactional(readOnly = true)
	public byte[] exportClassGradebookToExcel(Long userId, Long classId, Instant startDate, Instant endDate) {
		// 1. Kiểm tra ngày bắt đầu không được sau ngày kết thúc (TC-03)
		if (startDate != null && endDate != null && startDate.isAfter(endDate)) {
			throw new ApiException(ApiErrorCode.INVALID_DATE_RANGE);
		}

		// 2. Kiểm tra tồn tại lớp học
		ClassEntity classroom = classRepository.findById(classId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND));

		// 3. Phân quyền QTN-01: Chỉ giáo viên phụ trách lớp hoặc Admin (TC-06)
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.ADMIN);
		boolean isTeacherOwner = classroom.getTeacher() != null && classroom.getTeacher().getId().equals(userId);
		if (!isTeacherOwner && !isAdmin) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}

		// 4. Lấy danh sách bài tập của lớp (loại bỏ CANCELLED)
		List<AssignmentEntity> allAssignments = assignmentRepository
				.findByClassroom_IdAndStatusNotOrderByCreatedAtAsc(classId, AssignmentStatus.CANCELLED);

		// Lọc bài tập theo khoảng thời gian nếu có truyền
		List<AssignmentEntity> filteredAssignments = allAssignments.stream()
				.filter(a -> {
					Instant time = a.getStartTime() != null ? a.getStartTime() : a.getCreatedAt();
					if (startDate != null && time != null && time.isBefore(startDate)) {
						return false;
					}
					if (endDate != null && time != null && time.isAfter(endDate)) {
						return false;
					}
					return true;
				})
				.toList();

		// TC-02: Khoảng thời gian không có bài tập nào -> Báo lỗi, không tạo file rỗng
		if (filteredAssignments.isEmpty()) {
			throw new ApiException(ApiErrorCode.NO_DATA_FOR_PERIOD);
		}

		// 5. Lấy danh sách thành viên lớp
		List<ClassMemberEntity> members = classMemberRepository.findByClassroomIdWithStudent(classId);
		Map<Long, ClassMemberEntity> uniqueMembersMap = new LinkedHashMap<>();
		for (ClassMemberEntity cm : members) {
			if (cm.getStudent() != null) {
				Long stuId = cm.getStudent().getId();
				ClassMemberEntity existing = uniqueMembersMap.get(stuId);
				if (existing == null || (existing.getStatus() != ClassMemberStatus.ACTIVE && cm.getStatus() == ClassMemberStatus.ACTIVE)) {
					uniqueMembersMap.put(stuId, cm);
				}
			}
		}

		List<ClassMemberEntity> sortedMembers = uniqueMembersMap.values().stream()
				.sorted(Comparator.comparing((ClassMemberEntity m) -> m.getStatus() == ClassMemberStatus.ACTIVE ? 0 : 1)
						.thenComparing(m -> m.getStudent().getFullName() != null ? m.getStudent().getFullName().toLowerCase() : "")
						.thenComparing(m -> m.getStudent().getEmail().toLowerCase()))
				.toList();

		// 6. Batch fetch bài nộp của cả lớp
		List<AssignmentSubmissionEntity> submissions = assignmentSubmissionRepository.findSubmissionsByClassroomId(classId);

		// Map: studentId -> (assignmentId -> List<AssignmentSubmissionEntity>)
		Map<Long, Map<Long, List<AssignmentSubmissionEntity>>> studentAssignmentSubs = new HashMap<>();
		for (AssignmentSubmissionEntity sub : submissions) {
			if (sub.getStudent() != null && sub.getAssignment() != null) {
				studentAssignmentSubs
						.computeIfAbsent(sub.getStudent().getId(), k -> new HashMap<>())
						.computeIfAbsent(sub.getAssignment().getId(), k -> new ArrayList<>())
						.add(sub);
			}
		}

		// 7. Tạo Workbook bằng Apache POI
		try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook()) {
			org.apache.poi.xssf.usermodel.XSSFSheet sheet = workbook.createSheet("Bảng điểm lớp");

			// Font styles
			org.apache.poi.ss.usermodel.Font titleFont = workbook.createFont();
			titleFont.setFontName("Arial");
			titleFont.setFontHeightInPoints((short) 14);
			titleFont.setBold(true);

			org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
			headerFont.setFontName("Arial");
			headerFont.setFontHeightInPoints((short) 10);
			headerFont.setBold(true);
			headerFont.setColor(org.apache.poi.ss.usermodel.IndexedColors.WHITE.getIndex());

			org.apache.poi.ss.usermodel.Font regularFont = workbook.createFont();
			regularFont.setFontName("Arial");
			regularFont.setFontHeightInPoints((short) 10);

			// Cell styles
			org.apache.poi.ss.usermodel.CellStyle titleStyle = workbook.createCellStyle();
			titleStyle.setFont(titleFont);

			org.apache.poi.ss.usermodel.CellStyle headerStyle = workbook.createCellStyle();
			headerStyle.setFont(headerFont);
			headerStyle.setFillForegroundColor(org.apache.poi.ss.usermodel.IndexedColors.ROYAL_BLUE.getIndex());
			headerStyle.setFillPattern(org.apache.poi.ss.usermodel.FillPatternType.SOLID_FOREGROUND);
			headerStyle.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
			headerStyle.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
			headerStyle.setBorderTop(org.apache.poi.ss.usermodel.BorderStyle.THIN);
			headerStyle.setBorderBottom(org.apache.poi.ss.usermodel.BorderStyle.THIN);
			headerStyle.setBorderLeft(org.apache.poi.ss.usermodel.BorderStyle.THIN);
			headerStyle.setBorderRight(org.apache.poi.ss.usermodel.BorderStyle.THIN);

			org.apache.poi.ss.usermodel.CellStyle dataTextStyle = workbook.createCellStyle();
			dataTextStyle.setFont(regularFont);
			dataTextStyle.setBorderTop(org.apache.poi.ss.usermodel.BorderStyle.THIN);
			dataTextStyle.setBorderBottom(org.apache.poi.ss.usermodel.BorderStyle.THIN);
			dataTextStyle.setBorderLeft(org.apache.poi.ss.usermodel.BorderStyle.THIN);
			dataTextStyle.setBorderRight(org.apache.poi.ss.usermodel.BorderStyle.THIN);

			org.apache.poi.ss.usermodel.CellStyle numericStyle = workbook.createCellStyle();
			numericStyle.setFont(regularFont);
			numericStyle.setDataFormat(workbook.createDataFormat().getFormat("#,##0.0"));
			numericStyle.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.RIGHT);
			numericStyle.setBorderTop(org.apache.poi.ss.usermodel.BorderStyle.THIN);
			numericStyle.setBorderBottom(org.apache.poi.ss.usermodel.BorderStyle.THIN);
			numericStyle.setBorderLeft(org.apache.poi.ss.usermodel.BorderStyle.THIN);
			numericStyle.setBorderRight(org.apache.poi.ss.usermodel.BorderStyle.THIN);

			int rowIdx = 0;

			// Row 0: Tiêu đề
			org.apache.poi.ss.usermodel.Row titleRow = sheet.createRow(rowIdx++);
			org.apache.poi.ss.usermodel.Cell titleCell = titleRow.createCell(0);
			titleCell.setCellValue("BẢNG ĐIỂM LỚP HỌC: " + sanitizeForExcel(classroom.getTitle()) + " (" + classroom.getJoinCode() + ")");
			titleCell.setCellStyle(titleStyle);

			// Row 1: Thông tin giáo viên & ngày xuất
			org.apache.poi.ss.usermodel.Row metaRow = sheet.createRow(rowIdx++);
			String teacherName = classroom.getTeacher() != null ? sanitizeForExcel(classroom.getTeacher().getFullName()) : "N/A";
			metaRow.createCell(0).setCellValue("Giáo viên phụ trách: " + teacherName + " | Thời gian xuất: " + Instant.now().toString());

			// Dòng trống
			rowIdx++;

			// Row Header
			org.apache.poi.ss.usermodel.Row headerRow = sheet.createRow(rowIdx++);
			headerRow.setHeightInPoints(24);

			int colIdx = 0;
			createCellWithStyle(headerRow, colIdx++, "STT", headerStyle);
			createCellWithStyle(headerRow, colIdx++, "HỌ VÀ TÊN", headerStyle);
			createCellWithStyle(headerRow, colIdx++, "EMAIL", headerStyle);
			createCellWithStyle(headerRow, colIdx++, "TRẠNG THÁI", headerStyle);

			for (AssignmentEntity a : filteredAssignments) {
				String aHeader = sanitizeForExcel(a.getTitle()) + " (" + a.getTotalPoints() + "đ)";
				createCellWithStyle(headerRow, colIdx++, aHeader, headerStyle);
			}
			createCellWithStyle(headerRow, colIdx++, "ĐIỂM TRUNG BÌNH (%)", headerStyle);

			// Fill data
			int stt = 1;
			for (ClassMemberEntity member : sortedMembers) {
				org.apache.poi.ss.usermodel.Row dataRow = sheet.createRow(rowIdx++);
				colIdx = 0;

				// STT
				org.apache.poi.ss.usermodel.Cell sttCell = dataRow.createCell(colIdx++);
				sttCell.setCellValue(stt++);
				sttCell.setCellStyle(dataTextStyle);

				// Họ và tên (TC-04, TC-05: Hỗ trợ tiếng Việt có dấu, chống Formula Injection)
				String studentName = member.getStudent() != null ? member.getStudent().getFullName() : "N/A";
				createCellWithStyle(dataRow, colIdx++, sanitizeForExcel(studentName), dataTextStyle);

				// Email
				String studentEmail = member.getStudent() != null ? member.getStudent().getEmail() : "N/A";
				createCellWithStyle(dataRow, colIdx++, sanitizeForExcel(studentEmail), dataTextStyle);

				// Trạng thái
				String statusText = member.getStatus() == ClassMemberStatus.ACTIVE ? "Đang học"
						: member.getStatus() == ClassMemberStatus.LEFT ? "Tự rời lớp" : "Đã bị xóa";
				createCellWithStyle(dataRow, colIdx++, statusText, dataTextStyle);

				// Điểm các bài tập (TC-04: Ô điểm là số NUMERIC)
				Long studentId = member.getStudent() != null ? member.getStudent().getId() : null;
				Map<Long, List<AssignmentSubmissionEntity>> studentSubs = studentId != null
						? studentAssignmentSubs.getOrDefault(studentId, Collections.emptyMap())
						: Collections.emptyMap();

				List<Double> percentages = new ArrayList<>();

				for (AssignmentEntity a : filteredAssignments) {
					List<AssignmentSubmissionEntity> aSubs = studentSubs.getOrDefault(a.getId(), Collections.emptyList());
					List<AssignmentSubmissionEntity> submittedList = aSubs.stream()
							.filter(s -> s.getStatus() == SubmissionStatus.SUBMITTED || s.getStatus() == SubmissionStatus.AUTO_SUBMITTED)
							.toList();

					org.apache.poi.ss.usermodel.Cell scoreCell = dataRow.createCell(colIdx++);

					if (submittedList.isEmpty()) {
						scoreCell.setCellValue("-");
						scoreCell.setCellStyle(dataTextStyle);
					} else {
						// QTN-13: Lấy Best Attempt
						BigDecimal bestScore = null;
						for (AssignmentSubmissionEntity s : submittedList) {
							BigDecimal cur = s.getAdjustedScore() != null ? s.getAdjustedScore() : s.getScore();
							if (bestScore == null || (cur != null && cur.compareTo(bestScore) > 0)) {
								bestScore = cur;
							}
						}

						if (bestScore != null) {
							scoreCell.setCellValue(bestScore.doubleValue());
							scoreCell.setCellStyle(numericStyle);

							if (a.getTotalPoints() != null && a.getTotalPoints().compareTo(BigDecimal.ZERO) > 0) {
								double pct = (bestScore.doubleValue() / a.getTotalPoints().doubleValue()) * 100.0;
								percentages.add(pct);
							}
						} else {
							scoreCell.setCellValue("-");
							scoreCell.setCellStyle(dataTextStyle);
						}
					}
				}

				// Điểm trung bình % (TC-04: Ô là NUMERIC)
				org.apache.poi.ss.usermodel.Cell avgCell = dataRow.createCell(colIdx++);
				if (!percentages.isEmpty()) {
					double avg = percentages.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
					double roundedAvg = Math.round(avg * 10.0) / 10.0;
					avgCell.setCellValue(roundedAvg);
					avgCell.setCellStyle(numericStyle);
				} else {
					avgCell.setCellValue("-");
					avgCell.setCellStyle(dataTextStyle);
				}
			}

			// Tự động căn chỉnh độ rộng cột
			for (int c = 0; c < colIdx; c++) {
				sheet.autoSizeColumn(c);
				sheet.setColumnWidth(c, Math.min(sheet.getColumnWidth(c) + 1200, 15000));
			}

			java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
			workbook.write(out);
			return out.toByteArray();
		} catch (java.io.IOException e) {
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR, "Lỗi khi tạo tệp Excel: " + e.getMessage());
		}
	}

	private void createCellWithStyle(org.apache.poi.ss.usermodel.Row row, int col, String value, org.apache.poi.ss.usermodel.CellStyle style) {
		org.apache.poi.ss.usermodel.Cell cell = row.createCell(col);
		cell.setCellValue(value);
		cell.setCellStyle(style);
	}

	private String sanitizeForExcel(String value) {
		if (value == null) return "";
		String trimmed = value.trim();
		if (!trimmed.isEmpty() && (trimmed.startsWith("=") || trimmed.startsWith("+") || trimmed.startsWith("-") || trimmed.startsWith("@"))) {
			return "'" + value;
		}
		return value;
	}
}
