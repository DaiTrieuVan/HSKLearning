package com.hsk.content.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
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
import com.hsk.content.dto.VocabularyResponse;
import com.hsk.content.service.ContentService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/content")
public class ContentController {

	private final ContentService contentService;
	private final UserRepository userRepository;

	public ContentController(ContentService contentService, UserRepository userRepository) {
		this.contentService = contentService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
			.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	private boolean isAdmin(Authentication authentication) {
		if (authentication == null) return false;
		return authentication.getAuthorities().stream()
			.anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()) || "ADMIN".equals(a.getAuthority()));
	}

	// ==================== LEVELS ====================

	@GetMapping("/levels")
	public List<HskLevelResponse> getLevels(@RequestParam(required = false, defaultValue = "false") boolean includeHidden) {
		return contentService.getLevels(includeHidden);
	}

	@GetMapping("/levels/{id}")
	public HskLevelResponse getLevel(@PathVariable Long id) {
		return contentService.getLevelById(id);
	}

	// ==================== LESSONS ====================

	@GetMapping("/levels/{levelId}/lessons")
	public List<LessonResponse> getLessons(
			@PathVariable Long levelId,
			@RequestParam(required = false, defaultValue = "false") boolean includeHidden) {
		return contentService.getLessonsByLevel(levelId, includeHidden);
	}

	@GetMapping("/lessons/{lessonId}")
	public LessonResponse getLesson(@PathVariable Long lessonId, Authentication authentication) {
		return contentService.getLessonById(lessonId, isAdmin(authentication));
	}

	@GetMapping("/lessons/{lessonId}/study")
	public LessonStudyResponse getLessonStudy(@PathVariable Long lessonId, Authentication authentication) {
		return contentService.getLessonStudyContent(lessonId, isAdmin(authentication));
	}

	@PostMapping("/lessons")
	@ResponseStatus(HttpStatus.CREATED)
	public LessonResponse createLesson(@Valid @RequestBody CreateLessonRequest req, Principal principal) {
		UserEntity user = requireUser(principal);
		return contentService.createLesson(req, user.getId());
	}

	@PutMapping("/lessons/{lessonId}")
	public LessonResponse updateLesson(
			@PathVariable Long lessonId,
			@Valid @RequestBody UpdateLessonRequest req,
			Principal principal) {
		requireUser(principal);
		return contentService.updateLesson(lessonId, req);
	}

	@DeleteMapping("/lessons/{lessonId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteLesson(@PathVariable Long lessonId, Principal principal) {
		requireUser(principal);
		contentService.hideLesson(lessonId);
	}

	// ==================== VOCABULARIES ====================

	@GetMapping("/vocabularies")
	public List<VocabularyResponse> getVocabularies(
			@RequestParam(required = false) String query,
			Principal principal) {
		Long userId = null;
		if (principal != null) {
			userId = userRepository.findByEmail(principal.getName()).map(UserEntity::getId).orElse(null);
		}
		return contentService.getAccessibleVocabularies(userId, query);
	}

	@GetMapping("/lessons/{lessonId}/vocabularies")
	public List<VocabularyResponse> getLessonVocabularies(@PathVariable Long lessonId, Authentication authentication) {
		return contentService.getLessonVocabularies(lessonId, isAdmin(authentication));
	}

	@PostMapping("/vocabularies")
	@ResponseStatus(HttpStatus.CREATED)
	public VocabularyResponse createVocabulary(
			@Valid @RequestBody CreateVocabularyRequest req,
			Principal principal) {
		UserEntity user = requireUser(principal);
		return contentService.createVocabulary(req, user.getId());
	}

	@PutMapping("/vocabularies/{id}")
	public VocabularyResponse updateVocabulary(
			@PathVariable Long id,
			@Valid @RequestBody UpdateVocabularyRequest req,
			Principal principal) {
		UserEntity user = requireUser(principal);
		return contentService.updateVocabulary(id, req, user.getId());
	}

	@DeleteMapping("/vocabularies/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteVocabulary(@PathVariable Long id, Principal principal) {
		UserEntity user = requireUser(principal);
		contentService.hideOrDeleteVocabulary(id, user.getId());
	}

	@PostMapping("/lessons/{lessonId}/vocabularies/{vocabularyId}")
	@ResponseStatus(HttpStatus.CREATED)
	public void addVocabularyToLesson(
			@PathVariable Long lessonId,
			@PathVariable Long vocabularyId,
			@RequestParam(required = false) Integer sortOrder,
			Principal principal) {
		requireUser(principal);
		contentService.addVocabularyToLesson(lessonId, vocabularyId, sortOrder);
	}

	@DeleteMapping("/lessons/{lessonId}/vocabularies/{vocabularyId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void removeVocabularyFromLesson(
			@PathVariable Long lessonId,
			@PathVariable Long vocabularyId,
			Principal principal) {
		requireUser(principal);
		contentService.removeVocabularyFromLesson(lessonId, vocabularyId);
	}

	// ==================== AUDIO UPLOAD ====================

	@PostMapping("/audio")
	public Map<String, String> uploadAudio(@RequestParam("file") MultipartFile file, Principal principal) {
		requireUser(principal);
		String audioUrl = contentService.uploadAudio(file);
		return Map.of("audioUrl", audioUrl);
	}

	// ==================== BULK IMPORT ====================

	@PostMapping("/vocabularies/import")
	public ImportVocabularyResult importVocabularies(
			@RequestParam("file") MultipartFile file,
			@RequestParam(required = false) Long levelId,
			@RequestParam(required = false, defaultValue = "false") boolean isPrivate,
			Principal principal) {
		UserEntity user = requireUser(principal);
		return contentService.importVocabularies(file, levelId, user.getId(), isPrivate);
	}

	// ==================== GRAMMAR ====================

	@GetMapping("/lessons/{lessonId}/grammar")
	public List<GrammarPointResponse> getGrammarPoints(@PathVariable Long lessonId, Authentication authentication) {
		return contentService.getGrammarPointsByLesson(lessonId, isAdmin(authentication));
	}

	@PostMapping("/lessons/{lessonId}/grammar")
	@ResponseStatus(HttpStatus.CREATED)
	public GrammarPointResponse createGrammarPoint(
			@PathVariable Long lessonId,
			@Valid @RequestBody CreateGrammarPointRequest req,
			Principal principal) {
		requireUser(principal);
		return contentService.createGrammarPoint(lessonId, req);
	}

	@DeleteMapping("/grammar/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteGrammarPoint(@PathVariable Long id, Principal principal) {
		requireUser(principal);
		contentService.deleteGrammarPoint(id);
	}

	// ==================== VOCAB SETS ====================

	@GetMapping("/vocab-sets")
	public List<VocabSetResponse> getMyVocabSets(Principal principal) {
		UserEntity user = requireUser(principal);
		return contentService.getTeacherVocabSets(user.getId());
	}

	@PostMapping("/vocab-sets")
	@ResponseStatus(HttpStatus.CREATED)
	public VocabSetResponse createVocabSet(
			@Valid @RequestBody CreateVocabSetRequest req,
			Principal principal) {
		UserEntity user = requireUser(principal);
		return contentService.createVocabSet(req, user.getId());
	}

	@PostMapping("/classes/{classId}/vocab-sets/{vocabSetId}")
	@ResponseStatus(HttpStatus.CREATED)
	public void assignVocabSetToClass(
			@PathVariable Long classId,
			@PathVariable Long vocabSetId,
			Principal principal) {
		UserEntity user = requireUser(principal);
		contentService.assignVocabSetToClass(classId, vocabSetId, user.getId());
	}

	@GetMapping("/vocabularies/my-private")
	public List<VocabularyResponse> getMyPrivateVocabularies(Principal principal) {
		UserEntity user = requireUser(principal);
		return contentService.getTeacherPrivateVocabularies(user.getId());
	}

	@GetMapping("/classes/{classId}/vocab-sets")
	public List<VocabSetResponse> getClassVocabSets(@PathVariable Long classId, Principal principal) {
		UserEntity user = requireUser(principal);
		return contentService.getClassVocabSets(classId, user.getId());
	}

	@GetMapping("/vocab-sets/{vocabSetId}/vocabularies")
	public List<VocabularyResponse> getVocabSetItems(
			@PathVariable Long vocabSetId,
			Principal principal) {
		UserEntity user = requireUser(principal);
		return contentService.getVocabSetItems(vocabSetId, user.getId());
	}

	@PostMapping("/vocab-sets/{vocabSetId}/vocabularies/{vocabularyId}")
	@ResponseStatus(HttpStatus.CREATED)
	public void addVocabularyToVocabSet(
			@PathVariable Long vocabSetId,
			@PathVariable Long vocabularyId,
			Principal principal) {
		UserEntity user = requireUser(principal);
		contentService.addVocabularyToVocabSet(vocabSetId, vocabularyId, user.getId());
	}

	@DeleteMapping("/vocab-sets/{vocabSetId}/vocabularies/{vocabularyId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void removeVocabularyFromVocabSet(
			@PathVariable Long vocabSetId,
			@PathVariable Long vocabularyId,
			Principal principal) {
		UserEntity user = requireUser(principal);
		contentService.removeVocabularyFromVocabSet(vocabSetId, vocabularyId, user.getId());
	}

	@DeleteMapping("/vocab-sets/{vocabSetId}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteVocabSet(
			@PathVariable Long vocabSetId,
			Principal principal) {
		UserEntity user = requireUser(principal);
		contentService.deleteVocabSet(vocabSetId, user.getId());
	}
}
