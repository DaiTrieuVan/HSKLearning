package com.hsk.content.service;

import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.domain.ClassVocabSetEntity;
import com.hsk.content.domain.GrammarExampleEntity;
import com.hsk.content.domain.GrammarPointEntity;
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.LessonEntity;
import com.hsk.content.domain.LessonVocabularyEntity;
import com.hsk.content.domain.VocabSetEntity;
import com.hsk.content.domain.VocabSetItemEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.dto.CreateGrammarPointRequest;
import com.hsk.content.dto.CreateLessonRequest;
import com.hsk.content.dto.CreateVocabSetRequest;
import com.hsk.content.dto.CreateVocabularyRequest;
import com.hsk.content.dto.GrammarPointResponse;
import com.hsk.content.dto.HskLevelResponse;
import com.hsk.content.dto.ImportVocabularyResult;
import com.hsk.content.dto.LessonResponse;
import com.hsk.content.dto.LessonStudyResponse;
import com.hsk.content.dto.UpdateLessonRequest;
import com.hsk.content.dto.UpdateVocabularyRequest;
import com.hsk.content.dto.VocabSetResponse;
import com.hsk.content.dto.VocabularyAudioResponse;
import com.hsk.content.dto.VocabularyResponse;
import com.hsk.content.repository.ClassVocabSetRepository;
import com.hsk.content.repository.GrammarPointRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ContentService {

	private static final Logger log = LoggerFactory.getLogger(ContentService.class);
	private static final long MAX_AUDIO_BYTES = 5 * 1024 * 1024; // 5 MB (QTN)
	private static final String UPLOAD_AUDIO_DIR = "uploads/audio";

	private final HskLevelRepository levelRepository;
	private final LessonRepository lessonRepository;
	private final VocabularyRepository vocabularyRepository;
	private final LessonVocabularyRepository lessonVocabularyRepository;
	private final GrammarPointRepository grammarPointRepository;
	private final VocabSetRepository vocabSetRepository;
	private final VocabSetItemRepository vocabSetItemRepository;
	private final ClassVocabSetRepository classVocabSetRepository;
	private final ClassRepository classRepository;
	private final ClassMemberRepository classMemberRepository;

	public ContentService(
			HskLevelRepository levelRepository,
			LessonRepository lessonRepository,
			VocabularyRepository vocabularyRepository,
			LessonVocabularyRepository lessonVocabularyRepository,
			GrammarPointRepository grammarPointRepository,
			VocabSetRepository vocabSetRepository,
			VocabSetItemRepository vocabSetItemRepository,
			ClassVocabSetRepository classVocabSetRepository,
			ClassRepository classRepository,
			ClassMemberRepository classMemberRepository) {
		this.levelRepository = levelRepository;
		this.lessonRepository = lessonRepository;
		this.vocabularyRepository = vocabularyRepository;
		this.lessonVocabularyRepository = lessonVocabularyRepository;
		this.grammarPointRepository = grammarPointRepository;
		this.vocabSetRepository = vocabSetRepository;
		this.vocabSetItemRepository = vocabSetItemRepository;
		this.classVocabSetRepository = classVocabSetRepository;
		this.classRepository = classRepository;
		this.classMemberRepository = classMemberRepository;
	}

	// ==================== 1. HSK LEVELS ====================

	@Transactional(readOnly = true)
	public List<HskLevelResponse> getLevels(boolean includeHidden) {
		List<HskLevelEntity> levels = includeHidden
			? levelRepository.findAllByOrderByLevelNumberAsc()
			: levelRepository.findAllByHiddenFalseOrderByLevelNumberAsc();
		return levels.stream().map(HskLevelResponse::fromEntity).toList();
	}

	@Transactional(readOnly = true)
	public HskLevelResponse getLevelById(Long id) {
		HskLevelEntity entity = levelRepository.findById(id)
			.orElseThrow(() -> new ApiException(ApiErrorCode.HSK_LEVEL_NOT_FOUND));
		return HskLevelResponse.fromEntity(entity);
	}

	// ==================== 2. LESSONS ====================

	@Transactional(readOnly = true)
	public List<LessonResponse> getLessonsByLevel(Long levelId, boolean includeHidden) {
		List<LessonEntity> lessons = includeHidden
			? lessonRepository.findAllByHskLevelIdOrderBySortOrderAsc(levelId)
			: lessonRepository.findAllByHskLevelIdAndHiddenFalseOrderBySortOrderAsc(levelId);

		return lessons.stream().map(l -> {
			int vocabCount = lessonVocabularyRepository.findAllByLessonIdOrderBySortOrderAsc(l.getId()).size();
			int grammarCount = grammarPointRepository.findAllByLessonIdOrderBySortOrderAsc(l.getId()).size();
			return LessonResponse.fromEntity(l, vocabCount, grammarCount);
		}).toList();
	}

	@Transactional(readOnly = true)
	public LessonResponse getLessonById(Long id, boolean isAdmin) {
		LessonEntity entity = lessonRepository.findById(id)
			.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));
		// QTN-14: Hidden lesson is treated as not found for non-admin
		if (entity.isHidden() && !isAdmin) {
			throw new ApiException(ApiErrorCode.LESSON_NOT_FOUND);
		}
		int vocabCount = lessonVocabularyRepository.findAllByLessonIdOrderBySortOrderAsc(entity.getId()).size();
		int grammarCount = grammarPointRepository.findAllByLessonIdOrderBySortOrderAsc(entity.getId()).size();
		return LessonResponse.fromEntity(entity, vocabCount, grammarCount);
	}

	@Transactional(readOnly = true)
	public LessonResponse getLessonById(Long id) {
		return getLessonById(id, false);
	}

	@Transactional(readOnly = true)
	public LessonStudyResponse getLessonStudyContent(Long lessonId, boolean isAdmin) {
		LessonEntity lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));

		// QTN-14: Hidden lesson is treated as not found for non-admin
		if (lesson.isHidden() && !isAdmin) {
			throw new ApiException(ApiErrorCode.LESSON_NOT_FOUND);
		}

		List<LessonVocabularyEntity> relations = lessonVocabularyRepository.findAllByLessonIdOrderBySortOrderAsc(lessonId);
		List<VocabularyResponse> vocabularies = relations.stream()
			.map(LessonVocabularyEntity::getVocabulary)
			.filter(v -> !v.isHidden() || isAdmin)
			.map(VocabularyResponse::fromEntity)
			.toList();

		List<GrammarPointResponse> grammarPoints = grammarPointRepository.findAllByLessonIdOrderBySortOrderAsc(lessonId)
			.stream()
			.map(GrammarPointResponse::fromEntity)
			.toList();

		return LessonStudyResponse.from(lesson, vocabularies, grammarPoints);
	}

	@Transactional
	public LessonResponse createLesson(CreateLessonRequest req, Long userId) {
		HskLevelEntity level = levelRepository.findById(req.hskLevelId())
			.orElseThrow(() -> new ApiException(ApiErrorCode.HSK_LEVEL_NOT_FOUND));

		LessonEntity lesson = new LessonEntity(level, req.title(), req.description(), req.sortOrder(), userId);
		LessonEntity saved = lessonRepository.save(lesson);
		return LessonResponse.fromEntity(saved, 0, 0);
	}

	@Transactional
	public LessonResponse updateLesson(Long lessonId, UpdateLessonRequest req) {
		LessonEntity lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));

		if (req.title() != null && !req.title().isBlank()) {
			lesson.setTitle(req.title().trim());
		}
		if (req.description() != null) {
			lesson.setDescription(req.description());
		}
		if (req.sortOrder() != null) {
			lesson.setSortOrder(req.sortOrder());
		}
		if (req.hidden() != null) {
			lesson.setHidden(req.hidden());
		}

		LessonEntity saved = lessonRepository.save(lesson);
		int vocabCount = lessonVocabularyRepository.findAllByLessonIdOrderBySortOrderAsc(saved.getId()).size();
		int grammarCount = grammarPointRepository.findAllByLessonIdOrderBySortOrderAsc(saved.getId()).size();
		return LessonResponse.fromEntity(saved, vocabCount, grammarCount);
	}

	@Transactional
	public void hideLesson(Long lessonId) {
		LessonEntity lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));
		// QTN-14: Soft hide instead of hard delete
		lesson.setHidden(true);
		lessonRepository.save(lesson);
	}

	// ==================== 3. VOCABULARIES ====================

	@Transactional(readOnly = true)
	public List<VocabularyResponse> getAccessibleVocabularies(Long userId, String query) {
		List<VocabularyEntity> list = vocabularyRepository.searchAccessibleVocabularies(userId, query != null ? query.trim() : null);
		return list.stream().map(VocabularyResponse::fromEntity).toList();
	}

	@Transactional(readOnly = true)
	public List<VocabularyResponse> getVocabulariesByLevel(Long levelId) {
		return vocabularyRepository.findAllByHskLevelIdAndHiddenFalse(levelId)
			.stream().map(VocabularyResponse::fromEntity).toList();
	}

	@Transactional(readOnly = true)
	public List<VocabularyResponse> getLessonVocabularies(Long lessonId, boolean isAdmin) {
		LessonEntity lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));
		// QTN-14: Hidden lesson is treated as not found for non-admin
		if (lesson.isHidden() && !isAdmin) {
			throw new ApiException(ApiErrorCode.LESSON_NOT_FOUND);
		}
		List<LessonVocabularyEntity> relations = lessonVocabularyRepository.findAllByLessonIdOrderBySortOrderAsc(lessonId);
		return relations.stream()
			.map(LessonVocabularyEntity::getVocabulary)
			.filter(v -> !v.isHidden() || isAdmin)
			.map(VocabularyResponse::fromEntity)
			.toList();
	}

	@Transactional(readOnly = true)
	public List<VocabularyResponse> getLessonVocabularies(Long lessonId) {
		return getLessonVocabularies(lessonId, false);
	}

	@Transactional
	public VocabularyResponse createVocabulary(CreateVocabularyRequest req, Long userId) {
		Long ownerId = Boolean.TRUE.equals(req.isPrivate()) ? userId : null;
		String ownerKey = VocabularyEntity.buildOwnerKey(ownerId, req.hanzi(), req.pinyin());

		// QTN-07: Uniqueness check for Hanzi and Pinyin pair
		if (vocabularyRepository.existsByOwnerKey(ownerKey)) {
			throw new ApiException(ApiErrorCode.VOCABULARY_ALREADY_EXISTS);
		}

		HskLevelEntity level = null;
		if (req.hskLevelId() != null) {
			level = levelRepository.findById(req.hskLevelId()).orElse(null);
		}

		VocabularyEntity entity = new VocabularyEntity(
			req.hanzi().trim(),
			req.pinyin().trim(),
			req.meaning().trim(),
			req.partOfSpeech(),
			req.audioUrl(),
			req.exampleSentence(),
			req.examplePinyin(),
			req.exampleMeaning(),
			level,
			ownerId
		);

		VocabularyEntity saved = vocabularyRepository.save(entity);
		return VocabularyResponse.fromEntity(saved);
	}

	@Transactional
	public VocabularyResponse updateVocabulary(Long id, UpdateVocabularyRequest req, Long userId) {
		VocabularyEntity entity = vocabularyRepository.findById(id)
			.orElseThrow(() -> new ApiException(ApiErrorCode.VOCABULARY_NOT_FOUND));

		if (entity.getOwnerId() != null && !Objects.equals(entity.getOwnerId(), userId)) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}

		boolean needOwnerKeyUpdate = false;
		if (req.hanzi() != null && !req.hanzi().isBlank()) {
			entity.setHanzi(req.hanzi().trim());
			needOwnerKeyUpdate = true;
		}
		if (req.pinyin() != null && !req.pinyin().isBlank()) {
			entity.setPinyin(req.pinyin().trim());
			needOwnerKeyUpdate = true;
		}

		if (needOwnerKeyUpdate) {
			String newKey = VocabularyEntity.buildOwnerKey(entity.getOwnerId(), entity.getHanzi(), entity.getPinyin());
			if (!newKey.equals(entity.getOwnerKey()) && vocabularyRepository.existsByOwnerKey(newKey)) {
				throw new ApiException(ApiErrorCode.VOCABULARY_ALREADY_EXISTS);
			}
		}

		if (req.meaning() != null && !req.meaning().isBlank()) {
			entity.setMeaning(req.meaning().trim());
		}
		if (req.partOfSpeech() != null) {
			entity.setPartOfSpeech(req.partOfSpeech());
		}
		if (req.audioUrl() != null) {
			entity.setAudioUrl(req.audioUrl());
		}
		if (req.exampleSentence() != null) {
			entity.setExampleSentence(req.exampleSentence());
		}
		if (req.examplePinyin() != null) {
			entity.setExamplePinyin(req.examplePinyin());
		}
		if (req.exampleMeaning() != null) {
			entity.setExampleMeaning(req.exampleMeaning());
		}
		if (req.hskLevelId() != null) {
			levelRepository.findById(req.hskLevelId()).ifPresent(entity::setHskLevel);
		}
		if (req.hidden() != null) {
			entity.setHidden(req.hidden());
		}

		VocabularyEntity saved = vocabularyRepository.save(entity);
		return VocabularyResponse.fromEntity(saved);
	}

	@Transactional
	public void hideOrDeleteVocabulary(Long id, Long userId) {
		VocabularyEntity entity = vocabularyRepository.findById(id)
			.orElseThrow(() -> new ApiException(ApiErrorCode.VOCABULARY_NOT_FOUND));

		if (entity.getOwnerId() != null && !Objects.equals(entity.getOwnerId(), userId)) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}

		// QTN-14: If used in lessons or sets, soft hide
		boolean isUsedInLesson = lessonVocabularyRepository.existsByVocabularyId(id);
		boolean isUsedInSet = vocabSetItemRepository.existsByVocabularyId(id);

		if (isUsedInLesson || isUsedInSet) {
			entity.setHidden(true);
			vocabularyRepository.save(entity);
		} else {
			vocabularyRepository.delete(entity);
		}
	}

	@Transactional
	public void addVocabularyToLesson(Long lessonId, Long vocabularyId, Integer sortOrder) {
		LessonEntity lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));
		VocabularyEntity vocabulary = vocabularyRepository.findById(vocabularyId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.VOCABULARY_NOT_FOUND));

		LessonVocabularyId relId = new LessonVocabularyId(lessonId, vocabularyId);
		if (lessonVocabularyRepository.existsById(relId)) {
			return;
		}

		LessonVocabularyEntity relation = new LessonVocabularyEntity(lesson, vocabulary, sortOrder != null ? sortOrder : 1);
		lessonVocabularyRepository.save(relation);
	}

	@Transactional
	public VocabularyResponse createOrAddVocabularyToLesson(Long lessonId, CreateVocabularyRequest req, Long userId) {
		LessonEntity lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));

		Long ownerId = Boolean.TRUE.equals(req.isPrivate()) ? userId : null;
		String ownerKey = VocabularyEntity.buildOwnerKey(ownerId, req.hanzi(), req.pinyin());

		VocabularyEntity vocab = vocabularyRepository.findByOwnerKey(ownerKey).orElse(null);
		if (vocab == null) {
			HskLevelEntity level = null;
			if (req.hskLevelId() != null) {
				level = levelRepository.findById(req.hskLevelId()).orElse(null);
			}
			if (level == null) {
				level = lesson.getHskLevel();
			}

			vocab = new VocabularyEntity(
				req.hanzi().trim(),
				req.pinyin().trim(),
				req.meaning().trim(),
				req.partOfSpeech(),
				req.audioUrl(),
				req.exampleSentence(),
				req.examplePinyin(),
				req.exampleMeaning(),
				level,
				ownerId
			);
			vocab = vocabularyRepository.save(vocab);
		} else {
			if (vocab.isHidden()) {
				vocab.setHidden(false);
			}
			if (req.meaning() != null && !req.meaning().isBlank()) {
				vocab.setMeaning(req.meaning().trim());
			}
			if (req.partOfSpeech() != null && !req.partOfSpeech().isBlank()) {
				vocab.setPartOfSpeech(req.partOfSpeech());
			}
			if (req.audioUrl() != null && !req.audioUrl().isBlank()) {
				vocab.setAudioUrl(req.audioUrl());
			}
			if (req.exampleSentence() != null) {
				vocab.setExampleSentence(req.exampleSentence());
				vocab.setExamplePinyin(req.examplePinyin());
				vocab.setExampleMeaning(req.exampleMeaning());
			}
			vocab = vocabularyRepository.save(vocab);
		}

		LessonVocabularyId relId = new LessonVocabularyId(lesson.getId(), vocab.getId());
		if (!lessonVocabularyRepository.existsById(relId)) {
			int currentCount = lessonVocabularyRepository.findAllByLessonIdOrderBySortOrderAsc(lesson.getId()).size();
			lessonVocabularyRepository.save(new LessonVocabularyEntity(lesson, vocab, currentCount + 1));
		}

		return VocabularyResponse.fromEntity(vocab);
	}

	@Transactional
	public void removeVocabularyFromLesson(Long lessonId, Long vocabularyId) {
		lessonVocabularyRepository.deleteByLessonIdAndVocabularyId(lessonId, vocabularyId);
	}

	// ==================== 4. AUDIO UPLOAD (HTT-03-CN-006) ====================

	public String uploadAudio(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED);
		}

		if (file.getSize() > MAX_AUDIO_BYTES) {
			throw new ApiException(ApiErrorCode.FILE_TOO_LARGE);
		}

		String originalName = file.getOriginalFilename();
		String ext = "";
		if (originalName != null && originalName.contains(".")) {
			ext = originalName.substring(originalName.lastIndexOf(".")).toLowerCase();
		}

		if (!List.of(".mp3", ".wav", ".ogg", ".m4a").contains(ext)) {
			throw new ApiException(ApiErrorCode.INVALID_FILE_FORMAT);
		}

		try {
			Path dir = Paths.get(UPLOAD_AUDIO_DIR);
			if (!Files.exists(dir)) {
				Files.createDirectories(dir);
			}

			String filename = "audio_" + UUID.randomUUID() + ext;
			Path targetPath = dir.resolve(filename);
			Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

			return "/" + UPLOAD_AUDIO_DIR + "/" + filename;
		} catch (IOException e) {
			log.error("Failed to store audio file", e);
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR);
		}
	}

	@Transactional(readOnly = true)
	public VocabularyAudioResponse getVocabularyAudio(Long vocabularyId) {
		VocabularyEntity vocab = vocabularyRepository.findById(vocabularyId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.VOCABULARY_NOT_FOUND));

		if (vocab.isHidden()) {
			throw new ApiException(ApiErrorCode.VOCABULARY_NOT_FOUND);
		}

		String audioUrl = vocab.getAudioUrl();
		if (audioUrl == null || audioUrl.trim().isEmpty()) {
			throw new ApiException(ApiErrorCode.AUDIO_NOT_FOUND);
		}

		// HTT-04-CN-003-TC-03: Xử lý khi tệp audio không tồn tại
		if (audioUrl.startsWith("/uploads/") || audioUrl.startsWith("uploads/")) {
			String relative = audioUrl.startsWith("/") ? audioUrl.substring(1) : audioUrl;
			Path filePath = Paths.get(relative);
			if (!Files.exists(filePath)) {
				throw new ApiException(ApiErrorCode.AUDIO_FILE_NOT_FOUND);
			}
		}

		return new VocabularyAudioResponse(vocab.getId(), vocab.getHanzi(), vocab.getPinyin(), audioUrl);
	}

	// ==================== 5. BULK IMPORT (HTT-03-CN-007 / QTN-07) ====================

	@Transactional
	public ImportVocabularyResult importVocabularies(MultipartFile file, Long levelId, Long userId, boolean isPrivate) {
		if (file == null || file.isEmpty()) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED);
		}

		HskLevelEntity level = null;
		if (levelId != null) {
			level = levelRepository.findById(levelId).orElse(null);
		}

		Long ownerId = isPrivate ? userId : null;
		List<String> errors = new ArrayList<>();
		int totalRows = 0;
		int successCount = 0;
		int skippedCount = 0;

		try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
			String line;
			boolean isFirst = true;

			while ((line = reader.readLine()) != null) {
				if (totalRows >= 1000) {
					errors.add("Đã đạt giới hạn tối đa 1000 dòng");
					break;
				}

				if (isFirst) {
					isFirst = false;
					if (line.toLowerCase().contains("hanzi") || line.toLowerCase().contains("chữ hán")) {
						continue; // skip header line
					}
				}

				if (line.trim().isEmpty()) {
					continue;
				}

				totalRows++;
				String[] parts = line.split("[,;\t]");
				if (parts.length < 3) {
					skippedCount++;
					errors.add("Dòng " + totalRows + ": Thiếu dữ liệu bắt buộc (Hanzi, Pinyin, Meaning)");
					continue;
				}

				String hanzi = sanitizeFormula(parts[0].trim());
				String pinyin = sanitizeFormula(parts[1].trim());
				String meaning = sanitizeFormula(parts[2].trim());
				String partOfSpeech = parts.length > 3 ? sanitizeFormula(parts[3].trim()) : null;
				String exampleSentence = parts.length > 4 ? sanitizeFormula(parts[4].trim()) : null;
				String examplePinyin = parts.length > 5 ? sanitizeFormula(parts[5].trim()) : null;
				String exampleMeaning = parts.length > 6 ? sanitizeFormula(parts[6].trim()) : null;

				if (hanzi.isEmpty() || pinyin.isEmpty() || meaning.isEmpty()) {
					skippedCount++;
					continue;
				}

				String ownerKey = VocabularyEntity.buildOwnerKey(ownerId, hanzi, pinyin);
				if (vocabularyRepository.existsByOwnerKey(ownerKey)) {
					skippedCount++;
					errors.add("Dòng " + totalRows + ": Từ '" + hanzi + " (" + pinyin + ")' đã tồn tại trong kho");
					continue;
				}

				VocabularyEntity entity = new VocabularyEntity(
					hanzi, pinyin, meaning, partOfSpeech, null,
					exampleSentence, examplePinyin, exampleMeaning,
					level, ownerId
				);
				vocabularyRepository.save(entity);
				successCount++;
			}
		} catch (IOException e) {
			log.error("Failed to read import file", e);
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR);
		}

		return new ImportVocabularyResult(totalRows, successCount, skippedCount, errors);
	}

	/**
	 * QTN-07: Anti-formula injection: escapes starting characters =, +, -, @
	 */
	private String sanitizeFormula(String value) {
		if (value == null) return "";
		String trimmed = value.trim();
		if (trimmed.startsWith("=") || trimmed.startsWith("+") || trimmed.startsWith("-") || trimmed.startsWith("@")) {
			return "'" + trimmed;
		}
		return trimmed;
	}

	// ==================== 6. GRAMMAR POINTS ====================

	@Transactional(readOnly = true)
	public List<GrammarPointResponse> getGrammarPointsByLesson(Long lessonId, boolean isAdmin) {
		LessonEntity lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));
		// QTN-14: Hidden lesson is treated as not found for non-admin
		if (lesson.isHidden() && !isAdmin) {
			throw new ApiException(ApiErrorCode.LESSON_NOT_FOUND);
		}
		return grammarPointRepository.findAllByLessonIdOrderBySortOrderAsc(lessonId)
			.stream().map(GrammarPointResponse::fromEntity).toList();
	}

	@Transactional(readOnly = true)
	public List<GrammarPointResponse> getGrammarPointsByLesson(Long lessonId) {
		return getGrammarPointsByLesson(lessonId, false);
	}

	@Transactional
	public GrammarPointResponse createGrammarPoint(Long lessonId, CreateGrammarPointRequest req) {
		LessonEntity lesson = lessonRepository.findById(lessonId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.LESSON_NOT_FOUND));

		GrammarPointEntity point = new GrammarPointEntity(
			lesson, req.title().trim(), req.structure(), req.explanation().trim(), req.sortOrder()
		);

		if (req.examples() != null) {
			for (var exReq : req.examples()) {
				GrammarExampleEntity example = new GrammarExampleEntity(
					exReq.hanzi().trim(), exReq.pinyin().trim(), exReq.meaning().trim(), exReq.sortOrder()
				);
				point.addExample(example);
			}
		}

		GrammarPointEntity saved = grammarPointRepository.save(point);
		return GrammarPointResponse.fromEntity(saved);
	}

	@Transactional
	public void deleteGrammarPoint(Long id) {
		GrammarPointEntity point = grammarPointRepository.findById(id)
			.orElseThrow(() -> new ApiException(ApiErrorCode.GRAMMAR_POINT_NOT_FOUND));
		grammarPointRepository.delete(point);
	}

	// ==================== 7. VOCAB SETS & CLASS SHARING ====================

	@Transactional(readOnly = true)
	public List<VocabSetResponse> getTeacherVocabSets(Long teacherId) {
		return vocabSetRepository.findAllByTeacherIdOrderByCreatedAtDesc(teacherId)
			.stream().map(s -> {
				int count = vocabSetItemRepository.findAllByVocabSetIdOrderBySortOrderAsc(s.getId()).size();
				return VocabSetResponse.fromEntity(s, count);
			}).toList();
	}

	@Transactional
	public VocabSetResponse createVocabSet(CreateVocabSetRequest req, Long teacherId) {
		VocabSetEntity set = new VocabSetEntity(teacherId, req.title().trim(), req.description());
		VocabSetEntity saved = vocabSetRepository.save(set);

		int count = 0;
		if (req.vocabularyIds() != null) {
			int order = 1;
			for (Long vId : req.vocabularyIds()) {
				var vocabOpt = vocabularyRepository.findById(vId);
				if (vocabOpt.isPresent()) {
					VocabSetItemEntity item = new VocabSetItemEntity(saved, vocabOpt.get(), order++);
					vocabSetItemRepository.save(item);
					count++;
				}
			}
		}

		return VocabSetResponse.fromEntity(saved, count);
	}

	@Transactional
	public void assignVocabSetToClass(Long classId, Long vocabSetId, Long teacherId) {
		ClassEntity classroom = classRepository.findById(classId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND));

		if (!Objects.equals(classroom.getTeacher().getId(), teacherId)) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}

		VocabSetEntity set = vocabSetRepository.findById(vocabSetId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.VOCAB_SET_NOT_FOUND));

		ClassVocabSetEntity relation = new ClassVocabSetEntity(classroom, set);
		classVocabSetRepository.save(relation);
	}

	@Transactional(readOnly = true)
	public List<VocabSetResponse> getClassVocabSets(Long classId, Long userId) {
		ClassEntity classroom = classRepository.findById(classId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND));

		// Only teacher or active member can view class vocab sets
		boolean isTeacher = Objects.equals(classroom.getTeacher().getId(), userId);
		boolean isMember = classMemberRepository.findByClassroom_IdAndStudent_Id(classId, userId)
			.map(m -> m.getStatus() == ClassMemberStatus.ACTIVE).orElse(false);

		if (!isTeacher && !isMember) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}

		List<ClassVocabSetEntity> assignments = classVocabSetRepository.findAllByClassroomId(classId);
		return assignments.stream().map(a -> {
			VocabSetEntity s = a.getVocabSet();
			int count = vocabSetItemRepository.findAllByVocabSetIdOrderBySortOrderAsc(s.getId()).size();
			return VocabSetResponse.fromEntity(s, count);
		}).toList();
	}

	@Transactional(readOnly = true)
	public List<VocabularyResponse> getTeacherPrivateVocabularies(Long teacherId) {
		return vocabularyRepository.findAllByOwnerIdAndHiddenFalse(teacherId)
			.stream().map(VocabularyResponse::fromEntity).toList();
	}

	@Transactional(readOnly = true)
	public List<VocabularyResponse> getVocabSetItems(Long vocabSetId, Long userId) {
		VocabSetEntity set = vocabSetRepository.findById(vocabSetId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.VOCAB_SET_NOT_FOUND));

		boolean isOwner = Objects.equals(set.getTeacherId(), userId);
		if (!isOwner) {
			List<ClassVocabSetEntity> assignments = classVocabSetRepository.findAll();
			boolean hasAccess = assignments.stream()
				.anyMatch(a -> Objects.equals(a.getVocabSet().getId(), vocabSetId) &&
					(Objects.equals(a.getClassroom().getTeacher().getId(), userId) ||
					 classMemberRepository.findByClassroom_IdAndStudent_Id(a.getClassroom().getId(), userId)
						.map(m -> m.getStatus() == ClassMemberStatus.ACTIVE).orElse(false)));
			if (!hasAccess) {
				throw new ApiException(ApiErrorCode.FORBIDDEN);
			}
		}

		return vocabSetItemRepository.findAllByVocabSetIdOrderBySortOrderAsc(vocabSetId)
			.stream()
			.map(item -> VocabularyResponse.fromEntity(item.getVocabulary()))
			.toList();
	}

	@Transactional
	public void addVocabularyToVocabSet(Long vocabSetId, Long vocabularyId, Long teacherId) {
		VocabSetEntity set = vocabSetRepository.findById(vocabSetId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.VOCAB_SET_NOT_FOUND));
		if (!Objects.equals(set.getTeacherId(), teacherId)) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}
		VocabularyEntity vocab = vocabularyRepository.findById(vocabularyId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.VOCABULARY_NOT_FOUND));

		int currentCount = vocabSetItemRepository.findAllByVocabSetIdOrderBySortOrderAsc(vocabSetId).size();
		VocabSetItemEntity item = new VocabSetItemEntity(set, vocab, currentCount + 1);
		vocabSetItemRepository.save(item);
	}

	@Transactional
	public void removeVocabularyFromVocabSet(Long vocabSetId, Long vocabularyId, Long teacherId) {
		VocabSetEntity set = vocabSetRepository.findById(vocabSetId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.VOCAB_SET_NOT_FOUND));
		if (!Objects.equals(set.getTeacherId(), teacherId)) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}
		vocabSetItemRepository.deleteByVocabSetIdAndVocabularyId(vocabSetId, vocabularyId);
	}

	@Transactional
	public void deleteVocabSet(Long vocabSetId, Long teacherId) {
		VocabSetEntity set = vocabSetRepository.findById(vocabSetId)
			.orElseThrow(() -> new ApiException(ApiErrorCode.VOCAB_SET_NOT_FOUND));
		if (!Objects.equals(set.getTeacherId(), teacherId)) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}
		classVocabSetRepository.findAll().stream()
			.filter(c -> Objects.equals(c.getVocabSet().getId(), vocabSetId))
			.forEach(classVocabSetRepository::delete);
		vocabSetItemRepository.findAllByVocabSetIdOrderBySortOrderAsc(vocabSetId)
			.forEach(vocabSetItemRepository::delete);
		vocabSetRepository.delete(set);
	}
}
