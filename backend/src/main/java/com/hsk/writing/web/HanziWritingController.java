package com.hsk.writing.web;

import com.hsk.writing.dto.HanziStrokeDetailResponse;
import com.hsk.writing.dto.HanziStrokeSummaryResponse;
import com.hsk.writing.service.HanziWritingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST Controller cho tính năng Luyện viết chữ Hán (HTT-10-CN-002).
 */
@Validated
@RestController
@RequestMapping({"/api/v1/writing", "/api/writing"})
@Tag(name = "Writing", description = "Endpoints xem thứ tự nét và luyện viết chữ Hán (HTT-10-CN-002)")
public class HanziWritingController {

	private final HanziWritingService hanziWritingService;

	public HanziWritingController(HanziWritingService hanziWritingService) {
		this.hanziWritingService = hanziWritingService;
	}

	/**
	 * Lấy chi tiết thứ tự các nét và tọa độ median phục vụ vẽ/hoạt ảnh (HTT-10-CN-002-TC-01, TC-03).
	 *
	 * @param hanzi Ký tự chữ Hán cần lấy dữ liệu nét.
	 * @return Dữ liệu chi tiết nét vẽ và tọa độ median.
	 */
	@Operation(summary = "Lấy dữ liệu thứ tự nét của một chữ Hán")
	@GetMapping("/characters/{hanzi}/strokes")
	public ResponseEntity<HanziStrokeDetailResponse> getCharacterStrokes(@PathVariable("hanzi") String hanzi) {
		HanziStrokeDetailResponse response = hanziWritingService.getStrokeData(hanzi);
		return ResponseEntity.ok(response);
	}

	/**
	 * Kiểm tra trạng thái hỗ trợ thứ tự nét theo từng ký tự trong chuỗi (tối đa 20 ký tự).
	 *
	 * @param text Chuỗi ký tự cần kiểm tra.
	 * @return Danh sách trạng thái theo từng ký tự.
	 */
	@Operation(summary = "Kiểm tra hỗ trợ thứ tự nét cho chuỗi ký tự")
	@GetMapping("/characters/support")
	public ResponseEntity<List<HanziStrokeSummaryResponse>> getCharactersSupport(
			@RequestParam("text") String text
	) {
		List<HanziStrokeSummaryResponse> response = hanziWritingService.getSupportStatus(text);
		return ResponseEntity.ok(response);
	}
}
