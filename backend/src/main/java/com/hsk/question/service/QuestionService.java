package com.hsk.question.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.RoleCode;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionOptionEntity;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.BlankAnswerDto;
import com.hsk.question.dto.CreateFillBlankQuestionRequest;
import com.hsk.question.dto.CreateMatchingQuestionRequest;
import com.hsk.question.dto.CreateOrderingQuestionRequest;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.FillBlankPayloadDto;
import com.hsk.question.dto.MatchingPairDto;
import com.hsk.question.dto.MatchingPayloadDto;
import com.hsk.question.dto.OrderingPayloadDto;
import com.hsk.question.dto.QuestionOptionResponse;
import com.hsk.question.dto.QuestionResponse;
import com.hsk.question.repository.QuestionRepository;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Dịch vụ xử lý nghiệp vụ câu hỏi (HTT-05-CN-001, HTT-05-CN-002, HTT-05-CN-003).
 * Tuân thủ quy tắc QTN-08 (hợp lệ trắc nghiệm) và QTN-19 (quyền sở hữu của giáo viên).
 */
@Service
public class QuestionService {

	private static final Pattern BLANK_PATTERN = Pattern.compile("_{3,}");

	private final QuestionRepository questionRepository;
	private final UserRoleRepository userRoleRepository;
	private final ObjectMapper objectMapper;

	public QuestionService(
			QuestionRepository questionRepository,
			UserRoleRepository userRoleRepository) {
		this.questionRepository = questionRepository;
		this.userRoleRepository = userRoleRepository;
		this.objectMapper = new ObjectMapper();
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
	 * HTT-05-CN-002: Tạo câu hỏi điền từ vào chỗ trống vào ngân hàng câu hỏi của giáo viên (QTN-19).
	 */
	@Transactional
	public QuestionResponse createFillBlankQuestion(Long teacherId, CreateFillBlankQuestionRequest request) {
		assertTeacherOrAdmin(teacherId);

		if (request == null) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		if (request.content() == null || request.content().trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.QUESTION_CONTENT_BLANK);
		}

		// HTT-05-CN-002-TC-03: Đếm số chỗ trống trong câu (ký hiệu ___ hoặc 3 dấu gạch dưới trở lên)
		Matcher matcher = BLANK_PATTERN.matcher(request.content());
		int blankCount = 0;
		while (matcher.find()) {
			blankCount++;
		}

		if (blankCount == 0) {
			throw new ApiException(ApiErrorCode.QUESTION_NO_BLANKS);
		}

		// HTT-05-CN-002-TC-04: Số chỗ trống phải khớp số lượng đáp án được cung cấp
		if (request.blanks() == null || request.blanks().size() != blankCount) {
			throw new ApiException(ApiErrorCode.QUESTION_BLANK_COUNT_MISMATCH);
		}

		// HTT-05-CN-002-TC-05: Kiểm tra đáp án đúng của từng chỗ trống không được để trống
		List<BlankAnswerDto> sanitizedBlanks = new ArrayList<>();
		for (int i = 0; i < request.blanks().size(); i++) {
			BlankAnswerDto blank = request.blanks().get(i);
			if (blank == null || blank.correctAnswer() == null || blank.correctAnswer().trim().isEmpty()) {
				throw new ApiException(ApiErrorCode.QUESTION_CORRECT_ANSWER_BLANK);
			}

			List<String> acceptable = blank.acceptableAnswers() != null
					? blank.acceptableAnswers().stream()
							.filter(s -> s != null && !s.trim().isEmpty())
							.map(String::trim)
							.toList()
					: List.of();

			sanitizedBlanks.add(new BlankAnswerDto(
					blank.index() >= 0 ? blank.index() : i,
					blank.correctAnswer().trim(),
					acceptable
			));
		}

		String jsonPayload;
		try {
			jsonPayload = objectMapper.writeValueAsString(new FillBlankPayloadDto(sanitizedBlanks));
		} catch (JsonProcessingException e) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		String explanation = request.explanation() != null && !request.explanation().trim().isEmpty()
				? request.explanation().trim()
				: null;

		QuestionEntity question = new QuestionEntity(
				teacherId,
				QuestionType.FILL,
				request.content().trim(),
				explanation,
				jsonPayload
		);

		QuestionEntity saved = questionRepository.save(question);
		return mapToResponse(saved);
	}

