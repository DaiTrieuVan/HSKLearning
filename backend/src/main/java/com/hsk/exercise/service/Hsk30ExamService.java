package com.hsk.exercise.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseQuestionEntity;
import com.hsk.exercise.domain.ExerciseSectionEntity;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.domain.ExerciseType;
import com.hsk.exercise.domain.QuestionGroupEntity;
import com.hsk.exercise.dto.hsk30.Hsk30ExamDetailResponse;
import com.hsk.exercise.dto.hsk30.Hsk30ExamListItemDto;
import com.hsk.exercise.dto.hsk30.Hsk30ExamResultResponse;
import com.hsk.exercise.dto.hsk30.Hsk30GradedPartDto;
import com.hsk.exercise.dto.hsk30.Hsk30GradedQuestionDto;
import com.hsk.exercise.dto.hsk30.Hsk30GradedSectionDto;
import com.hsk.exercise.dto.hsk30.Hsk30PartItemDto;
import com.hsk.exercise.dto.hsk30.Hsk30QuestionItemDto;
import com.hsk.exercise.dto.hsk30.Hsk30QuestionOptionDto;
import com.hsk.exercise.dto.hsk30.Hsk30SectionItemDto;
import com.hsk.exercise.dto.hsk30.Hsk30SharedOptionItem;
import com.hsk.exercise.dto.hsk30.Hsk30StudentAnswerDto;
import com.hsk.exercise.dto.hsk30.Hsk30SubmitExamRequest;
import com.hsk.exercise.repository.ExerciseQuestionRepository;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.exercise.repository.ExerciseSectionRepository;
import com.hsk.exercise.repository.QuestionGroupRepository;
import com.hsk.learning.service.StreakService;
import com.hsk.learning.service.XpLevelService;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionOptionEntity;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.repository.QuestionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Service
public class Hsk30ExamService {

	private static final Logger log = LoggerFactory.getLogger(Hsk30ExamService.class);

	private final ExerciseRepository exerciseRepository;
	private final ExerciseSectionRepository exerciseSectionRepository;
	private final QuestionGroupRepository questionGroupRepository;
	private final ExerciseQuestionRepository exerciseQuestionRepository;
	private final QuestionRepository questionRepository;
	private final UserRepository userRepository;
	private final XpLevelService xpLevelService;
	private final StreakService streakService;
	private final ObjectMapper objectMapper;

	public Hsk30ExamService(
			ExerciseRepository exerciseRepository,
			ExerciseSectionRepository exerciseSectionRepository,
			QuestionGroupRepository questionGroupRepository,
			ExerciseQuestionRepository exerciseQuestionRepository,
			QuestionRepository questionRepository,
			UserRepository userRepository,
			XpLevelService xpLevelService,
			StreakService streakService
	) {
		this.exerciseRepository = exerciseRepository;
		this.exerciseSectionRepository = exerciseSectionRepository;
		this.questionGroupRepository = questionGroupRepository;
		this.exerciseQuestionRepository = exerciseQuestionRepository;
		this.questionRepository = questionRepository;
		this.userRepository = userRepository;
		this.xpLevelService = xpLevelService;
		this.streakService = streakService;
		this.objectMapper = new ObjectMapper();
	}

	/**
	 * Lấy danh sách các đề thi HSK 3.0 (phục vụ cả thí sinh và giáo viên).
	 */
	@Transactional(readOnly = true)
	public List<Hsk30ExamListItemDto> getHskExams(Integer hskLevel) {
		List<ExerciseEntity> exercises = exerciseRepository.findHskExams("HSK_3_0", hskLevel);
		List<Hsk30ExamListItemDto> result = new ArrayList<>();
		for (ExerciseEntity ex : exercises) {
			int totalQuestions = ex.getQuestions() != null ? ex.getQuestions().size() : 0;
			result.add(new Hsk30ExamListItemDto(
					ex.getId(),
					ex.getTitle(),
					ex.getDescription(),
					ex.getHskLevel(),
					ex.getHskStandard(),
					ex.getTimeLimitMinutes(),
					ex.getTotalPoints(),
					ex.getPassingScore(),
					totalQuestions,
					ex.getCreatedAt()
			));
		}
		return result;
	}

	/**
	 * Lấy chi tiết đề thi HSK 3.0 với đầy đủ sections, parts, groups và câu hỏi.
	 * Khi hideAnswers = true (dành cho /take), các trường đáp án sẽ bị ẩn đi.
	 */
	@Transactional(readOnly = true)
	public Hsk30ExamDetailResponse getExamDetail(Long examId, boolean hideAnswers) {
		ExerciseEntity exercise = exerciseRepository.findById(examId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND));

		List<ExerciseQuestionEntity> eqList = exerciseQuestionRepository.findByExerciseIdWithDetails(examId);

		// Nhóm các câu hỏi theo Section -> Group
		Map<Long, List<ExerciseQuestionEntity>> sectionQuestionsMap = new LinkedHashMap<>();
		for (ExerciseQuestionEntity eq : eqList) {
			Long secId = eq.getSection() != null ? eq.getSection().getId() : 0L;
			sectionQuestionsMap.computeIfAbsent(secId, k -> new ArrayList<>()).add(eq);
		}

		List<ExerciseSectionEntity> sections = exerciseSectionRepository.findByExercise_IdOrderBySortOrderAsc(examId);
		List<Hsk30SectionItemDto> sectionDtos = new ArrayList<>();

