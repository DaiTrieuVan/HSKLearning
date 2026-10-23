package com.hsk.progress;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import com.hsk.assignment.domain.AssignmentEntity;
import com.hsk.assignment.domain.AssignmentStatus;
import com.hsk.assignment.domain.AssignmentSubmissionEntity;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentStudentOverrideRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.repository.ExerciseRepository;
import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

/**
 * Integration Test suite cho User Story HTT-07-CN-007: Xuất bảng điểm lớp ra Excel (.xlsx).
 * Bao phủ các test cases: TC-01 đến TC-06.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ClassGradebookExportH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String EXPORT_URL = "/api/progress/classes/{classId}/gradebook/export";
	private static final String TEACHER_EMAIL = "teacher_exp@test.com";
	private static final String OTHER_TEACHER_EMAIL = "other_teacher_exp@test.com";
	private static final String STUDENT_A_EMAIL = "student_a_exp@test.com";
	private static final String STUDENT_B_EMAIL = "student_b_exp@test.com";
	private static final String PASSWORD = "Password123";

	@Autowired
	private MockMvc mockMvc;

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private RegistrationService registrationService;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	@Autowired
	private ClassRepository classRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private ClassMemberEventRepository classMemberEventRepository;

	@Autowired
	private ClassJoinAttemptRepository classJoinAttemptRepository;

	@Autowired
	private AssignmentRepository assignmentRepository;

	@Autowired
	private AssignmentSubmissionRepository assignmentSubmissionRepository;

	@Autowired
	private AssignmentStudentOverrideRepository overrideRepository;

	@Autowired
	private ExerciseRepository exerciseRepository;

	private UserEntity teacher;
	private UserEntity otherTeacher;
	private UserEntity studentA;
	private UserEntity studentB;

	private String teacherToken;
	private String otherTeacherToken;
	private String studentAToken;

	private ClassEntity classroom;
	private ClassEntity otherClassroom;
	private ExerciseEntity exercise;
	private AssignmentEntity assignment1;
	private AssignmentEntity assignment2;

	@BeforeEach
	void setUp() throws Exception {
		cleanDatabase();

		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Teacher Main", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacher = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher, teacherRole, null));

		registrationService.registerStudent(new RegisterStudentRequest("Other Teacher", OTHER_TEACHER_EMAIL, PASSWORD, PASSWORD));
		otherTeacher = userRepository.findByEmailIgnoreCase(OTHER_TEACHER_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(otherTeacher, teacherRole, null));

		// studentA có tên bắt đầu bằng '=' để test formula injection escaping
		registrationService.registerStudent(new RegisterStudentRequest("=CMD() Student", STUDENT_A_EMAIL, PASSWORD, PASSWORD));
		studentA = userRepository.findByEmailIgnoreCase(STUDENT_A_EMAIL).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Student Normal B", STUDENT_B_EMAIL, PASSWORD, PASSWORD));
		studentB = userRepository.findByEmailIgnoreCase(STUDENT_B_EMAIL).orElseThrow();

		teacherToken = loginAndGetToken(TEACHER_EMAIL, PASSWORD);
		otherTeacherToken = loginAndGetToken(OTHER_TEACHER_EMAIL, PASSWORD);
		studentAToken = loginAndGetToken(STUDENT_A_EMAIL, PASSWORD);

		classroom = classRepository.save(ClassEntity.create(teacher, "HSK 4 Tối 2-4-6", "Mô tả lớp", "EXP101"));
		otherClassroom = classRepository.save(ClassEntity.create(otherTeacher, "Lớp Khác", "Mô tả lớp", "EXP999"));

		// Thêm thành viên
		classMemberRepository.save(ClassMemberEntity.create(classroom, studentA));
		ClassMemberEntity memberB = classMemberRepository.save(ClassMemberEntity.create(classroom, studentB));
		memberB.leave();
		classMemberRepository.save(memberB);

		exercise = exerciseRepository.save(new ExerciseEntity(teacher.getId(), "Bài luyện HSK 4", "Desc", ExerciseStatus.READY));

		// Assignment 1: Tạo 5 ngày trước, tiêu đề có formula injection prefix
		assignment1 = assignmentRepository.save(new AssignmentEntity(
				exercise,
				classroom,
				teacher,
				"+Formula Assignment 1",
				"Desc 1",
				Instant.now().minus(5, ChronoUnit.DAYS),
				Instant.now().plus(2, ChronoUnit.DAYS),
				BigDecimal.valueOf(10.0),
				AssignmentStatus.ACTIVE,
				"{}"
		));

		// Assignment 2: Tạo 2 ngày trước
		assignment2 = assignmentRepository.save(new AssignmentEntity(
				exercise,
				classroom,
				teacher,
				"Bài tập ngữ pháp 2",
				"Desc 2",
				Instant.now().minus(2, ChronoUnit.DAYS),
				Instant.now().plus(5, ChronoUnit.DAYS),
				BigDecimal.valueOf(10.0),
				AssignmentStatus.ACTIVE,
				"{}"
		));

		// Student A nộp cả 2 bài: bài 1 (8.5), bài 2 (9.0)
		AssignmentSubmissionEntity subA1 = AssignmentSubmissionEntity.createAttempt(assignment1, studentA, 1);
		subA1.submit(BigDecimal.valueOf(8.5), "{}");
		assignmentSubmissionRepository.save(subA1);

		AssignmentSubmissionEntity subA2 = AssignmentSubmissionEntity.createAttempt(assignment2, studentA, 1);
		subA2.submit(BigDecimal.valueOf(9.0), "{}");
		assignmentSubmissionRepository.save(subA2);

		// Student B chỉ nộp bài 1: 7.0
		AssignmentSubmissionEntity subB1 = AssignmentSubmissionEntity.createAttempt(assignment1, studentB, 1);
		subB1.submit(BigDecimal.valueOf(7.0), "{}");
		assignmentSubmissionRepository.save(subB1);
	}

	@AfterEach
	void tearDown() {
		cleanDatabase();
	}

	private void cleanDatabase() {
		assignmentSubmissionRepository.deleteAll();
		overrideRepository.deleteAll();
		assignmentRepository.deleteAll();
		exerciseRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		String body = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
		MvcResult result = mockMvc.perform(
				org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(body)
		).andExpect(status().isOk()).andReturn();

		JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString(StandardCharsets.UTF_8));
		return node.get("token").asText();
	}

	@Test
	@DisplayName("TC-01: Giáo viên xuất file Excel toàn bộ bảng điểm lớp thành công (HTTP 200, format XLSX)")
	void testExportClassGradebook_Success() throws Exception {
		MvcResult result = mockMvc.perform(
				get(EXPORT_URL, classroom.getId())
						.header("Authorization", "Bearer " + teacherToken)
		)
				.andExpect(status().isOk())
				.andExpect(header().string("Content-Disposition", "attachment; filename=\"bang_diem_lop_" + classroom.getId() + ".xlsx\""))
				.andReturn();

		byte[] content = result.getResponse().getContentAsByteArray();
		assertTrue(content.length > 0);

		try (Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(content))) {
			assertEquals(1, workbook.getNumberOfSheets());
			Sheet sheet = workbook.getSheetAt(0);
			assertEquals("Bảng điểm lớp", sheet.getSheetName());

			// Dòng 1: Tiêu đề lớp
			Row titleRow = sheet.getRow(0);
			assertNotNull(titleRow);
			assertTrue(titleRow.getCell(0).getStringCellValue().contains("HSK 4 Tối 2-4-6"));

			// Dòng 4: Header (STT, HỌ VÀ TÊN, EMAIL, TRẠNG THÁI, BT1, BT2, ĐIỂM TRUNG BÌNH (%))
			Row headerRow = sheet.getRow(3);
			assertNotNull(headerRow);
			assertEquals("STT", headerRow.getCell(0).getStringCellValue());
			assertEquals("HỌ VÀ TÊN", headerRow.getCell(1).getStringCellValue());
			assertEquals("EMAIL", headerRow.getCell(2).getStringCellValue());
			assertEquals("TRẠNG THÁI", headerRow.getCell(3).getStringCellValue());
			assertTrue(headerRow.getCell(4).getStringCellValue().contains("Formula Assignment 1"));
			assertTrue(headerRow.getCell(5).getStringCellValue().contains("Bài tập ngữ pháp 2"));
			assertEquals("ĐIỂM TRUNG BÌNH (%)", headerRow.getCell(6).getStringCellValue());

			// Kiểm tra dữ liệu học sinh
			Row studentRow1 = sheet.getRow(4);
			assertNotNull(studentRow1);
			assertTrue(studentRow1.getCell(1).getStringCellValue().contains("=CMD() Student"));

			// Điểm bài 1 của Sinh viên A: 8.5 (Numeric)
			assertEquals(CellType.NUMERIC, studentRow1.getCell(4).getCellType());
			assertEquals(8.5, studentRow1.getCell(4).getNumericCellValue(), 0.01);

			// Điểm bài 2 của Sinh viên A: 9.0 (Numeric)
			assertEquals(CellType.NUMERIC, studentRow1.getCell(5).getCellType());
			assertEquals(9.0, studentRow1.getCell(5).getNumericCellValue(), 0.01);

			// Sinh viên B: đã rời lớp
			Row studentRow2 = sheet.getRow(5);
			assertNotNull(studentRow2);
			assertEquals("Tự rời lớp", studentRow2.getCell(3).getStringCellValue());
			// Điểm bài 1 của Sinh viên B: 7.0 (Numeric)
			assertEquals(CellType.NUMERIC, studentRow2.getCell(4).getCellType());
			assertEquals(7.0, studentRow2.getCell(4).getNumericCellValue(), 0.01);
			// Điểm bài 2 của Sinh viên B: chưa nộp -> "-"
			assertEquals("-", studentRow2.getCell(5).getStringCellValue());
		}
	}

	@Test
	@DisplayName("TC-02: Xuất bảng điểm với bộ lọc ngày hợp lệ (chỉ xuất bài tập trong khoảng)")
	void testExportClassGradebook_WithDateFilter() throws Exception {
		// Khoảng thời gian chỉ bao gồm bài tập 1 (3 ngày trước đến 6 ngày trước)
		Instant startDate = Instant.now().minus(6, ChronoUnit.DAYS);
		Instant endDate = Instant.now().minus(3, ChronoUnit.DAYS);

		MvcResult result = mockMvc.perform(
				get(EXPORT_URL, classroom.getId())
						.param("startDate", startDate.toString())
						.param("endDate", endDate.toString())
						.header("Authorization", "Bearer " + teacherToken)
		)
				.andExpect(status().isOk())
				.andReturn();

		byte[] content = result.getResponse().getContentAsByteArray();
		try (Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(content))) {
			Sheet sheet = workbook.getSheetAt(0);
			Row headerRow = sheet.getRow(3);
			// Chỉ có 1 cột bài tập (assignment 1), cột tiếp theo là ĐIỂM TRUNG BÌNH (%)
			assertTrue(headerRow.getCell(4).getStringCellValue().contains("Formula Assignment 1"));
			assertEquals("ĐIỂM TRUNG BÌNH (%)", headerRow.getCell(5).getStringCellValue());
		}
	}

	@Test
	@DisplayName("TC-03: Ngày bắt đầu lớn hơn ngày kết thúc trả về HTTP 400 (INVALID_DATE_RANGE)")
	void testExportClassGradebook_InvalidDateRange() throws Exception {
		Instant startDate = Instant.now().plus(1, ChronoUnit.DAYS);
		Instant endDate = Instant.now().minus(1, ChronoUnit.DAYS);

		mockMvc.perform(
				get(EXPORT_URL, classroom.getId())
						.param("startDate", startDate.toString())
						.param("endDate", endDate.toString())
						.header("Authorization", "Bearer " + teacherToken)
		)
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("INVALID_DATE_RANGE")));
	}

	@Test
	@DisplayName("TC-04: Không có bài tập nào trong khoảng thời gian đã lọc trả về HTTP 400 (NO_DATA_FOR_PERIOD)")
	void testExportClassGradebook_NoDataForPeriod() throws Exception {
		Instant startDate = Instant.now().minus(30, ChronoUnit.DAYS);
		Instant endDate = Instant.now().minus(20, ChronoUnit.DAYS);

		mockMvc.perform(
				get(EXPORT_URL, classroom.getId())
						.param("startDate", startDate.toString())
						.param("endDate", endDate.toString())
						.header("Authorization", "Bearer " + teacherToken)
		)
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.code", is("NO_DATA_FOR_PERIOD")));
	}

	@Test
	@DisplayName("TC-05: Bảo mật QTN-01 - Giáo viên không phụ trách lớp bị chặn 403 Forbidden")
	void testExportClassGradebook_TeacherUnauthorized() throws Exception {
		mockMvc.perform(
				get(EXPORT_URL, classroom.getId())
						.header("Authorization", "Bearer " + otherTeacherToken)
		)
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("FORBIDDEN")));
	}

	@Test
	@DisplayName("TC-06: Bảo mật QTN-01 - Học sinh truy cập export bảng điểm bị chặn 403 Forbidden")
	void testExportClassGradebook_StudentForbidden() throws Exception {
		mockMvc.perform(
				get(EXPORT_URL, classroom.getId())
						.header("Authorization", "Bearer " + studentAToken)
		)
				.andExpect(status().isForbidden())
				.andExpect(jsonPath("$.code", is("FORBIDDEN")));
	}
}
