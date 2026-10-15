package com.hsk.question.service;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionOptionEntity;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.QuestionOptionResponse;
import com.hsk.question.dto.QuestionResponse;
import com.hsk.question.repository.QuestionRepository;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Dịch vụ xử lý nghiệp vụ câu hỏi (HTT-05-CN-001).
 * Tuân thủ quy tắc QTN-08 (hợp lệ trắc nghiệm) và QTN-19 (quyền sở hữu của giáo viên).
 */
@Service
public class QuestionService {

	private final QuestionRepository questionRepository;
	private final UserRoleRepository userRoleRepository;

	public QuestionService(QuestionRepository questionRepository, UserRoleRepository userRoleRepository) {
		this.questionRepository = questionRepository;
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
	 * HTT-05-CN-001: Tạo câu hỏi trắc nghiệm mới vào ngân hàng của giáo viên.
	 */
	@Transactional
	public QuestionResponse createMultipleChoiceQuestion(Long teacherId, CreateQuestionRequest request) {
		assertTeacherOrAdmin(teacherId);

		if (request == null) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		// HTT-05-CN-001-TC-04: Kiểm tra nội dung câu hỏi
		if (request.content() == null || request.content().trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.QUESTION_CONTENT_BLANK);
		}

		// HTT-05-CN-001-TC-02 & QTN-08: Ít nhất 2 lựa chọn
		if (request.options() == null || request.options().size() < 2) {
			throw new ApiException(ApiErrorCode.QUESTION_MIN_OPTIONS);
		}

		// HTT-05-CN-001-TC-04: Kiểm tra từng lựa chọn không được để trống
		for (CreateQuestionOptionRequest opt : request.options()) {
			if (opt == null || opt.content() == null || opt.content().trim().isEmpty()) {
				throw new ApiException(ApiErrorCode.QUESTION_OPTION_CONTENT_BLANK);
			}
		}

		// HTT-05-CN-001-TC-05: Kiểm tra các lựa chọn không được trùng nhau
		Set<String> uniqueOptions = new HashSet<>();
		for (CreateQuestionOptionRequest opt : request.options()) {
			String normalized = opt.content().trim().toLowerCase();
			if (!uniqueOptions.add(normalized)) {
				throw new ApiException(ApiErrorCode.QUESTION_DUPLICATE_OPTIONS);
			}
		}

		// HTT-05-CN-001-TC-03 & QTN-08: Đúng một đáp án đúng
		long correctCount = request.options().stream()
				.filter(opt -> Boolean.TRUE.equals(opt.isCorrect()))
				.count();
		if (correctCount != 1) {
			throw new ApiException(ApiErrorCode.QUESTION_EXACTLY_ONE_CORRECT);
		}

		QuestionType questionType = request.type() != null ? request.type() : QuestionType.MCQ;
		String explanation = request.explanation() != null && !request.explanation().trim().isEmpty()
				? request.explanation().trim()
				: null;

		QuestionEntity question = new QuestionEntity(
				teacherId,
				questionType,
				request.content().trim(),
				explanation,
				request.payload()
		);

		int order = 1;
		for (CreateQuestionOptionRequest opt : request.options()) {
			QuestionOptionEntity optionEntity = new QuestionOptionEntity(
					opt.content().trim(),
					Boolean.TRUE.equals(opt.isCorrect()),
					order++
			);
			question.addOption(optionEntity);
		}

		QuestionEntity saved = questionRepository.save(question);
		return mapToResponse(saved);
	}

	/**
	 * QTN-19: Lấy danh sách câu hỏi trong ngân hàng của chính giáo viên.
	 */
	@Transactional(readOnly = true)
	public List<QuestionResponse> getMyQuestions(Long teacherId) {
		assertTeacherOrAdmin(teacherId);
		List<QuestionEntity> questions = questionRepository.findByOwnerIdAndIsHiddenFalseOrderByCreatedAtDesc(teacherId);
		return questions.stream()
				.map(this::mapToResponse)
				.toList();
	}

	public QuestionResponse mapToResponse(QuestionEntity entity) {
		List<QuestionOptionResponse> optionResponses = new ArrayList<>();
		if (entity.getOptions() != null) {
			for (QuestionOptionEntity opt : entity.getOptions()) {
				optionResponses.add(new QuestionOptionResponse(
						opt.getId(),
						opt.getContent(),
						opt.isCorrect(),
						opt.getSortOrder()
				));
			}
		}

		return new QuestionResponse(
				entity.getId(),
				entity.getOwnerId(),
				entity.getType(),
				entity.getContent(),
				entity.getExplanation(),
				entity.getPayload(),
				optionResponses,
				entity.getCreatedAt()
		);
	}
}
