package com.hsk.material.service;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.stream.Stream;

import javax.imageio.ImageIO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.material.config.MaterialProperties;

/**
 * Lưu trữ và truy xuất tệp giáo trình gốc & slide ảnh PNG trong thư mục riêng tư ngoài web root.
 */
@Service
public class MaterialStorageService {

	private static final Logger log = LoggerFactory.getLogger(MaterialStorageService.class);

	private final MaterialProperties properties;

	public MaterialStorageService(MaterialProperties properties) {
		this.properties = properties;
	}

	public Path rootDir() {
		return Paths.get(properties.getStorageDir()).toAbsolutePath().normalize();
	}

	/**
	 * Kiểm tra chống path traversal trước khi đọc bất kỳ tệp nào từ đĩa.
	 */
	public Path resolveSafe(String relativePath) {
		if (relativePath == null || relativePath.isBlank()) {
			throw new ApiException(ApiErrorCode.MATERIAL_NOT_FOUND);
		}
		Path root = rootDir();
		Path resolved = root.resolve(relativePath).normalize();
		if (!resolved.startsWith(root)) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}
		return resolved;
	}

	public String saveOriginalFile(Long teacherId, String uuid, String extension, InputStream inputStream) {
		String safeExt = extension.startsWith(".") ? extension.toLowerCase() : "." + extension.toLowerCase();
		String relativePath = teacherId + "/" + uuid + "/original" + safeExt;
		Path target = resolveSafe(relativePath);
		try {
			Files.createDirectories(target.getParent());
			Files.copy(inputStream, target, StandardCopyOption.REPLACE_EXISTING);
			return relativePath;
		} catch (IOException ex) {
			log.error("Failed to store original material file at {}", target, ex);
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR);
		}
	}

	public String saveSlidePng(Long teacherId, String uuid, int pageNumber, BufferedImage image) {
		String filename = String.format("page_%03d.png", pageNumber);
		String relativePath = teacherId + "/" + uuid + "/slides/" + filename;
		Path target = resolveSafe(relativePath);
		try {
			Files.createDirectories(target.getParent());
			ImageIO.write(image, "png", target.toFile());
			return relativePath;
		} catch (IOException ex) {
			log.error("Failed to store rendered slide PNG at {}", target, ex);
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR);
		}
	}

	public byte[] readAllBytes(String relativePath) {
		Path path = resolveSafe(relativePath);
		if (!Files.exists(path) || !Files.isRegularFile(path)) {
			throw new ApiException(ApiErrorCode.MATERIAL_NOT_FOUND);
		}
		try {
			return Files.readAllBytes(path);
		} catch (IOException ex) {
			log.error("Failed to read stored material file {}", path, ex);
			throw new ApiException(ApiErrorCode.INTERNAL_ERROR);
		}
	}

	public void deleteSlidesDirectory(Long teacherId, String uuid) {
		Path slidesDir = resolveSafe(teacherId + "/" + uuid + "/slides");
		deleteRecursively(slidesDir);
	}

	public void deleteMaterialBundle(String originalStoragePath) {
		if (originalStoragePath == null || originalStoragePath.isBlank()) {
			return;
		}
		try {
			Path original = resolveSafe(originalStoragePath);
			Path bundleDir = original.getParent();
			deleteRecursively(bundleDir);
		} catch (RuntimeException ex) {
			log.warn("Failed to clean up material storage bundle for {}", originalStoragePath, ex);
		}
	}

	private void deleteRecursively(Path dir) {
		if (dir == null || !Files.exists(dir)) {
			return;
		}
		try (Stream<Path> walk = Files.walk(dir)) {
			walk.sorted(Comparator.reverseOrder()).forEach(path -> {
				try {
					Files.deleteIfExists(path);
				} catch (IOException ex) {
					log.warn("Could not delete path {}", path, ex);
				}
			});
		} catch (IOException ex) {
			log.warn("Failed walking directory {}", dir, ex);
		}
	}
}
