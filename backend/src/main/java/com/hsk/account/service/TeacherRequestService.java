package com.hsk.account.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.RoleEntity;
import com.hsk.account.domain.TeacherRequestEntity;
import com.hsk.account.domain.TeacherRequestStatus;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
import com.hsk.account.dto.SubmitTeacherRequestCommand;
import com.hsk.account.dto.TeacherRequestResponse;
import com.hsk.account.repository.RoleRepository;
import com.hsk.account.repository.TeacherRequestRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;

/**
 * HTT-01-CN-002: Gửi yêu cầu nâng quyền giáo viên.
 * HTT-01-CN-003: Quản trị viên duyệt / từ chối yêu cầu nâng quyền giáo viên.
 */
@Service
public class TeacherRequestService {

	private final TeacherRequestRepository teacherRequestRepository;

	private final UserRepository userRepository;

	private final UserRoleRepository userRoleRepository;

	private final RoleRepository roleRepository;

	private final com.hsk.common.audit.AuditLogService auditLogService;

	public TeacherRequestService(
			TeacherRequestRepository teacherRequestRepository,
			UserRepository userRepository,
			UserRoleRepository userRoleRepository,
			RoleRepository roleRepository,
			com.hsk.common.audit.AuditLogService auditLogService) {
		this.teacherRequestRepository = teacherRequestRepository;
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
		this.roleRepository = roleRepository;
		this.auditLogService = auditLogService;
	}

	/**
	 * HTT-01-CN-002-TC-01..TC-06: Người dùng gửi yêu cầu trở thành giáo viên.
	 */
	@Transactional
	public TeacherRequestResponse submitRequest(String userEmail, SubmitTeacherRequestCommand command) {
		UserEntity user = userRepository.findByEmailIgnoreCase(userEmail)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		if (user.isPermanentlyLocked()) {
			throw new ApiException(ApiErrorCode.ACCOUNT_LOCKED);
		}

		// TC-06: Tài khoản đã có quyền giáo viên
		if (userRoleRepository.existsByUser_IdAndRole_Code(user.getId(), RoleCode.TEACHER)) {
			throw new ApiException(ApiErrorCode.ALREADY_TEACHER);
		}

		// TC-04: Tài khoản đã có yêu cầu đang chờ duyệt
		if (teacherRequestRepository.existsByUser_IdAndStatus(user.getId(), TeacherRequestStatus.PENDING)) {
			throw new ApiException(ApiErrorCode.PENDING_REQUEST_ALREADY_EXISTS);
		}

		TeacherRequestEntity request = TeacherRequestEntity.create(user, command.teachingInfo().trim());
		TeacherRequestEntity saved = teacherRequestRepository.save(request);
		return TeacherRequestResponse.from(saved);
	}

	/**
	 * Lấy yêu cầu gần nhất của người dùng hiện tại (cho phép xem trạng thái chờ duyệt hoặc lý do từ chối).
	 */
	@Transactional(readOnly = true)
	public Optional<TeacherRequestResponse> getMyLatestRequest(String userEmail) {
		UserEntity user = userRepository.findByEmailIgnoreCase(userEmail)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		return teacherRequestRepository.findTopByUser_IdOrderByCreatedAtDesc(user.getId())
				.map(TeacherRequestResponse::from);
	}

	/**
	 * HTT-01-CN-002-TC-02 & HTT-01-CN-003: Quản trị viên xem danh sách yêu cầu chờ duyệt.
	 */
	@Transactional(readOnly = true)
	public List<TeacherRequestResponse> listPendingRequests() {
		return teacherRequestRepository.findByStatusWithUser(TeacherRequestStatus.PENDING)
				.stream()
				.map(TeacherRequestResponse::from)
				.toList();
	}

	/**
	 * Quản trị viên xem tất cả yêu cầu nâng quyền giáo viên.
	 */
	@Transactional(readOnly = true)
	public List<TeacherRequestResponse> listAllRequests() {
		return teacherRequestRepository.findAllWithUser()
				.stream()
				.map(TeacherRequestResponse::from)
				.toList();
	}

	/**
	 * HTT-01-CN-003-TC-01: Quản trị viên phê duyệt yêu cầu nâng quyền giáo viên.
	 * QTN-03: Tài khoản được cấp thêm vai trò TEACHER và vẫn giữ vai trò STUDENT.
	 */
	@Transactional
	public TeacherRequestResponse approveRequest(Long requestId, String adminEmail) {
		UserEntity admin = userRepository.findByEmailIgnoreCase(adminEmail)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		TeacherRequestEntity request = teacherRequestRepository.findById(requestId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND));

		// TC-05: Yêu cầu đã được duyệt hoặc từ chối trước đó
		if (request.getStatus() != TeacherRequestStatus.PENDING) {
			throw new ApiException(ApiErrorCode.REQUEST_ALREADY_PROCESSED);
		}

		request.approve(admin, Instant.now());

		UserEntity studentUser = request.getUser();
		// Cấp thêm quyền TEACHER nếu chưa có
		if (!userRoleRepository.existsByUser_IdAndRole_Code(studentUser.getId(), RoleCode.TEACHER)) {
			RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER)
					.orElseThrow(() -> new ApiException(ApiErrorCode.INTERNAL_ERROR, "Không tìm thấy vai trò TEACHER"));
			UserRoleEntity grant = UserRoleEntity.of(studentUser, teacherRole, admin);
			userRoleRepository.save(grant);
		}

		// HTT-01-CN-003-TC-06 / CV-04: Ghi nhật ký xử lý yêu cầu (audit_logs)
		auditLogService.record(
				admin,
				"TEACHER_REQUEST_APPROVED",
				"TEACHER_REQUEST",
				String.valueOf(requestId),
				"Phê duyệt quyền giáo viên cho tài khoản: " + studentUser.getEmail());

		return TeacherRequestResponse.from(request);
	}

	/**
	 * HTT-01-CN-003-TC-02 & TC-03: Quản trị viên từ chối yêu cầu nâng quyền giáo viên kèm lý do bắt buộc.
	 */
	@Transactional
	public TeacherRequestResponse rejectRequest(Long requestId, String adminEmail, String reason) {
		if (reason == null || reason.trim().isBlank()) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED, "reason", "Lý do từ chối không được để trống");
		}

		UserEntity admin = userRepository.findByEmailIgnoreCase(adminEmail)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));

		TeacherRequestEntity request = teacherRequestRepository.findById(requestId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.RESOURCE_NOT_FOUND));

		// TC-05: Yêu cầu đã được duyệt hoặc từ chối trước đó
		if (request.getStatus() != TeacherRequestStatus.PENDING) {
			throw new ApiException(ApiErrorCode.REQUEST_ALREADY_PROCESSED);
		}

		request.reject(admin, reason.trim(), Instant.now());

		// HTT-01-CN-003-TC-06 / CV-04: Ghi nhật ký xử lý yêu cầu (audit_logs)
		auditLogService.record(
				admin,
				"TEACHER_REQUEST_REJECTED",
				"TEACHER_REQUEST",
				String.valueOf(requestId),
				"Từ chối yêu cầu của tài khoản: " + request.getUser().getEmail() + ". Lý do: " + reason.trim());

		return TeacherRequestResponse.from(request);
	}
}
