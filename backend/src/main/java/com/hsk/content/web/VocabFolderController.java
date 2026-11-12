package com.hsk.content.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.content.dto.CreateVocabFolderRequest;
import com.hsk.content.dto.VocabFolderDto;
import com.hsk.content.service.VocabFolderService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/content/vocab-folders")
public class VocabFolderController {

	private final VocabFolderService vocabFolderService;
	private final UserRepository userRepository;

	public VocabFolderController(VocabFolderService vocabFolderService, UserRepository userRepository) {
		this.vocabFolderService = vocabFolderService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmailIgnoreCase(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@GetMapping
	public List<VocabFolderDto> getMyFolders(Principal principal) {
		UserEntity user = requireUser(principal);
		return vocabFolderService.getMyFolders(user.getId());
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public VocabFolderDto createFolder(
			@Valid @RequestBody CreateVocabFolderRequest request,
			Principal principal) {
		UserEntity user = requireUser(principal);
		return vocabFolderService.createFolder(user.getId(), request);
	}

	@PutMapping("/{id}")
	public VocabFolderDto updateFolder(
			@PathVariable Long id,
			@Valid @RequestBody CreateVocabFolderRequest request,
			Principal principal) {
		UserEntity user = requireUser(principal);
		return vocabFolderService.updateFolder(user.getId(), id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void deleteFolder(
			@PathVariable Long id,
			Principal principal) {
		UserEntity user = requireUser(principal);
		vocabFolderService.deleteFolder(user.getId(), id);
	}
}
