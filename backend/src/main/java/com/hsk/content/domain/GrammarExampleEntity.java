package com.hsk.content.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "grammar_examples")
public class GrammarExampleEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "grammar_point_id", nullable = false)
	private GrammarPointEntity grammarPoint;

	@Column(name = "hanzi", nullable = false, length = 500)
	private String hanzi;

	@Column(name = "pinyin", nullable = false, length = 500)
	private String pinyin;

	@Column(name = "meaning", nullable = false, length = 500)
	private String meaning;

	@Column(name = "sort_order", nullable = false)
	private Integer sortOrder = 1;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public GrammarExampleEntity() {
	}

	public GrammarExampleEntity(String hanzi, String pinyin, String meaning, Integer sortOrder) {
		this.hanzi = hanzi;
		this.pinyin = pinyin;
		this.meaning = meaning;
		this.sortOrder = sortOrder != null ? sortOrder : 1;
	}

	public Long getId() {
		return id;
	}

	public GrammarPointEntity getGrammarPoint() {
		return grammarPoint;
	}

	public void setGrammarPoint(GrammarPointEntity grammarPoint) {
		this.grammarPoint = grammarPoint;
	}

	public String getHanzi() {
		return hanzi;
	}

	public void setHanzi(String hanzi) {
		this.hanzi = hanzi;
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	public String getMeaning() {
		return meaning;
	}

	public void setMeaning(String meaning) {
		this.meaning = meaning;
	}

	public Integer getSortOrder() {
		return sortOrder;
	}

	public void setSortOrder(Integer sortOrder) {
		this.sortOrder = sortOrder;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}
}
