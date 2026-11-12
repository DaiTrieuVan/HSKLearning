package com.hsk.material.service;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
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
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.DataFormatException;
import java.util.zip.Inflater;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

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
	private static final Pattern PDF_PAGES_TYPE_PATTERN = Pattern.compile("/Type\\s*/Pages\\b");
	private static final Pattern PDF_SINGLE_PAGE_TYPE_PATTERN = Pattern.compile("/Type\\s*/Page(?![sA-Za-z0-9_])");
	private static final Pattern PDF_COUNT_PATTERN = Pattern.compile("/Count\\s+(\\d+)");
	private static final int MAX_DECOMPRESSED_STREAM_BYTES = 2 * 1024 * 1024;

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
	 * Đọc nhanh số trang của tệp PDF mà không cần render toàn bộ ảnh slide.
	 * Dùng Apache PDFBox nếu có trên classpath và fallback thuần Java khi IDE chưa đồng bộ jar pdfbox.
	 */
	public int countPdfPages(Path pdfPath) {
		try {
			verifyPdfMagicBytes(pdfPath);
			int total;
			try {
				total = PdfBoxSupport.countPages(pdfPath);
			} catch (LinkageError err) {
				log.warn("Apache PDFBox unavailable on runtime classpath ({}); using pure-Java PDF page counter fallback", err.getMessage());
				total = countPdfPagesPureJava(pdfPath);
			}
			validatePageCount(total);
			return total;
		} catch (ApiException ex) {
			throw ex;
		} catch (IOException ex) {
			log.error("Failed to read PDF metadata for {}", pdfPath, ex);
			throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT, "Không thể đọc nội dung tệp PDF, vui lòng kiểm tra lại tệp không bị lỗi hoặc đặt mật khẩu");
		}
	}

	/**
	 * Đọc số trang PDF thuần Java không phụ thuộc thư viện ngoài (dự phòng khi thiếu PDFBox trên classpath).
	 */
	int countPdfPagesPureJava(Path pdfPath) throws IOException {
		verifyPdfMagicBytes(pdfPath);
		byte[] pdfBytes = Files.readAllBytes(pdfPath);
		String rawText = new String(pdfBytes, StandardCharsets.ISO_8859_1);

		int count = extractMaxPagesCountFromPdfText(rawText);
		if (count > 0) {
			return count;
		}

		StringBuilder inflatedText = new StringBuilder();
		for (byte[] streamData : extractStreamChunks(pdfBytes)) {
			byte[] inflated = tryInflateZlib(streamData);
			if (inflated != null && inflated.length > 0) {
				String decoded = new String(inflated, StandardCharsets.ISO_8859_1);
				int streamCount = extractMaxPagesCountFromPdfText(decoded);
				if (streamCount > count) {
					count = streamCount;
				}
				if (inflatedText.length() < MAX_DECOMPRESSED_STREAM_BYTES) {
					inflatedText.append('\n').append(decoded);
				}
			}
		}
		if (count > 0) {
			return count;
		}

		int pageMatches = countMatches(PDF_SINGLE_PAGE_TYPE_PATTERN, rawText)
				+ countMatches(PDF_SINGLE_PAGE_TYPE_PATTERN, inflatedText.toString());
		// Với PDF hợp lệ (%PDF-) mà cây trang được mã hóa phức tạp, trả tối thiểu 1 trang để PDF.js tự đọc chính xác khi trình chiếu
		return pageMatches > 0 ? pageMatches : 1;
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
		try {
			return PdfBoxSupport.renderPagesToPng(
					teacherId,
					bundleUuid,
					pdfPath,
					properties.getRenderDpi(),
					properties.getMaxPages(),
					storageService
			);
		} catch (IllegalArgumentException ex) {
			if (ex.getMessage() != null && ex.getMessage().startsWith("INVALID_PAGE_COUNT:")) {
				int total = Integer.parseInt(ex.getMessage().substring("INVALID_PAGE_COUNT:".length()));
				validatePageCount(total);
			}
			throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT);
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
					} catch (LinkageError err) {
						log.warn("Apache PDFBox unavailable for LibreOffice PDF rasterization ({}); falling back to POI", err.getMessage());
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
		try (InputStream is = file.getInputStream()) {
			verifyPdfMagicBytes(is);
		} catch (IOException ex) {
			throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT);
		}
	}

	private void verifyPdfMagicBytes(Path pdfPath) throws IOException {
		try (InputStream is = Files.newInputStream(pdfPath)) {
			verifyPdfMagicBytes(is);
		}
	}

	private void verifyPdfMagicBytes(InputStream rawStream) throws IOException {
		try (InputStream is = new BufferedInputStream(rawStream)) {
			byte[] header = is.readNBytes(5);
			String magic = new String(header, StandardCharsets.US_ASCII);
			if (!"%PDF-".equals(magic)) {
				throw new ApiException(ApiErrorCode.MATERIAL_INVALID_FORMAT);
			}
		}
	}

	private int extractMaxPagesCountFromPdfText(String text) {
		Matcher pagesMatcher = PDF_PAGES_TYPE_PATTERN.matcher(text);
		int maxCount = 0;
		while (pagesMatcher.find()) {
			int from = Math.max(0, pagesMatcher.start() - 250);
			int to = Math.min(text.length(), pagesMatcher.end() + 350);
			int prevEndObj = text.lastIndexOf("endobj", pagesMatcher.start());
			if (prevEndObj >= 0 && prevEndObj > from) {
				from = prevEndObj;
			}
			int nextEndObj = text.indexOf("endobj", pagesMatcher.end());
			if (nextEndObj >= 0 && nextEndObj < to) {
				to = nextEndObj;
			}
			Matcher countMatcher = PDF_COUNT_PATTERN.matcher(text.substring(from, to));
			if (countMatcher.find()) {
				try {
					int count = Integer.parseInt(countMatcher.group(1));
					if (count > maxCount) {
						maxCount = count;
					}
				} catch (NumberFormatException ignored) {
					// bỏ qua giá trị Count vượt ngưỡng int
				}
			}
		}
		return maxCount;
	}

	private List<byte[]> extractStreamChunks(byte[] pdfBytes) {
		List<byte[]> chunks = new ArrayList<>();
		byte[] startToken = "stream".getBytes(StandardCharsets.US_ASCII);
		byte[] endToken = "endstream".getBytes(StandardCharsets.US_ASCII);
		int cursor = 0;
		while (cursor < pdfBytes.length) {
			int start = indexOfBytes(pdfBytes, startToken, cursor);
			if (start < 0) {
				break;
			}
			int bodyStart = start + startToken.length;
			if (bodyStart < pdfBytes.length && pdfBytes[bodyStart] == '\r') {
				bodyStart++;
			}
			if (bodyStart < pdfBytes.length && pdfBytes[bodyStart] == '\n') {
				bodyStart++;
			} else {
				// Không phải keyword stream hợp lệ đứng cuối dòng
				cursor = start + startToken.length;
				continue;
			}
			int end = indexOfBytes(pdfBytes, endToken, bodyStart);
			if (end < 0) {
				break;
			}
			int bodyEnd = end;
			if (bodyEnd > bodyStart && pdfBytes[bodyEnd - 1] == '\n') {
				bodyEnd--;
			}
			if (bodyEnd > bodyStart && pdfBytes[bodyEnd - 1] == '\r') {
				bodyEnd--;
			}
			if (bodyEnd > bodyStart && pdfBytes[bodyStart] == 0x78) {
				int length = bodyEnd - bodyStart;
				byte[] slice = new byte[length];
				System.arraycopy(pdfBytes, bodyStart, slice, 0, length);
				chunks.add(slice);
			}
			cursor = end + endToken.length;
		}
		return chunks;
	}

	private int indexOfBytes(byte[] haystack, byte[] needle, int fromIndex) {
		outer:
		for (int i = fromIndex; i <= haystack.length - needle.length; i++) {
			for (int j = 0; j < needle.length; j++) {
				if (haystack[i + j] != needle[j]) {
					continue outer;
				}
			}
			return i;
		}
		return -1;
	}

	private byte[] tryInflateZlib(byte[] compressed) {
		Inflater inflater = new Inflater();
		try (ByteArrayOutputStream out = new ByteArrayOutputStream(Math.min(compressed.length * 4, 65536))) {
			inflater.setInput(compressed);
			byte[] buffer = new byte[8192];
			int total = 0;
			while (!inflater.finished() && total < MAX_DECOMPRESSED_STREAM_BYTES) {
				int count = inflater.inflate(buffer);
				if (count == 0) {
					if (inflater.needsInput() || inflater.needsDictionary()) {
						break;
					}
				} else {
					out.write(buffer, 0, count);
					total += count;
				}
			}
			return total > 0 ? out.toByteArray() : null;
		} catch (DataFormatException | IOException ex) {
			return null;
		} finally {
			inflater.end();
		}
	}

	private int countMatches(Pattern pattern, String input) {
		if (input == null || input.isEmpty()) {
			return 0;
		}
		Matcher matcher = pattern.matcher(input);
		int count = 0;
		while (matcher.find()) {
			count++;
		}
		return count;
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

