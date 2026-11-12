package com.hsk.pronunciation.port;

/**
 * Port giao tiếp với dịch vụ đánh giá phát âm bên ngoài (HTT-10-CN-003).
 *
 * <p>Kiến trúc Ports & Adapters: Nghiệp vụ cốt lõi chỉ phụ thuộc vào interface này.
 * Quá trình thực thi không được lưu lại audio byte hay log thông tin nhạy cảm.
 */
public interface PronunciationAssessmentProvider {

	/**
	 * Đánh giá bản ghi âm so với nội dung chuẩn.
	 *
	 * @param referenceText Đoạn chữ Hán hoặc câu mẫu chuẩn.
	 * @param audioBytes Mảng byte âm thanh của người học.
	 * @param contentType Định dạng MIME của âm thanh (ví dụ: audio/webm, audio/wav).
	 * @return Kết quả đánh giá độc lập với nhà cung cấp.
	 */
	PronunciationAssessmentResult assess(String referenceText, byte[] audioBytes, String contentType);
}
