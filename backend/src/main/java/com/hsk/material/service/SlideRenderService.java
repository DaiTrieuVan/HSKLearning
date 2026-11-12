package com.hsk.material.service;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.material.config.MaterialProperties;
import com.hsk.material.domain.MaterialFileType;

/**
 * Kiểm định tệp giáo trình (.pdf, .pptx) bằng magic bytes và kết xuất từng trang thành PNG độ nét cao.
 */
@Service
public class SlideRenderService {

	private static final Logger log = LoggerFactory.getLogger(SlideRenderService.class);
	private static final int PPTX_TARGET_WIDTH_PX = 1920;

	public record RenderedPageResult(int pageNumber, String imageStoragePath, int width, int height) {
	}

	private final MaterialProperties properties;
	private final MaterialStorageService storageService;

	public SlideRenderService(MaterialProperties properties, MaterialStorageService storageService) {
		this.properties = properties;
		this.storageService = storageService;
	}

	/**
	 * Kiểm tra kích thước, phần mở rộng và chữ ký nhị phân (magic bytes) của tệp tải lên.
	 */
	public MaterialFileType validateUploadedFile(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new ApiException(ApiErrorCode.VALIDATION_FAILED, "Vui lòng chọn tệp giáo trình để tải lên");
		}
		if (file.getSize() > properties.getMaxSizeBytes()) {
			throw new ApiException(ApiErrorCode.MATERIAL_FILE_TOO_LARGE);
		}

		String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename().trim() : "";
		String lower = originalName.toLowerCase(Locale.ROOT);

