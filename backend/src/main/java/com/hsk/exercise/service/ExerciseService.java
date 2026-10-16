package com.hsk.exercise.service;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseQuestionEntity;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.dto.CopyExerciseRequest;
import com.hsk.exercise.dto.CreateExerciseQuestionItem;
import com.hsk.exercise.dto.CreateExerciseRequest;
import com.hsk.exercise.dto.ExerciseQuestionResponse;
import com.hsk.exercise.dto.ExerciseResponse;
import com.hsk.exercise.dto.UpdateExerciseRequest;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.repository.QuestionRepository;
import com.hsk.question.service.QuestionService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Dịch vụ xử lý nghiệp vụ bài tập (HTT-05-CN-006).
 * Đóng gói câu hỏi thành bài tập, gán điểm và xác thực quy tắc QTN-09, QTN-14, QTN-19.
 */
@Service
public class ExerciseService {

	private final ExerciseRepository exerciseRepository;
	private final ExerciseQuestionRepository exerciseQuestionRepository;
	private final QuestionRepository questionRepository;
	private final QuestionService questionService;
	private final UserRoleRepository userRoleRepository;

	public ExerciseService(
			ExerciseRepository exerciseRepository,
			ExerciseQuestionRepository exerciseQuestionRepository,
			QuestionRepository questionRepository,
			QuestionService questionService,
			UserRoleRepository userRoleRepository
	) {
		this.exerciseRepository = exerciseRepository;
		this.exerciseQuestionRepository = exerciseQuestionRepository;
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

		// Xóa các liên kết câu hỏi cũ
		exercise.getQuestions().clear();

		BigDecimal totalPoints = BigDecimal.ZERO;
		int defaultOrder = 1;

		for (CreateExerciseQuestionItem item : questionItems) {
			// Điểm câu hỏi phải > 0
			if (item.points() == null || item.points().compareTo(BigDecimal.ZERO) <= 0) {
				throw new ApiException(ApiErrorCode.EXERCISE_QUESTION_POINTS_INVALID);
			}

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
}
