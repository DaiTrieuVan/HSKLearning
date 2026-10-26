package com.hsk.learning.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.assignment.domain.AssignmentEntity;
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseQuestionEntity;
import com.hsk.exercise.domain.ExerciseType;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.learning.dto.ListeningAnswerItemDto;
import com.hsk.learning.dto.ListeningGradedQuestionDto;
import com.hsk.learning.dto.ListeningOptionDto;
import com.hsk.learning.dto.ListeningPracticeDetailResponse;
import com.hsk.learning.dto.ListeningPracticeItemDto;
import com.hsk.learning.dto.ListeningPracticeResultResponse;
import com.hsk.learning.dto.ListeningQuestionItemDto;
import com.hsk.learning.dto.SubmitListeningPracticeRequest;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionOptionEntity;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service xử lý tính năng Luyện nghe hiểu (HTT-10-CN-001).
 * Tuân thủ Senior Backend Mode: tránh N+1, kiểm tra bảo mật, phân tách tầng rõ ràng.
 */
@Service
public class ListeningPracticeService {

	private static final Logger log = LoggerFactory.getLogger(ListeningPracticeService.class);

	private final ExerciseRepository exerciseRepository;
	private final UserRepository userRepository;
	private final AssignmentRepository assignmentRepository;
	private final AssignmentSubmissionRepository assignmentSubmissionRepository;
	private final XpLevelService xpLevelService;
	private final StreakService streakService;
	private final ObjectMapper objectMapper;

	public ListeningPracticeService(
			ExerciseRepository exerciseRepository,
			UserRepository userRepository,
			AssignmentRepository assignmentRepository,
			AssignmentSubmissionRepository assignmentSubmissionRepository,
			XpLevelService xpLevelService,
			StreakService streakService
	) {
		this.exerciseRepository = exerciseRepository;
		this.userRepository = userRepository;
		this.assignmentRepository = assignmentRepository;
		this.assignmentSubmissionRepository = assignmentSubmissionRepository;
		this.xpLevelService = xpLevelService;
		this.streakService = streakService;
		this.objectMapper = new ObjectMapper();
	}

	/**
	 * Lấy danh sách các bài luyện nghe khả dụng cho học sinh (HTT-10-CN-001-TC-03).
	 * Quy tắc TC-03: Bài tập chưa có audio sẽ tự động bị loại bỏ, không hiển thị cho học sinh.
	 */
	@Transactional(readOnly = true)
	public List<ListeningPracticeItemDto> getListeningPractices(Integer hskLevel) {
		List<ExerciseEntity> exercises = exerciseRepository.findListeningExercisesWithQuestions(hskLevel);
		if (exercises.isEmpty()) {
			return Collections.emptyList();
		}

		List<ListeningPracticeItemDto> result = new ArrayList<>();
		for (ExerciseEntity exercise : exercises) {
			String primaryAudioUrl = extractPrimaryAudioUrl(exercise);

			// HTT-10-CN-001-TC-03: Nếu bài nghe không có audio hoặc audio rỗng -> Bỏ qua
			if (primaryAudioUrl == null || primaryAudioUrl.isBlank()) {
				continue;
			}

			int questionCount = exercise.getQuestions() != null ? exercise.getQuestions().size() : 0;
			result.add(new ListeningPracticeItemDto(
					exercise.getId(),
					exercise.getTitle(),
					exercise.getDescription(),
					exercise.getHskLevel(),
					questionCount,
					exercise.getTotalPoints() != null ? exercise.getTotalPoints() : BigDecimal.ZERO,
					primaryAudioUrl,
					exercise.getCreatedAt()
			));
		}

		return result;
	}

	/**
	 * Lấy chi tiết bài luyện nghe kèm danh sách câu hỏi cho học sinh làm bài.
	 * Ẩn đáp án đúng của từng câu hỏi để bảo mật trước khi nộp bài.
	 */
	@Transactional(readOnly = true)
	public ListeningPracticeDetailResponse getListeningPracticeDetail(Long exerciseId) {
		ExerciseEntity exercise = exerciseRepository.findWithQuestionsById(exerciseId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.EXERCISE_NOT_FOUND));

		if (exercise.getExerciseType() != ExerciseType.LISTENING) {
			throw new ApiException(ApiErrorCode.EXERCISE_NOT_FOUND);
		}

		String primaryAudioUrl = extractPrimaryAudioUrl(exercise);
		String transcript = extractTranscript(exercise);

