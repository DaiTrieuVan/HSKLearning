package com.hsk.material.service;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;

import com.hsk.material.service.SlideRenderService.RenderedPageResult;

/**
 * Lớp tách biệt hoàn toàn tham chiếu Apache PDFBox để runtime không bị NoClassDefFoundError
 * khi classpath chưa nạp jar pdfbox (ví dụ IDE chưa sync lại pom.xml).
 */
final class PdfBoxSupport {

	private PdfBoxSupport() {
	}

	static int countPages(Path pdfPath) throws IOException {
		try (PDDocument document = Loader.loadPDF(pdfPath.toFile())) {
			return document.getNumberOfPages();
		}
	}

	static List<RenderedPageResult> renderPagesToPng(
			Long teacherId,
			String bundleUuid,
			Path pdfPath,
			float renderDpi,
			int maxPages,
			MaterialStorageService storageService) throws IOException {
		try (PDDocument document = Loader.loadPDF(pdfPath.toFile())) {
			int total = document.getNumberOfPages();
			if (total <= 0 || total > maxPages) {
				throw new IllegalArgumentException("INVALID_PAGE_COUNT:" + total);
			}

			PDFRenderer renderer = new PDFRenderer(document);
			List<RenderedPageResult> results = new ArrayList<>(total);

			for (int index = 0; index < total; index++) {
				BufferedImage image = renderer.renderImageWithDPI(index, renderDpi, ImageType.RGB);
				int pageNumber = index + 1;
				String relativePath = storageService.saveSlidePng(teacherId, bundleUuid, pageNumber, image);
				results.add(new RenderedPageResult(pageNumber, relativePath, image.getWidth(), image.getHeight()));
				image.flush();
			}
			return results;
		}
	}
}

