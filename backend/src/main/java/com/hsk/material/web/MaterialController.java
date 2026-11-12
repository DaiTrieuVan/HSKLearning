package com.hsk.material.web;

import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.List;

import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hsk.material.domain.MaterialFileType;
import com.hsk.material.dto.ClassMaterialResponse;
import com.hsk.material.dto.MaterialDetailResponse;
import com.hsk.material.dto.MaterialShareResponse;
import com.hsk.material.dto.MaterialSummaryResponse;
import com.hsk.material.dto.SyncMaterialSharesRequest;
import com.hsk.material.dto.UpdateClassMaterialDownloadRequest;
import com.hsk.material.dto.UpdateMaterialRequest;
import com.hsk.material.service.MaterialService;
import com.hsk.material.service.MaterialService.DownloadedMaterial;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

/**
 * REST API Quản lý giáo trình (PDF/PPTX), trình chiếu slide ảnh bảo mật và chia sẻ vào lớp học.
 */
@RestController
@RequestMapping("/api/v1")
@Tag(name = "Quản lý giáo trình", description = "Upload PDF/PPTX, trình chiếu slide bảo mật và chia sẻ lớp học")
@SecurityRequirement(name = "bearerAuth")
public class MaterialController {

	private static final MediaType PPTX_MEDIA_TYPE = MediaType
			.parseMediaType("application/vnd.openxmlformats-officedocument.presentationml.presentation");

	private final MaterialService materialService;

	public MaterialController(MaterialService materialService) {
		this.materialService = materialService;
	}

	@PostMapping(value = "/materials", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "Tải lên giáo trình mới (PDF hoặc PPTX)")
	public ResponseEntity<MaterialSummaryResponse> uploadMaterial(
			@RequestPart("file") MultipartFile file,
			@RequestParam(value = "title", required = false) String title,
			@RequestParam(value = "description", required = false) String description,
			@RequestParam(value = "hskLevel", required = false) Integer hskLevel,
			@RequestParam(value = "defaultAllowDownload", defaultValue = "false") boolean defaultAllowDownload,
			Principal principal) {
		MaterialSummaryResponse response = materialService.uploadMaterial(
				principal.getName(), file, title, description, hskLevel, defaultAllowDownload
		);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/materials")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "Danh sách giáo trình cá nhân của giáo viên")
	public ResponseEntity<List<MaterialSummaryResponse>> listMyMaterials(
			@RequestParam(value = "keyword", required = false) String keyword,
			@RequestParam(value = "hskLevel", required = false) Integer hskLevel,
			@RequestParam(value = "fileType", required = false) MaterialFileType fileType,
			Principal principal) {
		return ResponseEntity.ok(materialService.listMyMaterials(principal.getName(), keyword, hskLevel, fileType));
	}

	@GetMapping("/materials/{id}")
	@Operation(summary = "Chi tiết giáo trình, danh sách trang và quyền tải về của người gọi")
	public ResponseEntity<MaterialDetailResponse> getMaterialDetail(
			@PathVariable Long id,
			Principal principal) {
		return ResponseEntity.ok(materialService.getMaterialDetail(principal.getName(), id));
	}

	@PatchMapping("/materials/{id}")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "Cập nhật thông tin giáo trình")
	public ResponseEntity<MaterialSummaryResponse> updateMaterial(
			@PathVariable Long id,
			@Valid @RequestBody UpdateMaterialRequest request,
			Principal principal) {
		return ResponseEntity.ok(materialService.updateMaterial(principal.getName(), id, request));
	}

