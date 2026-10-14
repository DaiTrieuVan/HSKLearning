package com.hsk.learning.web;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.learning.dto.RoadmapResponse;
import com.hsk.learning.service.RoadmapService;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/roadmap")
public class RoadmapController {

	private final RoadmapService roadmapService;
	private final UserRepository userRepository;

	public RoadmapController(RoadmapService roadmapService, UserRepository userRepository) {
		this.roadmapService = roadmapService;
		this.userRepository = userRepository;
	}

	private UserEntity requireUser(Principal principal) {
		if (principal == null) {
			throw new ApiException(ApiErrorCode.UNAUTHORIZED);
		}
		return userRepository.findByEmail(principal.getName())
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	@GetMapping
	public ResponseEntity<RoadmapResponse> getRoadmap(Principal principal) {
		UserEntity user = requireUser(principal);
		RoadmapResponse response = roadmapService.getRoadmap(user.getId());
		return ResponseEntity.ok(response);
	}

	@PostMapping("/lessons/{lessonId}/complete")
	public ResponseEntity<Void> markLessonCompleted(@PathVariable Long lessonId, Principal principal) {
		UserEntity user = requireUser(principal);
		roadmapService.markLessonCompleted(user.getId(), lessonId);
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/lessons/{lessonId}/complete")
	public ResponseEntity<Void> unmarkLessonCompleted(@PathVariable Long lessonId, Principal principal) {
		UserEntity user = requireUser(principal);
		roadmapService.unmarkLessonCompleted(user.getId(), lessonId);
		return ResponseEntity.noContent().build();
	}
}
