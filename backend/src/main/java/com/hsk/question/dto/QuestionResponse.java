package com.hsk.question.dto;

import com.hsk.question.domain.QuestionType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

public record QuestionResponse(
	@Schema(description = "ID của câu hỏi", example = "1")
	Long id,

	@Schema(description = "ID của giáo viên sở hữu", example = "2")
	Long ownerId,

	@Schema(description = "Loại câu hỏi", example = "MCQ")
	QuestionType type,

	@Schema(description = "Nội dung câu hỏi", example = "你好 nghĩa là gì?")
	String content,

	@Schema(description = "Giải thích đáp án", example = "你好 là lời chào hỏi thông dụng trong tiếng Trung.")
	String explanation,

	@Schema(description = "Cấu hình JSON mở rộng", example = "{}")
	String payload,

	@Schema(description = "Danh sách các lựa chọn")
	List<QuestionOptionResponse> options,

	@Schema(description = "Thời gian tạo")
	Instant createdAt,

	@Schema(description = "Đường dẫn tệp audio của câu hỏi", example = "/uploads/audio/listening_01.mp3")
	String audioUrl,

	@Schema(description = "Đoạn văn bản phát âm / transcript")
	String transcript,

	@Schema(description = "Pinyin phiên âm")
	String pinyin,

	@Schema(description = "Hình ảnh minh họa cho câu hỏi", example = "/uploads/images/question_01.png")
	String imageUrl,

	@Schema(description = "Cấp độ HSK", example = "1")
	Integer hskLevel,

	@Schema(description = "ID câu hỏi cha (nếu thuộc đoạn văn / nhóm câu hỏi)", example = "10")
	Long parentId,

	@Schema(description = "Kho ảnh dùng chung (Image Pool) cho câu hỏi cha / nhóm ghép tranh HSK")
	List<ImagePoolItemDto> imagePool
) {
	// Constructor tương thích ngược cho 8 tham số ban đầu
	public QuestionResponse(
			Long id,
			Long ownerId,
			QuestionType type,
			String content,
			String explanation,
			String payload,
			List<QuestionOptionResponse> options,
			Instant createdAt
	) {
		this(id, ownerId, type, content, explanation, payload, options, createdAt, null, null, null, null, null, null, null);
	}

	// Constructor tương thích ngược cho 11 tham số
	public QuestionResponse(
			Long id,
			Long ownerId,
			QuestionType type,
			String content,
			String explanation,
			String payload,
			List<QuestionOptionResponse> options,
			Instant createdAt,
			String audioUrl,
			String transcript,
			String pinyin
	) {
		this(id, ownerId, type, content, explanation, payload, options, createdAt, audioUrl, transcript, pinyin, null, null, null, null);
	}

	// Constructor tương thích ngược cho 14 tham số
	public QuestionResponse(
			Long id,
			Long ownerId,
			QuestionType type,
			String content,
			String explanation,
			String payload,
			List<QuestionOptionResponse> options,
			Instant createdAt,
			String audioUrl,
			String transcript,
			String pinyin,
			String imageUrl,
			Integer hskLevel,
			Long parentId
	) {
		this(id, ownerId, type, content, explanation, payload, options, createdAt, audioUrl, transcript, pinyin, imageUrl, hskLevel, parentId, null);
	}
}
