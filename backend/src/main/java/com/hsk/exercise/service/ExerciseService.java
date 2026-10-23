package com.hsk.exercise.service;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseQuestionEntity;
import com.hsk.exercise.domain.ExerciseSectionEntity;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.domain.ExerciseType;
import com.hsk.exercise.dto.CopyExerciseRequest;
import com.hsk.exercise.dto.CreateExerciseQuestionItem;
import com.hsk.exercise.dto.CreateExerciseRequest;
import com.hsk.exercise.dto.CreateMockExamRequest;
import com.hsk.exercise.dto.CreateMockExamSectionItem;
import com.hsk.exercise.dto.ExerciseQuestionResponse;
import com.hsk.exercise.dto.ExerciseResponse;
import com.hsk.exercise.dto.MockExamResponse;
import com.hsk.exercise.dto.MockExamSectionResponse;
import com.hsk.exercise.dto.UpdateExerciseRequest;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.exercise.repository.ExerciseSectionRepository;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.repository.QuestionRepository;
import com.hsk.question.service.QuestionService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Dịch vụ xử lý nghiệp vụ bài tập (HTT-05-CN-006) và đề thi thử HSK (HTT-09-CN-001).
 * Đóng gói câu hỏi thành bài tập, đề thi thử nhiều phần, gán điểm và xác thực quy tắc QTN-09, QTN-14, QTN-19.
 */
@Service
public class ExerciseService {

	private final ExerciseRepository exerciseRepository;
	private final ExerciseQuestionRepository exerciseQuestionRepository;
	private final ExerciseSectionRepository exerciseSectionRepository;
	private final QuestionRepository questionRepository;
	private final QuestionService questionService;
	private final UserRoleRepository userRoleRepository;

	public ExerciseService(
			ExerciseRepository exerciseRepository,
			ExerciseQuestionRepository exerciseQuestionRepository,
			ExerciseSectionRepository exerciseSectionRepository,
			QuestionRepository questionRepository,
			QuestionService questionService,
			UserRoleRepository userRoleRepository
	) {
		this.exerciseRepository = exerciseRepository;
		this.exerciseQuestionRepository = exerciseQuestionRepository;
		this.exerciseSectionRepository = exerciseSectionRepository;
		this.questionRepository = questionRepository;
		this.questionService = questionService;
		this.userRoleRepository = userRoleRepository;
	}

