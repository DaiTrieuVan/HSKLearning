package com.hsk.question.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.RoleCode;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.domain.VocabSetItemEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionFormat;
import com.hsk.question.domain.QuestionOptionEntity;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.BatchCreateQuestionsRequest;
import com.hsk.question.dto.BlankAnswerDto;
import com.hsk.question.dto.CreateFillBlankQuestionRequest;
import com.hsk.question.dto.CreateMatchingQuestionRequest;
import com.hsk.question.dto.CreateOrderingQuestionRequest;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.CreateImageMatchGroupRequest;
import com.hsk.question.dto.ImageMatchGroupResponse;
import com.hsk.question.dto.ImageMatchSubQuestionDto;
import com.hsk.question.dto.ImagePoolItemDto;
import com.hsk.question.dto.FillBlankPayloadDto;
import com.hsk.question.dto.MatchingPairDto;
import com.hsk.question.dto.MatchingPayloadDto;
import com.hsk.question.dto.OrderingPayloadDto;
import com.hsk.question.dto.BulkDeleteResult;
import com.hsk.question.dto.ImportQuestionsResult;
import com.hsk.question.dto.QuestionOptionResponse;
import com.hsk.question.dto.QuestionResponse;
import com.hsk.question.dto.QuickGeneratePreviewRequest;
import com.hsk.question.dto.UpdateQuestionRequest;
import com.hsk.question.repository.QuestionRepository;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Random;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Dịch vụ xử lý nghiệp vụ câu hỏi (HTT-05-CN-001 -> HTT-05-CN-005).
 * Tuân thủ quy tắc QTN-08 (hợp lệ trắc nghiệm) và QTN-19 (quyền sở hữu của giáo viên).
 */
@Service
public class QuestionService {

	private static final Logger log = LoggerFactory.getLogger(QuestionService.class);
	private static final Pattern BLANK_PATTERN = Pattern.compile("_{3,}");

	private final QuestionRepository questionRepository;
	private final UserRoleRepository userRoleRepository;
	private final VocabSetRepository vocabSetRepository;
	private final VocabSetItemRepository vocabSetItemRepository;
	private final ObjectProvider<ExerciseQuestionRepository> exerciseQuestionRepositoryProvider;
	private final ObjectMapper objectMapper;

	public QuestionService(
			QuestionRepository questionRepository,
			UserRoleRepository userRoleRepository,
			VocabSetRepository vocabSetRepository,
			VocabSetItemRepository vocabSetItemRepository,
			ObjectProvider<ExerciseQuestionRepository> exerciseQuestionRepositoryProvider
	) {
		this.questionRepository = questionRepository;
		this.userRoleRepository = userRoleRepository;
		this.vocabSetRepository = vocabSetRepository;
		this.vocabSetItemRepository = vocabSetItemRepository;
		this.exerciseQuestionRepositoryProvider = exerciseQuestionRepositoryProvider;
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

		String payload = request.payload();
		if (request.audioUrl() != null || request.transcript() != null || request.pinyin() != null || request.imageUrl() != null || request.imagePool() != null) {
			try {
				com.fasterxml.jackson.databind.node.ObjectNode node;
				if (payload != null && !payload.isBlank()) {
					com.fasterxml.jackson.databind.JsonNode parsed = objectMapper.readTree(payload);
					node = parsed.isObject() ? (com.fasterxml.jackson.databind.node.ObjectNode) parsed : objectMapper.createObjectNode();
				} else {
					node = objectMapper.createObjectNode();
				}
				if (request.audioUrl() != null && !request.audioUrl().isBlank()) {
					node.put("audioUrl", request.audioUrl().trim());
				}
				if (request.transcript() != null && !request.transcript().isBlank()) {
					node.put("transcript", request.transcript().trim());
				}
				if (request.pinyin() != null && !request.pinyin().isBlank()) {
					node.put("pinyin", request.pinyin().trim());
				}
				if (request.imageUrl() != null && !request.imageUrl().isBlank()) {
					node.put("imageUrl", request.imageUrl().trim());
				}
				if (request.imagePool() != null) {
					com.fasterxml.jackson.databind.node.ArrayNode poolArr = node.putArray("imagePool");
					for (ImagePoolItemDto item : request.imagePool()) {
						if (item == null) continue;
						com.fasterxml.jackson.databind.node.ObjectNode itemNode = poolArr.addObject();
						itemNode.put("label", item.label() != null ? item.label().trim().toUpperCase() : "");
						itemNode.put("imageUrl", item.imageUrl() != null ? item.imageUrl().trim() : "");
					}
				}
				payload = objectMapper.writeValueAsString(node);
			} catch (Exception ignored) {
			}
		}

		QuestionEntity question = new QuestionEntity(
				teacherId,
				questionType,
				request.content().trim(),
				explanation,
				payload
		);
		if (request.hskLevel() != null) {
			question.setHskLevel(request.hskLevel());
		}
		if (request.parentId() != null) {
			questionRepository.findById(request.parentId()).ifPresent(question::setParent);
		}

		int order = 1;
		for (CreateQuestionOptionRequest opt : request.options()) {
			QuestionOptionEntity optionEntity = new QuestionOptionEntity(
					opt.content().trim(),
					Boolean.TRUE.equals(opt.isCorrect()),
					order++
			);
			if (opt.imageUrl() != null && !opt.imageUrl().isBlank()) {
				optionEntity.setImageUrl(opt.imageUrl().trim());
			}
			question.addOption(optionEntity);
		}

		QuestionEntity saved = questionRepository.save(question);
		return mapToResponse(saved);
	}