	/**
	 * HTT-05-CN-003: Tạo câu hỏi nối từ vào ngân hàng câu hỏi của giáo viên (QTN-19).
	 */
	@Transactional
	public QuestionResponse createMatchingQuestion(Long teacherId, CreateMatchingQuestionRequest request) {
		assertTeacherOrAdmin(teacherId);

		if (request == null) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		if (request.content() == null || request.content().trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.QUESTION_CONTENT_BLANK);
		}

		// HTT-05-CN-003-TC-03: Ít nhất 2 cặp từ và nghĩa cần nối
		if (request.pairs() == null || request.pairs().size() < 2) {
			throw new ApiException(ApiErrorCode.QUESTION_MATCH_MIN_PAIRS);
		}

		Set<String> uniqueLeftItems = new HashSet<>();
		List<MatchingPairDto> sanitizedPairs = new ArrayList<>();

		for (MatchingPairDto pair : request.pairs()) {
			// HTT-05-CN-003-TC-04: Một vế của cặp bị bỏ trống
			if (pair == null
					|| pair.left() == null || pair.left().trim().isEmpty()
					|| pair.right() == null || pair.right().trim().isEmpty()) {
				throw new ApiException(ApiErrorCode.QUESTION_MATCH_PAIR_BLANK);
			}

			String leftTrimmed = pair.left().trim();
			String rightTrimmed = pair.right().trim();

			// HTT-05-CN-003-TC-05: Hai cặp có vế trái giống nhau
			if (!uniqueLeftItems.add(leftTrimmed)) {
				throw new ApiException(ApiErrorCode.QUESTION_MATCH_DUPLICATE_LEFT);
			}

			sanitizedPairs.add(new MatchingPairDto(leftTrimmed, rightTrimmed));
		}

		String jsonPayload;
		try {
			jsonPayload = objectMapper.writeValueAsString(new MatchingPayloadDto(sanitizedPairs));
		} catch (JsonProcessingException e) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		String explanation = request.explanation() != null && !request.explanation().trim().isEmpty()
				? request.explanation().trim()
				: null;

		QuestionEntity question = new QuestionEntity(
				teacherId,
				QuestionType.MATCH,
				request.content().trim(),
				explanation,
				jsonPayload
		);

		QuestionEntity saved = questionRepository.save(question);
		return mapToResponse(saved);
	}

	/**
	 * HTT-05-CN-003: Tạo câu hỏi sắp xếp câu vào ngân hàng câu hỏi của giáo viên (QTN-19).
	 */
	@Transactional
	public QuestionResponse createOrderingQuestion(Long teacherId, CreateOrderingQuestionRequest request) {
		assertTeacherOrAdmin(teacherId);

		if (request == null) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		if (request.content() == null || request.content().trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.QUESTION_CONTENT_BLANK);
		}

		// HTT-05-CN-003-TC-04: Câu sắp xếp chỉ có 1 thành phần -> Cần ít nhất 2 thành phần
		if (request.items() == null || request.items().size() < 2) {
			throw new ApiException(ApiErrorCode.QUESTION_ORDER_MIN_ITEMS);
		}

		List<String> sanitizedItems = new ArrayList<>();
		for (String item : request.items()) {
			// HTT-05-CN-003-TC-04: Thành phần bị bỏ trống
			if (item == null || item.trim().isEmpty()) {
				throw new ApiException(ApiErrorCode.QUESTION_ORDER_ITEM_BLANK);
			}
			sanitizedItems.add(item.trim());
		}

		String jsonPayload;
		try {
			jsonPayload = objectMapper.writeValueAsString(new OrderingPayloadDto(sanitizedItems));
		} catch (JsonProcessingException e) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		String explanation = request.explanation() != null && !request.explanation().trim().isEmpty()
				? request.explanation().trim()
				: null;

		QuestionEntity question = new QuestionEntity(
				teacherId,
				QuestionType.ORDER,
				request.content().trim(),
				explanation,
				jsonPayload
		);

		QuestionEntity saved = questionRepository.save(question);
		return mapToResponse(saved);
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