		if (lower.endsWith(".pdf")) {
			verifyPdfMagicBytes(file);
			return MaterialFileType.PDF;
		}
		if (lower.endsWith(".pptx")) {
			verifyZipMagicBytes(file);
			return MaterialFileType.PPTX;
		}
		throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT);
	}

	/**
	 * Kết xuất toàn bộ trang PDF hoặc slide PPTX thành từng ảnh PNG (giải phóng RAM ngay sau mỗi trang).
	 */
	public List<RenderedPageResult> renderToPngPages(
			Long teacherId,
			String bundleUuid,
			MaterialFileType fileType,
			Path sourceFile) {
		storageService.deleteSlidesDirectory(teacherId, bundleUuid);

		if (fileType == MaterialFileType.PDF) {
			return renderPdfPages(teacherId, bundleUuid, sourceFile);
		}
		return renderPptxPages(teacherId, bundleUuid, sourceFile);
	}

	private List<RenderedPageResult> renderPdfPages(Long teacherId, String bundleUuid, Path pdfPath) {
		try (PDDocument document = Loader.loadPDF(pdfPath.toFile())) {
			int total = document.getNumberOfPages();
			validatePageCount(total);

			PDFRenderer renderer = new PDFRenderer(document);
			List<RenderedPageResult> results = new ArrayList<>(total);

			for (int index = 0; index < total; index++) {
				BufferedImage image = renderer.renderImageWithDPI(index, properties.getRenderDpi(), ImageType.RGB);
				int pageNumber = index + 1;
				String relativePath = storageService.saveSlidePng(teacherId, bundleUuid, pageNumber, image);
				results.add(new RenderedPageResult(pageNumber, relativePath, image.getWidth(), image.getHeight()));
				image.flush();
			}
			return results;
		} catch (ApiException ex) {
			throw ex;
		} catch (IOException ex) {
			log.error("Failed to parse/render PDF material {}", pdfPath, ex);
			throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT, "Không thể đọc nội dung tệp PDF, vui lòng kiểm tra lại tệp không bị lỗi hoặc đặt mật khẩu");
		}
	}

	private List<RenderedPageResult> renderPptxPages(Long teacherId, String bundleUuid, Path pptxPath) {
		// 1. Ưu tiên cấu trúc PPTX hợp lệ trước khi render
		verifyPptxZipStructure(pptxPath);

		// 2. Nếu môi trường có LibreOffice headless, chuyển PPTX -> PDF để đạt độ chuẩn xác font/layout 100%
		String soffice = properties.getSofficePath();
		if (soffice != null && !soffice.isBlank()) {
			Path sofficeExec = Paths.get(soffice.trim());
			if (Files.isExecutable(sofficeExec)) {
				Path convertedPdf = convertPptxViaLibreOffice(sofficeExec, pptxPath);
				if (convertedPdf != null) {
					try {
						return renderPdfPages(teacherId, bundleUuid, convertedPdf);
					} finally {
						try {
							Files.deleteIfExists(convertedPdf);
						} catch (IOException ignored) {
							// temp file cleanup best-effort
						}
					}
				}
			}
		}

		// 3. Fallback thuần Java dùng Apache POI XMLSlideShow + Graphics2D
		try (InputStream is = Files.newInputStream(pptxPath); XMLSlideShow ppt = new XMLSlideShow(is)) {
			List<XSLFSlide> slides = ppt.getSlides();
			int total = slides.size();
			validatePageCount(total);

			Dimension pgSize = ppt.getPageSize();
			double scale = pgSize.getWidth() > 0
					? Math.max(1.2, Math.min(2.5, (double) PPTX_TARGET_WIDTH_PX / pgSize.getWidth()))
					: 2.0;
			int imgWidth = Math.max(1, (int) Math.round(pgSize.getWidth() * scale));
			int imgHeight = Math.max(1, (int) Math.round(pgSize.getHeight() * scale));

			List<RenderedPageResult> results = new ArrayList<>(total);
			for (int index = 0; index < total; index++) {
				XSLFSlide slide = slides.get(index);
				BufferedImage img = new BufferedImage(imgWidth, imgHeight, BufferedImage.TYPE_INT_RGB);
				Graphics2D graphics = img.createGraphics();
				try {
					graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
					graphics.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
					graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
					graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BICUBIC);
					graphics.setPaint(Color.WHITE);
					graphics.fill(new Rectangle2D.Double(0, 0, imgWidth, imgHeight));
					graphics.scale(scale, scale);
					slide.draw(graphics);
				} finally {
					graphics.dispose();
				}

				int pageNumber = index + 1;
				String relativePath = storageService.saveSlidePng(teacherId, bundleUuid, pageNumber, img);
				results.add(new RenderedPageResult(pageNumber, relativePath, imgWidth, imgHeight));
				img.flush();
			}
			return results;
		} catch (ApiException ex) {
			throw ex;
		} catch (Exception ex) {
			log.error("Failed to render PPTX material {}", pptxPath, ex);
			throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT, "Không thể xử lý tệp PowerPoint (.pptx), vui lòng xuất ra PDF hoặc kiểm tra lại tệp");
		}
	}

	private Path convertPptxViaLibreOffice(Path sofficeExec, Path pptxPath) {
		Path tempOutDir = null;
		try {
			tempOutDir = Files.createTempDirectory("hsk-pptx-");
			ProcessBuilder pb = new ProcessBuilder(
					sofficeExec.toString(),
					"--headless",
					"--norestore",
					"--convert-to",
					"pdf",
					"--outdir",
					tempOutDir.toString(),
					pptxPath.toString()
			);
			pb.redirectErrorStream(true);
			Process process = pb.start();
			boolean finished = process.waitFor(90, TimeUnit.SECONDS);
			if (!finished) {
				process.destroyForcibly();
				log.warn("LibreOffice conversion timed out for {}", pptxPath);
				return null;
			}
			if (process.exitValue() != 0) {
				log.warn("LibreOffice conversion exited with {} for {}", process.exitValue(), pptxPath);
				return null;
			}
			String baseName = pptxPath.getFileName().toString().replaceFirst("(?i)\\.pptx$", "");
			Path pdfCandidate = tempOutDir.resolve(baseName + ".pdf");
			return Files.exists(pdfCandidate) ? pdfCandidate : null;
		} catch (Exception ex) {
			log.warn("LibreOffice conversion unavailable/failed, falling back to POI: {}", ex.getMessage());
			return null;
		}
	}

	private void validatePageCount(int total) {
		if (total <= 0) {
			throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT, "Tệp giáo trình không có trang/slide nào");
		}
		if (total > properties.getMaxPages()) {
			throw new ApiException(ApiErrorCode.MATERIAL_TOO_MANY_PAGES);
		}
	}

	private void verifyPdfMagicBytes(MultipartFile file) {
		try (InputStream is = new BufferedInputStream(file.getInputStream())) {
			byte[] header = is.readNBytes(5);
			String magic = new String(header, StandardCharsets.US_ASCII);
			if (!"%PDF-".equals(magic)) {
				throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT);
			}
		} catch (IOException ex) {
			throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT);
		}
	}

	private void verifyZipMagicBytes(MultipartFile file) {
		try (InputStream is = new BufferedInputStream(file.getInputStream())) {
			byte[] header = is.readNBytes(4);
			if (header.length < 4 || header[0] != 0x50 || header[1] != 0x4B || header[2] != 0x03 || header[3] != 0x04) {
				throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT);
			}
		} catch (IOException ex) {
			throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT);
		}
	}

	private void verifyPptxZipStructure(Path pptxPath) {
		try (ZipFile zip = new ZipFile(pptxPath.toFile())) {
			ZipEntry contentTypes = zip.getEntry("[Content_Types].xml");
			ZipEntry presentation = zip.getEntry("ppt/presentation.xml");
			if (contentTypes == null || presentation == null) {
				throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT);
			}
		} catch (ApiException ex) {
			throw ex;
		} catch (IOException ex) {
			throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT);
		}
	}
}