	@PostMapping("/materials/{id}/retry-render")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "Thử chuyển đổi lại slide nếu xử lý bị lỗi")
	public ResponseEntity<MaterialSummaryResponse> retryRender(
			@PathVariable Long id,
			Principal principal) {
		return ResponseEntity.ok(materialService.retryRender(principal.getName(), id));
	}

	@DeleteMapping("/materials/{id}")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "Xóa giáo trình và toàn bộ slide ảnh liên quan")
	public ResponseEntity<Void> deleteMaterial(
			@PathVariable Long id,
			Principal principal) {
		materialService.deleteMaterial(principal.getName(), id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/materials/{id}/shares")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "Danh sách các lớp đang được chia sẻ giáo trình")
	public ResponseEntity<List<MaterialShareResponse>> listShares(
			@PathVariable Long id,
			Principal principal) {
		return ResponseEntity.ok(materialService.listShares(principal.getName(), id));
	}

	@PutMapping("/materials/{id}/shares")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "Đồng bộ chia sẻ giáo trình vào các lớp và cấu hình quyền tải cho từng lớp")
	public ResponseEntity<List<MaterialShareResponse>> syncShares(
			@PathVariable Long id,
			@Valid @RequestBody SyncMaterialSharesRequest request,
			Principal principal) {
		return ResponseEntity.ok(materialService.syncShares(principal.getName(), id, request.shares()));
	}

	@GetMapping("/classes/{classId}/materials")
	@Operation(summary = "Danh sách giáo trình được chia sẻ trong lớp học")
	public ResponseEntity<List<ClassMaterialResponse>> listClassMaterials(
			@PathVariable Long classId,
			Principal principal) {
		return ResponseEntity.ok(materialService.listClassMaterials(principal.getName(), classId));
	}

	@PatchMapping("/classes/{classId}/materials/{materialId}")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "Bật/tắt nhanh quyền tải file gốc cho lớp học")
	public ResponseEntity<Void> updateClassMaterialDownload(
			@PathVariable Long classId,
			@PathVariable Long materialId,
			@Valid @RequestBody UpdateClassMaterialDownloadRequest request,
			Principal principal) {
		materialService.updateClassMaterialDownload(principal.getName(), classId, materialId, request.allowDownload());
		return ResponseEntity.ok().build();
	}

	@DeleteMapping("/classes/{classId}/materials/{materialId}")
	@PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
	@Operation(summary = "Gỡ giáo trình khỏi lớp học")
	public ResponseEntity<Void> unshareFromClass(
			@PathVariable Long classId,
			@PathVariable Long materialId,
			Principal principal) {
		materialService.unshareFromClass(principal.getName(), classId, materialId);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/materials/{id}/slides/{pageNumber}/image")
	@Operation(summary = "Tải ảnh PNG của một trang slide phục vụ trình chiếu trên canvas")
	public ResponseEntity<byte[]> getSlideImage(
			@PathVariable Long id,
			@PathVariable int pageNumber,
			Principal principal) {
		byte[] pngBytes = materialService.readSlideImage(principal.getName(), id, pageNumber);
		return ResponseEntity.ok()
				.contentType(MediaType.IMAGE_PNG)
				.cacheControl(CacheControl.noStore())
				.header("X-Content-Type-Options", "nosniff")
				.header(HttpHeaders.CONTENT_DISPOSITION, "inline")
				.body(pngBytes);
	}

	@GetMapping("/materials/{id}/download")
	@Operation(summary = "Tải file giáo trình gốc (chỉ thành công nếu người gọi được phép tải)")
	public ResponseEntity<byte[]> downloadOriginalMaterial(
			@PathVariable Long id,
			Principal principal) {
		DownloadedMaterial downloaded = materialService.downloadOriginal(principal.getName(), id);
		MediaType mediaType = downloaded.fileType() == MaterialFileType.PDF
				? MediaType.APPLICATION_PDF
				: PPTX_MEDIA_TYPE;

		ContentDisposition disposition = ContentDisposition.attachment()
				.filename(downloaded.originalFilename(), StandardCharsets.UTF_8)
				.build();

		return ResponseEntity.ok()
				.contentType(mediaType)
				.cacheControl(CacheControl.noStore())
				.header("X-Content-Type-Options", "nosniff")
				.header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
				.body(downloaded.bytes());
	}
}