		for (ExerciseSectionEntity sec : sections) {
			List<ExerciseQuestionEntity> secQuestions = sectionQuestionsMap.getOrDefault(sec.getId(), Collections.emptyList());

			// Nhóm theo Group
			Map<Long, List<ExerciseQuestionEntity>> groupQuestionsMap = new LinkedHashMap<>();
			for (ExerciseQuestionEntity eq : secQuestions) {
				Long grpId = eq.getGroup() != null ? eq.getGroup().getId() : 0L;
				groupQuestionsMap.computeIfAbsent(grpId, k -> new ArrayList<>()).add(eq);
			}

			List<QuestionGroupEntity> groups = questionGroupRepository.findBySection_IdOrderByPartNumberAsc(sec.getId());
			List<Hsk30PartItemDto> partDtos = new ArrayList<>();

			for (QuestionGroupEntity grp : groups) {
				List<ExerciseQuestionEntity> grpQuestions = groupQuestionsMap.getOrDefault(grp.getId(), Collections.emptyList());
				List<Hsk30QuestionItemDto> questionDtos = new ArrayList<>();

				for (ExerciseQuestionEntity eq : grpQuestions) {
					QuestionEntity q = eq.getQuestion();
					if (q == null) continue;

					QuestionParsedMetadata meta = parseQuestionMetadata(q);
					List<Hsk30QuestionOptionDto> optionDtos = mapQuestionOptions(q);

					if (hideAnswers) {
						questionDtos.add(Hsk30QuestionItemDto.forTake(
								q.getId(),
								eq.getSortOrder(),
								q.getContent(),
								meta.audioUrl(),
								meta.pinyin(),
								eq.getPoints(),
								optionDtos
						));
					} else {
						questionDtos.add(new Hsk30QuestionItemDto(
								q.getId(),
								eq.getSortOrder(),
								q.getContent(),
								meta.audioUrl(),
								meta.pinyin(),
								eq.getPoints(),
								optionDtos,
								meta.correctKey(),
								meta.correctOptionId(),
								q.getExplanation()
						));
					}
				}

				GroupParsedData parsedGroup = parseGroupData(grp.getSharedData());
				partDtos.add(new Hsk30PartItemDto(
						grp.getId(),
						grp.getPartNumber(),
						grp.getTitle(),
						grp.getInstruction(),
						grp.getFormatCode(),
						grp.getSharedData(),
						parsedGroup.options(),
						parsedGroup.passage(),
						questionDtos
				));
			}

			sectionDtos.add(new Hsk30SectionItemDto(
					sec.getId(),
					sec.getName(),
					sec.getSortOrder(),
					partDtos
			));
		}

