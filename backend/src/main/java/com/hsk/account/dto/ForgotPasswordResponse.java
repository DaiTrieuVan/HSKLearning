package com.hsk.account.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Phản hồi yêu cầu đặt lại mật khẩu")
public record ForgotPasswordResponse(
	@Schema(description = "Thông báo chung an toàn (không lộ email tồn tại hay không)")
	String message,

	@Schema(description = "Token thử nghiệm trong môi trường dev/test (chỉ khả dụng khi dev/test)")
	String resetToken
) {
}
