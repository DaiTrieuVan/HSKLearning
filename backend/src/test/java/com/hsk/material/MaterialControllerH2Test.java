package com.hsk.material;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.awt.Color;
import java.awt.Rectangle;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFAutoShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.sl.usermodel.ShapeType;
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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.RoleEntity;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
import com.hsk.account.dto.RegisterStudentRequest;
import com.hsk.account.repository.PasswordResetTokenRepository;
import com.hsk.account.repository.RoleRepository;
import com.hsk.account.repository.TeacherRequestRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.account.service.RegistrationService;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.audit.AuditLogRepository;
import com.hsk.material.repository.ClassCourseMaterialRepository;
import com.hsk.material.repository.CourseMaterialPageRepository;
import com.hsk.material.repository.CourseMaterialRepository;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class MaterialControllerH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String TEACHER_EMAIL = "teacher_material@test.com";
	private static final String STUDENT_A_EMAIL = "student_a_mat@test.com";
	private static final String STUDENT_B_EMAIL = "student_b_mat@test.com";
	private static final String OUTSIDER_EMAIL = "student_out_mat@test.com";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private RegistrationService registrationService;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserRoleRepository userRoleRepository;
	@Autowired
	private RoleRepository roleRepository;
	@Autowired
	private TeacherRequestRepository teacherRequestRepository;
	@Autowired
	private AuditLogRepository auditLogRepository;
	@Autowired
	private ClassRepository classRepository;
	@Autowired
	private ClassMemberRepository classMemberRepository;
	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;
	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;
	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;
	@Autowired
	private ClassCourseMaterialRepository classCourseMaterialRepository;
	@Autowired
	private CourseMaterialPageRepository courseMaterialPageRepository;
	@Autowired
	private CourseMaterialRepository courseMaterialRepository;

	private String teacherToken;
	private String studentAToken;
	private String studentBToken;
	private String outsiderToken;

	@BeforeEach
	void setUp() throws Exception {
		cleanupData();

		registrationService.registerStudent(new RegisterStudentRequest("Co Giao An", TEACHER_EMAIL, PASSWORD, PASSWORD));
		UserEntity teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		registrationService.registerStudent(new RegisterStudentRequest("Hoc Sinh A", STUDENT_A_EMAIL, PASSWORD, PASSWORD));
		registrationService.registerStudent(new RegisterStudentRequest("Hoc Sinh B", STUDENT_B_EMAIL, PASSWORD, PASSWORD));
		registrationService.registerStudent(new RegisterStudentRequest("Nguoi Ngoai", OUTSIDER_EMAIL, PASSWORD, PASSWORD));

		teacherToken = authenticate(TEACHER_EMAIL, PASSWORD);
		studentAToken = authenticate(STUDENT_A_EMAIL, PASSWORD);
		studentBToken = authenticate(STUDENT_B_EMAIL, PASSWORD);
		outsiderToken = authenticate(OUTSIDER_EMAIL, PASSWORD);
	}

	@AfterEach
	void tearDown() {
		cleanupData();
	}

	private void cleanupData() {
		classCourseMaterialRepository.deleteAll();
		courseMaterialPageRepository.deleteAll();
		courseMaterialRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		auditLogRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String authenticate(String email, String password) throws Exception {
		String body = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
		return root.path("token").asText();
	}

	private byte[] createSamplePdf(int pageCount) throws Exception {
		try (PDDocument doc = new PDDocument(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
			PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
			for (int i = 1; i <= pageCount; i++) {
				PDPage page = new PDPage();
				doc.addPage(page);
				try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
					cs.beginText();
					cs.setFont(font, 20);
					cs.newLineAtOffset(72, 700);
					cs.showText("HSK Material Slide " + i);
					cs.endText();
				}
			}
			doc.save(baos);
			return baos.toByteArray();
		}
	}

	private byte[] createSamplePptx(int slideCount) throws Exception {
		try (XMLSlideShow ppt = new XMLSlideShow(); ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
			for (int i = 1; i <= slideCount; i++) {
				XSLFSlide slide = ppt.createSlide();
				XSLFAutoShape box = slide.createAutoShape();
				box.setShapeType(ShapeType.RECT);
				box.setAnchor(new Rectangle(60, 80, 500, 120));
				box.setFillColor(new Color(16, 185, 129));
				box.setText("HSK PowerPoint Slide " + i);
			}
			ppt.write(baos);
			return baos.toByteArray();
		}
	}

	private long createClassAndEnroll(String title, String studentToken) throws Exception {
		MvcResult createRes = mockMvc.perform(post("/api/v1/classes")
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"title\":\"" + title + "\",\"description\":\"Lop test\"}"))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode classJson = objectMapper.readTree(createRes.getResponse().getContentAsString());
		long classId = classJson.path("id").asLong();
		String joinCode = classJson.path("joinCode").asText();

		mockMvc.perform(post("/api/v1/classes/join")
						.header("Authorization", "Bearer " + studentToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"code\":\"" + joinCode + "\"}"))
				.andExpect(status().isOk());

		return classId;
	}

	private JsonNode waitUntilReady(long materialId, String token) throws Exception {
		for (int attempt = 0; attempt < 60; attempt++) {
			MvcResult res = mockMvc.perform(get("/api/v1/materials/" + materialId)
							.header("Authorization", "Bearer " + token))
					.andExpect(status().isOk())
					.andReturn();
			JsonNode json = objectMapper.readTree(res.getResponse().getContentAsString());
			String status = json.path("status").asText();
			if ("READY".equals(status) || "FAILED".equals(status)) {
				return json;
			}
			Thread.sleep(100);
		}
		throw new AssertionError("Timed out waiting for material " + materialId + " rendering");
	}

	@Test
	@DisplayName("Upload PDF & PPTX thanh cong, stream PNG bao mat va khoa tai ve theo tung lop")
	void fullCourseMaterialWorkflowAndDownloadRestriction() throws Exception {
		byte[] pdfBytes = createSamplePdf(2);
		MockMultipartFile pdfPart = new MockMultipartFile(
				"file", "giao-trinh-hsk1.pdf", MediaType.APPLICATION_PDF_VALUE, pdfBytes
		);

		MvcResult uploadPdfRes = mockMvc.perform(multipart("/api/v1/materials")
						.file(pdfPart)
						.param("title", "Giao trinh HSK 1 Bai 1")
						.param("hskLevel", "1")
						.param("defaultAllowDownload", "false")
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.fileType", is("PDF")))
				.andReturn();

		long pdfMaterialId = objectMapper.readTree(uploadPdfRes.getResponse().getContentAsString()).path("id").asLong();
		// PDF chuyen ngay sang READY khong can doi convert sang slide
		JsonNode pdfUploadJson = objectMapper.readTree(uploadPdfRes.getResponse().getContentAsString());
		assertEquals("READY", pdfUploadJson.path("status").asText());
		assertEquals(2, pdfUploadJson.path("totalPages").asInt());

		// Upload PPTX
		byte[] pptxBytes = createSamplePptx(2);
		MockMultipartFile pptxPart = new MockMultipartFile(
				"file",
				"bai-giang-hsk2.pptx",
				"application/vnd.openxmlformats-officedocument.presentationml.presentation",
				pptxBytes
		);
		MvcResult uploadPptxRes = mockMvc.perform(multipart("/api/v1/materials")
						.file(pptxPart)
						.param("title", "Slide HSK 2")
						.param("hskLevel", "2")
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.fileType", is("PPTX")))
				.andReturn();

		long pptxMaterialId = objectMapper.readTree(uploadPptxRes.getResponse().getContentAsString()).path("id").asLong();
		JsonNode pptxDetail = waitUntilReady(pptxMaterialId, teacherToken);
		assertEquals("READY", pptxDetail.path("status").asText());
		assertEquals(2, pptxDetail.path("totalPages").asInt());

		// Chia se ca PDF va PPTX vao 2 lop: Lop A tat tai ve, Lop B bat tai ve
		long classA = createClassAndEnroll("Lop HSK A", studentAToken);
		long classB = createClassAndEnroll("Lop HSK B", studentBToken);

		String syncPayload = """
				{
				  "shares": [
				    { "classId": %d, "allowDownload": false, "note": "Chi xem tren web" },
				    { "classId": %d, "allowDownload": true, "note": "Duoc phep tai PDF" }
				  ]
				}
				""".formatted(classA, classB);

		mockMvc.perform(put("/api/v1/materials/" + pdfMaterialId + "/shares")
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(syncPayload))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(2)));

		mockMvc.perform(put("/api/v1/materials/" + pptxMaterialId + "/shares")
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(syncPayload))
				.andExpect(status().isOk());

		// Student A (lop A, allowDownload = false): xem duoc danh sach, stream PDF qua /document va slide PNG cua PPTX, nhung tai file goc bi chan 403
		mockMvc.perform(get("/api/v1/classes/" + classA + "/materials")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(2)))
				.andExpect(jsonPath("$[0].canDownload", is(false)));

		MvcResult docStreamRes = mockMvc.perform(get("/api/v1/materials/" + pdfMaterialId + "/document")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk())
				.andExpect(header().string("Cache-Control", containsString("no-store")))
				.andExpect(header().string("X-Content-Type-Options", is("nosniff")))
				.andReturn();
		assertArrayEquals(pdfBytes, docStreamRes.getResponse().getContentAsByteArray());

		MvcResult slideRes = mockMvc.perform(get("/api/v1/materials/" + pptxMaterialId + "/slides/1/image")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk())
				.andExpect(header().string("Cache-Control", containsString("no-store")))
				.andExpect(header().string("X-Content-Type-Options", is("nosniff")))
				.andReturn();
		byte[] pngData = slideRes.getResponse().getContentAsByteArray();
		assertTrue(pngData.length > 100);
		assertEquals((byte) 0x89, pngData[0]);
		assertEquals((byte) 0x50, pngData[1]);

		mockMvc.perform(get("/api/v1/materials/" + pdfMaterialId + "/download")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("MATERIAL_DOWNLOAD_NOT_ALLOWED")));

		// Student B (lop B, allowDownload = true): tai duoc dung byte file PDF goc
		MvcResult downloadRes = mockMvc.perform(get("/api/v1/materials/" + pdfMaterialId + "/download")
						.header("Authorization", "Bearer " + studentBToken))
				.andExpect(status().isOk())
				.andExpect(header().string("Content-Disposition", containsString("attachment")))
				.andReturn();
		assertArrayEquals(pdfBytes, downloadRes.getResponse().getContentAsByteArray());

		// Giao vien bat quyen tai cho Lop A -> Student A tai duoc ngay
		mockMvc.perform(patch("/api/v1/classes/" + classA + "/materials/" + pdfMaterialId)
						.header("Authorization", "Bearer " + teacherToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"allowDownload\":true}"))
				.andExpect(status().isOk());

		mockMvc.perform(get("/api/v1/materials/" + pdfMaterialId + "/download")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isOk());

		// Nguoi ngoai khong thuoc lop -> bi chan ca xem tai lieu lan tai ve
		mockMvc.perform(get("/api/v1/materials/" + pdfMaterialId)
						.header("Authorization", "Bearer " + outsiderToken))
				.andExpect(status().isForbidden());
		mockMvc.perform(get("/api/v1/materials/" + pdfMaterialId + "/document")
						.header("Authorization", "Bearer " + outsiderToken))
				.andExpect(status().isForbidden());
		mockMvc.perform(get("/api/v1/materials/" + pptxMaterialId + "/slides/1/image")
						.header("Authorization", "Bearer " + outsiderToken))
				.andExpect(status().isForbidden());
		mockMvc.perform(get("/api/v1/materials/" + pdfMaterialId + "/download")
						.header("Authorization", "Bearer " + outsiderToken))
				.andExpect(status().isForbidden());

		// Giao vien xoa giao trinh -> tra 204
		mockMvc.perform(delete("/api/v1/materials/" + pdfMaterialId)
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isNoContent());

		mockMvc.perform(get("/api/v1/materials/" + pdfMaterialId)
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isNotFound());
	}

	@Test
	@DisplayName("Tu choi file gia mao dinh dang (magic bytes sai) va chan hoc sinh upload")
	void rejectsInvalidFormatAndUnauthorizedUpload() throws Exception {
		MockMultipartFile fakePdf = new MockMultipartFile(
				"file",
				"malicious.pdf",
				MediaType.APPLICATION_PDF_VALUE,
				"NOT_A_REAL_PDF_FILE".getBytes(StandardCharsets.UTF_8)
		);

		mockMvc.perform(multipart("/api/v1/materials")
						.file(fakePdf)
						.param("title", "Fake PDF")
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("MATERIAL_INVALID_FORMAT")));

		MockMultipartFile legacyPpt = new MockMultipartFile(
				"file",
				"old-deck.ppt",
				"application/vnd.ms-powerpoint",
				new byte[] { 0x01, 0x02, 0x03 }
		);
		mockMvc.perform(multipart("/api/v1/materials")
						.file(legacyPpt)
						.param("title", "Legacy PPT")
						.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("MATERIAL_INVALID_FORMAT")));

		// Hoc sinh khong duoc phep upload giao trinh
		byte[] validPdf = createSamplePdf(1);
		MockMultipartFile validPart = new MockMultipartFile("file", "valid.pdf", MediaType.APPLICATION_PDF_VALUE, validPdf);
		mockMvc.perform(multipart("/api/v1/materials")
						.file(validPart)
						.param("title", "Student Upload")
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isForbidden());
	}
}
