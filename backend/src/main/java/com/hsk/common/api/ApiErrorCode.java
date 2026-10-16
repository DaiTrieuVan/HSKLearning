package com.hsk.common.api;

import org.springframework.http.HttpStatus;

/**
 * Stable machine-readable error codes for the REST API.
 *
 * <p>The frontend maps its logic on {@link #name()} while {@link #message()} is the
 * Vietnamese text shown to the end user (decided for HTT-01-CN-001). Codes are part of the
 * API contract: renaming one is a breaking change, so add a new code instead.
 */
public enum ApiErrorCode {

	/** The JSON body could not be read (missing, malformed, unknown structure). */
	MALFORMED_REQUEST_BODY(HttpStatus.BAD_REQUEST, "Dữ liệu gửi lên không hợp lệ"),

	/** One or more fields failed bean validation; details are in the {@code fields} map. */
	VALIDATION_FAILED(HttpStatus.BAD_REQUEST, "Dữ liệu nhập không hợp lệ"),

	/** QTN-17: the email is already taken by another account. */
	EMAIL_ALREADY_IN_USE(HttpStatus.CONFLICT, "Email đã được sử dụng cho một tài khoản khác"),

	/** The confirmation password differs from the password. */
	PASSWORD_CONFIRMATION_MISMATCH(HttpStatus.BAD_REQUEST, "Mật khẩu xác nhận không khớp"),

	/** A resource with the same unique value already exists (database constraint). */
	RESOURCE_ALREADY_EXISTS(HttpStatus.CONFLICT, "Dữ liệu đã tồn tại trong hệ thống"),

	/** No resource matches the requested identifier. */
	RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy dữ liệu"),

