package com.hsk.material.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.domain.ClassStatus;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.material.domain.ClassCourseMaterialEntity;
import com.hsk.material.domain.CourseMaterialEntity;
import com.hsk.material.domain.CourseMaterialPageEntity;
import com.hsk.material.domain.MaterialFileType;
import com.hsk.material.domain.MaterialStatus;
import com.hsk.material.dto.ClassMaterialResponse;
import com.hsk.material.dto.MaterialDetailResponse;
import com.hsk.material.dto.MaterialPageDto;
import com.hsk.material.dto.MaterialShareItemRequest;
import com.hsk.material.dto.MaterialShareResponse;
import com.hsk.material.dto.MaterialSummaryResponse;
import com.hsk.material.dto.UpdateMaterialRequest;
import com.hsk.material.repository.ClassCourseMaterialRepository;
import com.hsk.material.repository.CourseMaterialPageRepository;
import com.hsk.material.repository.CourseMaterialRepository;

/**
 * Nghiệp vụ quản lý giáo trình, trình chiếu slide ảnh bảo mật và chia sẻ vào lớp học.
 */
@Service
public class MaterialService {

	public record DownloadedMaterial(String originalFilename, MaterialFileType fileType, byte[] bytes) {
	}

	private final CourseMaterialRepository materialRepository;
	private final CourseMaterialPageRepository pageRepository;
	private final ClassCourseMaterialRepository classMaterialRepository;
	private final ClassRepository classRepository;
	private final ClassMemberRepository classMemberRepository;
	private final UserRepository userRepository;
	private final UserRoleRepository userRoleRepository;
	private final MaterialStorageService storageService;
	private final SlideRenderService slideRenderService;
	private final MaterialAsyncProcessor asyncProcessor;

	public MaterialService(
			CourseMaterialRepository materialRepository,
			CourseMaterialPageRepository pageRepository,
			ClassCourseMaterialRepository classMaterialRepository,
			ClassRepository classRepository,
			ClassMemberRepository classMemberRepository,
			UserRepository userRepository,
			UserRoleRepository userRoleRepository,
			MaterialStorageService storageService,
			SlideRenderService slideRenderService,
			MaterialAsyncProcessor asyncProcessor) {
		this.materialRepository = materialRepository;
		this.pageRepository = pageRepository;
		this.classMaterialRepository = classMaterialRepository;
		this.classRepository = classRepository;
		this.classMemberRepository = classMemberRepository;
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
		this.storageService = storageService;
		this.slideRenderService = slideRenderService;
		this.asyncProcessor = asyncProcessor;
	}