	/**
	 * HTT-05-CN-004-CV-01 / CV-03: Sinh tự động danh sách câu hỏi trắc nghiệm từ một bộ từ vựng.
	 */
	@Transactional(readOnly = true)
	public List<CreateQuestionRequest> quickGeneratePreview(Long teacherId, QuickGeneratePreviewRequest request) {
		assertTeacherOrAdmin(teacherId);

		if (request == null || request.vocabSetId() == null) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		VocabSetEntity vocabSet = vocabSetRepository.findById(request.vocabSetId())
				.orElseThrow(() -> new ApiException(ApiErrorCode.VOCAB_SET_NOT_FOUND));

		// HTT-05-CN-004-TC-05 & QTN-19: Bộ từ vựng thuộc giáo viên khác -> từ chối truy cập
		if (!teacherId.equals(vocabSet.getTeacherId())) {
			throw new ApiException(ApiErrorCode.ACCESS_DENIED_VOCAB_SET);
		}

		List<VocabSetItemEntity> items = vocabSetItemRepository.findAllByVocabSetIdOrderBySortOrderAsc(vocabSet.getId());

		// HTT-05-CN-004-TC-04: Bộ từ vựng chưa có từ nào
		if (items == null || items.isEmpty()) {
			throw new ApiException(ApiErrorCode.VOCAB_SET_EMPTY);
		}

		List<VocabularyEntity> vocabList = items.stream()
				.map(VocabSetItemEntity::getVocabulary)
				.filter(v -> v != null)
				.distinct()
				.toList();

		// HTT-05-CN-004-TC-03: Bộ từ vựng có ít hơn 4 từ
		if (vocabList.size() < 4) {
			throw new ApiException(ApiErrorCode.VOCAB_SET_INSUFFICIENT_WORDS);
		}

		QuestionFormat format = request.format() != null ? request.format() : QuestionFormat.HANZI_TO_MEANING;
		List<CreateQuestionRequest> drafts = new ArrayList<>();

		for (int i = 0; i < vocabList.size(); i++) {
			VocabularyEntity current = vocabList.get(i);

			String questionContent;
			String correctAnswer;
			String explanation;

			switch (format) {
				case MEANING_TO_HANZI -> {
					questionContent = String.format("Từ nào dưới đây có nghĩa là \"%s\"?", current.getMeaning());
					correctAnswer = current.getHanzi();
					explanation = String.format("Chữ Hán: %s | Pinyin: %s | Nghĩa: %s", current.getHanzi(), current.getPinyin(), current.getMeaning());
				}
				case HANZI_TO_PINYIN -> {
					questionContent = String.format("Phiên âm pinyin của từ \"%s\" là gì?", current.getHanzi());
					correctAnswer = current.getPinyin();
					explanation = String.format("Chữ Hán: %s | Pinyin: %s | Nghĩa: %s", current.getHanzi(), current.getPinyin(), current.getMeaning());
				}
				default -> { // HANZI_TO_MEANING
					questionContent = String.format("Từ \"%s\" (%s) có nghĩa là gì?", current.getHanzi(), current.getPinyin());
					correctAnswer = current.getMeaning();
					explanation = String.format("Chữ Hán: %s | Pinyin: %s | Nghĩa: %s", current.getHanzi(), current.getPinyin(), current.getMeaning());
				}
			}

			// Lấy 3 lựa chọn gây nhiễu từ các từ khác trong bộ (không trùng đáp án đúng và không trùng nhau)
			List<VocabularyEntity> otherVocabs = new ArrayList<>(vocabList);
			otherVocabs.remove(current);
			Collections.shuffle(otherVocabs, new Random(42L + i));

			List<String> distractors = new ArrayList<>();
			Set<String> seen = new HashSet<>();
			seen.add(correctAnswer.trim().toLowerCase());

			for (VocabularyEntity other : otherVocabs) {
				String candidate;
				switch (format) {
					case MEANING_TO_HANZI -> candidate = other.getHanzi();
					case HANZI_TO_PINYIN -> candidate = other.getPinyin();
					default -> candidate = other.getMeaning();
				}
				if (candidate != null && !candidate.trim().isEmpty()) {
					String norm = candidate.trim().toLowerCase();
					if (seen.add(norm)) {
						distractors.add(candidate.trim());
						if (distractors.size() == 3) {
							break;
						}
					}
				}
			}

			// Nếu do dữ liệu trùng nghĩa chưa đủ 3 distractor, bổ sung fallback
			if (distractors.size() < 3) {
				for (VocabularyEntity other : otherVocabs) {
					String candidate = other.getHanzi() + " (" + other.getPinyin() + ")";
					if (seen.add(candidate.toLowerCase())) {
						distractors.add(candidate);
						if (distractors.size() == 3) break;
					}
				}
			}

			List<CreateQuestionOptionRequest> optionRequests = new ArrayList<>();
			optionRequests.add(new CreateQuestionOptionRequest(correctAnswer, true));
			for (String distractor : distractors) {
				optionRequests.add(new CreateQuestionOptionRequest(distractor, false));
			}

			// Xáo trộn vị trí đáp án đúng
			Collections.shuffle(optionRequests, new Random((current.getId() != null ? current.getId() : 1L) * 31 + i));

			drafts.add(new CreateQuestionRequest(
					questionContent,
					explanation,
					QuestionType.MCQ,
					null,
					optionRequests
			));
		}

		return drafts;
	}

