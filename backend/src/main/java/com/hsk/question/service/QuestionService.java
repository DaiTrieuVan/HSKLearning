package com.hsk.question.service;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.domain.VocabSetItemEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionFormat;
import com.hsk.question.domain.QuestionOptionEntity;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.dto.BatchCreateQuestionsRequest;
import com.hsk.question.dto.CreateQuestionOptionRequest;
import com.hsk.question.dto.CreateQuestionRequest;
import com.hsk.question.dto.QuestionOptionResponse;
import com.hsk.question.dto.QuestionResponse;
import com.hsk.question.dto.QuickGeneratePreviewRequest;
import com.hsk.question.repository.QuestionRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Dịch vụ xử lý nghiệp vụ câu hỏi (HTT-05-CN-001 & HTT-05-CN-004).
 * Tuân thủ quy tắc QTN-08 (hợp lệ trắc nghiệm) và QTN-19 (quyền sở hữu của giáo viên).
 */
@Service
public class QuestionService {

	private final QuestionRepository questionRepository;
	private final UserRoleRepository userRoleRepository;
	private final VocabSetRepository vocabSetRepository;
	private final VocabSetItemRepository vocabSetItemRepository;

	public QuestionService(
			QuestionRepository questionRepository,
			UserRoleRepository userRoleRepository,
			VocabSetRepository vocabSetRepository,
			VocabSetItemRepository vocabSetItemRepository
	) {
		this.questionRepository = questionRepository;
		this.userRoleRepository = userRoleRepository;
		this.vocabSetRepository = vocabSetRepository;
		this.vocabSetItemRepository = vocabSetItemRepository;
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