	/**
	 * Kiểm tra xem người dùng có quyền giáo viên hoặc quản trị viên hay không.
	 */
	public void assertTeacherOrAdmin(Long userId) {
		boolean isTeacher = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.TEACHER)
				|| userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.ADMIN);
		if (!isTeacher) {
			throw new ApiException(ApiErrorCode.TEACHER_ROLE_NOT_GRANTED);
		}
	}

	/**
	 * HTT-05-CN-006: Tạo bài tập mới từ danh sách câu hỏi trong ngân hàng của giáo viên.
	 */
	@Transactional
	public ExerciseResponse createExercise(Long teacherId, CreateExerciseRequest request) {
		assertTeacherOrAdmin(teacherId);

		if (request == null) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		// HTT-05-CN-006-TC-03: Bỏ trống tên bài tập -> báo lỗi
		if (request.title() == null || request.title().trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.EXERCISE_TITLE_BLANK);
		}

		ExerciseStatus status = request.status() != null ? request.status() : ExerciseStatus.DRAFT;

		// HTT-05-CN-006-TC-05 & QTN-09: Bài 0 câu hỏi chỉ cho phép lưu DRAFT, chặn chuyển READY
		List<CreateExerciseQuestionItem> questionItems = request.questions() != null ? request.questions() : List.of();
		if (status == ExerciseStatus.READY && questionItems.isEmpty()) {
			throw new ApiException(ApiErrorCode.EXERCISE_READY_REQUIRES_QUESTIONS);
		}

		ExerciseEntity exercise = new ExerciseEntity(
				teacherId,
				request.title().trim(),
				request.description() != null && !request.description().trim().isEmpty() ? request.description().trim() : null,
				status
		);

		// HTT-05-CN-006-TC-06: Kiểm tra câu hỏi trùng lặp trong bài tập
		Set<Long> seenQuestionIds = new HashSet<>();
		for (CreateExerciseQuestionItem item : questionItems) {
			if (item == null || item.questionId() == null) {
				throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
			}
			if (!seenQuestionIds.add(item.questionId())) {
				throw new ApiException(ApiErrorCode.EXERCISE_DUPLICATE_QUESTIONS);
			}
		}

		BigDecimal totalPoints = BigDecimal.ZERO;
		int defaultOrder = 1;

		for (CreateExerciseQuestionItem item : questionItems) {
			// HTT-05-CN-006-TC-04: Điểm của câu hỏi phải > 0
			if (item.points() == null || item.points().compareTo(BigDecimal.ZERO) <= 0) {
				throw new ApiException(ApiErrorCode.EXERCISE_QUESTION_POINTS_INVALID);
			}

			// Kiểm tra câu hỏi tồn tại trong ngân hàng
			QuestionEntity question = questionRepository.findById(item.questionId())
					.orElseThrow(() -> new ApiException(ApiErrorCode.QUESTION_NOT_FOUND));

			if (question.isHidden()) {
				throw new ApiException(ApiErrorCode.QUESTION_NOT_FOUND);
			}

			// HTT-05-CN-006-TC-07 & QTN-19: Giáo viên chỉ được đưa câu hỏi của mình vào bài tập
			if (!question.getOwnerId().equals(teacherId)) {
				throw new ApiException(ApiErrorCode.ACCESS_DENIED_QUESTION);
			}

			// QTN-14: Đánh dấu câu hỏi đã được dùng trong bài tập
			questionService.markQuestionAsUsedInExercise(question.getId());

			int sortOrder = item.sortOrder() != null ? item.sortOrder() : defaultOrder;
			ExerciseQuestionEntity eq = new ExerciseQuestionEntity(exercise, question, item.points(), sortOrder);
			exercise.addQuestion(eq);

			totalPoints = totalPoints.add(item.points());
			defaultOrder++;
		}

		exercise.setTotalPoints(totalPoints);
		ExerciseEntity saved = exerciseRepository.save(exercise);
		return mapToResponse(saved);
	}

	/**
	 * Lấy danh sách bài tập của giáo viên đăng nhập (QTN-19).
	 */
	@Transactional(readOnly = true)
	public List<ExerciseResponse> getMyExercises(Long teacherId) {
		assertTeacherOrAdmin(teacherId);
		return exerciseRepository.findByOwnerIdOrderByCreatedAtDesc(teacherId).stream()
				.map(this::mapToResponse)
				.toList();
	}

	/**
	 * Lấy chi tiết bài tập kèm danh sách câu hỏi và điểm số (QTN-19).
	 */
	@Transactional(readOnly = true)
	public ExerciseResponse getExerciseDetail(Long teacherId, Long exerciseId) {
		assertTeacherOrAdmin(teacherId);

		ExerciseEntity exercise = exerciseRepository.findWithQuestionsById(exerciseId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.EXERCISE_NOT_FOUND));

		if (!exercise.getOwnerId().equals(teacherId)) {
			throw new ApiException(ApiErrorCode.ACCESS_DENIED_EXERCISE);
		}

		return mapToResponse(exercise);
	}

	/**
	 * HTT-05-CN-007: Sao chép bài tập có sẵn thành bản sao ở trạng thái DRAFT (QTN-19).
	 * Bản sao độc lập hoàn toàn với bài gốc, kế thừa toàn bộ câu hỏi, điểm và thứ tự sắp xếp.
	 */
	@Transactional
	public ExerciseResponse copyExercise(Long teacherId, Long exerciseId, CopyExerciseRequest request) {
		assertTeacherOrAdmin(teacherId);

		ExerciseEntity sourceExercise = exerciseRepository.findWithQuestionsById(exerciseId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.EXERCISE_NOT_FOUND));

		// QTN-19: Giáo viên chỉ được sao chép bài tập của chính mình
		if (!sourceExercise.getOwnerId().equals(teacherId)) {
			throw new ApiException(ApiErrorCode.ACCESS_DENIED_EXERCISE);
		}

		String newTitle;
		if (request != null && request.newTitle() != null && !request.newTitle().trim().isEmpty()) {
			newTitle = request.newTitle().trim();
		} else {
			String baseTitle = sourceExercise.getTitle() != null ? sourceExercise.getTitle().trim() : "Bài tập";
			newTitle = baseTitle + " (Bản sao)";
		}

		if (newTitle.length() > 255) {
			newTitle = newTitle.substring(0, 255);
		}

		ExerciseEntity newExercise = new ExerciseEntity();
		newExercise.setOwnerId(teacherId);
		newExercise.setTitle(newTitle);
		newExercise.setDescription(sourceExercise.getDescription());
		newExercise.setStatus(ExerciseStatus.DRAFT);
		newExercise.setTotalPoints(sourceExercise.getTotalPoints());

		ExerciseEntity savedExercise = exerciseRepository.save(newExercise);

		List<ExerciseQuestionEntity> copiedQuestions = new ArrayList<>();
		if (sourceExercise.getQuestions() != null && !sourceExercise.getQuestions().isEmpty()) {
			for (ExerciseQuestionEntity sourceEq : sourceExercise.getQuestions()) {
				ExerciseQuestionEntity newEq = new ExerciseQuestionEntity();
				newEq.setExercise(savedExercise);
				newEq.setQuestion(sourceEq.getQuestion());
				newEq.setPoints(sourceEq.getPoints());
				newEq.setSortOrder(sourceEq.getSortOrder());
				copiedQuestions.add(newEq);

				// Đảm bảo câu hỏi được đánh dấu đã sử dụng (QTN-14)
				if (sourceEq.getQuestion() != null) {
					questionService.markQuestionAsUsedInExercise(sourceEq.getQuestion().getId());
				}
			}
			exerciseQuestionRepository.saveAll(copiedQuestions);
		}
		savedExercise.setQuestions(copiedQuestions);

		return mapToResponse(savedExercise);
	}

	/**
	 * HTT-05-CN-008: Chỉnh sửa bài tập (QTN-09, QTN-10, QTN-14, QTN-19).
	 * Cập nhật tên, mô tả, trạng thái, danh sách câu hỏi, điểm từng câu và thứ tự sắp xếp.
	 */
	@Transactional
	public ExerciseResponse updateExercise(Long teacherId, Long exerciseId, UpdateExerciseRequest request) {
		assertTeacherOrAdmin(teacherId);

		ExerciseEntity exercise = exerciseRepository.findWithQuestionsById(exerciseId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.EXERCISE_NOT_FOUND));

		// QTN-19: Giáo viên chỉ được sửa bài tập của chính mình
		if (!exercise.getOwnerId().equals(teacherId)) {
			throw new ApiException(ApiErrorCode.ACCESS_DENIED_EXERCISE);
		}

		if (request == null) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		// HTT-05-CN-008-TC-04: Bỏ trống tên bài tập -> Báo lỗi
		if (request.title() == null || request.title().trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.EXERCISE_TITLE_BLANK);
		}

		ExerciseStatus status = request.status() != null ? request.status() : exercise.getStatus();

		// HTT-05-CN-008-TC-06 & QTN-09: Bài 0 câu hỏi chỉ cho phép lưu DRAFT, chặn chuyển READY
		List<CreateExerciseQuestionItem> questionItems = request.questions() != null ? request.questions() : List.of();
		if (status == ExerciseStatus.READY && questionItems.isEmpty()) {
			throw new ApiException(ApiErrorCode.EXERCISE_READY_REQUIRES_QUESTIONS);
		}

		// Kiểm tra trùng lặp câu hỏi trong bài tập
		Set<Long> seenQuestionIds = new HashSet<>();
		for (CreateExerciseQuestionItem item : questionItems) {
			if (item == null || item.questionId() == null) {
				throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
			}
			if (!seenQuestionIds.add(item.questionId())) {
				throw new ApiException(ApiErrorCode.EXERCISE_DUPLICATE_QUESTIONS);
			}
		}

		exercise.setTitle(request.title().trim());
		exercise.setDescription(request.description() != null && !request.description().trim().isEmpty() ? request.description().trim() : null);
		exercise.setStatus(status);

		// 1. Loại bỏ các câu hỏi không còn trong danh sách yêu cầu mới
		Set<Long> targetQuestionIds = questionItems.stream()
				.map(CreateExerciseQuestionItem::questionId)
				.collect(Collectors.toSet());

		exercise.getQuestions().removeIf(eq -> eq.getQuestion() == null || !targetQuestionIds.contains(eq.getQuestion().getId()));

		// 2. Map các câu hỏi còn giữ lại để tái sử dụng entity và tránh lỗi Unique Constraint
		Map<Long, ExerciseQuestionEntity> existingMap = new HashMap<>();
		for (ExerciseQuestionEntity eq : exercise.getQuestions()) {
			if (eq.getQuestion() != null) {
				existingMap.put(eq.getQuestion().getId(), eq);
			}
		}

		BigDecimal totalPoints = BigDecimal.ZERO;
		int defaultOrder = 1;

		for (CreateExerciseQuestionItem item : questionItems) {
			// Điểm câu hỏi phải > 0
			if (item.points() == null || item.points().compareTo(BigDecimal.ZERO) <= 0) {
				throw new ApiException(ApiErrorCode.EXERCISE_QUESTION_POINTS_INVALID);
			}

			int sortOrder = item.sortOrder() != null ? item.sortOrder() : defaultOrder;
			ExerciseQuestionEntity existingEq = existingMap.get(item.questionId());

			if (existingEq != null) {
				existingEq.setPoints(item.points());
				existingEq.setSortOrder(sortOrder);
			} else {
				QuestionEntity question = questionRepository.findById(item.questionId())
						.orElseThrow(() -> new ApiException(ApiErrorCode.QUESTION_NOT_FOUND));

				if (question.isHidden()) {
					throw new ApiException(ApiErrorCode.QUESTION_NOT_FOUND);
				}

				// QTN-19: Giáo viên chỉ được đưa câu hỏi của mình vào bài tập
				if (!question.getOwnerId().equals(teacherId)) {
					throw new ApiException(ApiErrorCode.ACCESS_DENIED_QUESTION);
				}

				// QTN-14: Đánh dấu câu hỏi đã được dùng trong bài tập
				questionService.markQuestionAsUsedInExercise(question.getId());

				ExerciseQuestionEntity newEq = new ExerciseQuestionEntity(exercise, question, item.points(), sortOrder);
				exercise.addQuestion(newEq);
			}

			totalPoints = totalPoints.add(item.points());
			defaultOrder++;
		}

		exercise.setTotalPoints(totalPoints);
		ExerciseEntity saved = exerciseRepository.save(exercise);
		return mapToResponse(saved);
	}

	public ExerciseResponse mapToResponse(ExerciseEntity entity) {
		List<ExerciseQuestionResponse> questionResponses = new ArrayList<>();
		if (entity.getQuestions() != null) {
			for (ExerciseQuestionEntity eq : entity.getQuestions()) {
				QuestionEntity q = eq.getQuestion();
				questionResponses.add(new ExerciseQuestionResponse(
						eq.getId(),
						q != null ? q.getId() : null,
						q != null ? q.getContent() : null,
						q != null ? q.getType() : null,
						eq.getPoints(),
						eq.getSortOrder()
				));
			}
		}

		return new ExerciseResponse(
				entity.getId(),
				entity.getOwnerId(),
				entity.getTitle(),
				entity.getDescription(),
				entity.getStatus(),
				entity.getTotalPoints(),
				questionResponses.size(),
				questionResponses,
				entity.getCreatedAt(),
				entity.getUpdatedAt()
		);
	}

	/**
	 * HTT-09-CN-001: Tạo đề thi thử HSK gồm nhiều phần, giới hạn thời gian và điểm đạt.
	 * Đề thi thử được lưu như một bài tập có tính giờ (QTN-09, QTN-19).
	 */
	@Transactional
	public MockExamResponse createMockExam(Long teacherId, CreateMockExamRequest request) {
		assertTeacherOrAdmin(teacherId);

		if (request == null) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		// HTT-05-CN-006 & HTT-09-CN-001: Bỏ trống tên đề thi -> báo lỗi
		if (request.title() == null || request.title().trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.EXERCISE_TITLE_BLANK);
		}

		// HTT-09-CN-001-TC-03: Cấp độ HSK hoặc thời gian làm bài trống -> Báo thiếu dữ liệu
		if (request.hskLevel() == null) {
			throw new ApiException(ApiErrorCode.MOCK_EXAM_HSK_LEVEL_REQUIRED);
		}
		if (request.hskLevel() < 1 || request.hskLevel() > 6) {
			throw new ApiException(ApiErrorCode.MOCK_EXAM_HSK_LEVEL_REQUIRED);
		}
		if (request.timeLimitMinutes() == null) {
			throw new ApiException(ApiErrorCode.MOCK_EXAM_TIME_LIMIT_REQUIRED);
		}

		// HTT-09-CN-001-TC-04: Thời gian làm bài <= 0 -> Dữ liệu không hợp lệ
		if (request.timeLimitMinutes() <= 0) {
			throw new ApiException(ApiErrorCode.MOCK_EXAM_TIME_LIMIT_INVALID);
		}

		ExerciseStatus status = request.status() != null ? request.status() : ExerciseStatus.DRAFT;
		List<CreateMockExamSectionItem> sectionItems = request.sections() != null ? request.sections() : List.of();

		// HTT-09-CN-001-TC-05: Chuyển READY mà không có phần thi hoặc có phần thi 0 câu hỏi -> Chặn, chỉ cho lưu DRAFT
		if (status == ExerciseStatus.READY) {
			if (sectionItems.isEmpty()) {
				throw new ApiException(ApiErrorCode.MOCK_EXAM_SECTIONS_REQUIRED);
			}
			for (CreateMockExamSectionItem sec : sectionItems) {
				if (sec.questions() == null || sec.questions().isEmpty()) {
					throw new ApiException(ApiErrorCode.MOCK_EXAM_SECTION_EMPTY_QUESTIONS);
				}
			}
		}

		// Kiểm tra trùng lặp câu hỏi trên toàn bộ các phần thi của đề thi thử (QTN-09)
		Set<Long> seenQuestionIds = new HashSet<>();
		for (CreateMockExamSectionItem sec : sectionItems) {
			List<CreateExerciseQuestionItem> qItems = sec.questions() != null ? sec.questions() : List.of();
			for (CreateExerciseQuestionItem item : qItems) {
				if (item == null || item.questionId() == null) {
					throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
				}
				if (!seenQuestionIds.add(item.questionId())) {
					throw new ApiException(ApiErrorCode.EXERCISE_DUPLICATE_QUESTIONS);
				}
			}
		}

		ExerciseEntity mockExam = new ExerciseEntity(
				teacherId,
				request.title().trim(),
				request.description() != null && !request.description().trim().isEmpty() ? request.description().trim() : null,
				status
		);
		mockExam.setExerciseType(ExerciseType.MOCK_EXAM);
		mockExam.setHskLevel(request.hskLevel());
		mockExam.setTimeLimitMinutes(request.timeLimitMinutes());

		BigDecimal totalPoints = BigDecimal.ZERO;
		int sectionOrder = 1;
		int overallQuestionOrder = 1;

		for (CreateMockExamSectionItem secItem : sectionItems) {
			String sectionName = secItem.name() != null && !secItem.name().trim().isEmpty()
					? secItem.name().trim()
					: ("Phần " + sectionOrder);
			int sOrder = secItem.sortOrder() != null ? secItem.sortOrder() : sectionOrder;

			ExerciseSectionEntity sectionEntity = new ExerciseSectionEntity(mockExam, sectionName, sOrder);
			mockExam.addSection(sectionEntity);

			List<CreateExerciseQuestionItem> qItems = secItem.questions() != null ? secItem.questions() : List.of();
			for (CreateExerciseQuestionItem qItem : qItems) {
				// HTT-05-CN-006 & HTT-09-CN-001: Điểm câu hỏi phải > 0
				if (qItem.points() == null || qItem.points().compareTo(BigDecimal.ZERO) <= 0) {
					throw new ApiException(ApiErrorCode.EXERCISE_QUESTION_POINTS_INVALID);
				}

				QuestionEntity question = questionRepository.findById(qItem.questionId())
						.orElseThrow(() -> new ApiException(ApiErrorCode.QUESTION_NOT_FOUND));

				if (question.isHidden()) {
					throw new ApiException(ApiErrorCode.QUESTION_NOT_FOUND);
				}

				// HTT-09-CN-001-TC-06 & QTN-19: Giáo viên chỉ được đưa câu hỏi của chính mình vào đề
				if (!question.getOwnerId().equals(teacherId)) {
					throw new ApiException(ApiErrorCode.ACCESS_DENIED_QUESTION);
				}

				// QTN-14: Đánh dấu câu hỏi đã được dùng trong bài tập
				questionService.markQuestionAsUsedInExercise(question.getId());

				int qOrder = qItem.sortOrder() != null ? qItem.sortOrder() : overallQuestionOrder;
				ExerciseQuestionEntity eq = new ExerciseQuestionEntity(mockExam, sectionEntity, question, qItem.points(), qOrder);
				mockExam.addQuestion(eq);

				totalPoints = totalPoints.add(qItem.points());
				overallQuestionOrder++;
			}
			sectionOrder++;
		}

		// HTT-09-CN-001-TC-04: Điểm đạt âm hoặc lớn hơn tổng điểm -> Dữ liệu không hợp lệ
		if (request.passingScore() != null) {
			if (request.passingScore().compareTo(BigDecimal.ZERO) < 0 || request.passingScore().compareTo(totalPoints) > 0) {
				throw new ApiException(ApiErrorCode.MOCK_EXAM_PASSING_SCORE_INVALID);
			}
			mockExam.setPassingScore(request.passingScore());
		}

		// HTT-09-CN-001-TC-01: Tổng điểm bằng tổng điểm các câu
		mockExam.setTotalPoints(totalPoints);

		ExerciseEntity saved = exerciseRepository.save(mockExam);
		return mapToMockExamResponse(saved);
	}

	/**
	 * Lấy danh sách đề thi thử do giáo viên đăng nhập tạo ra (QTN-19).
	 */
	@Transactional(readOnly = true)
	public List<MockExamResponse> getMyMockExams(Long teacherId) {
		assertTeacherOrAdmin(teacherId);
		List<ExerciseEntity> list = exerciseRepository.findByOwnerIdAndExerciseTypeOrderByCreatedAtDesc(teacherId, ExerciseType.MOCK_EXAM);
		return list.stream()
				.map(this::mapToMockExamResponse)
				.toList();
	}

	/**
	 * Lấy chi tiết đề thi thử kèm các phần và câu hỏi (QTN-19).
	 */
	@Transactional(readOnly = true)
	public MockExamResponse getMockExamDetail(Long teacherId, Long mockExamId) {
		assertTeacherOrAdmin(teacherId);

		ExerciseEntity exam = exerciseRepository.findById(mockExamId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.EXERCISE_NOT_FOUND));

		if (!exam.getOwnerId().equals(teacherId)) {
			throw new ApiException(ApiErrorCode.ACCESS_DENIED_EXERCISE);
		}

		return mapToMockExamResponse(exam);
	}

	public MockExamResponse mapToMockExamResponse(ExerciseEntity entity) {
		List<ExerciseSectionEntity> sections = entity.getSections() != null ? entity.getSections() : List.of();
		List<MockExamSectionResponse> sectionResponses = new ArrayList<>();

		for (ExerciseSectionEntity sec : sections) {
			List<ExerciseQuestionResponse> qList = new ArrayList<>();
			if (entity.getQuestions() != null) {
				for (ExerciseQuestionEntity eq : entity.getQuestions()) {
					boolean isMatch = eq.getSection() == sec 
							|| (eq.getSection() != null && sec.getId() != null && sec.getId().equals(eq.getSection().getId()));
					if (isMatch) {
						QuestionEntity q = eq.getQuestion();
						qList.add(new ExerciseQuestionResponse(
								eq.getId(),
								q != null ? q.getId() : null,
								q != null ? q.getContent() : null,
								q != null ? q.getType() : null,
								eq.getPoints(),
								eq.getSortOrder()
						));
					}
				}
			}
			sectionResponses.add(new MockExamSectionResponse(
					sec.getId(),
					sec.getName(),
					sec.getSortOrder(),
					qList.size(),
					qList
			));
		}

		int totalQuestionCount = entity.getQuestions() != null ? entity.getQuestions().size() : 0;

		return new MockExamResponse(
				entity.getId(),
				entity.getOwnerId(),
				entity.getTitle(),
				entity.getDescription(),
				entity.getExerciseType(),
				entity.getHskLevel(),
				entity.getTimeLimitMinutes(),
				entity.getPassingScore(),
				entity.getStatus(),
				entity.getTotalPoints(),
				sectionResponses.size(),
				totalQuestionCount,
				sectionResponses,
				entity.getCreatedAt(),
				entity.getUpdatedAt()
		);
	}
}
