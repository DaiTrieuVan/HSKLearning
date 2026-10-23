package com.hsk.question;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.audit.AuditLogRepository;
import com.hsk.question.domain.QuestionEntity;
import com.hsk.question.domain.QuestionType;
import com.hsk.question.repository.QuestionOptionRepository;
import com.hsk.question.repository.QuestionRepository;
import java.nio.charset.StandardCharsets;
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

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class QuestionImportH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String IMPORT_URL = "/api/questions/import";
	private static final String TEACHER_EMAIL = "teacher_import_q@test.com";
	private static final String STUDENT_EMAIL = "student_import_q@test.com";
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
	private QuestionRepository questionRepository;

	@Autowired
	private QuestionOptionRepository questionOptionRepository;

	private UserEntity teacherUser;
	private String teacherToken;

	private UserEntity studentUser;
	private String studentToken;

	@BeforeEach
	void setUp() throws Exception {
		tearDown();

		// 1. Create Teacher
		registrationService.registerStudent(
				new RegisterStudentRequest("Cô Giáo Import", TEACHER_EMAIL, PASSWORD, PASSWORD));
		teacherUser = userRepository.findByEmailIgnoreCase(TEACHER_EMAIL).orElseThrow();
		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacherUser, teacherRole, null));
		teacherToken = login(TEACHER_EMAIL, PASSWORD);

		// 2. Create Student
		registrationService.registerStudent(
				new RegisterStudentRequest("Học Sinh Test", STUDENT_EMAIL, PASSWORD, PASSWORD));
		studentUser = userRepository.findByEmailIgnoreCase(STUDENT_EMAIL).orElseThrow();
		studentToken = login(STUDENT_EMAIL, PASSWORD);
	}

	@AfterEach
	void tearDown() {
		questionOptionRepository.deleteAll();
		questionRepository.deleteAll();
		auditLogRepository.deleteAll();
		classJoinAttemptRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();
		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String login(String email, String password) throws Exception {
		String payload = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}";
		MvcResult result = mockMvc.perform(post(LOGIN_URL)
				.contentType(MediaType.APPLICATION_JSON)
				.content(payload))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode node = objectMapper.readTree(result.getResponse().getContentAsString());
		return node.get("token").asText();
	}

	@Test
	@DisplayName("Should import all four question types (MCQ, FILL, MATCH, ORDER) from CSV successfully")
	void shouldImportAllFourQuestionTypesFromCsvSuccessfully() throws Exception {
		String csvContent = """
				type,content,option_a_or_data,option_b,option_c,option_d,correct_answer,explanation
				MCQ,"Từ ""苹果"" (píngguǒ) có nghĩa là gì?",Quả táo,Quả chuối,Quả cam,Quả dưa,A,"Nghĩa là quả táo."
				FILL,我想喝一___咖啡。,杯,,,,,杯 là lượng từ.
				MATCH,Nối từ vựng với nghĩa tương ứng:,"咖啡: Cà phê | 茶: Trà | 牛奶: Sữa",,,,,"Từ vựng đồ uống."
				ORDER,Hãy sắp xếp câu sau:,我 | 喜欢 | 吃 | 苹果,,,,,Chủ ngữ + Vị ngữ + Tân ngữ.
				""";

		MockMultipartFile file = new MockMultipartFile(
				"file",
				"questions.csv",
				"text/csv",
				csvContent.getBytes(StandardCharsets.UTF_8)
		);

		mockMvc.perform(multipart(IMPORT_URL)
				.file(file)
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.totalRows", is(4)))
				.andExpect(jsonPath("$.successCount", is(4)))
				.andExpect(jsonPath("$.skippedCount", is(0)))
				.andExpect(jsonPath("$.importedQuestions", hasSize(4)));

		List<QuestionEntity> saved = questionRepository.findByOwnerIdAndIsHiddenFalseOrderByCreatedAtDesc(teacherUser.getId());
		assertEquals(4, saved.size());

		long mcqCount = saved.stream().filter(q -> q.getType() == QuestionType.MCQ).count();
		long fillCount = saved.stream().filter(q -> q.getType() == QuestionType.FILL).count();
		long matchCount = saved.stream().filter(q -> q.getType() == QuestionType.MATCH).count();
		long orderCount = saved.stream().filter(q -> q.getType() == QuestionType.ORDER).count();

		assertEquals(1, mcqCount);
		assertEquals(1, fillCount);
		assertEquals(1, matchCount);
		assertEquals(1, orderCount);
	}

	@Test
	@DisplayName("Should skip invalid rows and record detailed error messages")
	void shouldSkipInvalidRowsAndRecordDetailedErrors() throws Exception {
		String csvContent = """
				type,content,option_a_or_data,option_b,option_c,option_d,correct_answer,explanation
				UNKNOWN,Câu hỏi không rõ loại,A,B,C,D,A,
				MCQ,Câu trắc nghiệm thiếu đáp án đúng,Lựa chọn 1,Lựa chọn 2,,,E,
				FILL,Câu điền từ nhưng không có chỗ trống,đáp án,,,,,
				MCQ,Câu trắc nghiệm hợp lệ,Hà Nội,Bắc Kinh,Tokyo,Seoul,B,Thủ đô Trung Quốc
				""";

		MockMultipartFile file = new MockMultipartFile(
				"file",
				"questions_with_errors.csv",
				"text/csv",
				csvContent.getBytes(StandardCharsets.UTF_8)
		);

		mockMvc.perform(multipart(IMPORT_URL)
				.file(file)
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.totalRows", is(4)))
				.andExpect(jsonPath("$.successCount", is(1)))
				.andExpect(jsonPath("$.skippedCount", is(3)))
				.andExpect(jsonPath("$.errors", hasSize(3)))
				.andExpect(jsonPath("$.importedQuestions", hasSize(1)));

		List<QuestionEntity> saved = questionRepository.findByOwnerIdAndIsHiddenFalseOrderByCreatedAtDesc(teacherUser.getId());
		assertEquals(1, saved.size());
		assertEquals("Câu trắc nghiệm hợp lệ", saved.get(0).getContent());
	}

	@Test
	@DisplayName("Should download question templates for Excel and CSV")
	void shouldDownloadQuestionTemplates() throws Exception {
		// 1. Download Excel template
		mockMvc.perform(get("/api/questions/template/excel")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(header().string("Content-Disposition", containsString("HSK_Question_Import_Template.xlsx")));

		// 2. Download CSV template
		mockMvc.perform(get("/api/questions/template/csv")
				.header("Authorization", "Bearer " + teacherToken))
				.andExpect(status().isOk())
				.andExpect(header().string("Content-Disposition", containsString("HSK_Question_Import_Template.csv")));
	}

	@Test
	@DisplayName("Should forbid student from importing questions")
	void shouldForbidStudentFromImportingQuestions() throws Exception {
		MockMultipartFile file = new MockMultipartFile(
				"file",
				"test.csv",
				"text/csv",
				"MCQ,Nội dung,A,B,,,A,".getBytes(StandardCharsets.UTF_8)
		);

		mockMvc.perform(multipart(IMPORT_URL)
				.file(file)
				.header("Authorization", "Bearer " + studentToken))
				.andExpect(status().isForbidden());
	}
}
