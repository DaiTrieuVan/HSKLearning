package com.hsk.question.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "Kết quả nhập hàng loạt câu hỏi từ file Excel/CSV")
public record ImportQuestionsResult(
		@Schema(description = "Tổng số dòng trong file (trừ dòng tiêu đề)")
		int totalRows,

		@Schema(description = "Số câu hỏi nhập thành công")
		int successCount,

		@Schema(description = "Số câu hỏi bị bỏ qua do lỗi dữ liệu")
		int skippedCount,

		@Schema(description = "Danh sách thông báo lỗi chi tiết theo dòng")
		List<String> errors,

		@Schema(description = "Danh sách câu hỏi đã được tạo thành công")
		List<QuestionResponse> importedQuestions
) {}
