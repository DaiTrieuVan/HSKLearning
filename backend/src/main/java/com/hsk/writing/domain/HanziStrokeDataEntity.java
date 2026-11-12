package com.hsk.writing.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * Entity lưu trữ dữ liệu nét vẽ (SVG paths) và trung tuyến (medians) phục vụ luyện viết chữ Hán (HTT-10-CN-002).
 */
@Entity
@Table(name = "hanzi_stroke_data")
public class HanziStrokeDataEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "hanzi", nullable = false, unique = true, length = 10)
	private String hanzi;

	@Column(name = "stroke_count", nullable = false)
	private Integer strokeCount;

	@Column(name = "strokes_json", nullable = false, columnDefinition = "TEXT")
	private String strokesJson;

	@Column(name = "medians_json", nullable = false, columnDefinition = "TEXT")
	private String mediansJson;

	@Column(name = "source", nullable = false, length = 100)
	private String source;

	@Column(name = "license", nullable = false, length = 255)
	private String license;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public HanziStrokeDataEntity() {
	}

	public HanziStrokeDataEntity(
			String hanzi,
			Integer strokeCount,
			String strokesJson,
			String mediansJson,
			String source,
			String license
	) {
		this.hanzi = hanzi;
		this.strokeCount = strokeCount;
		this.strokesJson = strokesJson;
		this.mediansJson = mediansJson;
		this.source = source;
		this.license = license;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getHanzi() {
		return hanzi;
	}

	public void setHanzi(String hanzi) {
		this.hanzi = hanzi;
	}

	public Integer getStrokeCount() {
		return strokeCount;
	}

	public void setStrokeCount(Integer strokeCount) {
		this.strokeCount = strokeCount;
	}

	public String getStrokesJson() {
		return strokesJson;
	}

	public void setStrokesJson(String strokesJson) {
		this.strokesJson = strokesJson;
	}

	public String getMediansJson() {
		return mediansJson;
	}

	public void setMediansJson(String mediansJson) {
		this.mediansJson = mediansJson;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getLicense() {
		return license;
	}

	public void setLicense(String license) {
		this.license = license;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}
}
