package com.hsk.material.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

/**
 * Cấu hình lưu trữ riêng tư và kết xuất slide giáo trình.
 */
@Component
@ConfigurationProperties(prefix = "app.materials")
@Getter
@Setter
public class MaterialProperties {

	/** Thư mục gốc ngoài web root (không nằm trong /uploads public). */
	private String storageDir = "./storage/materials";

	/** Giới hạn dung lượng file upload (mặc định 50 MB). */
	private long maxSizeBytes = 52_428_800L;

	/** Giới hạn số trang/slide tối đa mỗi giáo trình để bảo vệ bộ nhớ. */
	private int maxPages = 150;

	/** Độ phân giải DPI khi rasterize PDF sang PNG. */
	private float renderDpi = 200f;

	/** Đường dẫn tùy chọn tới LibreOffice soffice nếu máy chủ có cài. */
	private String sofficePath = "";
}
