package com.hsk.material.domain;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;

/**
 * Từng trang ảnh PNG độ phân giải cao được kết xuất từ giáo trình phục vụ trình chiếu bảo mật.
 */
@Entity
@Table(
		name = "course_material_pages",
		uniqueConstraints = @UniqueConstraint(name = "uk_cmp_material_page", columnNames = { "material_id", "page_number" })
)
@Getter
public class CourseMaterialPageEntity {

	protected CourseMaterialPageEntity() {
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "material_id", nullable = false)
	@OnDelete(action = OnDeleteAction.CASCADE)
	private CourseMaterialEntity material;

	@Column(name = "page_number", nullable = false)
	private int pageNumber;

	@Column(name = "image_storage_path", nullable = false, length = 500)
	private String imageStoragePath;

	@Column(name = "width", nullable = false)
	private int width;

	@Column(name = "height", nullable = false)
	private int height;

	public static CourseMaterialPageEntity of(
			CourseMaterialEntity material,
			int pageNumber,
			String imageStoragePath,
			int width,
			int height) {
		CourseMaterialPageEntity page = new CourseMaterialPageEntity();
		page.material = material;
		page.pageNumber = pageNumber;
		page.imageStoragePath = imageStoragePath;
		page.width = width;
		page.height = height;
		return page;
	}
}