	/**
	 * HTT-05-CN-004-CV-03 / TC-02: Lưu hàng loạt các câu hỏi được giáo viên giữ lại vào ngân hàng.
	 */
	@Transactional
	public List<QuestionResponse> batchCreateQuestions(Long teacherId, BatchCreateQuestionsRequest request) {
		assertTeacherOrAdmin(teacherId);

		if (request == null || request.questions() == null || request.questions().isEmpty()) {
			throw new ApiException(ApiErrorCode.BATCH_QUESTIONS_EMPTY);
		}

		List<QuestionResponse> saved = new ArrayList<>();
		for (CreateQuestionRequest qReq : request.questions()) {
			saved.add(createMultipleChoiceQuestion(teacherId, qReq));
		}

		return saved;
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

	/**
	 * Tìm kiếm câu hỏi trong ngân hàng của giáo viên có phân trang và bộ lọc.
	 */
	@Transactional(readOnly = true)
	public Page<QuestionResponse> searchMyQuestions(
			Long teacherId,
			String keyword,
			QuestionType type,
			Integer hskLevel,
			Boolean hasAudio,
			Boolean hasImage,
			Pageable pageable
	) {
		assertTeacherOrAdmin(teacherId);
		String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword.trim() : null;
		Page<QuestionEntity> page = questionRepository.searchMyQuestions(teacherId, searchKeyword, type, hskLevel, hasAudio, hasImage, pageable);
		return page.map(this::mapToResponse);
	}

	@Transactional(readOnly = true)
	public Page<QuestionResponse> searchMyQuestions(Long teacherId, String keyword, QuestionType type, Pageable pageable) {
		return searchMyQuestions(teacherId, keyword, type, null, null, null, pageable);
	}

	/**
	 * Xóa hàng loạt câu hỏi thuộc quyền sở hữu của giáo viên (QTN-14, QTN-19).
	 */
	@Transactional
	public BulkDeleteResult bulkDeleteQuestions(Long teacherId, List<Long> questionIds) {
		assertTeacherOrAdmin(teacherId);
		if (questionIds == null || questionIds.isEmpty()) {
			return new BulkDeleteResult(0, 0);
		}
		int deletedCount = 0;
		for (Long qId : questionIds) {
			if (qId == null) continue;
			Optional<QuestionEntity> opt = questionRepository.findWithOptionsById(qId);
			if (opt.isPresent()) {
				QuestionEntity q = opt.get();
				if (q.getOwnerId().equals(teacherId) && !q.isHidden()) {
					if (isQuestionUsedInAnyExercise(qId)) {
						q.setHidden(true);
						questionRepository.save(q);
					} else {
						questionRepository.delete(q);
					}
					deletedCount++;
				}
			}
		}
		return new BulkDeleteResult(questionIds.size(), deletedCount);
	}

	public QuestionResponse mapToResponse(QuestionEntity entity) {
		List<QuestionOptionResponse> optionResponses = new ArrayList<>();
		if (entity.getOptions() != null) {
			for (QuestionOptionEntity opt : entity.getOptions()) {
				optionResponses.add(new QuestionOptionResponse(
						opt.getId(),
						opt.getContent(),
						opt.isCorrect(),
						opt.getSortOrder(),
						opt.getImageUrl()
				));
			}
		}

		String audioUrl = null;
		String transcript = null;
		String pinyin = null;
		String imageUrl = null;
		List<ImagePoolItemDto> imagePool = null;
		if (entity.getPayload() != null && !entity.getPayload().isBlank()) {
			try {
				com.fasterxml.jackson.databind.JsonNode node = objectMapper.readTree(entity.getPayload());
				if (node.hasNonNull("audioUrl")) {
					audioUrl = node.get("audioUrl").asText();
				}
				if (node.hasNonNull("transcript")) {
					transcript = node.get("transcript").asText();
				}
				if (node.hasNonNull("pinyin")) {
					pinyin = node.get("pinyin").asText();
				}
				if (node.hasNonNull("imageUrl")) {
					imageUrl = node.get("imageUrl").asText();
				}
				if (node.hasNonNull("imagePool") && node.get("imagePool").isArray()) {
					imagePool = new ArrayList<>();
					for (com.fasterxml.jackson.databind.JsonNode item : node.get("imagePool")) {
						String label = item.hasNonNull("label") ? item.get("label").asText() : "";
						String imgUrl = item.hasNonNull("imageUrl") ? item.get("imageUrl").asText() : "";
						imagePool.add(new ImagePoolItemDto(label, imgUrl));
					}
				}
			} catch (Exception ignored) {
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
				entity.getCreatedAt(),
				audioUrl,
				transcript,
				pinyin,
				imageUrl,
				entity.getHskLevel(),
				entity.getParent() != null ? entity.getParent().getId() : null,
				imagePool
		);
	}

	// --- HTT-05-CN-005: Quản lý ngân hàng câu hỏi ---

	private final Set<Long> usedInExerciseQuestionIds = Collections.synchronizedSet(new HashSet<>());

	/**
	 * Đánh dấu câu hỏi đã được sử dụng trong bài tập (phục vụ mô phỏng QTN-14).
	 */
	public void markQuestionAsUsedInExercise(Long questionId) {
		if (questionId != null) {
			usedInExerciseQuestionIds.add(questionId);
		}
	}

	/**
	 * Xóa cache mô phỏng câu hỏi đã dùng (dùng cho test isolation).
	 */
	public void clearUsedInExerciseQuestionIds() {
		usedInExerciseQuestionIds.clear();
	}

	/**
	 * Kiểm tra xem câu hỏi đã được gắn vào bài tập nào hay chưa (QTN-14).
	 * Kiểm tra trực tiếp trong DB thông qua ExerciseQuestionRepository nếu có,
	 * đồng thời kiểm tra thêm bộ nhớ in-memory cache/mock.
	 */
	public boolean isQuestionUsedInAnyExercise(Long questionId) {
		if (questionId == null) {
			return false;
		}
		ExerciseQuestionRepository exerciseQuestionRepository = exerciseQuestionRepositoryProvider != null
				? exerciseQuestionRepositoryProvider.getIfAvailable()
				: null;
		if (exerciseQuestionRepository != null && exerciseQuestionRepository.existsByQuestion_Id(questionId)) {
			return true;
		}
		return usedInExerciseQuestionIds.contains(questionId);
	}

	/**
	 * HTT-05-CN-005 / TC-06: Xem chi tiết câu hỏi (QTN-19: chỉ giáo viên sở hữu mới được xem).
	 */
	@Transactional(readOnly = true)
	public QuestionResponse getQuestionDetail(Long teacherId, Long questionId) {
		assertTeacherOrAdmin(teacherId);

		QuestionEntity question = questionRepository.findWithOptionsById(questionId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.QUESTION_NOT_FOUND));

		if (question.isHidden()) {
			throw new ApiException(ApiErrorCode.QUESTION_NOT_FOUND);
		}

		if (!question.getOwnerId().equals(teacherId)) {
			throw new ApiException(ApiErrorCode.ACCESS_DENIED_QUESTION);
		}

		return mapToResponse(question);
	}

	/**
	 * HTT-05-CN-005 / TC-02, TC-03: Sửa câu hỏi trong ngân hàng của giáo viên (QTN-10, QTN-19).
	 */
	@Transactional
	public QuestionResponse updateQuestion(Long teacherId, Long questionId, UpdateQuestionRequest request) {
		assertTeacherOrAdmin(teacherId);

		if (request == null) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		if (request.content() == null || request.content().trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.QUESTION_CONTENT_BLANK);
		}

		QuestionEntity question = questionRepository.findWithOptionsById(questionId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.QUESTION_NOT_FOUND));

