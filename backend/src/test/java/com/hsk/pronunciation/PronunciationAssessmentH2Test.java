package com.hsk.pronunciation;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.RoleEntity;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.RoleRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.pronunciation.domain.PronunciationAttemptEntity;
import com.hsk.pronunciation.domain.ReferenceType;
import com.hsk.pronunciation.repository.PronunciationAttemptRepository;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Kiểm thử tích hợp toàn diện cho User Story HTT-10-CN-003: Chấm phát âm.
 *
 * <p>Bao phủ các Acceptance Criteria:
 * - TC-01: Luồng thành công (Gửi từ 你好, nhận điểm phát âm và nhận xét, lưu điểm không lưu audio).
 * - TC-02: Không có quyền / chưa đăng nhập (Trả về 401 Unauthorized khi thiếu JWT).
 * - TC-03: Ngoại lệ dịch vụ nhận dạng (Báo lỗi 503 PRONUNCIATION_PROVIDER_UNAVAILABLE, không lưu điểm vào DB).
 * - TC-04: Dữ liệu không hợp lệ (Bản ghi âm 0,3 giây hoặc rỗng -> Trả về 400 INVALID_AUDIO, không gọi provider).
 * - TC-05: Lưu lịch sử (Chỉ lưu điểm và thời điểm, không giữ tệp ghi âm, chỉ hiển thị lịch sử của chính user).
 * - TC-06..07: Kiểm thử bổ sung cho referenceText không chứa chữ Hán, và sai referenceId.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class PronunciationAssessmentH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String ASSESS_URL = "/api/v1/pronunciation/assess";
	private static final String HISTORY_URL = "/api/v1/pronunciation/history";

	private static final String STUDENT1_EMAIL = "student_pronounce1@test.com";
	private static final String STUDENT2_EMAIL = "student_pronounce2@test.com";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private PronunciationAttemptRepository pronunciationAttemptRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	private String student1Token;
	private String student2Token;
	private Long student1Id;
	private Long student2Id;
	private Long sampleVocabId;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// Tạo Student 1
		registrationService.registerStudent(
				new RegisterStudentRequest("Học sinh Phát âm 1", STUDENT1_EMAIL, PASSWORD, PASSWORD)
		);
		UserEntity student1 = userRepository.findByEmailIgnoreCase(STUDENT1_EMAIL).orElseThrow();
		student1Id = student1.getId();
		student1Token = loginAndGetToken(STUDENT1_EMAIL, PASSWORD);

		// Tạo Student 2
		registrationService.registerStudent(
				new RegisterStudentRequest("Học sinh Phát âm 2", STUDENT2_EMAIL, PASSWORD, PASSWORD)
		);
		UserEntity student2 = userRepository.findByEmailIgnoreCase(STUDENT2_EMAIL).orElseThrow();
		student2Id = student2.getId();
		student2Token = loginAndGetToken(STUDENT2_EMAIL, PASSWORD);

		// Tạo một từ vựng mẫu
		VocabularyEntity vocab = new VocabularyEntity(
				"你好", "nǐ hǎo", "Xin chào", "noun", null,
				"你好，很高兴认识你。", "Nǐ hǎo, hěn gāoxìng rènshí nǐ.", "Xin chào, rất vui được gặp bạn.",
				null, null
		);
		VocabularyEntity savedVocab = vocabularyRepository.save(vocab);
		sampleVocabId = savedVocab.getId();
	}

	@AfterEach
	void tearDown() {
		pronunciationAttemptRepository.deleteAll();
		if (sampleVocabId != null) {
			vocabularyRepository.deleteById(sampleVocabId);
			sampleVocabId = null;
		}
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		String json = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
		MvcResult result = mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(json))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.get("token").asText();
	}

	/**
	 * Tạo mảng byte file WAV hợp lệ với thời lượng xác định (giây).
	 */
	private byte[] createMockWavAudio(double durationSeconds, boolean silent) throws Exception {
		int sampleRate = 16000;
		int channels = 1;
		int bitsPerSample = 16;
		int byteRate = sampleRate * channels * (bitsPerSample / 8);
		int dataSize = (int) (durationSeconds * byteRate);
		// Chẵn byte cho 16-bit
		if (dataSize % 2 != 0) {
			dataSize++;
		}
		int totalSize = 36 + dataSize;

		ByteBuffer buffer = ByteBuffer.allocate(44 + dataSize).order(ByteOrder.LITTLE_ENDIAN);
		// RIFF header
		buffer.put((byte) 'R').put((byte) 'I').put((byte) 'F').put((byte) 'F');
		buffer.putInt(totalSize);
		buffer.put((byte) 'W').put((byte) 'A').put((byte) 'V').put((byte) 'E');
		// fmt subchunk
		buffer.put((byte) 'f').put((byte) 'm').put((byte) 't').put((byte) ' ');
		buffer.putInt(16); // Subchunk1Size
		buffer.putShort((short) 1); // AudioFormat (PCM = 1)
		buffer.putShort((short) channels);
		buffer.putInt(sampleRate);
		buffer.putInt(byteRate);
		buffer.putShort((short) (channels * bitsPerSample / 8)); // BlockAlign
		buffer.putShort((short) bitsPerSample);
		// data subchunk
		buffer.put((byte) 'd').put((byte) 'a').put((byte) 't').put((byte) 'a');
		buffer.putInt(dataSize);

		// PCM data: nếu silent thì để 0; nếu có tiếng thì tạo âm thanh sóng sin tần số 440Hz
		short amplitude = (short) (silent ? 0 : 5000);
		double freq = 440.0;
		for (int i = 0; i < dataSize / 2; i++) {
			short sample = silent ? 0 : (short) (amplitude * Math.sin(2.0 * Math.PI * freq * i / sampleRate));
			buffer.putShort(sample);
		}

		return buffer.array();
	}

	@Test
	@DisplayName("TC-01: Luồng thành công - Học sinh ghi âm đọc từ '你好', nhận điểm phát âm và nhận xét, DB lưu điểm không lưu audio")
	void tc01_pronunciationAssessment_successFlow_gradesAndPersistsWithoutAudio() throws Exception {
		byte[] wavBytes = createMockWavAudio(1.2, false);
		MockMultipartFile audioFile = new MockMultipartFile(
				"audio", "recording.wav", "audio/wav", wavBytes
		);

		mockMvc.perform(multipart(ASSESS_URL)
						.file(audioFile)
						.param("referenceText", "你好")
						.param("referenceType", "VOCABULARY")
						.param("referenceId", String.valueOf(sampleVocabId))
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.attemptId", notNullValue()))
				.andExpect(jsonPath("$.overallScore", is(92.5)))
				.andExpect(jsonPath("$.accuracyScore", is(95.0)))
				.andExpect(jsonPath("$.fluencyScore", is(90.0)))
				.andExpect(jsonPath("$.completenessScore", is(92.5)))
				.andExpect(jsonPath("$.feedbackCode", is("EXCELLENT")))
				.andExpect(jsonPath("$.feedback", containsString("Phát âm rất tốt")))
				.andExpect(jsonPath("$.assessedAt", notNullValue()));

		// Kiểm tra tính toàn vẹn trong Database: Đảm bảo có bản ghi nhưng TUYỆT ĐỐI KHÔNG CÓ audio file/path
		List<PronunciationAttemptEntity> attempts = pronunciationAttemptRepository.findAll();
		assertEquals(1, attempts.size());
		PronunciationAttemptEntity attempt = attempts.get(0);
		assertEquals(student1Id, attempt.getStudentId());
		assertEquals("你好", attempt.getReferenceText());
		assertEquals(ReferenceType.VOCABULARY, attempt.getReferenceType());
		assertEquals(sampleVocabId, attempt.getReferenceId());
		assertEquals(92.5, attempt.getScore().doubleValue());
		assertEquals("EXCELLENT", attempt.getFeedbackCode());
		assertNotNull(attempt.getAssessedAt());
	}

	@Test
	@DisplayName("TC-02: Không có quyền - Chưa gửi JWT token hoặc token hết hạn -> Trả về 401 Unauthorized")
	void tc02_pronunciationAssessment_unauthorized_returns401() throws Exception {
		byte[] wavBytes = createMockWavAudio(1.0, false);
		MockMultipartFile audioFile = new MockMultipartFile(
				"audio", "recording.wav", "audio/wav", wavBytes
		);

		mockMvc.perform(multipart(ASSESS_URL)
						.file(audioFile)
						.param("referenceText", "你好"))
				.andExpect(status().isUnauthorized());

		// DB không được có bản ghi nào
		assertEquals(0, pronunciationAttemptRepository.count());
	}

	@Test
	@DisplayName("TC-03: Ngoại lệ - Dịch vụ nhận dạng giọng nói bị lỗi hoặc quá thời gian -> Báo lỗi 503 và KHÔNG lưu điểm")
	void tc03_pronunciationAssessment_providerErrorOrTimeout_returns503AndDoesNotPersist() throws Exception {
		byte[] wavBytes = createMockWavAudio(1.5, false);
		MockMultipartFile audioFile = new MockMultipartFile(
				"audio", "recording.wav", "audio/wav", wavBytes
		);

		// Gửi văn bản kích hoạt mô phỏng lỗi upstream bên thứ ba
		mockMvc.perform(multipart(ASSESS_URL)
						.file(audioFile)
						.param("referenceText", "SIMULATE_TIMEOUT 你好")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isServiceUnavailable())
				.andExpect(jsonPath("$.code", is("PRONUNCIATION_PROVIDER_UNAVAILABLE")));

		// Khẳng định chắc chắn: Dịch vụ ngoài lỗi thì KHÔNG LƯU BẢN GHI NÀO VÀO DB
		assertEquals(0, pronunciationAttemptRepository.count());
	}

	@Test
	@DisplayName("TC-04: Dữ liệu không hợp lệ - Bản ghi âm 0,3 giây hoặc im lặng -> Trả về 400 INVALID_AUDIO, không gọi provider")
	void tc04_pronunciationAssessment_audioTooShortOrSilent_returns400() throws Exception {
		// 1. Bản ghi âm 0.3 giây (Test Data theo User Story: Bản ghi 0,3 giây)
		byte[] shortWavBytes = createMockWavAudio(0.3, false);
		MockMultipartFile shortAudio = new MockMultipartFile(
				"audio", "short_audio.wav", "audio/wav", shortWavBytes
		);

		mockMvc.perform(multipart(ASSESS_URL)
						.file(shortAudio)
						.param("referenceText", "你好")
						.param("durationSeconds", "0.3")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("INVALID_AUDIO")));

		// 2. Bản ghi âm chỉ có tiếng ồn hoặc im lặng hoàn toàn (silent audio)
		byte[] silentWavBytes = createMockWavAudio(1.0, true);
		MockMultipartFile silentAudio = new MockMultipartFile(
				"audio", "silent_audio.wav", "audio/wav", silentWavBytes
		);

		mockMvc.perform(multipart(ASSESS_URL)
						.file(silentAudio)
						.param("referenceText", "你好")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("INVALID_AUDIO")));

		// Khẳng định: Không bản ghi nào được lưu vào DB
		assertEquals(0, pronunciationAttemptRepository.count());
	}

	@Test
	@DisplayName("TC-05: Lưu lịch sử - Chỉ lưu điểm và thời điểm, không giữ audio, phân tách lịch sử giữa các học sinh")
	void tc05_pronunciationAssessment_history_persistsScoreOnlyAndIsolatesUsers() throws Exception {
		byte[] wavBytes = createMockWavAudio(1.0, false);
		MockMultipartFile audioFile = new MockMultipartFile(
				"audio", "recording.wav", "audio/wav", wavBytes
		);

		// Student 1 thực hiện 2 lần chấm
		mockMvc.perform(multipart(ASSESS_URL)
						.file(audioFile)
						.param("referenceText", "你好")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		mockMvc.perform(multipart(ASSESS_URL)
						.file(audioFile)
						.param("referenceText", "谢谢")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk());

		// Student 2 thực hiện 1 lần chấm
		mockMvc.perform(multipart(ASSESS_URL)
						.file(audioFile)
						.param("referenceText", "再见")
						.header("Authorization", "Bearer " + student2Token))
				.andExpect(status().isOk());

		assertEquals(3, pronunciationAttemptRepository.count());

		// Student 1 gọi API lấy lịch sử -> Chỉ thấy 2 bản ghi của chính mình, không có trường audio
		mockMvc.perform(get(HISTORY_URL)
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(2)))
				.andExpect(jsonPath("$[0].referenceText", is("谢谢")))
				.andExpect(jsonPath("$[0].overallScore", notNullValue()))
				.andExpect(jsonPath("$[0].assessedAt", notNullValue()))
				.andExpect(jsonPath("$[0].audioUrl").doesNotExist())
				.andExpect(jsonPath("$[0].audio").doesNotExist())
				.andExpect(jsonPath("$[1].referenceText", is("你好")));

		// Student 2 gọi API lấy lịch sử -> Chỉ thấy 1 bản ghi của Student 2
		mockMvc.perform(get(HISTORY_URL)
						.header("Authorization", "Bearer " + student2Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].referenceText", is("再见")));
	}

	@Test
	@DisplayName("TC-06: Nội dung chuẩn không hợp lệ - Không chứa chữ Hán hoặc rỗng -> Trả về 400 INVALID_REFERENCE_TEXT")
	void tc06_pronunciationAssessment_invalidReferenceText_returns400() throws Exception {
		byte[] wavBytes = createMockWavAudio(1.0, false);
		MockMultipartFile audioFile = new MockMultipartFile(
				"audio", "recording.wav", "audio/wav", wavBytes
		);

		// Không có chữ Hán
		mockMvc.perform(multipart(ASSESS_URL)
						.file(audioFile)
						.param("referenceText", "Hello world")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("INVALID_REFERENCE_TEXT")));

		// Rỗng
		mockMvc.perform(multipart(ASSESS_URL)
						.file(audioFile)
						.param("referenceText", "   ")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("INVALID_REFERENCE_TEXT")));
	}

	@Test
	@DisplayName("TC-07: ID từ vựng tham chiếu không hợp lệ hoặc nội dung chuẩn không khớp -> Trả về 400 hoặc 404")
	void tc07_pronunciationAssessment_referenceIdMismatch_returnsError() throws Exception {
		byte[] wavBytes = createMockWavAudio(1.0, false);
		MockMultipartFile audioFile = new MockMultipartFile(
				"audio", "recording.wav", "audio/wav", wavBytes
		);

		// ID không tồn tại
		mockMvc.perform(multipart(ASSESS_URL)
						.file(audioFile)
						.param("referenceText", "你好")
						.param("referenceType", "VOCABULARY")
						.param("referenceId", "999999")
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.code", is("RESOURCE_NOT_FOUND")));

		// ID tồn tại nhưng chữ Hán không khớp
		mockMvc.perform(multipart(ASSESS_URL)
						.file(audioFile)
						.param("referenceText", "谢谢")
						.param("referenceType", "VOCABULARY")
						.param("referenceId", String.valueOf(sampleVocabId))
						.header("Authorization", "Bearer " + student1Token))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("VALIDATION_FAILED")));
	}
}
