package com.hsk.learning.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.dto.MatchSessionResponse;
import com.hsk.learning.dto.MatchSubmitRequest;
import com.hsk.learning.dto.MatchSubmitResponse;
import com.hsk.learning.dto.PracticeSessionHistoryItemDto;
import com.hsk.learning.dto.QuizSessionResponse;
import com.hsk.learning.dto.QuizSubmitRequest;
import com.hsk.learning.dto.QuizSubmitResponse;
import com.hsk.learning.dto.WritingSessionResponse;
import com.hsk.learning.dto.WritingSubmitRequest;
import com.hsk.learning.dto.WritingSubmitResponse;
import com.hsk.learning.service.PracticeSessionSupport;
import com.hsk.learning.service.VocabMatchService;
import com.hsk.learning.service.VocabQuizService;
import com.hsk.learning.service.VocabWritingService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/learning/practice")
public class VocabPracticeController {

	private final VocabQuizService vocabQuizService;
	private final VocabMatchService vocabMatchService;
	private final VocabWritingService vocabWritingService;
	private final PracticeSessionSupport practiceSessionSupport;
	private final UserRepository userRepository;

	public VocabPracticeController(
			VocabQuizService vocabQuizService,
			VocabMatchService vocabMatchService,
			VocabWritingService vocabWritingService,
			PracticeSessionSupport practiceSessionSupport,
			UserRepository userRepository) {
		this.vocabQuizService = vocabQuizService;
		this.vocabMatchService = vocabMatchService;
		this.vocabWritingService = vocabWritingService;
		this.practiceSessionSupport = practiceSessionSupport;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@GetMapping("/quiz")
	public ResponseEntity<QuizSessionResponse> generateQuiz(
			@RequestParam(required = false) Long lessonId,
			@RequestParam(required = false) Long vocabSetId,
			@RequestParam(required = false, defaultValue = "ALL") String filterStatus,
			@RequestParam(required = false, defaultValue = "RANDOM") String order,
			@RequestParam(required = false) Integer limit,
			@RequestParam(required = false, defaultValue = "HANZI_TO_MEANING") String mode,
			Principal principal) {
		UserEntity user = requireUser(principal);
		QuizSessionResponse response = vocabQuizService.generateQuiz(
				user.getId(), lessonId, vocabSetId, filterStatus, order, limit, mode);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/quiz/submit")
	public ResponseEntity<QuizSubmitResponse> submitQuiz(
			@Valid @RequestBody QuizSubmitRequest request,
			Principal principal) {
		UserEntity user = requireUser(principal);
		QuizSubmitResponse response = vocabQuizService.submitQuiz(user.getId(), request);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/match")
	public ResponseEntity<MatchSessionResponse> generateMatch(
			@RequestParam(required = false) Long lessonId,
			@RequestParam(required = false) Long vocabSetId,
			@RequestParam(required = false, defaultValue = "ALL") String filterStatus,
			@RequestParam(required = false, defaultValue = "RANDOM") String order,
			@RequestParam(required = false) Integer limit,
			@RequestParam(required = false, defaultValue = "MATCH_MEANING") String mode,
			Principal principal) {
		UserEntity user = requireUser(principal);
		MatchSessionResponse response = vocabMatchService.generateMatchSession(
				user.getId(), lessonId, vocabSetId, filterStatus, order, limit, mode);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/match/submit")
	public ResponseEntity<MatchSubmitResponse> submitMatch(
			@Valid @RequestBody MatchSubmitRequest request,
			Principal principal) {
		UserEntity user = requireUser(principal);
		MatchSubmitResponse response = vocabMatchService.submitMatch(user.getId(), request);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/writing")
	public ResponseEntity<WritingSessionResponse> generateWriting(
			@RequestParam(required = false) Long lessonId,
			@RequestParam(required = false) Long vocabSetId,
			@RequestParam(required = false, defaultValue = "ALL") String filterStatus,
			@RequestParam(required = false, defaultValue = "RANDOM") String order,
			@RequestParam(required = false) Integer limit,
			@RequestParam(required = false, defaultValue = "TRACE") String mode,
			Principal principal) {
		UserEntity user = requireUser(principal);
		WritingSessionResponse response = vocabWritingService.generateWritingSession(
				user.getId(), lessonId, vocabSetId, filterStatus, order, limit, mode);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/writing/submit")
	public ResponseEntity<WritingSubmitResponse> submitWriting(
			@Valid @RequestBody WritingSubmitRequest request,
			Principal principal) {
		UserEntity user = requireUser(principal);
		WritingSubmitResponse response = vocabWritingService.submitWriting(user.getId(), request);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/history")
	public ResponseEntity<List<PracticeSessionHistoryItemDto>> getPracticeHistory(
			@RequestParam(required = false, defaultValue = "10") int limit,
			Principal principal) {
		UserEntity user = requireUser(principal);
		return ResponseEntity.ok(practiceSessionSupport.getPracticeHistory(user.getId(), limit));
	}
}