		if (question.isHidden()) {
			throw new ApiException(ApiErrorCode.QUESTION_NOT_FOUND);
		}

		// QTN-19: Giáo viên chỉ có quyền sửa câu hỏi của mình
		if (!question.getOwnerId().equals(teacherId)) {
			throw new ApiException(ApiErrorCode.ACCESS_DENIED_QUESTION);
		}

		question.setContent(request.content().trim());
		question.setExplanation(request.explanation() != null && !request.explanation().trim().isEmpty()
				? request.explanation().trim()
				: null);

		// Nếu là dạng câu hỏi trắc nghiệm MCQ -> cập nhật và kiểm tra hợp lệ các lựa chọn (QTN-08)
		if (question.getType() == QuestionType.MCQ) {
			if (request.options() == null || request.options().size() < 2) {
				throw new ApiException(ApiErrorCode.QUESTION_MIN_OPTIONS);
			}

			long correctCount = request.options().stream()
					.filter(CreateQuestionOptionRequest::isCorrect)
					.count();
			if (correctCount != 1) {
				throw new ApiException(ApiErrorCode.QUESTION_EXACTLY_ONE_CORRECT);
			}

			Set<String> seenContents = new HashSet<>();
			for (CreateQuestionOptionRequest optReq : request.options()) {
				if (optReq.content() == null || optReq.content().trim().isEmpty()) {
					throw new ApiException(ApiErrorCode.QUESTION_OPTION_CONTENT_BLANK);
				}
				String normalized = optReq.content().trim().toLowerCase();
				if (!seenContents.add(normalized)) {
					throw new ApiException(ApiErrorCode.QUESTION_DUPLICATE_OPTIONS);
				}
			}

			question.getOptions().clear();
			int order = 1;
			for (CreateQuestionOptionRequest optReq : request.options()) {
				QuestionOptionEntity opt = new QuestionOptionEntity(
						optReq.content().trim(),
						Boolean.TRUE.equals(optReq.isCorrect()),
						order++
				);
				if (optReq.imageUrl() != null && !optReq.imageUrl().isBlank()) {
					opt.setImageUrl(optReq.imageUrl().trim());
				}
				question.addOption(opt);
			}
		} else {
			// Với các loại FILL, MATCH, ORDER -> cập nhật payload nếu có
			if (request.payload() != null && !request.payload().trim().isEmpty()) {
				question.setPayload(request.payload().trim());
			}
		}

		if (request.audioUrl() != null || request.transcript() != null || request.pinyin() != null || request.imageUrl() != null || request.imagePool() != null) {
			try {
				com.fasterxml.jackson.databind.node.ObjectNode node;
				String curPayload = question.getPayload();
				if (curPayload != null && !curPayload.isBlank()) {
					com.fasterxml.jackson.databind.JsonNode parsed = objectMapper.readTree(curPayload);
					node = parsed.isObject() ? (com.fasterxml.jackson.databind.node.ObjectNode) parsed : objectMapper.createObjectNode();
				} else {
					node = objectMapper.createObjectNode();
				}
				if (request.audioUrl() != null) {
					if (request.audioUrl().isBlank()) node.remove("audioUrl");
					else node.put("audioUrl", request.audioUrl().trim());
				}
				if (request.imageUrl() != null) {
					if (request.imageUrl().isBlank()) node.remove("imageUrl");
					else node.put("imageUrl", request.imageUrl().trim());
				}
				if (request.transcript() != null) {
					if (request.transcript().isBlank()) node.remove("transcript");
					else node.put("transcript", request.transcript().trim());
				}
				if (request.pinyin() != null) {
					if (request.pinyin().isBlank()) node.remove("pinyin");
					else node.put("pinyin", request.pinyin().trim());
				}
				if (request.imagePool() != null) {
					com.fasterxml.jackson.databind.node.ArrayNode poolArr = node.putArray("imagePool");
					for (ImagePoolItemDto item : request.imagePool()) {
						if (item == null) continue;
						com.fasterxml.jackson.databind.node.ObjectNode itemNode = poolArr.addObject();
						itemNode.put("label", item.label() != null ? item.label().trim().toUpperCase() : "");
						itemNode.put("imageUrl", item.imageUrl() != null ? item.imageUrl().trim() : "");
					}
				}
				question.setPayload(objectMapper.writeValueAsString(node));
			} catch (Exception ignored) {
			}
		}

		if (request.hskLevel() != null) {
			question.setHskLevel(request.hskLevel());
		}
		if (request.parentId() != null) {
			questionRepository.findById(request.parentId()).ifPresent(question::setParent);
		}