	/** The caller is authenticated but not allowed to perform this action. */
	FORBIDDEN(HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này"),

	/** Credentials are missing or invalid. */
	UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Bạn chưa đăng nhập hoặc phiên đã hết hạn"),

	/** TC-05 / TC-06: Wrong password or non-existent email (unified to prevent account enumeration). */
	INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không chính xác"),

	/** TC-08: Account has been locked by an administrator. */
	ACCOUNT_LOCKED(HttpStatus.FORBIDDEN, "Tài khoản đã bị quản trị viên khóa, vui lòng liên hệ quản trị viên"),

	/** HTT-01-CN-008-TC-04: Admin attempting to lock own account. */
	CANNOT_LOCK_SELF(HttpStatus.BAD_REQUEST, "Bạn không thể tự khóa tài khoản của chính mình"),

	/** TC-09 & QTN-17: Account temporarily locked for 15 minutes after 5 consecutive failures. */
	ACCOUNT_TEMPORARILY_LOCKED(HttpStatus.FORBIDDEN, "Tài khoản bị khóa tạm thời do nhập sai quá 5 lần liên tiếp. Vui lòng thử lại sau 15 phút"),

	/** HTT-01-CN-002: User already has a pending teacher upgrade request. */
	PENDING_REQUEST_ALREADY_EXISTS(HttpStatus.CONFLICT, "Bạn đã có một yêu cầu đang chờ duyệt"),

	/** HTT-01-CN-002: User already holds the teacher role. */
	ALREADY_TEACHER(HttpStatus.BAD_REQUEST, "Tài khoản đã có quyền giáo viên"),

	/** HTT-01-CN-003: Request has already been reviewed (approved or rejected). */
	REQUEST_ALREADY_PROCESSED(HttpStatus.BAD_REQUEST, "Yêu cầu đã được xử lý trước đó"),

	/** HTT-01-CN-007 / HTT-02-CN-001: Attempting teacher actions without teacher role. */
	TEACHER_ROLE_NOT_GRANTED(HttpStatus.FORBIDDEN, "Bạn chưa có quyền giáo viên để thực hiện thao tác này"),

	/** HTT-01-CN-005: Password reset token has expired (>30 minutes). */
	TOKEN_EXPIRED(HttpStatus.BAD_REQUEST, "Liên kết đã hết hạn, vui lòng yêu cầu liên kết mới"),

	/** HTT-01-CN-005: Password reset token has already been consumed. */
	TOKEN_ALREADY_USED(HttpStatus.BAD_REQUEST, "Liên kết đã được sử dụng"),

	/** HTT-01-CN-006: Current password entered during password change is wrong. */
	INVALID_CURRENT_PASSWORD(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không chính xác"),

	/** HTT-01-CN-006: Uploaded avatar file exceeds 2 MB. */
	FILE_TOO_LARGE(HttpStatus.BAD_REQUEST, "Kích thước tệp vượt quá dung lượng cho phép (tối đa 2 MB)"),

	/** HTT-01-CN-006: Uploaded file is not an allowed image format (.jpg, .jpeg, .png, .webp). */
	INVALID_FILE_FORMAT(HttpStatus.BAD_REQUEST, "Định dạng tệp không hợp lệ (chỉ chấp nhận ảnh .jpg, .png, .webp)"),

	/** HTT-02: Class not found. */
	CLASS_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy lớp học"),

	/** HTT-02-CN-002: Class is archived, cannot be modified or joined (QTN-01). */
	CLASS_ALREADY_ARCHIVED(HttpStatus.BAD_REQUEST, "Lớp học đã được lưu trữ, không thể nhận thêm học sinh hoặc chỉnh sửa"),

	/** HTT-02-CN-003: Rate limited after 10 failed join code attempts in 1 hour (QTN-05). */
	CLASS_JOIN_RATE_LIMITED(HttpStatus.TOO_MANY_REQUESTS, "Bạn đã nhập sai mã lớp quá 10 lần liên tiếp. Vui lòng thử lại sau 1 giờ"),

	/** HTT-02-CN-003: Wrong join code entered. */
	INVALID_JOIN_CODE(HttpStatus.BAD_REQUEST, "Mã tham gia lớp học không chính xác"),

	/** HTT-02-CN-003: Student is already an active member of this class. */
	ALREADY_CLASS_MEMBER(HttpStatus.BAD_REQUEST, "Bạn đã tham gia lớp học này rồi"),

	/** HTT-02-CN-006 / 007 / 008: Student is not in class. */
	NOT_CLASS_MEMBER(HttpStatus.BAD_REQUEST, "Học sinh không thuộc lớp học này"),

	/** HTT-03-CN-001: HSK level not found. */
	HSK_LEVEL_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy cấp độ HSK"),

	/** HTT-03-CN-002: Lesson not found. */
	LESSON_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy bài học"),

	/** HTT-03-CN-004: Vocabulary not found. */
	VOCABULARY_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy từ vựng"),

	/** HTT-03-CN-004 / 011: Vocabulary pair (hanzi, pinyin) already exists in scope (QTN-07). */
	VOCABULARY_ALREADY_EXISTS(HttpStatus.CONFLICT, "Từ vựng với cặp chữ Hán và Pinyin này đã tồn tại trong kho"),

	/** HTT-03-CN-005: Vocabulary is used in lessons or sets (QTN-14). */
	VOCABULARY_IN_USE(HttpStatus.BAD_REQUEST, "Từ vựng đang được sử dụng, không thể xóa (hệ thống sẽ ẩn đi)"),

	/** HTT-03-CN-008: Grammar point not found. */
	GRAMMAR_POINT_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy điểm ngữ pháp"),

	/** HTT-03-CN-009: Vocabulary set not found. */
	VOCAB_SET_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy bộ từ vựng"),

	/** HTT-04-CN-003: Vocabulary has no audio attached. */
	AUDIO_NOT_FOUND(HttpStatus.NOT_FOUND, "Từ vựng chưa có tệp âm thanh phát âm"),

	/** HTT-04-CN-003: Audio file does not exist on disk or cannot be reached. */
	AUDIO_FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "Tệp âm thanh không tồn tại hoặc đã bị xóa"),

	/** HTT-05-CN-001 / QTN-08: Multiple choice question must have at least 2 options. */
	QUESTION_MIN_OPTIONS(HttpStatus.BAD_REQUEST, "Câu hỏi trắc nghiệm phải có ít nhất 2 lựa chọn"),

	/** HTT-05-CN-001 / QTN-08: Multiple choice question must have exactly one correct answer. */
	QUESTION_EXACTLY_ONE_CORRECT(HttpStatus.BAD_REQUEST, "Câu hỏi trắc nghiệm phải có đúng một đáp án đúng"),

	/** HTT-05-CN-001: Multiple choice question cannot have duplicate options. */
	QUESTION_DUPLICATE_OPTIONS(HttpStatus.BAD_REQUEST, "Các lựa chọn không được có nội dung trùng nhau"),

	/** HTT-05-CN-001: Question content cannot be blank. */
	QUESTION_CONTENT_BLANK(HttpStatus.BAD_REQUEST, "Nội dung câu hỏi không được để trống"),

	/** HTT-05-CN-001: Option content cannot be blank. */
	QUESTION_OPTION_CONTENT_BLANK(HttpStatus.BAD_REQUEST, "Nội dung lựa chọn không được để trống"),

	/** HTT-05-CN-002-TC-03: Fill in blank question must have at least one blank. */
	QUESTION_NO_BLANKS(HttpStatus.BAD_REQUEST, "Câu hỏi phải chứa ít nhất một chỗ trống (ký hiệu ___)"),

	/** HTT-05-CN-002-TC-04: Number of blanks must match number of configured answers. */
	QUESTION_BLANK_COUNT_MISMATCH(HttpStatus.BAD_REQUEST, "Số lượng chỗ trống trong câu không khớp với số lượng đáp án đã cung cấp"),

	/** HTT-05-CN-002-TC-05: Correct answer for blank cannot be empty. */
	QUESTION_CORRECT_ANSWER_BLANK(HttpStatus.BAD_REQUEST, "Đáp án đúng cho mỗi chỗ trống không được để trống"),

	/** HTT-05-CN-003-TC-03: Matching question must have at least 2 pairs. */
	QUESTION_MATCH_MIN_PAIRS(HttpStatus.BAD_REQUEST, "Câu hỏi nối từ phải có ít nhất 2 cặp từ và nghĩa"),

	/** HTT-05-CN-003-TC-04: Matching pair sides cannot be blank. */
	QUESTION_MATCH_PAIR_BLANK(HttpStatus.BAD_REQUEST, "Các vế của cặp nối từ không được để trống"),

	/** HTT-05-CN-003-TC-05: Matching question cannot have duplicate left items. */
	QUESTION_MATCH_DUPLICATE_LEFT(HttpStatus.BAD_REQUEST, "Các cặp nối từ không được có vế trái trùng nhau"),

	/** HTT-05-CN-003-TC-04: Ordering question must have at least 2 items. */
	QUESTION_ORDER_MIN_ITEMS(HttpStatus.BAD_REQUEST, "Câu hỏi sắp xếp câu phải có ít nhất 2 thành phần"),

	/** HTT-05-CN-003-TC-04: Ordering question items cannot be blank. */
	QUESTION_ORDER_ITEM_BLANK(HttpStatus.BAD_REQUEST, "Thành phần của câu sắp xếp không được để trống"),

	/** Unexpected server side failure; the client may retry. */
	INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Hệ thống đang gặp sự cố, vui lòng thử lại sau");

	private final HttpStatus status;

	private final String message;

	ApiErrorCode(HttpStatus status, String message) {
		this.status = status;
		this.message = message;
	}

	public HttpStatus status() {
		return this.status;
	}

	public String message() {
		return this.message;
	}
}