		return new Hsk30ExamDetailResponse(
				exercise.getId(),
				exercise.getTitle(),
				exercise.getDescription(),
				exercise.getHskLevel(),
				exercise.getHskStandard(),
				exercise.getTimeLimitMinutes(),
				exercise.getTotalPoints(),
				exercise.getPassingScore(),
				eqList.size(),
				sectionDtos,
				exercise.getCreatedAt()
		);
	}

	/**
	 * Chấm điểm bài thi HSK 3.0 tự động (200 điểm tối đa, 100 điểm Nghe, 100 điểm Đọc).
	 */
	@Transactional
	public Hsk30ExamResultResponse submitExam(Long studentId, Long examId, Hsk30SubmitExamRequest request) {
		ExerciseEntity exercise = exerciseRepository.findById(examId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND));

		UserEntity student = userRepository.findById(studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND));

		List<ExerciseQuestionEntity> eqList = exerciseQuestionRepository.findByExerciseIdWithDetails(examId);

		// Bản đồ câu trả lời của thí sinh theo questionId
		Map<Long, Hsk30StudentAnswerDto> studentAnswers = new HashMap<>();
		if (request.answers() != null) {
			for (Hsk30StudentAnswerDto ans : request.answers()) {
				if (ans.questionId() != null) {
					studentAnswers.put(ans.questionId(), ans);
				}
			}
		}

		// Nhóm theo Section -> Group
		Map<Long, List<ExerciseQuestionEntity>> secMap = new LinkedHashMap<>();
		for (ExerciseQuestionEntity eq : eqList) {
			Long secId = eq.getSection() != null ? eq.getSection().getId() : 0L;
			secMap.computeIfAbsent(secId, k -> new ArrayList<>()).add(eq);
		}

		List<ExerciseSectionEntity> sections = exerciseSectionRepository.findByExercise_IdOrderBySortOrderAsc(examId);
		List<Hsk30GradedSectionDto> gradedSections = new ArrayList<>();

		int totalCorrectCount = 0;
		int totalQuestionCount = eqList.size();
		BigDecimal totalEarnedScore = BigDecimal.ZERO;
		BigDecimal listeningScore = BigDecimal.ZERO;
		BigDecimal readingScore = BigDecimal.ZERO;

		for (ExerciseSectionEntity sec : sections) {
			List<ExerciseQuestionEntity> secQuestions = secMap.getOrDefault(sec.getId(), Collections.emptyList());
			Map<Long, List<ExerciseQuestionEntity>> grpMap = new LinkedHashMap<>();
			for (ExerciseQuestionEntity eq : secQuestions) {
				Long grpId = eq.getGroup() != null ? eq.getGroup().getId() : 0L;
				grpMap.computeIfAbsent(grpId, k -> new ArrayList<>()).add(eq);
			}

			List<QuestionGroupEntity> groups = questionGroupRepository.findBySection_IdOrderByPartNumberAsc(sec.getId());
			List<Hsk30GradedPartDto> gradedParts = new ArrayList<>();

			int secCorrectCount = 0;
			int secTotalCount = secQuestions.size();
			BigDecimal secScore = BigDecimal.ZERO;
			BigDecimal secMaxScore = BigDecimal.valueOf(100.0);

			for (QuestionGroupEntity grp : groups) {
				List<ExerciseQuestionEntity> grpQuestions = grpMap.getOrDefault(grp.getId(), Collections.emptyList());
				List<Hsk30GradedQuestionDto> gradedQuestions = new ArrayList<>();

				int grpCorrectCount = 0;
				int grpTotalCount = grpQuestions.size();
				BigDecimal grpScore = BigDecimal.ZERO;

				for (ExerciseQuestionEntity eq : grpQuestions) {
					QuestionEntity q = eq.getQuestion();
					if (q == null) continue;

					QuestionParsedMetadata meta = parseQuestionMetadata(q);
					Hsk30StudentAnswerDto ans = studentAnswers.get(q.getId());

					String selectedKey = ans != null ? ans.selectedKey() : null;
					Long selectedOptionId = ans != null ? ans.selectedOptionId() : null;

					boolean isCorrect = false;
					if (meta.correctKey() != null && selectedKey != null) {
						isCorrect = meta.correctKey().trim().equalsIgnoreCase(selectedKey.trim());
					} else if (meta.correctOptionId() != null && selectedOptionId != null) {
						isCorrect = meta.correctOptionId().equals(selectedOptionId);
					}

					BigDecimal points = eq.getPoints() != null ? eq.getPoints() : BigDecimal.valueOf(5.00);
					BigDecimal earned = isCorrect ? points : BigDecimal.ZERO;

					if (isCorrect) {
						grpCorrectCount++;
						secCorrectCount++;
						totalCorrectCount++;
					}

					grpScore = grpScore.add(earned);
					secScore = secScore.add(earned);
					totalEarnedScore = totalEarnedScore.add(earned);

					gradedQuestions.add(new Hsk30GradedQuestionDto(
							q.getId(),
							eq.getSortOrder(),
							q.getContent(),
							meta.audioUrl(),
							meta.pinyin(),
							selectedKey,
							meta.correctKey(),
							selectedOptionId,
							meta.correctOptionId(),
							isCorrect,
							earned,
							points,
							q.getExplanation()
					));
				}

				GroupParsedData parsedGroup = parseGroupData(grp.getSharedData());
				gradedParts.add(new Hsk30GradedPartDto(
						grp.getId(),
						grp.getPartNumber(),
						grp.getTitle(),
						grp.getInstruction(),
						grp.getFormatCode(),
						grp.getSharedData(),
						parsedGroup.options(),
						parsedGroup.passage(),
						gradedQuestions,
						grpCorrectCount,
						grpTotalCount,
						grpScore
				));
			}

			// Ghi nhận điểm kỹ năng
			String skillType = (sec.getName() != null && sec.getName().contains("Nghe")) ? "LISTENING" : "READING";
			if ("LISTENING".equalsIgnoreCase(skillType)) {
				listeningScore = secScore;
			} else {
				readingScore = secScore;
			}

			gradedSections.add(new Hsk30GradedSectionDto(
					sec.getId(),
					sec.getName(),
					skillType,
					sec.getSortOrder(),
					gradedParts,
					secCorrectCount,
					secTotalCount,
					secScore,
					secMaxScore
			));
		}

		BigDecimal passingScore = exercise.getPassingScore() != null ? exercise.getPassingScore() : BigDecimal.valueOf(120.0);
		boolean passed = totalEarnedScore.compareTo(passingScore) >= 0;

		// Cộng điểm XP và chuỗi streak học tập
		int xpAwarded = totalCorrectCount * 5;
		if (passed) {
			xpAwarded += 50; // Thưởng thêm 50 XP khi thi đỗ HSK 3.0
		}
		if (xpAwarded > 0) {
			try {
				xpLevelService.awardXp(
						student,
						xpAwarded,
						"HSK_EXAM_PASS",
						"exercise:" + examId,
						"Hoàn thành thi thử HSK 3.0: " + exercise.getTitle() + " (" + totalCorrectCount + "/" + totalQuestionCount + " câu đúng)"
				);
			} catch (Exception e) {
				log.warn("Could not award XP for HSK 3.0 exam: {}", e.getMessage());
			}
		}

		try {
			streakService.recordDailyGoalCompletion(student, LocalDate.now());
		} catch (Exception e) {
			log.warn("Could not update streak: {}", e.getMessage());
		}

		return new Hsk30ExamResultResponse(
				exercise.getId(),
				exercise.getTitle(),
				exercise.getHskLevel(),
				exercise.getHskStandard(),
				totalEarnedScore,
				exercise.getTotalPoints() != null ? exercise.getTotalPoints() : BigDecimal.valueOf(200.0),
				passingScore,
				passed,
				listeningScore,
				readingScore,
				totalCorrectCount,
				totalQuestionCount,
				request.timeSpentSeconds(),
				gradedSections,
				Instant.now(),
				null
		);
	}

	/**
	 * Tự động tạo đề thi mẫu HSK 1 theo chuẩn HSK 3.0 đầy đủ 40 câu hỏi qua 8 part với nội dung chuẩn hóa.
	 */
	@Transactional
	public Hsk30ExamDetailResponse seedSampleHsk1Exam(Long teacherId) {
		String defaultTitle = "Đề thi thử HSK 1 - Chuẩn HSK 3.0 (Đề Mẫu Số 01)";
		Optional<ExerciseEntity> existing = exerciseRepository.findAll().stream()
				.filter(e -> "HSK_3_0".equalsIgnoreCase(e.getHskStandard()) && defaultTitle.equals(e.getTitle()))
				.findFirst();

		if (existing.isPresent()) {
			return getExamDetail(existing.get().getId(), false);
		}

		ExerciseEntity exam = new ExerciseEntity();
		exam.setOwnerId(teacherId);
		exam.setTitle(defaultTitle);
		exam.setDescription("Đề thi thử chuẩn HSK 3.0 Cấp 1 gồm 40 câu hỏi trắc nghiệm chia thành 2 phần: Nghe (20 câu, 100 điểm) và Đọc (20 câu, 100 điểm). Thời gian làm bài 40 phút. Điểm đạt: từ 120/200 điểm.");
		exam.setExerciseType(ExerciseType.MOCK_EXAM);
		exam.setStatus(ExerciseStatus.READY);
		exam.setHskLevel(1);
		exam.setHskStandard("HSK_3_0");
		exam.setTimeLimitMinutes(40);
		exam.setTotalPoints(BigDecimal.valueOf(200.00));
		exam.setPassingScore(BigDecimal.valueOf(120.00));
		exerciseRepository.save(exam);

		// 1. PHẦN NGHE (听力)
		ExerciseSectionEntity listeningSection = new ExerciseSectionEntity(exam, "听力 - Phần Nghe", 1);
		exerciseSectionRepository.save(listeningSection);

		// Nghe Part 1: LISTEN_IMAGE_3 (1–5)
		QuestionGroupEntity lGroup1 = new QuestionGroupEntity(
				listeningSection, 1, "Phần 1 (Câu 1–5)",
				"听录音，选出与所听内容相符的图片 (Nghe và chọn 1 trong 3 hình ảnh A/B/C)",
				"LISTEN_IMAGE_3", null
		);
		questionGroupRepository.save(lGroup1);

		createListeningImage3Questions(teacherId, exam, listeningSection, lGroup1);

		// Nghe Part 2: LISTEN_MCQ_3 (6–10)
		QuestionGroupEntity lGroup2 = new QuestionGroupEntity(
				listeningSection, 2, "Phần 2 (Câu 6–10)",
				"听句子或对话，选择正确答案 (Nghe và chọn đáp án A/B/C)",
				"LISTEN_MCQ_3", null
		);
		questionGroupRepository.save(lGroup2);

		createListeningMcqQuestions(teacherId, exam, listeningSection, lGroup2);

		// Nghe Part 3: LISTEN_IMAGE_MATCH (11–15)
		String listeningSharedImagesJson = """
			{
				"options": [
					{"key": "A", "imageUrl": "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400", "description": "Trường học (学校)"},
					{"key": "B", "imageUrl": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400", "description": "Bệnh viện (医院)"},
					{"key": "C", "imageUrl": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400", "description": "Cửa hàng (商店)"},
					{"key": "D", "imageUrl": "https://images.unsplash.com/photo-1515165562839-978bbcf18277?w=400", "description": "Nhà ga xe lửa (火车站)"},
					{"key": "E", "imageUrl": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400", "description": "Sân bay (机场)"},
					{"key": "F", "imageUrl": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400", "description": "Nhà ăn/Quán ăn (饭馆) - Distractor"}
				]
			}
		""";
		QuestionGroupEntity lGroup3 = new QuestionGroupEntity(
				listeningSection, 3, "Phần 3 (Câu 11–15)",
				"听录音，从A-F六幅图中选出与所听内容相符的图片 (Nghe và ghép với 1 trong 6 hình ảnh A–F, 1 hình dư)",
				"LISTEN_IMAGE_MATCH", listeningSharedImagesJson
		);
		questionGroupRepository.save(lGroup3);

		createListeningImageMatchQuestions(teacherId, exam, listeningSection, lGroup3);

		// Nghe Part 4: LISTEN_COMPREHENSION (16–20)
		QuestionGroupEntity lGroup4 = new QuestionGroupEntity(
				listeningSection, 4, "Phần 4 (Câu 16–20)",
				"听简短对话和问句，选择正确答案 (Nghe hội thoại ngắn và trả lời câu hỏi A/B/C)",
				"LISTEN_COMPREHENSION", null
		);
		questionGroupRepository.save(lGroup4);

		createListeningComprehensionQuestions(teacherId, exam, listeningSection, lGroup4);

		// 2. PHẦN ĐỌC (阅读)
		ExerciseSectionEntity readingSection = new ExerciseSectionEntity(exam, "阅读 - Phần Đọc", 2);
		exerciseSectionRepository.save(readingSection);

		// Đọc Part 1: READ_IMAGE_MATCH (21–25)
		String readingSharedImagesJson = """
			{
				"options": [
					{"key": "A", "imageUrl": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400", "description": "Cô gái uống trà (喝茶)"},
					{"key": "B", "imageUrl": "https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=400", "description": "Bé trai ăn cơm (吃米饭)"},
					{"key": "C", "imageUrl": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400", "description": "Thầy giáo viết chữ trên bảng (写字)"},
					{"key": "D", "imageUrl": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400", "description": "Đá bóng (踢足球)"},
					{"key": "E", "imageUrl": "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=400", "description": "Ngủ trên giường (睡觉)"},
					{"key": "F", "imageUrl": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400", "description": "Con mèo phơi nắng (小猫) - Distractor"}
				]
			}
		""";
		QuestionGroupEntity rGroup1 = new QuestionGroupEntity(
				readingSection, 1, "Phần 1 (Câu 21–25)",
				"阅读句子，选出对应的图片 (Đọc 5 câu, ghép với 1 trong 6 hình ảnh A–F, 1 hình dư)",
				"READ_IMAGE_MATCH", readingSharedImagesJson
		);
		questionGroupRepository.save(rGroup1);

		createReadingImageMatchQuestions(teacherId, exam, readingSection, rGroup1);

		// Đọc Part 2: READ_QA_MATCH (26–30)
		String readingSharedQaJson = """
			{
				"options": [
					{"key": "A", "text": "没关系，不客气。", "pinyin": "Méi guānxi, bù kèqi."},
					{"key": "B", "text": "我学了一年了。", "pinyin": "Wǒ xué le yì nián le."},
					{"key": "C", "text": "桌子上有三个苹果。", "pinyin": "Zhuōzi shàng yǒu sān gè píngguǒ."},
					{"key": "D", "text": "他是我大学同学。", "pinyin": "Tā shì wǒ dàxué tóngxué."},
					{"key": "E", "text": "现在差五分十二点。", "pinyin": "Xiànzài chà wǔ fēn shí'èr diǎn."},
					{"key": "F", "text": "明天我们不上课。", "pinyin": "Míngtiān wǒmen bù shàngkè. (Distractor)"}
				]
			}
		""";
		QuestionGroupEntity rGroup2 = new QuestionGroupEntity(
				readingSection, 2, "Phần 2 (Câu 26–30)",
				"阅读问句，从A-F中选出最恰当的应答 (5 câu hỏi, chọn câu trả lời tương ứng từ 6 lựa chọn A–F, 1 lựa chọn dư)",
				"READ_QA_MATCH", readingSharedQaJson
		);
		questionGroupRepository.save(rGroup2);

		createReadingQaMatchQuestions(teacherId, exam, readingSection, rGroup2);

		// Đọc Part 3: READ_WORD_BANK (31–35)
		String readingSharedWordsJson = """
			{
				"options": [
					{"key": "A", "text": "看", "pinyin": "kàn"},
					{"key": "B", "text": "在", "pinyin": "zài"},
					{"key": "C", "text": "高兴", "pinyin": "gāoxìng"},
					{"key": "D", "text": "漂亮", "pinyin": "piàoliang"},
					{"key": "E", "text": "多少", "pinyin": "duōshao"},
					{"key": "F", "text": "吃", "pinyin": "chī (Distractor)"}
				]
			}
		""";
		QuestionGroupEntity rGroup3 = new QuestionGroupEntity(
				readingSection, 3, "Phần 3 (Câu 31–35)",
				"选词填空，从词库A-F中选择合适的词语补全句子 (5 câu điền từ từ kho 6 từ A–F, 1 từ dư)",
				"READ_WORD_BANK", readingSharedWordsJson
		);
		questionGroupRepository.save(rGroup3);

		createReadingWordBankQuestions(teacherId, exam, readingSection, rGroup3);

		// Đọc Part 4: READ_COMPREHENSION (36–40)
		String readingPassageJson = """
			{
				"passage": "我家有四口人：爸爸、妈妈、哥哥和我。爸爸是医生，在医院工作；妈妈是老师，在学校教英语。哥哥比我大三岁，他喜欢打篮球。我今年十岁，是一名小学生。我们家还有一只小狗，名叫点点，非常可爱。",
				"pinyin": "Wǒ jiā yǒu sì kǒu rén: bàba, māma, gēge hé wǒ. Bàba shì yīshēng, zài yīyuàn gōngzuò; māma shì lǎoshī, zài xuéxiào jiāo yīngyǔ. Gēge bǐ wǒ dà sān suì, tā xǐhuan dǎ lánqiú. Wǒ jīnnián shí suì, shì yì míng xiǎoxuéshēng. Wǒmen jiā hái yǒu yì zhī xiǎogǒu, míng jiào Diǎndian, fēicháng kě'ài."
			}
		""";
		QuestionGroupEntity rGroup4 = new QuestionGroupEntity(
				readingSection, 4, "Phần 4 (Câu 36–40)",
				"阅读短文，回答下列问题 (Đọc đoạn văn ngắn và chọn đáp án A/B/C)",
				"READ_COMPREHENSION", readingPassageJson
		);
		questionGroupRepository.save(rGroup4);

		createReadingComprehensionQuestions(teacherId, exam, readingSection, rGroup4);

		return getExamDetail(exam.getId(), false);
	}

	// ==================== CÁC PHƯƠNG THỨC TẠO DỮ LIỆU CÂU HỎI MẪU ====================

	private void createListeningImage3Questions(Long teacherId, ExerciseEntity exam, ExerciseSectionEntity section, QuestionGroupEntity group) {
		String defaultAudio = "https://actions.google.com/sounds/v1/speech/chinese_sample.ogg";
		String[][] data = {
				{"听力第1题: 苹果 (píngguǒ)", defaultAudio, "píngguǒ", "A", "Giải thích: 所听内容为'苹果'，A为苹果图片。", "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200"},
				{"听力第2题: 看书 (kàn shū)", defaultAudio, "kàn shū", "B", "Giải thích: 所听内容为'看书'，B为看书图片。", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200", "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200", "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200"},
				{"听力第3题: 喝水 (hē shuǐ)", defaultAudio, "hē shuǐ", "A", "Giải thích: 所听内容为'喝水'，A为喝水图片。", "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200", "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=200", "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200"},
				{"听力第4题: 猫 (māo)", defaultAudio, "māo", "B", "Giải thích: 所听内容为'猫'，B为猫咪图片。", "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200", "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=200"},
				{"听力第5题: 飞机 (fēijī)", defaultAudio, "fēijī", "C", "Giải thích: 所听内容为'飞机'，C为飞机图片。", "https://images.unsplash.com/photo-1515165562839-978bbcf18277?w=200", "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200", "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200"}
		};

		for (int i = 0; i < data.length; i++) {
			int sortOrder = i + 1;
			String[] row = data[i];
			QuestionEntity q = new QuestionEntity();
			q.setOwnerId(teacherId);
			q.setType(QuestionType.MCQ);
			q.setContent(row[0]);
			q.setExplanation(row[4]);
			q.setPayload(buildQuestionPayload(row[1], row[2], row[3]));

			QuestionOptionEntity optA = new QuestionOptionEntity("A", "A".equals(row[3]), 1);
			optA.setContent("A");
			optA.setQuestion(q);
			QuestionOptionEntity optB = new QuestionOptionEntity("B", "B".equals(row[3]), 2);
			optB.setContent("B");
			optB.setQuestion(q);
			QuestionOptionEntity optC = new QuestionOptionEntity("C", "C".equals(row[3]), 3);
			optC.setContent("C");
			optC.setQuestion(q);

			q.getOptions().add(optA);
			q.getOptions().add(optB);
			q.getOptions().add(optC);
			questionRepository.save(q);

			ExerciseQuestionEntity eq = new ExerciseQuestionEntity(exam, section, group, q, BigDecimal.valueOf(5.00), sortOrder);
			exerciseQuestionRepository.save(eq);
		}
	}

	private void createListeningMcqQuestions(Long teacherId, ExerciseEntity exam, ExerciseSectionEntity section, QuestionGroupEntity group) {
		String defaultAudio = "https://actions.google.com/sounds/v1/speech/chinese_sample.ogg";
		String[][] data = {
				{"你好！(Nǐ hǎo!)", defaultAudio, "Nǐ hǎo!", "B", "Đáp lại lời chào '你好' là '你好'。", "再见 (Zàijiàn)", "你好 (Nǐ hǎo)", "谢谢 (Xièxie)"},
				{"你叫什么名字？(Nǐ jiào shénme míngzi?)", defaultAudio, "Nǐ jiào shénme míngzi?", "A", "Hỏi tên '你叫什么名字' trả lời '我叫李明'。", "我叫李明 (Wǒ jiào Lǐ Míng)", "他是老师 (Tā shì lǎoshī)", "很高兴 (Hěn gāoxìng)"},
				{"今天星期几？(Jīntiān xīngqī jǐ?)", defaultAudio, "Jīntiān xīngqī jǐ?", "B", "Hỏi thứ '星期几' trả lời '星期三'。", "三号 (Sān hào)", "星期三 (Xīngqīsān)", "三点 (Sān diǎn)"},
				{"你想吃什么？(Nǐ xiǎng chī shénme?)", defaultAudio, "Nǐ xiǎng chī shénme?", "A", "Hỏi món ăn '想吃什么' trả lời '米饭'。", "米饭 (Mǐfàn)", "喝茶 (Hē chá)", "去学校 (Qù xuéxiào)"},
				{"他是哪国人？(Tā shì nǎ guó rén?)", defaultAudio, "Tā shì nǎ guó rén?", "A", "Hỏi quốc tịch '哪国人' trả lời '中国人'。", "中国人 (Zhōngguó rén)", "在家 (Zài jiā)", "八岁 (Bā suì)"}
		};

		for (int i = 0; i < data.length; i++) {
			int sortOrder = 6 + i;
			String[] row = data[i];
			QuestionEntity q = new QuestionEntity();
			q.setOwnerId(teacherId);
			q.setType(QuestionType.MCQ);
			q.setContent(row[0]);
			q.setExplanation(row[4]);
			q.setPayload(buildQuestionPayload(row[1], row[2], row[3]));

			QuestionOptionEntity optA = new QuestionOptionEntity(row[5], "A".equals(row[3]), 1);
			optA.setQuestion(q);
			QuestionOptionEntity optB = new QuestionOptionEntity(row[6], "B".equals(row[3]), 2);
			optB.setQuestion(q);
			QuestionOptionEntity optC = new QuestionOptionEntity(row[7], "C".equals(row[3]), 3);
			optC.setQuestion(q);

			q.getOptions().add(optA);
			q.getOptions().add(optB);
			q.getOptions().add(optC);
			questionRepository.save(q);

			ExerciseQuestionEntity eq = new ExerciseQuestionEntity(exam, section, group, q, BigDecimal.valueOf(5.00), sortOrder);
			exerciseQuestionRepository.save(eq);
		}
	}

	private void createListeningImageMatchQuestions(Long teacherId, ExerciseEntity exam, ExerciseSectionEntity section, QuestionGroupEntity group) {
		String defaultAudio = "https://actions.google.com/sounds/v1/speech/chinese_sample.ogg";
		String[][] data = {
				{"听力句1: 我去学校学汉语。", defaultAudio, "Wǒ qù xuéxiào xué hànyǔ.", "A", "Giải thích: 提到'学校' (Trường học), chọn ảnh A."},
				{"听力句2: 他在医院工作。", defaultAudio, "Tā zài yīyuàn gōngzuò.", "B", "Giải thích: 提到'医院' (Bệnh viện), chọn ảnh B."},
				{"听力句3: 我想去商店买东西。", defaultAudio, "Wǒ xiǎng qù shāngdiàn mǎi dōngxi.", "C", "Giải thích: 提到'商店' (Cửa hàng), chọn ảnh C."},
				{"听力句4: 火车站怎么走？", defaultAudio, "Huǒchēzhàn zěnme zǒu?", "D", "Giải thích: 提到'火车站' (Nhà ga), chọn ảnh D."},
				{"听力句5: 我们在机场等你。", defaultAudio, "Wǒmen zài jīchǎng děng nǐ.", "E", "Giải thích: 提到'机场' (Sân bay), chọn ảnh E."}
		};

		for (int i = 0; i < data.length; i++) {
			int sortOrder = 11 + i;
			String[] row = data[i];
			QuestionEntity q = new QuestionEntity();
			q.setOwnerId(teacherId);
			q.setType(QuestionType.MCQ);
			q.setContent(row[0]);
			q.setExplanation(row[4]);
			q.setPayload(buildQuestionPayload(row[1], row[2], row[3]));
			questionRepository.save(q);

			ExerciseQuestionEntity eq = new ExerciseQuestionEntity(exam, section, group, q, BigDecimal.valueOf(5.00), sortOrder);
			exerciseQuestionRepository.save(eq);
		}
	}

	private void createListeningComprehensionQuestions(Long teacherId, ExerciseEntity exam, ExerciseSectionEntity section, QuestionGroupEntity group) {
		String defaultAudio = "https://actions.google.com/sounds/v1/speech/chinese_sample.ogg";
		String[][] data = {
				{"男：请喝茶。女：谢谢！问：女的在做什么？", defaultAudio, "Nán: Qǐng hē chá. Nǚ: Xièxie! Wèn: Nǚ de zài zuò shénme?", "A", "Giải thích: Nam mời uống trà và nữ cảm ơn -> 女的在喝茶。", "喝茶 (Hē chá)", "吃饭 (Chī fàn)", "买水果 (Mǎi shuǐguǒ)"},
				{"男：这本书多少钱？女：十五块。问：这本书多少钱？", defaultAudio, "Nán: Zhè běn shū duōshao qián? Nǚ: Shíwǔ kuài. Wèn: Zhè běn shū duōshao qián?", "B", "Giải thích: 15 đồng = 十五块 -> chọn B.", "5块 (Wǔ kuài)", "15块 (Shíwǔ kuài)", "50块 (Wǔshí kuài)"},
				{"男：你女儿几岁了？女：她今年六岁了。问：女儿多大了？", defaultAudio, "Nán: Nǐ nǚ'ér jǐ suì le? Nǚ: Tā jīnnián liù suì le. Wèn: Nǚ'ér duō dà le?", "B", "Giải thích: 6 tuổi = 六岁 -> chọn B.", "4岁 (Sì suì)", "6岁 (Liù suì)", "8岁 (Bā suì)"},
				{"男：明天天气怎么样？女：明天下雨，很冷。问：明天天气如何？", defaultAudio, "Nán: Míngtiān tiānqì zěnmeyàng? Nǚ: Míngtiān xiàyǔ, hěn lěng. Wèn: Míngtiān tiānqì rúhé?", "A", "Giải thích: 明天下雨 -> chọn A.", "下雨 (Xiàyǔ)", "晴天 (Qíngtiān)", "很热 (Hěn rè)"},
				{"男：现在几点了？女：现在上午十点十分。问：现在几点？", defaultAudio, "Nán: Xiànzài jǐ diǎn le? Nǚ: Xiànzài shàngwǔ shí diǎn shí fēn. Wèn: Xiànzài jǐ diǎn?", "B", "Giải thích: 10:10 = 十点十分 -> chọn B.", "9:10", "10:10", "10:50"}
		};

		for (int i = 0; i < data.length; i++) {
			int sortOrder = 16 + i;
			String[] row = data[i];
			QuestionEntity q = new QuestionEntity();
			q.setOwnerId(teacherId);
			q.setType(QuestionType.MCQ);
			q.setContent(row[0]);
			q.setExplanation(row[4]);
			q.setPayload(buildQuestionPayload(row[1], row[2], row[3]));

			QuestionOptionEntity optA = new QuestionOptionEntity(row[5], "A".equals(row[3]), 1);
			optA.setQuestion(q);
			QuestionOptionEntity optB = new QuestionOptionEntity(row[6], "B".equals(row[3]), 2);
			optB.setQuestion(q);
			QuestionOptionEntity optC = new QuestionOptionEntity(row[7], "C".equals(row[3]), 3);
			optC.setQuestion(q);

			q.getOptions().add(optA);
			q.getOptions().add(optB);
			q.getOptions().add(optC);
			questionRepository.save(q);

			ExerciseQuestionEntity eq = new ExerciseQuestionEntity(exam, section, group, q, BigDecimal.valueOf(5.00), sortOrder);
			exerciseQuestionRepository.save(eq);
		}
	}

	private void createReadingImageMatchQuestions(Long teacherId, ExerciseEntity exam, ExerciseSectionEntity section, QuestionGroupEntity group) {
		String[][] data = {
				{"她喜欢喝中国茶。", "Tā xǐhuan hē zhōngguó chá.", "A", "Giải thích: '喝茶' nghĩa là uống trà, tương ứng với hình A."},
				{"弟弟在吃米饭。", "Dìdi zài chī mǐfàn.", "B", "Giải thích: '吃米饭' nghĩa là ăn cơm, tương ứng với hình B."},
				{"王老师在黑板上写字。", "Wáng lǎoshī zài hēibǎn shàng xiězì.", "C", "Giải thích: '写字' nghĩa là viết chữ, tương ứng với hình C."},
				{"他们都在操场踢足球。", "Tāmen dōu zài cāochǎng tī zúqiú.", "D", "Giải thích: '踢足球' nghĩa là đá bóng, tương ứng với hình D."},
				{"太累了，他很早就睡觉了。", "Tài lèi le, tā hěn zǎo jiù shuìjiào le.", "E", "Giải thích: '睡觉' nghĩa là đi ngủ, tương ứng với hình E."}
		};

		for (int i = 0; i < data.length; i++) {
			int sortOrder = 21 + i;
			String[] row = data[i];
			QuestionEntity q = new QuestionEntity();
			q.setOwnerId(teacherId);
			q.setType(QuestionType.MCQ);
			q.setContent(row[0]);
			q.setExplanation(row[3]);
			q.setPayload(buildQuestionPayload(null, row[1], row[2]));
			questionRepository.save(q);

			ExerciseQuestionEntity eq = new ExerciseQuestionEntity(exam, section, group, q, BigDecimal.valueOf(5.00), sortOrder);
			exerciseQuestionRepository.save(eq);
		}
	}

	private void createReadingQaMatchQuestions(Long teacherId, ExerciseEntity exam, ExerciseSectionEntity section, QuestionGroupEntity group) {
		String[][] data = {
				{"你学汉语多长时间了？", "Nǐ xué hànyǔ duō cháng shíjiān le?", "B", "Giải thích: Hỏi thời gian học -> '我学了一年了' (Đáp án B)."},
				{"桌子上有什么？", "Zhuōzi shàng yǒu shénme?", "C", "Giải thích: Hỏi trên bàn có gì -> '桌子上有三个苹果' (Đáp án C)."},
				{"那个高个子男生是谁？", "Nàge gāo gèzi nánshēng shì shéi?", "D", "Giải thích: Hỏi là ai -> '他是我大学同学' (Đáp án D)."},
				{"请问现在几点？", "Qǐngwèn xiànzài jǐ diǎn?", "E", "Giải thích: Hỏi giờ -> '现在差五分十二点' (Đáp án E)."},
				{"非常感谢你的帮助！", "Fēicháng gǎnxiè nǐ de bāngzhù!", "A", "Giải thích: Đáp lại cảm ơn -> '没关系，不客气' (Đáp án A)."}
		};

		for (int i = 0; i < data.length; i++) {
			int sortOrder = 26 + i;
			String[] row = data[i];
			QuestionEntity q = new QuestionEntity();
			q.setOwnerId(teacherId);
			q.setType(QuestionType.MCQ);
			q.setContent(row[0]);
			q.setExplanation(row[3]);
			q.setPayload(buildQuestionPayload(null, row[1], row[2]));
			questionRepository.save(q);

			ExerciseQuestionEntity eq = new ExerciseQuestionEntity(exam, section, group, q, BigDecimal.valueOf(5.00), sortOrder);
			exerciseQuestionRepository.save(eq);
		}
	}

	private void createReadingWordBankQuestions(Long teacherId, ExerciseEntity exam, ExerciseSectionEntity section, QuestionGroupEntity group) {
		String[][] data = {
				{"今天认识你，我非常______。", "Jīntiān rènshi nǐ, wǒ fēicháng ______.", "C", "Giải thích: Điền '高兴' (gāoxìng) tạo thành câu quen thuộc: Rất vui được gặp bạn."},
				{"请问这件衣服______钱？", "Qǐngwèn zhè jiàn yīfu ______ qián?", "E", "Giải thích: Điền '多少' (duōshao) tạo thành câu hỏi giá: bao nhiêu tiền."},
				{"你妈妈买的这朵花真______。", "Nǐ māma mǎi de zhè duǒ huā zhēn ______.", "D", "Giải thích: Điền '漂亮' (piàoliang) khen bông hoa rất đẹp."},
				{"我周末喜欢在家______电影。", "Wǒ zhōumò xǐhuan zài jiā ______ diànyǐng.", "A", "Giải thích: Điền '看' (kàn) kết hợp với 电影: xem phim."},
				{"爸爸现在不______家，他去上班了。", "Bàba xiànzài bù ______ jiā, tā qù shàngbān le.", "B", "Giải thích: Điền '在' (zài) chỉ nơi chốn: không ở nhà."}
		};

		for (int i = 0; i < data.length; i++) {
			int sortOrder = 31 + i;
			String[] row = data[i];
			QuestionEntity q = new QuestionEntity();
			q.setOwnerId(teacherId);
			q.setType(QuestionType.MCQ);
			q.setContent(row[0]);
			q.setExplanation(row[3]);
			q.setPayload(buildQuestionPayload(null, row[1], row[2]));
			questionRepository.save(q);

			ExerciseQuestionEntity eq = new ExerciseQuestionEntity(exam, section, group, q, BigDecimal.valueOf(5.00), sortOrder);
			exerciseQuestionRepository.save(eq);
		}
	}

	private void createReadingComprehensionQuestions(Long teacherId, ExerciseEntity exam, ExerciseSectionEntity section, QuestionGroupEntity group) {
		String[][] data = {
				{"我家一共有几口人？", "Wǒ jiā yígòng yǒu jǐ kǒu rén?", "B", "Giải thích: Đoạn văn viết: '我家有四口人：爸爸、妈妈、哥哥和我' -> 4 người.", "三口 (Sān kǒu)", "四口 (Sì kǒu)", "五口 (Wǔ kǒu)"},
				{"爸爸在哪里工作？", "Bàba zài nǎlǐ gōngzuò?", "C", "Giải thích: Đoạn văn viết: '爸爸是医生，在医院工作' -> 医院.", "学校 (Xuéxiào)", "商店 (Shāngdiàn)", "医院 (Yīyuàn)"},
				{"妈妈是教什么科目的老师？", "Māma shì jiāo shénme kēmù de lǎoshī?", "B", "Giải thích: Đoạn văn viết: '妈妈是老师，在学校教英语' -> 英语.", "汉语 (Hànyǔ)", "英语 (Yīngyǔ)", "体育 (Tǐyù)"},
				{"哥哥喜欢做什么？", "Gēge xǐhuan zuò shénme?", "A", "Giải thích: Đoạn văn viết: '他喜欢打篮球' -> 打篮球.", "打篮球 (Dǎ lánqiú)", "踢足球 (Tī zúqiú)", "游泳 (Yóuyǒng)"},
				{"小狗的名字叫什么？", "Xiǎogǒu de míngzi jiào shénme?", "B", "Giải thích: Đoạn văn viết: '名叫点点，非常可爱' -> 点点.", "乐乐 (Lèlè)", "点点 (Diǎndian)", "花花 (Huāhuā)"}
		};

		for (int i = 0; i < data.length; i++) {
			int sortOrder = 36 + i;
			String[] row = data[i];
			QuestionEntity q = new QuestionEntity();
			q.setOwnerId(teacherId);
			q.setType(QuestionType.MCQ);
			q.setContent(row[0]);
			q.setExplanation(row[3]);
			q.setPayload(buildQuestionPayload(null, row[1], row[2]));

			QuestionOptionEntity optA = new QuestionOptionEntity(row[4], "A".equals(row[2]), 1);
			optA.setQuestion(q);
			QuestionOptionEntity optB = new QuestionOptionEntity(row[5], "B".equals(row[2]), 2);
			optB.setQuestion(q);
			QuestionOptionEntity optC = new QuestionOptionEntity(row[6], "C".equals(row[2]), 3);
			optC.setQuestion(q);

			q.getOptions().add(optA);
			q.getOptions().add(optB);
			q.getOptions().add(optC);
			questionRepository.save(q);

			ExerciseQuestionEntity eq = new ExerciseQuestionEntity(exam, section, group, q, BigDecimal.valueOf(5.00), sortOrder);
			exerciseQuestionRepository.save(eq);
		}
	}

	// ==================== HELPER METHODS ====================

	private String buildQuestionPayload(String audioUrl, String pinyin, String correctKey) {
		try {
			Map<String, Object> map = new HashMap<>();
			if (audioUrl != null) map.put("audioUrl", audioUrl);
			if (pinyin != null) map.put("pinyin", pinyin);
			if (correctKey != null) map.put("correctKey", correctKey);
			return objectMapper.writeValueAsString(map);
		} catch (Exception e) {
			return null;
		}
	}

	private QuestionParsedMetadata parseQuestionMetadata(QuestionEntity q) {
		String audioUrl = null;
		String pinyin = null;
		String correctKey = null;
		Long correctOptionId = null;

		if (q.getPayload() != null && !q.getPayload().isBlank()) {
			try {
				JsonNode node = objectMapper.readTree(q.getPayload());
				if (node.hasNonNull("audioUrl")) audioUrl = node.get("audioUrl").asText();
				if (node.hasNonNull("pinyin")) pinyin = node.get("pinyin").asText();
				if (node.hasNonNull("correctKey")) correctKey = node.get("correctKey").asText();
			} catch (Exception ignored) {
			}
		}

		if (q.getOptions() != null) {
			for (int idx = 0; idx < q.getOptions().size(); idx++) {
				QuestionOptionEntity opt = q.getOptions().get(idx);
				if (opt.isCorrect()) {
					correctOptionId = opt.getId();
					if (correctKey == null) {
						char labelChar = (char) ('A' + idx);
						correctKey = String.valueOf(labelChar);
					}
					break;
				}
			}
		}

		return new QuestionParsedMetadata(audioUrl, pinyin, correctKey, correctOptionId);
	}

	private List<Hsk30QuestionOptionDto> mapQuestionOptions(QuestionEntity q) {
		if (q.getOptions() == null || q.getOptions().isEmpty()) {
			return Collections.emptyList();
		}
		List<Hsk30QuestionOptionDto> list = new ArrayList<>();
		for (int i = 0; i < q.getOptions().size(); i++) {
			QuestionOptionEntity opt = q.getOptions().get(i);
			String label = String.valueOf((char) ('A' + i));
			list.add(new Hsk30QuestionOptionDto(opt.getId(), label, opt.getContent(), null));
		}
		return list;
	}

	private GroupParsedData parseGroupData(String sharedDataJson) {
		if (sharedDataJson == null || sharedDataJson.isBlank()) {
			return new GroupParsedData(Collections.emptyList(), null);
		}
		try {
			JsonNode root = objectMapper.readTree(sharedDataJson);
			List<Hsk30SharedOptionItem> options = new ArrayList<>();
			if (root.has("options") && root.get("options").isArray()) {
				for (JsonNode item : root.get("options")) {
					String key = item.hasNonNull("key") ? item.get("key").asText() : "";
					String imageUrl = item.hasNonNull("imageUrl") ? item.get("imageUrl").asText() : null;
					String text = item.hasNonNull("text") ? item.get("text").asText() : null;
					String pinyin = item.hasNonNull("pinyin") ? item.get("pinyin").asText() : null;
					String description = item.hasNonNull("description") ? item.get("description").asText() : null;
					options.add(new Hsk30SharedOptionItem(key, imageUrl, text, pinyin, description));
				}
			}
			String passage = root.hasNonNull("passage") ? root.get("passage").asText() : null;
			return new GroupParsedData(options, passage);
		} catch (Exception e) {
			log.warn("Could not parse group shared data: {}", e.getMessage());
			return new GroupParsedData(Collections.emptyList(), null);
		}
	}

	private record QuestionParsedMetadata(String audioUrl, String pinyin, String correctKey, Long correctOptionId) {}
	private record GroupParsedData(List<Hsk30SharedOptionItem> options, String passage) {}
}
