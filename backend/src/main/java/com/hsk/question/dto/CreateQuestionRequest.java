package com.hsk.question.dto;

import com.hsk.question.domain.QuestionType;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public record CreateQuestionRequest(
	@Schema(description = "Nội dung câu hỏi", example = "你好 nghĩa là gì?")
	String content,

	@Schema(description = "Giải thích đáp án", example = "你好 là lời chào hỏi thông dụng trong tiếng Trung.")
	String explanation,

	@Schema(description = "Loại câu hỏi", example = "MCQ")
	QuestionType type,

	@Schema(description = "Cấu hình JSON mở rộng", example = "{}")
	String payload,

	@Schema(description = "Danh sách lựa chọn cho câu trắc nghiệm")
	List<CreateQuestionOptionRequest> options,

	@Schema(description = "Đường dẫn tệp audio (cho câu hỏi nghe hiểu - HTT-10-CN-001)", example = "/uploads/audio/listening_01.mp3")
	String audioUrl,

	@Schema(description = "Đoạn văn bản hội thoại / transcript")
	String transcript,

	@Schema(description = "Phiên âm pinyin")
	String pinyin,

	@Schema(description = "Đường dẫn ảnh minh họa cho câu hỏi", example = "/uploads/images/question_01.png")
	String imageUrl,

	@Schema(description = "Cấp độ HSK", example = "1")
	Integer hskLevel,

	@Schema(description = "ID câu hỏi cha / bài đọc (nếu là câu hỏi chùm)", example = "10")
	Long parentId,

	@Schema(description = "Kho ảnh dùng chung (Image Pool) cho câu hỏi cha / nhóm ghép tranh HSK")
	List<ImagePoolItemDto> imagePool
) {
	// Constructor tương thích ngược cho 5 tham số ban đầu
	public CreateQuestionRequest(
			String content,
			String explanation,
			QuestionType type,
			String payload,
			List<CreateQuestionOptionRequest> options
	) {
		this(content, explanation, type, payload, options, null, null, null, null, null, null, null);
	}

	// Constructor tương thích ngược cho 8 tham số
	public CreateQuestionRequest(
			String content,
			String explanation,
			QuestionType type,
			String payload,
			List<CreateQuestionOptionRequest> options,
			String audioUrl,
			String transcript,
			String pinyin
	) {
		this(content, explanation, type, payload, options, audioUrl, transcript, pinyin, null, null, null, null);
	}

	// Constructor tương thích ngược cho 11 tham số
	public CreateQuestionRequest(
			String content,
			String explanation,
			QuestionType type,
			String payload,
			List<CreateQuestionOptionRequest> options,
			String audioUrl,
			String transcript,
			String pinyin,
			String imageUrl,
			Integer hskLevel,
			Long parentId
	) {
		this(content, explanation, type, payload, options, audioUrl, transcript, pinyin, imageUrl, hskLevel, parentId, null);
	}
}
