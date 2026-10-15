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
import org.hibernate.annotations.UpdateTimestamp;
import com.hsk.content.util.PinyinUtils;

@Entity
@Table(name = "vocabularies")
public class VocabularyEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "hanzi", nullable = false, length = 100)
	private String hanzi;

	@Column(name = "pinyin", nullable = false, length = 150)
	private String pinyin;

	@Column(name = "pinyin_search", length = 150)
	private String pinyinSearch;

	@Column(name = "meaning", nullable = false, length = 500)
	private String meaning;

	@Column(name = "part_of_speech", length = 50)
	private String partOfSpeech;

	@Column(name = "audio_url", length = 500)
	private String audioUrl;

	@Column(name = "example_sentence", length = 500)
	private String exampleSentence;

	@Column(name = "example_pinyin", length = 500)
	private String examplePinyin;

	@Column(name = "example_meaning", length = 500)
	private String exampleMeaning;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "hsk_level_id")
	private HskLevelEntity hskLevel;

	@Column(name = "owner_id")
	private Long ownerId;

	@Column(name = "owner_key", nullable = false, unique = true, length = 255)
	private String ownerKey;

	@Column(name = "is_hidden", nullable = false)
	private boolean hidden = false;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	public VocabularyEntity() {
	}

	public VocabularyEntity(String hanzi, String pinyin, String meaning, String partOfSpeech,
			String audioUrl, String exampleSentence, String examplePinyin, String exampleMeaning,
			HskLevelEntity hskLevel, Long ownerId) {
		this.hanzi = hanzi;
		this.pinyin = pinyin;
		this.pinyinSearch = PinyinUtils.normalizeForSearch(pinyin);
		this.meaning = meaning;
		this.partOfSpeech = partOfSpeech;
		this.audioUrl = audioUrl;
		this.exampleSentence = exampleSentence;
		this.examplePinyin = examplePinyin;
		this.exampleMeaning = exampleMeaning;
		this.hskLevel = hskLevel;
		this.ownerId = ownerId;
		this.ownerKey = buildOwnerKey(ownerId, hanzi, pinyin);
	}

	public static String buildOwnerKey(Long ownerId, String hanzi, String pinyin) {
		String cleanHanzi = hanzi != null ? hanzi.trim() : "";
		String cleanPinyin = pinyin != null ? pinyin.trim().toLowerCase() : "";
		if (ownerId == null) {
			return "SHARED_" + cleanHanzi + "_" + cleanPinyin;
		}
		return "TEACHER_" + ownerId + "_" + cleanHanzi + "_" + cleanPinyin;
	}

	public Long getId() {
		return id;
	}

	public String getHanzi() {
		return hanzi;
	}

	public void setHanzi(String hanzi) {
		this.hanzi = hanzi;
		this.ownerKey = buildOwnerKey(this.ownerId, this.hanzi, this.pinyin);
	}

	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
		this.pinyinSearch = PinyinUtils.normalizeForSearch(pinyin);
		this.ownerKey = buildOwnerKey(this.ownerId, this.hanzi, this.pinyin);
	}

	public String getPinyinSearch() {
		return pinyinSearch;
	}

	public void setPinyinSearch(String pinyinSearch) {
		this.pinyinSearch = pinyinSearch;
	}

	public String getMeaning() {
		return meaning;
	}

	public void setMeaning(String meaning) {
		this.meaning = meaning;
	}

	public String getPartOfSpeech() {
		return partOfSpeech;
	}

	public void setPartOfSpeech(String partOfSpeech) {
		this.partOfSpeech = partOfSpeech;
	}

	public String getAudioUrl() {
		return audioUrl;
	}

	public void setAudioUrl(String audioUrl) {
		this.audioUrl = audioUrl;
	}

	public String getExampleSentence() {
		return exampleSentence;
	}

	public void setExampleSentence(String exampleSentence) {
		this.exampleSentence = exampleSentence;
	}

	public String getExamplePinyin() {
		return examplePinyin;
	}

	public void setExamplePinyin(String examplePinyin) {
		this.examplePinyin = examplePinyin;
	}

	public String getExampleMeaning() {
		return exampleMeaning;
	}

	public void setExampleMeaning(String exampleMeaning) {
		this.exampleMeaning = exampleMeaning;
	}

	public HskLevelEntity getHskLevel() {
		return hskLevel;
	}

	public void setHskLevel(HskLevelEntity hskLevel) {
		this.hskLevel = hskLevel;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
		this.ownerKey = buildOwnerKey(this.ownerId, this.hanzi, this.pinyin);
	}

	public String getOwnerKey() {
		return ownerKey;
	}

	public boolean isHidden() {
		return hidden;
	}

	public void setHidden(boolean hidden) {
		this.hidden = hidden;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
