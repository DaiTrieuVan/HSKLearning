package com.hsk.pronunciation.port;

/**
 * Kết quả chấm điểm trung gian (provider-neutral) từ dịch vụ nhận dạng giọng nói.
 *
 * @param overallScore Điểm tổng thể (thang điểm 0 - 100).
 * @param accuracyScore Điểm độ chính xác phát âm (thang điểm 0 - 100).
 * @param fluencyScore Điểm độ trôi chảy (thang điểm 0 - 100).
 * @param completenessScore Điểm độ hoàn thiện nội dung (thang điểm 0 - 100).
 * @param feedbackCode Mã phản hồi tiêu chuẩn hóa (ví dụ: EXCELLENT, GOOD, NEEDS_PRACTICE).
 * @param feedbackMessage Nhận xét bằng tiếng Việt hiển thị cho học sinh.
 */
public record PronunciationAssessmentResult(
		double overallScore,
		double accuracyScore,
		double fluencyScore,
		double completenessScore,
		String feedbackCode,
		String feedbackMessage
) {}
