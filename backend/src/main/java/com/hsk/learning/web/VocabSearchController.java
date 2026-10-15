package com.hsk.learning.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.dto.VocabSearchResultItem;
import com.hsk.learning.service.VocabSearchService;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/learning/vocabularies")
public class VocabSearchController {

	private final VocabSearchService vocabSearchService;
	private final UserRepository userRepository;

	public VocabSearchController(VocabSearchService vocabSearchService, UserRepository userRepository) {
		this.vocabSearchService = vocabSearchService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@GetMapping("/search")
	public ResponseEntity<List<VocabSearchResultItem>> searchVocabularies(
			@RequestParam(name = "q", required = false) String q,
			@RequestParam(name = "query", required = false) String query,
			Principal principal) {
		String keyword = (q != null && !q.isBlank()) ? q : query;
		UserEntity user = requireUser(principal);
		List<VocabSearchResultItem> results = vocabSearchService.searchVocabularies(user.getId(), keyword);
		return ResponseEntity.ok(results);
	}
}
