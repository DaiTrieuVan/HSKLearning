package com.hsk.account.web;

import java.security.Principal;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hsk.account.dto.ChangePasswordCommand;
import com.hsk.account.dto.UpdateProfileCommand;
import com.hsk.account.dto.UserProfileResponse;
import com.hsk.account.service.ProfileService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * HTT-01-CN-006: Cập nhật hồ sơ cá nhân và đổi mật khẩu.
 */
@RestController
@RequestMapping("/api/v1/profile")
@Tag(name = "Hồ sơ cá nhân", description = "HTT-01-CN-006 — Cập nhật hồ sơ cá nhân và đổi mật khẩu")
public class ProfileController {

	private final ProfileService profileService;

	public ProfileController(ProfileService profileService) {
		this.profileService = profileService;
	}

	@Operation(summary = "HTT-01-CN-006 — Xem thông tin hồ sơ của tôi")
	@GetMapping(path = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UserProfileResponse> getMyProfile(Principal principal) {
		UserProfileResponse profile = profileService.getProfile(principal.getName());
		return ResponseEntity.ok(profile);
	}

	@Operation(summary = "HTT-01-CN-006-TC-01 — Cập nhật họ tên và ảnh đại diện")
	@PutMapping(path = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UserProfileResponse> updateProfile(
			@Valid @RequestBody UpdateProfileCommand command,
			Principal principal) {
		UserProfileResponse profile = profileService.updateProfile(principal.getName(), command);
		return ResponseEntity.ok(profile);
	}

	@Operation(summary = "HTT-01-CN-006-TC-01 & TC-04 — Tải lên tệp ảnh đại diện")
	@PostMapping(path = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UserProfileResponse> uploadAvatar(
			@RequestParam("file") MultipartFile file,
			Principal principal) {
		UserProfileResponse profile = profileService.uploadAvatar(principal.getName(), file);
		return ResponseEntity.ok(profile);
	}

	@Operation(summary = "HTT-01-CN-006-TC-02 & TC-03 — Đổi mật khẩu tài khoản")
	@PutMapping(path = "/change-password", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Void> changePassword(
			@Valid @RequestBody ChangePasswordCommand command,
			Principal principal) {
		profileService.changePassword(principal.getName(), command);
		return ResponseEntity.ok().build();
	}

	@Operation(summary = "HTT-01-CN-009 — Chuyển đổi chế độ làm việc (STUDENT ⇄ TEACHER)")
	@PutMapping(path = "/mode", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<UserProfileResponse> switchMode(
			@Valid @RequestBody com.hsk.account.dto.SwitchModeRequest request,
			Principal principal) {
		UserProfileResponse profile = profileService.switchMode(principal.getName(), request.mode());
		return ResponseEntity.ok(profile);
	}
}