		List<ListeningQuestionItemDto> questionDtos = new ArrayList<>();
		if (exercise.getQuestions() != null) {
			for (ExerciseQuestionEntity eq : exercise.getQuestions()) {
				QuestionEntity q = eq.getQuestion();
				if (q == null) {
					continue;
				}

				String audioUrl = extractAudioUrlFromQuestion(q);
				if (audioUrl == null || audioUrl.isBlank()) {
					audioUrl = primaryAudioUrl;
				}
				String pinyin = extractPinyinFromQuestion(q);

				List<ListeningOptionDto> optionDtos = new ArrayList<>();
				if (q.getOptions() != null) {
					for (QuestionOptionEntity opt : q.getOptions()) {
						String label = String.valueOf((char) ('A' + Math.max(0, opt.getSortOrder() - 1)));
						optionDtos.add(new ListeningOptionDto(
								opt.getId(),
								label,
								opt.getContent()
						));
					}
				}

				questionDtos.add(new ListeningQuestionItemDto(
						q.getId(),
						q.getContent(),
						audioUrl,
						pinyin,
						eq.getPoints() != null ? eq.getPoints() : BigDecimal.ONE,
						eq.getSortOrder(),
						optionDtos
				));
			}
		}

		return new ListeningPracticeDetailResponse(
				exercise.getId(),
				exercise.getTitle(),
				exercise.getDescription(),
				exercise.getHskLevel(),
				exercise.getTotalPoints() != null ? exercise.getTotalPoints() : BigDecimal.ZERO,
				primaryAudioUrl,
				transcript,
				questionDtos
		);
	}

	/**
	 * Chấm điểm tự động và lưu kết quả bài làm nghe hiểu (HTT-10-CN-001-TC-01).
	 */
	@Transactional
	public ListeningPracticeResultResponse submitListeningPractice(
			Long studentId,
			Long exerciseId,
			SubmitListeningPracticeRequest request
	) {
		UserEntity student = userRepository.findById(studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		ExerciseEntity exercise = exerciseRepository.findWithQuestionsById(exerciseId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.EXERCISE_NOT_FOUND));

		if (exercise.getExerciseType() != ExerciseType.LISTENING) {
			throw new ApiException(ApiErrorCode.EXERCISE_NOT_FOUND);
		}

		if (request == null || request.answers() == null) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		Map<Long, Long> answersMap = new HashMap<>();
		for (ListeningAnswerItemDto ans : request.answers()) {
			if (ans != null && ans.questionId() != null) {
				answersMap.put(ans.questionId(), ans.selectedOptionId());
			}
		}

		List<ListeningGradedQuestionDto> gradedQuestions = new ArrayList<>();
		BigDecimal earnedPoints = BigDecimal.ZERO;
		BigDecimal totalPoints = BigDecimal.ZERO;
		int totalQuestions = 0;
		int correctAnswersCount = 0;

		String primaryAudioUrl = extractPrimaryAudioUrl(exercise);
		String transcript = extractTranscript(exercise);

		if (exercise.getQuestions() != null) {
			for (ExerciseQuestionEntity eq : exercise.getQuestions()) {
				QuestionEntity q = eq.getQuestion();
				if (q == null) {
					continue;
				}

				totalQuestions++;
				BigDecimal pointsPossible = eq.getPoints() != null ? eq.getPoints() : BigDecimal.ONE;
				totalPoints = totalPoints.add(pointsPossible);

				Long selectedOptionId = answersMap.get(q.getId());
				Long correctOptionId = null;

				List<ListeningOptionDto> options = new ArrayList<>();
				if (q.getOptions() != null) {
					for (QuestionOptionEntity opt : q.getOptions()) {
						String label = String.valueOf((char) ('A' + Math.max(0, opt.getSortOrder() - 1)));
						options.add(new ListeningOptionDto(opt.getId(), label, opt.getContent()));
						if (Boolean.TRUE.equals(opt.isCorrect())) {
							correctOptionId = opt.getId();
						}
					}
				}

				boolean isCorrect = selectedOptionId != null && selectedOptionId.equals(correctOptionId);
				BigDecimal pointsEarned = isCorrect ? pointsPossible : BigDecimal.ZERO;

				if (isCorrect) {
					correctAnswersCount++;
					earnedPoints = earnedPoints.add(pointsEarned);
				}

				String audioUrl = extractAudioUrlFromQuestion(q);
				if (audioUrl == null || audioUrl.isBlank()) {
					audioUrl = primaryAudioUrl;
				}
				String pinyin = extractPinyinFromQuestion(q);

				gradedQuestions.add(new ListeningGradedQuestionDto(
						q.getId(),
						q.getContent(),
						audioUrl,
						pinyin,
						q.getExplanation(),
						selectedOptionId,
						correctOptionId,
						isCorrect,
						pointsEarned,
						pointsPossible,
						options
				));
			}
		}

		double scorePercentage = 0.0;
		if (totalPoints.compareTo(BigDecimal.ZERO) > 0) {
			scorePercentage = earnedPoints.divide(totalPoints, 4, RoundingMode.HALF_UP)
					.multiply(BigDecimal.valueOf(100))
					.doubleValue();
		} else if (totalQuestions > 0) {
			scorePercentage = ((double) correctAnswersCount / totalQuestions) * 100.0;
		}

		boolean passed;
		if (exercise.getPassingScore() != null && exercise.getPassingScore().compareTo(BigDecimal.ZERO) > 0) {
			passed = earnedPoints.compareTo(exercise.getPassingScore()) >= 0;
		} else {
			passed = scorePercentage >= 60.0;
		}

		Instant submittedAt = Instant.now();

		// HTT-10-CN-001-TC-01: Lưu kết quả bài nghe và cộng XP học tập
		int xpToAward = correctAnswersCount * 10;
		if (xpToAward > 0) {
			xpLevelService.awardXp(
					student,
					xpToAward,
					"LISTENING_PRACTICE",
					"exercise:" + exerciseId,
					"Luyện nghe hiểu: " + exercise.getTitle() + " (" + correctAnswersCount + "/" + totalQuestions + " câu đúng)"
			);
		}
		streakService.recordDailyGoalCompletion(student, LocalDate.now());

		// Nếu bài nghe có liên kết với Assignment (giao bài), cập nhật / lưu AssignmentSubmissionEntity
		Optional<AssignmentEntity> assignmentOpt = assignmentRepository.findFirstByExercise_Id(exerciseId);
		if (assignmentOpt.isPresent()) {
			AssignmentEntity assignment = assignmentOpt.get();
			saveAssignmentSubmission(assignment, student, earnedPoints, request);
		}

		return new ListeningPracticeResultResponse(
				exercise.getId(),
				exercise.getTitle(),
				earnedPoints,
				totalPoints,
				totalQuestions,
				correctAnswersCount,
				scorePercentage,
				passed,
				transcript,
				gradedQuestions,
				submittedAt
		);
	}

	private void saveAssignmentSubmission(
			AssignmentEntity assignment,
			UserEntity student,
			BigDecimal earnedPoints,
			SubmitListeningPracticeRequest request
	) {
		try {
			int nextAttempt = assignmentSubmissionRepository.findFirstByAssignment_IdAndStudent_IdOrderByAttemptNumberDesc(
							assignment.getId(), student.getId())
					.map(s -> s.getAttemptNumber() + 1)
					.orElse(1);

			AssignmentSubmissionEntity submission = AssignmentSubmissionEntity.createAttempt(assignment, student, nextAttempt);
			String answersJson = objectMapper.writeValueAsString(request.answers());
			submission.submit(earnedPoints, answersJson);
			submission.setStatus(SubmissionStatus.SUBMITTED);
			assignmentSubmissionRepository.save(submission);
		} catch (Exception e) {
			log.warn("Could not save assignment submission for exercise {}: {}", assignment.getExercise().getId(), e.getMessage());
		}
	}

	private String extractPrimaryAudioUrl(ExerciseEntity exercise) {
		if (exercise.getQuestions() == null) {
			return null;
		}
		for (ExerciseQuestionEntity eq : exercise.getQuestions()) {
			if (eq.getQuestion() != null) {
				String audioUrl = extractAudioUrlFromQuestion(eq.getQuestion());
				if (audioUrl != null && !audioUrl.isBlank()) {
					return audioUrl;
				}
			}
		}
		return null;
	}

	private String extractTranscript(ExerciseEntity exercise) {
		if (exercise.getQuestions() == null) {
			return null;
		}
		for (ExerciseQuestionEntity eq : exercise.getQuestions()) {
			if (eq.getQuestion() != null) {
				String transcript = extractTranscriptFromQuestion(eq.getQuestion());
				if (transcript != null && !transcript.isBlank()) {
					return transcript;
				}
			}
		}
		return null;
	}

	private String extractAudioUrlFromQuestion(QuestionEntity question) {
		if (question.getPayload() == null || question.getPayload().isBlank()) {
			return null;
		}
		try {
			JsonNode node = objectMapper.readTree(question.getPayload());
			if (node.hasNonNull("audioUrl")) {
				return node.get("audioUrl").asText().trim();
			}
		} catch (Exception e) {
			log.debug("Error parsing question payload: {}", e.getMessage());
		}
		return null;
	}

	private String extractTranscriptFromQuestion(QuestionEntity question) {
		if (question.getPayload() == null || question.getPayload().isBlank()) {
			return null;
		}
		try {
			JsonNode node = objectMapper.readTree(question.getPayload());
			if (node.hasNonNull("transcript")) {
				return node.get("transcript").asText().trim();
			}
		} catch (Exception e) {
			log.debug("Error parsing question payload: {}", e.getMessage());
		}
		return null;
	}

	private String extractPinyinFromQuestion(QuestionEntity question) {
		if (question.getPayload() == null || question.getPayload().isBlank()) {
			return null;
		}
		try {
			JsonNode node = objectMapper.readTree(question.getPayload());
			if (node.hasNonNull("pinyin")) {
				return node.get("pinyin").asText().trim();
			}
		} catch (Exception e) {
			log.debug("Error parsing question payload: {}", e.getMessage());
		}
		return null;
	}
}
