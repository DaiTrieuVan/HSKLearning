package com.hsk.material.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.nio.file.Files;
import java.nio.file.Path;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import com.hsk.common.api.ApiException;
import com.hsk.material.config.MaterialProperties;

class SlideRenderServiceFallbackTest {

	@TempDir
	Path tempDir;

	@Test
	void countPdfPagesPureJavaDetectsExactPageCount() throws Exception {
		MaterialProperties props = new MaterialProperties();
		props.setStorageDir(tempDir.toString());
		SlideRenderService service = new SlideRenderService(props, new MaterialStorageService(props));

		Path pdfPath = tempDir.resolve("sample.pdf");
		try (PDDocument doc = new PDDocument()) {
			doc.addPage(new PDPage());
			doc.addPage(new PDPage());
			doc.addPage(new PDPage());
			doc.save(pdfPath.toFile());
		}

		assertEquals(3, service.countPdfPagesPureJava(pdfPath));
	}

	@Test
	void countPdfPagesPureJavaRejectsNonPdfFile() throws Exception {
		MaterialProperties props = new MaterialProperties();
		props.setStorageDir(tempDir.toString());
		SlideRenderService service = new SlideRenderService(props, new MaterialStorageService(props));

		Path invalid = tempDir.resolve("bad.pdf");
		Files.writeString(invalid, "NOT A PDF");

		assertThrows(ApiException.class, () -> service.countPdfPagesPureJava(invalid));
	}
}

