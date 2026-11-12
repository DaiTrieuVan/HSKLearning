package com.hsk.material.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import com.hsk.material.domain.CourseMaterialEntity;
import com.hsk.material.domain.CourseMaterialPageEntity;
import com.hsk.material.domain.MaterialFileType;
import com.hsk.material.domain.MaterialStatus;
import com.hsk.material.repository.CourseMaterialPageRepository;
import com.hsk.material.repository.CourseMaterialRepository;
import com.hsk.material.service.SlideRenderService.RenderedPageResult;

/**
 * Thực thi chuyển đổi slide bất đồng bộ ngoài DB transaction chính để tránh giữ kết nối CSDL trong lúc rasterize.
 */
@Service
public class MaterialAsyncProcessor {

	private static final Logger log = LoggerFactory.getLogger(MaterialAsyncProcessor.class);

	private record RenderInput(Long teacherId, String bundleUuid, MaterialFileType fileType, Path sourcePath) {
	}

	private final CourseMaterialRepository materialRepository;
	private final CourseMaterialPageRepository pageRepository;
	private final MaterialStorageService storageService;
	private final SlideRenderService slideRenderService;
	private final TransactionTemplate transactionTemplate;

	public MaterialAsyncProcessor(
			CourseMaterialRepository materialRepository,
			CourseMaterialPageRepository pageRepository,
			MaterialStorageService storageService,
			SlideRenderService slideRenderService,
			PlatformTransactionManager transactionManager) {
		this.materialRepository = materialRepository;
		this.pageRepository = pageRepository;
		this.storageService = storageService;
		this.slideRenderService = slideRenderService;
		this.transactionTemplate = new TransactionTemplate(transactionManager);
	}

	@Async("materialRenderExecutor")
	public void renderSlidesAsync(Long materialId) {
		renderSlidesNow(materialId);
	}

	/**
	 * Cho phép test hoặc processor gọi trực tiếp đồng bộ khi cần xác minh tuần tự.
	 */
	public void renderSlidesNow(Long materialId) {
		RenderInput input = transactionTemplate.execute(status -> {
			CourseMaterialEntity entity = materialRepository.findByIdWithTeacher(materialId).orElse(null);
			if (entity == null) {
				return null;
			}
			Path sourcePath = storageService.resolveSafe(entity.getOriginalStoragePath());
			String bundleUuid = Paths.get(entity.getOriginalStoragePath()).getParent().getFileName().toString();
			return new RenderInput(entity.getTeacher().getId(), bundleUuid, entity.getFileType(), sourcePath);
		});

		if (input == null) {
			return;
		}

		try {
			List<RenderedPageResult> pages = slideRenderService.renderToPngPages(
					input.teacherId(),
					input.bundleUuid(),
					input.fileType(),
					input.sourcePath()
			);

			transactionTemplate.executeWithoutResult(status -> {
				CourseMaterialEntity entity = materialRepository.findById(materialId).orElse(null);
				if (entity == null) {
					return;
				}
				pageRepository.deleteByMaterial_Id(materialId);
				pageRepository.flush();

				List<CourseMaterialPageEntity> pageEntities = pages.stream()
						.map(p -> CourseMaterialPageEntity.of(entity, p.pageNumber(), p.imageStoragePath(), p.width(), p.height()))
						.toList();
				pageRepository.saveAll(pageEntities);
				entity.markReady(pageEntities.size());
				materialRepository.save(entity);
			});
		} catch (Throwable ex) {
			log.error("Slide rendering failed for materialId={}", materialId, ex);
			String errorMessage = ex.getMessage() != null && !ex.getMessage().isBlank()
					? ex.getMessage()
					: "Không thể chuyển đổi giáo trình sang trang trình chiếu";
			transactionTemplate.executeWithoutResult(status -> {
				CourseMaterialEntity entity = materialRepository.findById(materialId).orElse(null);
				if (entity != null) {
					entity.markFailed(errorMessage);
					materialRepository.save(entity);
				}
			});
		}
	}

	/**
	 * Khôi phục các giáo trình bị kẹt ở PROCESSING (hoặc PDF bị FAILED do lỗi chuyển slide cũ) từ phiên chạy trước.
	 */
	@EventListener(ApplicationReadyEvent.class)
	public void reconcileStaleProcessingMaterials() {
		List<CourseMaterialEntity> stale = materialRepository.findByStatusIn(List.of(MaterialStatus.PROCESSING, MaterialStatus.FAILED));
		for (CourseMaterialEntity item : stale) {
			if (item.getFileType() == MaterialFileType.PDF) {
				try {
					Path pdfPath = storageService.resolveSafe(item.getOriginalStoragePath());
					if (!Files.exists(pdfPath)) {
						continue;
					}
					int totalPages = slideRenderService.countPdfPages(pdfPath);
					transactionTemplate.executeWithoutResult(status -> {
						CourseMaterialEntity reloaded = materialRepository.findById(item.getId()).orElse(null);
						if (reloaded != null && reloaded.getStatus() != MaterialStatus.READY) {
							reloaded.markReady(totalPages);
							materialRepository.save(reloaded);
						}
					});
				} catch (Throwable ex) {
					log.warn("Failed reconciling PDF materialId={}", item.getId(), ex);
					transactionTemplate.executeWithoutResult(status -> {
						CourseMaterialEntity reloaded = materialRepository.findById(item.getId()).orElse(null);
						if (reloaded != null && reloaded.getStatus() == MaterialStatus.PROCESSING) {
							reloaded.markFailed("Không thể đọc tệp PDF, vui lòng tải lại");
							materialRepository.save(reloaded);
						}
					});
				}
			} else if (item.getStatus() == MaterialStatus.PROCESSING) {
				renderSlidesAsync(item.getId());
			}
		}
	}
}