	@Transactional
	public MaterialSummaryResponse uploadMaterial(
			String callerEmail,
			MultipartFile file,
			String title,
			String description,
			Integer hskLevel,
			boolean defaultAllowDownload) {
		UserEntity teacher = findUser(callerEmail);
		assertTeacherOrAdmin(teacher.getId());

		if (hskLevel != null && (hskLevel < 1 || hskLevel > 6)) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED, "Cấp HSK phải nằm trong khoảng từ 1 đến 6");
		}

		MaterialFileType fileType = slideRenderService.validateUploadedFile(file);
		String originalFilename = sanitizeFilename(file.getOriginalFilename(), fileType);
		String resolvedTitle = (title != null && !title.isBlank())
				? title.trim()
				: stripExtension(originalFilename);
		if (resolvedTitle.length() > 200) {
			resolvedTitle = resolvedTitle.substring(0, 200);
		}
		String resolvedDescription = (description != null && !description.isBlank()) ? description.trim() : null;

		String bundleUuid = UUID.randomUUID().toString();
		String ext = fileType == MaterialFileType.PDF ? ".pdf" : ".pptx";
		String storagePath;
		try {
			storagePath = storageService.saveOriginalFile(teacher.getId(), bundleUuid, ext, file.getInputStream());
		} catch (IOException ex) {
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR);
		}

		try {
			CourseMaterialEntity entity = CourseMaterialEntity.createProcessing(
					teacher,
					resolvedTitle,
					resolvedDescription,
					hskLevel,
					fileType,
					originalFilename,
					storagePath,
					file.getSize(),
					defaultAllowDownload
			);
			if (fileType == MaterialFileType.PDF) {
				// PDF hiển thị trực tiếp qua trình đọc toàn màn hình, không cần chuyển thành slide ảnh trên server
				int pageCount = slideRenderService.countPdfPages(storageService.resolveSafe(storagePath));
				entity.markReady(pageCount);
				CourseMaterialEntity saved = materialRepository.save(entity);
				return toSummary(saved, 0L);
			}

			CourseMaterialEntity saved = materialRepository.save(entity);
			triggerAsyncRenderAfterCommit(saved.getId());
			return toSummary(saved, 0L);
		} catch (RuntimeException ex) {
			storageService.deleteMaterialBundle(storagePath);
			throw ex;
		}
	}

	@Transactional(readOnly = true)
	public List<MaterialSummaryResponse> listMyMaterials(
			String callerEmail,
			String keyword,
			Integer hskLevel,
			MaterialFileType fileType) {
		UserEntity caller = findUser(callerEmail);
		assertTeacherOrAdmin(caller.getId());

		List<CourseMaterialEntity> materials = materialRepository
				.findByTeacherIdWithTeacherOrderByCreatedAtDesc(caller.getId());
		if (materials.isEmpty()) {
			return List.of();
		}

		String normalizedKeyword = keyword != null ? keyword.trim().toLowerCase(Locale.ROOT) : "";
		List<CourseMaterialEntity> filtered = materials.stream()
				.filter(m -> normalizedKeyword.isEmpty()
						|| m.getTitle().toLowerCase(Locale.ROOT).contains(normalizedKeyword)
						|| m.getOriginalFilename().toLowerCase(Locale.ROOT).contains(normalizedKeyword))
				.filter(m -> hskLevel == null || hskLevel.equals(m.getHskLevel()))
				.filter(m -> fileType == null || fileType == m.getFileType())
				.toList();

		if (filtered.isEmpty()) {
			return List.of();
		}

		List<Long> ids = filtered.stream().map(CourseMaterialEntity::getId).toList();
		Map<Long, Long> shareCounts = new HashMap<>();
		for (Object[] row : classMaterialRepository.countSharesByMaterialIds(ids)) {
			shareCounts.put((Long) row[0], ((Number) row[1]).longValue());
		}

		return filtered.stream()
				.map(m -> toSummary(m, shareCounts.getOrDefault(m.getId(), 0L)))
				.toList();
	}

	@Transactional(readOnly = true)
	public MaterialDetailResponse getMaterialDetail(String callerEmail, Long materialId) {
		UserEntity caller = findUser(callerEmail);
		CourseMaterialEntity material = findMaterialWithTeacher(materialId);

		assertCanView(caller, material);
		boolean isOwner = isOwnerOrAdmin(caller, material);
		boolean canDownload = isOwner || classMaterialRepository.existsActiveStudentDownloadAccess(materialId, caller.getId());

		List<MaterialPageDto> pages = pageRepository.findByMaterial_IdOrderByPageNumberAsc(materialId).stream()
				.map(p -> new MaterialPageDto(p.getPageNumber(), p.getWidth(), p.getHeight()))
				.toList();

		return new MaterialDetailResponse(
				material.getId(),
				material.getTeacher().getId(),
				material.getTeacher().getFullName(),
				material.getTitle(),
				material.getDescription(),
				material.getHskLevel(),
				material.getFileType(),
				material.getOriginalFilename(),
				material.getFileSizeBytes(),
				material.getTotalPages(),
				material.getStatus(),
				material.getErrorMessage(),
				material.isDefaultAllowDownload(),
				canDownload,
				isOwner,
				pages,
				material.getCreatedAt(),
				material.getUpdatedAt()
		);
	}

	@Transactional
	public MaterialSummaryResponse updateMaterial(String callerEmail, Long materialId, UpdateMaterialRequest request) {
		UserEntity caller = findUser(callerEmail);
		CourseMaterialEntity material = findMaterialWithTeacher(materialId);
		assertOwnerOrAdmin(caller, material);

		String description = (request.description() != null && !request.description().isBlank())
				? request.description().trim()
				: null;
		boolean allowDownload = request.defaultAllowDownload() != null
				? request.defaultAllowDownload()
				: material.isDefaultAllowDownload();

		material.updateMetadata(request.title().trim(), description, request.hskLevel(), allowDownload);
		CourseMaterialEntity saved = materialRepository.save(material);

		long shareCount = countSingleShare(saved.getId());
		return toSummary(saved, shareCount);
	}

	@Transactional
	public MaterialSummaryResponse retryRender(String callerEmail, Long materialId) {
		UserEntity caller = findUser(callerEmail);
		CourseMaterialEntity material = findMaterialWithTeacher(materialId);
		assertOwnerOrAdmin(caller, material);

		if (material.getFileType() == MaterialFileType.PDF) {
			int pageCount = slideRenderService.countPdfPages(storageService.resolveSafe(material.getOriginalStoragePath()));
			material.markReady(pageCount);
			CourseMaterialEntity saved = materialRepository.save(material);
			return toSummary(saved, countSingleShare(saved.getId()));
		}

		material.markProcessing();
		CourseMaterialEntity saved = materialRepository.save(material);
		triggerAsyncRenderAfterCommit(saved.getId());
		return toSummary(saved, countSingleShare(saved.getId()));
	}

	@Transactional
	public void deleteMaterial(String callerEmail, Long materialId) {
		UserEntity caller = findUser(callerEmail);
		CourseMaterialEntity material = findMaterialWithTeacher(materialId);
		assertOwnerOrAdmin(caller, material);

		String storagePath = material.getOriginalStoragePath();
		pageRepository.deleteByMaterial_Id(materialId);
		materialRepository.delete(material);

		if (TransactionSynchronizationManager.isSynchronizationActive()) {
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCommit() {
					storageService.deleteMaterialBundle(storagePath);
				}
			});
		} else {
			storageService.deleteMaterialBundle(storagePath);
		}
	}

	@Transactional(readOnly = true)
	public List<MaterialShareResponse> listShares(String callerEmail, Long materialId) {
		UserEntity caller = findUser(callerEmail);
		CourseMaterialEntity material = findMaterialWithTeacher(materialId);
		assertOwnerOrAdmin(caller, material);

		return classMaterialRepository.findByMaterialIdWithClassroom(materialId).stream()
				.map(ccm -> new MaterialShareResponse(
						ccm.getClassroom().getId(),
						ccm.getClassroom().getTitle(),
						ccm.isAllowDownload(),
						ccm.getNote(),
						ccm.getSharedAt()
				))
				.toList();
	}

	@Transactional
	public List<MaterialShareResponse> syncShares(
			String callerEmail,
			Long materialId,
			List<MaterialShareItemRequest> requestedShares) {
		UserEntity caller = findUser(callerEmail);
		CourseMaterialEntity material = findMaterialWithTeacher(materialId);
		assertOwnerOrAdmin(caller, material);

		boolean callerIsAdmin = isAdmin(caller.getId());

		// Loại bỏ classId trùng lặp trong payload, giữ phần tử cuối cùng
		Map<Long, MaterialShareItemRequest> targetMap = new LinkedHashMap<>();
		for (MaterialShareItemRequest item : requestedShares) {
			targetMap.put(item.classId(), item);
		}

		List<ClassCourseMaterialEntity> existing = classMaterialRepository.findByMaterialIdWithClassroom(materialId);
		Map<Long, ClassCourseMaterialEntity> existingByClassId = existing.stream()
				.collect(Collectors.toMap(ccm -> ccm.getClassroom().getId(), ccm -> ccm));

		Set<Long> targetClassIds = targetMap.keySet();
		for (ClassCourseMaterialEntity ccm : existing) {
			if (!targetClassIds.contains(ccm.getClassroom().getId())) {
				classMaterialRepository.delete(ccm);
			}
		}

		for (MaterialShareItemRequest item : targetMap.values()) {
			ClassEntity classroom = classRepository.findById(item.classId())
					.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND));
			if (!classroom.getTeacher().getId().equals(caller.getId()) && !callerIsAdmin) {
				throw new ApiException(ApiErrorCode.FORBIDDEN);
			}
			if (classroom.getStatus() == ClassStatus.ARCHIVED) {
				throw new ApiException(ApiErrorCode.CLASS_ALREADY_ARCHIVED);
			}

			String note = (item.note() != null && !item.note().isBlank()) ? item.note().trim() : null;
			ClassCourseMaterialEntity current = existingByClassId.get(classroom.getId());
			if (current != null) {
				current.updateShareSettings(item.allowDownload(), note);
				classMaterialRepository.save(current);
			} else {
				ClassCourseMaterialEntity created = ClassCourseMaterialEntity.create(
						classroom, material, caller, item.allowDownload(), note
				);
				classMaterialRepository.save(created);
			}
		}

		return classMaterialRepository.findByMaterialIdWithClassroom(materialId).stream()
				.map(ccm -> new MaterialShareResponse(
						ccm.getClassroom().getId(),
						ccm.getClassroom().getTitle(),
						ccm.isAllowDownload(),
						ccm.getNote(),
						ccm.getSharedAt()
				))
				.toList();
	}

	@Transactional(readOnly = true)
	public List<ClassMaterialResponse> listClassMaterials(String callerEmail, Long classId) {
		UserEntity caller = findUser(callerEmail);
		ClassEntity classroom = classRepository.findById(classId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND));

		boolean isTeacherOrAdmin = classroom.getTeacher().getId().equals(caller.getId()) || isAdmin(caller.getId());
		if (!isTeacherOrAdmin) {
			ClassMemberEntity membership = classMemberRepository
					.findByClassroom_IdAndStudent_Id(classId, caller.getId())
					.orElseThrow(() -> new ApiException(ApiErrorCode.FORBIDDEN));
			if (membership.getStatus() != ClassMemberStatus.ACTIVE) {
				throw new ApiException(ApiErrorCode.FORBIDDEN);
			}
		}

		return classMaterialRepository.findByClassroomIdWithMaterialAndTeacher(classId).stream()
				.map(ccm -> {
					CourseMaterialEntity m = ccm.getMaterial();
					boolean canDownload = isTeacherOrAdmin || ccm.isAllowDownload();
					return new ClassMaterialResponse(
							m.getId(),
							classId,
							m.getTitle(),
							m.getDescription(),
							m.getHskLevel(),
							m.getFileType(),
							m.getOriginalFilename(),
							m.getFileSizeBytes(),
							m.getTotalPages(),
							m.getStatus(),
							ccm.isAllowDownload(),
							canDownload,
							ccm.getNote(),
							m.getTeacher().getFullName(),
							ccm.getSharedAt()
					);
				})
				.toList();
	}

	@Transactional
	public void updateClassMaterialDownload(
			String callerEmail,
			Long classId,
			Long materialId,
			boolean allowDownload) {
		UserEntity caller = findUser(callerEmail);
		ClassEntity classroom = classRepository.findById(classId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND));
		if (!classroom.getTeacher().getId().equals(caller.getId()) && !isAdmin(caller.getId())) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}
		if (classroom.getStatus() == ClassStatus.ARCHIVED) {
			throw new ApiException(ApiErrorCode.CLASS_ALREADY_ARCHIVED);
		}

		ClassCourseMaterialEntity share = classMaterialRepository
				.findByClassroom_IdAndMaterial_Id(classId, materialId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.MATERIAL_NOT_FOUND));
		share.setAllowDownload(allowDownload);
		classMaterialRepository.save(share);
	}

	@Transactional
	public void unshareFromClass(String callerEmail, Long classId, Long materialId) {
		UserEntity caller = findUser(callerEmail);
		ClassEntity classroom = classRepository.findById(classId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND));
		if (!classroom.getTeacher().getId().equals(caller.getId()) && !isAdmin(caller.getId())) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}

		classMaterialRepository.deleteByClassroom_IdAndMaterial_Id(classId, materialId);
	}

	@Transactional(readOnly = true)
	public byte[] readSlideImage(String callerEmail, Long materialId, int pageNumber) {
		UserEntity caller = findUser(callerEmail);
		CourseMaterialEntity material = findMaterialWithTeacher(materialId);
		assertCanView(caller, material);

		if (material.getStatus() != MaterialStatus.READY) {
			throw new ApiException(ApiErrorCode.MATERIAL_NOT_READY);
		}

		CourseMaterialPageEntity page = pageRepository
				.findByMaterial_IdAndPageNumber(materialId, pageNumber)
				.orElseThrow(() -> new ApiException(ApiErrorCode.MATERIAL_NOT_FOUND));
		return storageService.readAllBytes(page.getImageStoragePath());
	}

	@Transactional(readOnly = true)
	public byte[] readPdfDocument(String callerEmail, Long materialId) {
		UserEntity caller = findUser(callerEmail);
		CourseMaterialEntity material = findMaterialWithTeacher(materialId);
		assertCanView(caller, material);

		if (material.getFileType() != MaterialFileType.PDF) {
			throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT);
		}
		if (material.getStatus() != MaterialStatus.READY) {
			throw new ApiException(ApiErrorCode.MATERIAL_NOT_READY);
		}
		return storageService.readAllBytes(material.getOriginalStoragePath());
	}

	@Transactional(readOnly = true)
	public DownloadedMaterial downloadOriginal(String callerEmail, Long materialId) {
		UserEntity caller = findUser(callerEmail);
		CourseMaterialEntity material = findMaterialWithTeacher(materialId);

		if (!isOwnerOrAdmin(caller, material)) {
			boolean canDownload = classMaterialRepository.existsActiveStudentDownloadAccess(materialId, caller.getId());
			if (!canDownload) {
				boolean canView = classMaterialRepository.existsActiveStudentAccess(materialId, caller.getId());
				if (canView) {
					throw new ApiException(ApiErrorCode.MATERIAL_DOWNLOAD_NOT_ALLOWED);
				}
				throw new ApiException(ApiErrorCode.FORBIDDEN);
			}
		}

		byte[] bytes = storageService.readAllBytes(material.getOriginalStoragePath());
		return new DownloadedMaterial(material.getOriginalFilename(), material.getFileType(), bytes);
	}

	// -------------------------------------------------------------------------
	// Helpers & Guards
	// -------------------------------------------------------------------------

	private void triggerAsyncRenderAfterCommit(Long materialId) {
		if (TransactionSynchronizationManager.isSynchronizationActive()) {
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCommit() {
					asyncProcessor.renderSlidesAsync(materialId);
				}
			});
		} else {
			asyncProcessor.renderSlidesAsync(materialId);
		}
	}

	private long countSingleShare(Long materialId) {
		List<Object[]> rows = classMaterialRepository.countSharesByMaterialIds(List.of(materialId));
		if (rows.isEmpty()) {
			return 0L;
		}
		return ((Number) rows.get(0)[1]).longValue();
	}

	private MaterialSummaryResponse toSummary(CourseMaterialEntity m, long sharedClassCount) {
		return new MaterialSummaryResponse(
				m.getId(),
				m.getTeacher().getId(),
				m.getTeacher().getFullName(),
				m.getTitle(),
				m.getDescription(),
				m.getHskLevel(),
				m.getFileType(),
				m.getOriginalFilename(),
				m.getFileSizeBytes(),
				m.getTotalPages(),
				m.getStatus(),
				m.getErrorMessage(),
				m.isDefaultAllowDownload(),
				sharedClassCount,
				m.getCreatedAt(),
				m.getUpdatedAt()
		);
	}

	private UserEntity findUser(String email) {
		return userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	private CourseMaterialEntity findMaterialWithTeacher(Long materialId) {
		return materialRepository.findByIdWithTeacher(materialId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.MATERIAL_NOT_FOUND));
	}

	private boolean isAdmin(Long userId) {
		return userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.ADMIN);
	}

	private void assertTeacherOrAdmin(Long userId) {
		boolean isTeacher = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.TEACHER);
		if (!isTeacher && !isAdmin(userId)) {
			throw new ApiException(ApiErrorCode.TEACHER_ROLE_NOT_GRANTED);
		}
	}

	private boolean isOwnerOrAdmin(UserEntity caller, CourseMaterialEntity material) {
		return material.getTeacher().getId().equals(caller.getId()) || isAdmin(caller.getId());
	}

	private void assertOwnerOrAdmin(UserEntity caller, CourseMaterialEntity material) {
		if (!isOwnerOrAdmin(caller, material)) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}
	}

	private void assertCanView(UserEntity caller, CourseMaterialEntity material) {
		if (isOwnerOrAdmin(caller, material)) {
			return;
		}
		if (!classMaterialRepository.existsActiveStudentAccess(material.getId(), caller.getId())) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}
	}

	private String sanitizeFilename(String originalFilename, MaterialFileType fileType) {
		String fallback = fileType == MaterialFileType.PDF ? "giaotrinh.pdf" : "giaotrinh.pptx";
		if (originalFilename == null || originalFilename.isBlank()) {
			return fallback;
		}
		String clean = originalFilename.replace("\\", "/");
		int slash = clean.lastIndexOf('/');
		if (slash >= 0) {
			clean = clean.substring(slash + 1);
		}
		clean = clean.replaceAll("[\\r\\n\"<>|*?]", "_").trim();
		if (clean.isEmpty()) {
			return fallback;
		}
		return clean.length() > 255 ? clean.substring(clean.length() - 255) : clean;
	}

	private String stripExtension(String filename) {
		int dot = filename.lastIndexOf('.');
		return dot > 0 ? filename.substring(0, dot) : filename;
	}
}