		// QTN-10: Sửa câu hỏi trong ngân hàng không ảnh hưởng nội dung snapshot đã chụp trong các lần giao bài trước
		QuestionEntity saved = questionRepository.save(question);
		return mapToResponse(saved);
	}

	/**
	 * Tạo Nhóm câu hỏi ghép tranh HSK (1 kho ảnh A-F dùng chung cho nhóm các câu hỏi con).
	 */
	@Transactional
	public ImageMatchGroupResponse createImageMatchGroup(Long teacherId, CreateImageMatchGroupRequest request) {
		assertTeacherOrAdmin(teacherId);

		if (request == null) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}
		if (request.title() == null || request.title().trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.QUESTION_CONTENT_BLANK);
		}
		if (request.imagePool() == null || request.imagePool().isEmpty()) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED);
		}
		if (request.subQuestions() == null || request.subQuestions().isEmpty()) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED);
		}

		// Tạo payload JSON cho câu hỏi cha chứa imagePool
		com.fasterxml.jackson.databind.node.ObjectNode parentPayloadNode = objectMapper.createObjectNode();
		if (request.audioUrl() != null && !request.audioUrl().isBlank()) {
			parentPayloadNode.put("audioUrl", request.audioUrl().trim());
		}
		com.fasterxml.jackson.databind.node.ArrayNode poolArray = parentPayloadNode.putArray("imagePool");
		for (ImagePoolItemDto item : request.imagePool()) {
			if (item == null) continue;
			com.fasterxml.jackson.databind.node.ObjectNode itemNode = poolArray.addObject();
			itemNode.put("label", item.label() != null ? item.label().trim().toUpperCase() : "");
			itemNode.put("imageUrl", item.imageUrl() != null ? item.imageUrl().trim() : "");
		}

		String parentPayload;
		try {
			parentPayload = objectMapper.writeValueAsString(parentPayloadNode);
		} catch (JsonProcessingException e) {
			parentPayload = "{}";
		}

		// 1. Tạo câu hỏi Cha (Context / Shared Image Pool)
		QuestionEntity parent = new QuestionEntity(
				teacherId,
				QuestionType.MATCH,
				request.title().trim(),
				request.explanation() != null && !request.explanation().isBlank() ? request.explanation().trim() : null,
				parentPayload
		);
		if (request.hskLevel() != null) {
			parent.setHskLevel(request.hskLevel());
		}
		QuestionEntity savedParent = questionRepository.save(parent);

		// 2. Tạo từng câu hỏi con liên kết với câu hỏi cha
		List<QuestionEntity> savedChildren = new ArrayList<>();
		int subIndex = 1;
		for (ImageMatchSubQuestionDto sub : request.subQuestions()) {
			if (sub == null) continue;
			String subContent = sub.content() != null && !sub.content().isBlank()
					? sub.content().trim()
					: "Câu " + subIndex;

			com.fasterxml.jackson.databind.node.ObjectNode subPayloadNode = objectMapper.createObjectNode();
			if (sub.audioUrl() != null && !sub.audioUrl().isBlank()) {
				subPayloadNode.put("audioUrl", sub.audioUrl().trim());
			}
			if (sub.transcript() != null && !sub.transcript().isBlank()) {
				subPayloadNode.put("transcript", sub.transcript().trim());
			}

			String subPayload;
			try {
				subPayload = objectMapper.writeValueAsString(subPayloadNode);
			} catch (JsonProcessingException e) {
				subPayload = "{}";
			}

			QuestionEntity child = new QuestionEntity(
					teacherId,
					QuestionType.MCQ,
					subContent,
					sub.explanation() != null && !sub.explanation().isBlank() ? sub.explanation().trim() : null,
					subPayload
			);
			child.setParent(savedParent);
			if (request.hskLevel() != null) {
				child.setHskLevel(request.hskLevel());
			}

			// Thêm các phương án lựa chọn A..F tương ứng với các ảnh trong imagePool
			int optOrder = 1;
			String targetCorrect = sub.correctLabel() != null ? sub.correctLabel().trim().toUpperCase() : "A";
			for (ImagePoolItemDto poolItem : request.imagePool()) {
				if (poolItem == null) continue;
				String label = poolItem.label() != null ? poolItem.label().trim().toUpperCase() : String.valueOf((char) ('A' + optOrder - 1));
				boolean isCorrect = label.equalsIgnoreCase(targetCorrect);
				QuestionOptionEntity option = new QuestionOptionEntity(
						label,
						isCorrect,
						optOrder++
				);
				if (poolItem.imageUrl() != null && !poolItem.imageUrl().isBlank()) {
					option.setImageUrl(poolItem.imageUrl().trim());
				}
				child.addOption(option);
			}

			savedChildren.add(questionRepository.save(child));
			subIndex++;
		}

		List<QuestionResponse> childResponses = savedChildren.stream()
				.map(this::mapToResponse)
				.toList();

		return new ImageMatchGroupResponse(mapToResponse(savedParent), childResponses);
	}

	private static final long MAX_MEDIA_BYTES = 50 * 1024 * 1024; // 50MB

	/**
	 * Tải lên tệp media (ảnh/audio) phục vụ ngân hàng câu hỏi.
	 */
	public String uploadMedia(Long teacherId, MultipartFile file) {
		assertTeacherOrAdmin(teacherId);

		if (file == null || file.isEmpty()) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED);
		}

		if (file.getSize() > MAX_MEDIA_BYTES) {
			throw new ApiException(ApiErrorCode.FILE_TOO_LARGE);
		}

		String originalName = file.getOriginalFilename();
		String ext = "";
		if (originalName != null && originalName.contains(".")) {
			ext = originalName.substring(originalName.lastIndexOf(".")).toLowerCase().trim();
		}

		String contentType = file.getContentType() != null ? file.getContentType().toLowerCase().trim() : "";

		boolean isImage = List.of(".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".bmp").contains(ext)
				|| contentType.startsWith("image/");
		boolean isAudio = List.of(".mp3", ".wav", ".ogg", ".m4a", ".aac", ".flac", ".wma", ".webm", ".weba", ".opus", ".mp4", ".m4p").contains(ext)
				|| contentType.startsWith("audio/")
				|| contentType.equals("video/mp4")
				|| contentType.equals("video/webm");

		if (!isImage && !isAudio) {
			throw new ApiException(ApiErrorCode.INVALID_FILE_FORMAT);
		}

		if (ext.isEmpty()) {
			ext = isImage ? ".jpg" : ".mp3";
		}

		try {
			Path baseDir = Paths.get("uploads").toAbsolutePath();
			Path dir = baseDir.resolve(isImage ? "images" : "audio");
			if (!Files.exists(dir)) {
				Files.createDirectories(dir);
			}

			String prefix = isImage ? "img_" : "audio_";
			String filename = prefix + UUID.randomUUID() + ext;
			Path targetPath = dir.resolve(filename);
			Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

			return "/uploads/" + (isImage ? "images" : "audio") + "/" + filename;
		} catch (IOException e) {
			log.error("Failed to save uploaded question media file", e);
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR);
		}
	}

	/**
	 * HTT-05-CN-005 / TC-04, TC-05: Xóa hoặc ẩn câu hỏi (QTN-14, QTN-19).
	 */
	@Transactional
	public void deleteOrHideQuestion(Long teacherId, Long questionId) {
		assertTeacherOrAdmin(teacherId);

		QuestionEntity question = questionRepository.findWithOptionsById(questionId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.QUESTION_NOT_FOUND));

		// QTN-19: Giáo viên chỉ có quyền xóa/ẩn câu hỏi của mình
		if (!question.getOwnerId().equals(teacherId)) {
			throw new ApiException(ApiErrorCode.ACCESS_DENIED_QUESTION);
		}

		// QTN-14: Câu hỏi đã dùng trong bài tập thì chỉ ẩn đi, không xóa cứng
		if (isQuestionUsedInAnyExercise(questionId)) {
			question.setHidden(true);
			questionRepository.save(question);
		} else {
			// Câu hỏi chưa từng dùng trong bài tập nào -> cho phép xóa cứng khỏi database
			questionRepository.delete(question);
		}
	}

	// ==================== IMPORT CÂU HỎI TỪ FILE (EXCEL / CSV) ====================

	/**
	 * QTN-07: Khử công thức độc hại: bảo vệ chống formula injection bằng cách escape =, +, -, @
	 */
	private String sanitizeFormula(String value) {
		if (value == null) return "";
		String trimmed = value.trim();
		if (trimmed.startsWith("=") || trimmed.startsWith("+") || trimmed.startsWith("-") || trimmed.startsWith("@")) {
			return "'" + trimmed;
		}
		return trimmed;
	}

	private QuestionType parseQuestionType(String rawType) {
		if (rawType == null) return null;
		String norm = rawType.trim().toUpperCase();
		if (norm.equals("MCQ") || norm.contains("TRẮC NGHIỆM") || norm.contains("TRAC NGHIEM") || norm.contains("CHỌN")) {
			return QuestionType.MCQ;
		}
		if (norm.equals("FILL") || norm.contains("ĐIỀN") || norm.contains("DIEN")) {
			return QuestionType.FILL;
		}
		if (norm.equals("MATCH") || norm.contains("NỐI") || norm.contains("NOI")) {
			return QuestionType.MATCH;
		}
		if (norm.equals("ORDER") || norm.contains("SẮP XẾP") || norm.contains("SAP XEP") || norm.contains("XẾP")) {
			return QuestionType.ORDER;
		}
		return null;
	}

	private List<String> parseCsvLine(String line) {
		List<String> result = new ArrayList<>();
		if (line == null) return result;

		// Hỗ trợ tab delimiter
		if (line.contains("\t") && !line.contains(",")) {
			String[] parts = line.split("\t", -1);
			for (String p : parts) result.add(p.trim());
			return result;
		}

		// Hỗ trợ semicolon delimiter
		if (line.contains(";") && !line.contains(",")) {
			String[] parts = line.split(";", -1);
			for (String p : parts) result.add(p.trim());
			return result;
		}

		StringBuilder current = new StringBuilder();
		boolean inQuotes = false;
		for (int i = 0; i < line.length(); i++) {
			char c = line.charAt(i);
			if (c == '\"') {
				if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '\"') {
					current.append('\"');
					i++;
				} else {
					inQuotes = !inQuotes;
				}
			} else if (c == ',' && !inQuotes) {
				result.add(current.toString().trim());
				current.setLength(0);
			} else {
				current.append(c);
			}
		}
		result.add(current.toString().trim());
		return result;
	}

	private List<String[]> parseCsvFile(InputStream is) throws IOException {
		List<String[]> rows = new ArrayList<>();
		try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
			String line;
			while ((line = reader.readLine()) != null) {
				if (line.trim().isEmpty()) continue;
				if (line.startsWith("\uFEFF")) {
					line = line.substring(1);
				}
				List<String> cells = parseCsvLine(line);
				if (!cells.isEmpty()) {
					rows.add(cells.toArray(new String[0]));
				}
			}
		}
		return rows;
	}

	private List<String[]> parseExcelFile(InputStream is) throws Exception {
		List<String[]> rows = new ArrayList<>();
		try (Workbook workbook = WorkbookFactory.create(is)) {
			Sheet sheet = workbook.getSheetAt(0);
			DataFormatter formatter = new DataFormatter();
			for (Row row : sheet) {
				if (row == null) continue;
				int lastCell = Math.max(row.getLastCellNum(), 8);
				String[] cells = new String[lastCell];
				boolean hasData = false;
				for (int i = 0; i < lastCell; i++) {
					Cell cell = row.getCell(i, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
					String text = cell != null ? formatter.formatCellValue(cell).trim() : "";
					cells[i] = text;
					if (!text.isEmpty()) hasData = true;
				}
				if (hasData) {
					rows.add(cells);
				}
			}
		}
		return rows;
	}

	@Transactional
	public ImportQuestionsResult importQuestionsFromFile(Long teacherId, MultipartFile file) {
		assertTeacherOrAdmin(teacherId);

		if (file == null || file.isEmpty()) {
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
		List<String[]> rawRows;

		try {
			if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
				rawRows = parseExcelFile(file.getInputStream());
			} else {
				rawRows = parseCsvFile(file.getInputStream());
			}
		} catch (Exception e) {
			log.error("Failed to parse question file", e);
			throw new ApiException(ApiErrorCode.MALFORMED_REQUEST_BODY);
		}

		List<String> errors = new ArrayList<>();
		List<QuestionResponse> importedQuestions = new ArrayList<>();
		int totalRows = 0;
		int successCount = 0;
		int skippedCount = 0;

		boolean isFirstRow = true;
		for (String[] row : rawRows) {
			if (row == null || row.length == 0) continue;

			// Kiểm tra nếu là dòng tiêu đề (header)
			if (isFirstRow) {
				isFirstRow = false;
				String firstCell = row[0] != null ? row[0].toLowerCase() : "";
				if (firstCell.contains("type") || firstCell.contains("loại") || firstCell.contains("dang")) {
					continue;
				}
			}

			// Bỏ qua dòng rỗng hoàn toàn
			boolean allEmpty = true;
			for (String c : row) {
				if (c != null && !c.trim().isEmpty()) {
					allEmpty = false;
					break;
				}
			}
			if (allEmpty) continue;

			totalRows++;
			int rowNum = totalRows;

			String rawType = row.length > 0 ? sanitizeFormula(row[0]) : "";
			String content = row.length > 1 ? sanitizeFormula(row[1]) : "";
			String optAOrData = row.length > 2 ? sanitizeFormula(row[2]) : "";
			String optB = row.length > 3 ? sanitizeFormula(row[3]) : "";
			String optC = row.length > 4 ? sanitizeFormula(row[4]) : "";
			String optD = row.length > 5 ? sanitizeFormula(row[5]) : "";
			String correctAnswer = row.length > 6 ? sanitizeFormula(row[6]) : "";
			String explanation = row.length > 7 ? sanitizeFormula(row[7]) : null;

			QuestionType type = parseQuestionType(rawType);
			if (type == null) {
				skippedCount++;
				errors.add("Dòng " + rowNum + ": Loại câu hỏi không hợp lệ ('" + rawType + "'). Chấp nhận: MCQ, FILL, MATCH, ORDER");
				continue;
			}

			if (content.isEmpty()) {
				skippedCount++;
				errors.add("Dòng " + rowNum + ": Nội dung câu hỏi không được để trống.");
				continue;
			}

			try {
				switch (type) {
					case MCQ -> {
						QuestionResponse res = parseAndCreateMcq(teacherId, content, optAOrData, optB, optC, optD, correctAnswer, explanation);
						importedQuestions.add(res);
						successCount++;
					}
					case FILL -> {
						QuestionResponse res = parseAndCreateFill(teacherId, content, optAOrData, correctAnswer, explanation);
						importedQuestions.add(res);
						successCount++;
					}
					case MATCH -> {
						QuestionResponse res = parseAndCreateMatch(teacherId, content, optAOrData, explanation);
						importedQuestions.add(res);
						successCount++;
					}
					case ORDER -> {
						QuestionResponse res = parseAndCreateOrder(teacherId, content, optAOrData, explanation);
						importedQuestions.add(res);
						successCount++;
					}
				}
			} catch (ApiException e) {
				skippedCount++;
				String msg = e.getMessage() != null ? e.getMessage() : (e.code() != null ? e.code().message() : "Lỗi dữ liệu");
				errors.add("Dòng " + rowNum + " (" + type + "): " + msg);
			} catch (Exception e) {
				skippedCount++;
				errors.add("Dòng " + rowNum + " (" + type + "): " + e.getMessage());
			}
		}

		return new ImportQuestionsResult(totalRows, successCount, skippedCount, errors, importedQuestions);
	}

	private QuestionResponse parseAndCreateMcq(
			Long teacherId,
			String content,
			String optA,
			String optB,
			String optC,
			String optD,
			String rawCorrectAnswer,
			String explanation
	) {
		List<String> optionsText = new ArrayList<>();
		if (!optB.isEmpty()) {
			if (!optA.isEmpty()) optionsText.add(optA);
			if (!optB.isEmpty()) optionsText.add(optB);
			if (!optC.isEmpty()) optionsText.add(optC);
			if (!optD.isEmpty()) optionsText.add(optD);
		} else if (optA.contains("|")) {
			String[] split = optA.split("\\|");
			for (String s : split) {
				if (!s.trim().isEmpty()) {
					optionsText.add(s.trim());
				}
			}
		} else {
			optionsText.add(optA);
		}

		if (optionsText.size() < 2) {
			throw new ApiException(ApiErrorCode.QUESTION_MIN_OPTIONS);
		}

		int correctIdx = -1;
		String normCorrect = rawCorrectAnswer != null ? rawCorrectAnswer.trim().toUpperCase() : "";

		if (normCorrect.equals("A") || normCorrect.equals("1") || normCorrect.startsWith("A.") || normCorrect.startsWith("A:")) {
			correctIdx = 0;
		} else if (normCorrect.equals("B") || normCorrect.equals("2") || normCorrect.startsWith("B.") || normCorrect.startsWith("B:")) {
			correctIdx = 1;
		} else if (normCorrect.equals("C") || normCorrect.equals("3") || normCorrect.startsWith("C.") || normCorrect.startsWith("C:")) {
			correctIdx = 2;
		} else if (normCorrect.equals("D") || normCorrect.equals("4") || normCorrect.startsWith("D.") || normCorrect.startsWith("D:")) {
			correctIdx = 3;
		} else if (!rawCorrectAnswer.isEmpty()) {
			for (int i = 0; i < optionsText.size(); i++) {
				if (optionsText.get(i).equalsIgnoreCase(rawCorrectAnswer.trim())) {
					correctIdx = i;
					break;
				}
			}
		}

		if (correctIdx < 0 || correctIdx >= optionsText.size()) {
			throw new ApiException(ApiErrorCode.QUESTION_EXACTLY_ONE_CORRECT);
		}

		List<CreateQuestionOptionRequest> options = new ArrayList<>();
		for (int i = 0; i < optionsText.size(); i++) {
			String cleanOpt = optionsText.get(i).replaceFirst("^[A-Da-d][.:\\)]\\s*", "").trim();
			if (cleanOpt.isEmpty()) {
				cleanOpt = optionsText.get(i);
			}
			options.add(new CreateQuestionOptionRequest(cleanOpt, i == correctIdx));
		}

		CreateQuestionRequest req = new CreateQuestionRequest(
				content,
				explanation,
				QuestionType.MCQ,
				null,
				options
		);
		return createMultipleChoiceQuestion(teacherId, req);
	}

	private QuestionResponse parseAndCreateFill(
			Long teacherId,
			String content,
			String rawData,
			String rawCorrectAnswer,
			String explanation
	) {
		String answerData = !rawData.isEmpty() ? rawData : rawCorrectAnswer;
		if (answerData == null || answerData.trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.QUESTION_CORRECT_ANSWER_BLANK);
		}

		String[] blankParts = answerData.split("\\|");
		List<BlankAnswerDto> blanks = new ArrayList<>();
		for (int i = 0; i < blankParts.length; i++) {
			String bp = blankParts[i].trim();
			if (bp.isEmpty()) continue;

			String[] alts = bp.split("/");
			String correct = alts[0].trim();
			List<String> acceptable = new ArrayList<>();
			for (int j = 1; j < alts.length; j++) {
				if (!alts[j].trim().isEmpty()) {
					acceptable.add(alts[j].trim());
				}
			}
			blanks.add(new BlankAnswerDto(i, correct, acceptable));
		}

		CreateFillBlankQuestionRequest req = new CreateFillBlankQuestionRequest(content, explanation, blanks);
		return createFillBlankQuestion(teacherId, req);
	}

	private QuestionResponse parseAndCreateMatch(
			Long teacherId,
			String content,
			String rawData,
			String explanation
	) {
		if (rawData == null || rawData.trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.QUESTION_MATCH_MIN_PAIRS);
		}

		String[] pairTokens = rawData.split("[|\\n\\r]+");
		List<MatchingPairDto> pairs = new ArrayList<>();

		for (String token : pairTokens) {
			token = token.trim();
			if (token.isEmpty()) continue;

			String[] parts = token.split("[:\\-]", 2);
			if (parts.length >= 2) {
				String left = parts[0].trim();
				String right = parts[1].trim();
				if (!left.isEmpty() && !right.isEmpty()) {
					pairs.add(new MatchingPairDto(left, right));
				}
			}
		}

		if (pairs.size() < 2) {
			throw new ApiException(ApiErrorCode.QUESTION_MATCH_MIN_PAIRS);
		}

		CreateMatchingQuestionRequest req = new CreateMatchingQuestionRequest(content, explanation, pairs);
		return createMatchingQuestion(teacherId, req);
	}

	private QuestionResponse parseAndCreateOrder(
			Long teacherId,
			String content,
			String rawData,
			String explanation
	) {
		if (rawData == null || rawData.trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.QUESTION_ORDER_MIN_ITEMS);
		}

		String[] itemsArr = rawData.split("[|/]+");
		List<String> items = new ArrayList<>();
		for (String it : itemsArr) {
			String trimmed = it.trim();
			if (!trimmed.isEmpty()) {
				items.add(trimmed);
			}
		}

		if (items.size() < 2) {
			throw new ApiException(ApiErrorCode.QUESTION_ORDER_MIN_ITEMS);
		}

		CreateOrderingQuestionRequest req = new CreateOrderingQuestionRequest(content, explanation, items);
		return createOrderingQuestion(teacherId, req);
	}

	/**
	 * Tạo file mẫu Excel (.xlsx) có sẵn tiêu đề và ví dụ mẫu cho cả 4 loại câu hỏi.
	 */
	public byte[] generateQuestionExcelTemplate() {
		try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
			Sheet sheet = workbook.createSheet("HSK_CauHoi_Mau");

			CellStyle headerStyle = workbook.createCellStyle();
			Font headerFont = workbook.createFont();
			headerFont.setBold(true);
			headerFont.setColor(IndexedColors.WHITE.getIndex());
			headerStyle.setFont(headerFont);
			headerStyle.setFillForegroundColor(IndexedColors.INDIGO.getIndex());
			headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

			String[] headers = {
					"type (Loại câu hỏi)",
					"content (Nội dung câu hỏi)",
					"option_a_or_data (Lựa chọn A / Đáp án / Cặp nối / Thứ tự từ)",
					"option_b (Lựa chọn B)",
					"option_c (Lựa chọn C)",
					"option_d (Lựa chọn D)",
					"correct_answer (Đáp án đúng)",
					"explanation (Giải thích)"
			};

			Row headerRow = sheet.createRow(0);
			for (int i = 0; i < headers.length; i++) {
				Cell cell = headerRow.createCell(i);
				cell.setCellValue(headers[i]);
				cell.setCellStyle(headerStyle);
			}

			String[][] sampleData = {
					{
							"MCQ",
							"Từ \"苹果\" (píngguǒ) có nghĩa là gì?",
							"Quả táo",
							"Quả chuối",
							"Quả cam",
							"Quả dưa hấu",
							"A",
							"苹果 (píngguǒ) nghĩa là quả táo trong tiếng Trung."
					},
					{
							"FILL",
							"我想喝一___咖啡。",
							"杯",
							"",
							"",
							"",
							"",
							"杯 (bēi) là lượng từ chỉ cốc/ly."
					},
					{
							"MATCH",
							"Nối từ vựng với nghĩa tiếng Việt tương ứng:",
							"咖啡: Cà phê | 茶: Trà | 牛奶: Sữa | 水: Nước",
							"",
							"",
							"",
							"",
							"Các từ vựng về thức uống thông dụng trong HSK 1-2."
					},
					{
							"ORDER",
							"Hãy sắp xếp các từ sau thành câu hoàn chỉnh:",
							"我 | 喜欢 | 吃 | 苹果",
							"",
							"",
							"",
							"",
							"Cấu trúc: Chủ ngữ (我) + Động từ (喜欢吃) + Tân ngữ (苹果)."
					}
			};

			for (int r = 0; r < sampleData.length; r++) {
				Row row = sheet.createRow(r + 1);
				for (int c = 0; c < sampleData[r].length; c++) {
					Cell cell = row.createCell(c);
					cell.setCellValue(sampleData[r][c]);
				}
			}

			for (int i = 0; i < headers.length; i++) {
				sheet.autoSizeColumn(i);
			}

			workbook.write(out);
			return out.toByteArray();
		} catch (Exception e) {
			log.error("Failed to generate Excel template", e);
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR);
		}
	}

	/**
	 * Tạo file mẫu CSV (UTF-8 BOM) có sẵn tiêu đề và ví dụ mẫu cho cả 4 loại câu hỏi.
	 */
	public byte[] generateQuestionCsvTemplate() {
		StringBuilder sb = new StringBuilder();
		// UTF-8 BOM
		sb.append("\uFEFF");
		sb.append("type,content,option_a_or_data,option_b,option_c,option_d,correct_answer,explanation\n");
		sb.append("MCQ,\"Từ \"\"苹果\"\" (píngguǒ) có nghĩa là gì?\",Quả táo,Quả chuối,Quả cam,Quả dưa hấu,A,\"苹果 (píngguǒ) nghĩa là quả táo.\"\n");
		sb.append("FILL,我想喝一___咖啡。,杯,,,,,杯 (bēi) là lượng từ chỉ cốc/ly.\n");
		sb.append("MATCH,Nối từ vựng với nghĩa tiếng Việt tương ứng:,\"咖啡: Cà phê | 茶: Trà | 牛奶: Sữa | 水: Nước\",,,,,\"Từ vựng về thức uống.\"\n");
		sb.append("ORDER,Hãy sắp xếp các từ sau thành câu hoàn chỉnh:,我 | 喜欢 | 吃 | 苹果,,,,,Chủ ngữ + Vị ngữ + Tân ngữ.\n");
		return sb.toString().getBytes(StandardCharsets.UTF_8);
	}
}
