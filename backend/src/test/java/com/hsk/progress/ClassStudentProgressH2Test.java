package com.hsk.progress;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import com.hsk.assignment.domain.SubmissionStatus;
import com.hsk.assignment.repository.AssignmentRepository;
import com.hsk.assignment.repository.AssignmentStudentOverrideRepository;
import com.hsk.assignment.repository.AssignmentSubmissionRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.content.domain.HskLevelEntity;
import com.hsk.content.domain.LessonEntity;
import com.hsk.content.domain.LessonVocabularyEntity;
import com.hsk.content.domain.VocabularyEntity;
import com.hsk.content.repository.GrammarExampleRepository;
import com.hsk.content.repository.GrammarPointRepository;
import com.hsk.content.repository.HskLevelRepository;
import com.hsk.content.repository.LessonRepository;
import com.hsk.content.repository.LessonVocabularyRepository;
import com.hsk.content.repository.VocabSetItemRepository;
import com.hsk.content.repository.VocabSetRepository;
import com.hsk.content.repository.VocabularyRepository;
import com.hsk.exercise.domain.ExerciseEntity;
import com.hsk.exercise.domain.ExerciseStatus;
import com.hsk.exercise.repository.ExerciseRepository;
import com.hsk.learning.domain.LessonProgressEntity;
import com.hsk.learning.repository.LessonProgressRepository;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for HTT-07-CN-006: Xem tiến độ của từng học sinh trong lớp (Teacher role).
 * Covers TC-01, TC-02, TC-03, TC-04 and QTN-01.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("h2")
class ClassStudentProgressH2Test {

	private static final String LOGIN_URL = "/api/v1/auth/login";
	private static final String PROGRESS_BASE_URL = "/api/progress/classes";
	private static final String TEACHER_1_EMAIL = "teacher1_prog@test.com";
	private static final String TEACHER_2_EMAIL = "teacher2_prog@test.com";
	private static final String STUDENT_A_EMAIL = "student_a_prog@test.com";
	private static final String STUDENT_B_EMAIL = "student_b_prog@test.com";
	private static final String STUDENT_OUTSIDER_EMAIL = "student_out_prog@test.com";
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
	private HskLevelRepository hskLevelRepository;

	@Autowired
	private LessonRepository lessonRepository;

	@Autowired
	private LessonProgressRepository lessonProgressRepository;

	@Autowired
	private LessonVocabularyRepository lessonVocabularyRepository;

	@Autowired
	private GrammarPointRepository grammarPointRepository;

	@Autowired
	private GrammarExampleRepository grammarExampleRepository;

	@Autowired
	private VocabSetItemRepository vocabSetItemRepository;

	@Autowired
	private VocabSetRepository vocabSetRepository;

	@Autowired
	private VocabularyRepository vocabularyRepository;

	@Autowired
	private ExerciseRepository exerciseRepository;

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
	private AssignmentStudentOverrideRepository assignmentStudentOverrideRepository;

	@Autowired
	private TeacherRequestRepository teacherRequestRepository;

	@Autowired
	private PasswordResetTokenRepository passwordResetTokenRepository;

	private UserEntity teacher1;
	private UserEntity teacher2;
	private UserEntity studentA;
	private UserEntity studentB;
	private UserEntity studentOutsider;

	private String teacher1Token;
	private String teacher2Token;
	private String studentAToken;

	private ClassEntity class1;
	private ClassEntity class2;

	private ExerciseEntity exercise;
	private HskLevelEntity hsk1;

	@BeforeEach
	void setUp() throws Exception {
		cleanDatabase();

		RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElseThrow();

		// 1. Tạo Giáo viên 1
		registrationService.registerStudent(new RegisterStudentRequest("Giáo Viên 1", TEACHER_1_EMAIL, PASSWORD, PASSWORD));
		teacher1 = userRepository.findByEmailIgnoreCase(TEACHER_1_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher1, teacherRole, null));

		// 2. Tạo Giáo viên 2
		registrationService.registerStudent(new RegisterStudentRequest("Giáo Viên 2", TEACHER_2_EMAIL, PASSWORD, PASSWORD));
		teacher2 = userRepository.findByEmailIgnoreCase(TEACHER_2_EMAIL).orElseThrow();
		userRoleRepository.save(UserRoleEntity.of(teacher2, teacherRole, null));

		// 3. Tạo Học sinh A, B và Học sinh ngoài lớp
		registrationService.registerStudent(new RegisterStudentRequest("Học sinh An", STUDENT_A_EMAIL, PASSWORD, PASSWORD));
		studentA = userRepository.findByEmailIgnoreCase(STUDENT_A_EMAIL).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Học sinh Bình", STUDENT_B_EMAIL, PASSWORD, PASSWORD));
		studentB = userRepository.findByEmailIgnoreCase(STUDENT_B_EMAIL).orElseThrow();

		registrationService.registerStudent(new RegisterStudentRequest("Học sinh Ngoài Lớp", STUDENT_OUTSIDER_EMAIL, PASSWORD, PASSWORD));
		studentOutsider = userRepository.findByEmailIgnoreCase(STUDENT_OUTSIDER_EMAIL).orElseThrow();

		// 4. Lấy tokens
		teacher1Token = loginAndGetToken(TEACHER_1_EMAIL, PASSWORD);
		teacher2Token = loginAndGetToken(TEACHER_2_EMAIL, PASSWORD);
		studentAToken = loginAndGetToken(STUDENT_A_EMAIL, PASSWORD);

		// 5. Tạo 2 lớp học
		class1 = classRepository.save(ClassEntity.create(teacher1, "Lớp HSK 1 - Sáng", "Mô tả", "CLS001"));
		class2 = classRepository.save(ClassEntity.create(teacher2, "Lớp HSK 2 - Chiều", "Mô tả", "CLS002"));

		// Học sinh An tham gia cả 2 lớp
		classMemberRepository.save(ClassMemberEntity.create(class1, studentA));
		classMemberRepository.save(ClassMemberEntity.create(class2, studentA));

		// Học sinh Bình chỉ tham gia Lớp 1
		classMemberRepository.save(ClassMemberEntity.create(class1, studentB));

		// 6. Tạo nội dung HSK
		hsk1 = hskLevelRepository.save(new HskLevelEntity("HSK_1", "HSK 1 - Cơ bản", 1, "Mô tả HSK 1", 150));

		// 7. Tạo bài tập mẫu
		exercise = exerciseRepository.save(new ExerciseEntity(teacher1.getId(), "Bài tập Ngữ pháp mẫu", "Mô tả", ExerciseStatus.READY));
	}

	@AfterEach
	void tearDown() {
		cleanDatabase();
	}

	private void cleanDatabase() {
		assignmentStudentOverrideRepository.deleteAll();
		assignmentSubmissionRepository.deleteAll();
		assignmentRepository.deleteAll();
		exerciseRepository.deleteAll();

		classJoinAttemptRepository.deleteAll();
		classMemberEventRepository.deleteAll();
		classMemberRepository.deleteAll();
		classRepository.deleteAll();

		lessonProgressRepository.deleteAll();
		grammarExampleRepository.deleteAll();
		grammarPointRepository.deleteAll();
		lessonVocabularyRepository.deleteAll();
		vocabSetItemRepository.deleteAll();
		vocabSetRepository.deleteAll();
		vocabularyRepository.deleteAll();
		lessonRepository.deleteAll();
		hskLevelRepository.deleteAll();

		teacherRequestRepository.deleteAll();
		passwordResetTokenRepository.deleteAll();
		userRoleRepository.deleteAll();
		userRepository.deleteAll();
	}

	private String loginAndGetToken(String email, String password) throws Exception {
		String body = String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password);
		MvcResult res = mockMvc.perform(post(LOGIN_URL)
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andReturn();
		JsonNode json = objectMapper.readTree(res.getResponse().getContentAsString(StandardCharsets.UTF_8));
		return json.get("token").asText();
	}

	@Test
	@DisplayName("HTT-07-CN-006-TC-01: Luồng thành công — Giáo viên xem tiến độ học sinh trong lớp")
	void testTC01_ClassStudentProgress_Success() throws Exception {
		// 1. Tạo 2 bài học HSK, học sinh An hoàn thành bài 1
		LessonEntity l1 = lessonRepository.save(new LessonEntity(hsk1, "Bài 1: Chào hỏi", "Desc", 1, null));
		LessonEntity l2 = lessonRepository.save(new LessonEntity(hsk1, "Bài 2: Gia đình", "Desc", 2, null));
		lessonProgressRepository.save(new LessonProgressEntity(studentA, l1));

		// 2. Giáo viên 1 tạo 2 bài tập trong lớp 1
		AssignmentEntity assign1 = new AssignmentEntity();
		assign1.setExercise(exercise);
		assign1.setClassroom(class1);
		assign1.setTeacher(teacher1);
		assign1.setTitle("Bài tập 1: Đại từ");
		assign1.setStartTime(Instant.now().minus(2, ChronoUnit.DAYS));
		assign1.setDueTime(Instant.now().plus(2, ChronoUnit.DAYS));
		assign1.setTotalPoints(BigDecimal.valueOf(10.0));
		assign1.setStatus(AssignmentStatus.ACTIVE);
		assign1.setSnapshotData("[]");
		assign1 = assignmentRepository.save(assign1);

		AssignmentEntity assign2 = new AssignmentEntity();
		assign2.setExercise(exercise);
		assign2.setClassroom(class1);
		assign2.setTeacher(teacher1);
		assign2.setTitle("Bài tập 2: Câu chữ Thị");
		assign2.setStartTime(Instant.now().minus(5, ChronoUnit.DAYS));
		assign2.setDueTime(Instant.now().minus(1, ChronoUnit.DAYS)); // Đã quá hạn
		assign2.setTotalPoints(BigDecimal.valueOf(10.0));
		assign2.setStatus(AssignmentStatus.ACTIVE);
		assign2.setSnapshotData("[]");
		assign2 = assignmentRepository.save(assign2);

		// 3. Học sinh An nộp bài tập 1 với điểm 8.5/10
		AssignmentSubmissionEntity sub1 = AssignmentSubmissionEntity.createAttempt(assign1, studentA, 1);
		sub1.setStatus(SubmissionStatus.SUBMITTED);
		sub1.setScore(BigDecimal.valueOf(8.5));
		sub1.setSubmittedAt(Instant.now().minus(1, ChronoUnit.DAYS));
		assignmentSubmissionRepository.save(sub1);

		// Học sinh An chưa nộp bài tập 2 -> Quá hạn (OVERDUE)

		// 4. Giáo viên 1 gọi API xem tiến độ của học sinh An
		String url = String.format("%s/%d/students/%d", PROGRESS_BASE_URL, class1.getId(), studentA.getId());

		mockMvc.perform(get(url)
						.header("Authorization", "Bearer " + teacher1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.classId", is(class1.getId().intValue())))
				.andExpect(jsonPath("$.studentId", is(studentA.getId().intValue())))
				.andExpect(jsonPath("$.studentName", is("Học sinh An")))
				.andExpect(jsonPath("$.studentEmail", is(STUDENT_A_EMAIL)))
				.andExpect(jsonPath("$.membershipStatus", is("ACTIVE")))
				.andExpect(jsonPath("$.hasActivity", is(true)))
				.andExpect(jsonPath("$.summary.totalAssignments", is(2)))
				.andExpect(jsonPath("$.summary.submittedAssignments", is(1)))
				.andExpect(jsonPath("$.summary.overdueAssignments", is(1)))
				.andExpect(jsonPath("$.summary.averageScorePercentage", is(85.0)))
				.andExpect(jsonPath("$.summary.completedLessonsCount", is(1)))
				.andExpect(jsonPath("$.assignments", hasSize(2)))
				.andExpect(jsonPath("$.completedLessons", hasSize(1)))
				.andExpect(jsonPath("$.completedLessons[0].lessonTitle", is("Bài 1: Chào hỏi")));
	}

	@Test
	@DisplayName("HTT-07-CN-006-TC-02: Cách ly dữ liệu giữa các lớp QTN-01 — Học sinh ở 2 lớp, GV chỉ thấy bài của lớp mình")
	void testTC02_ClassStudentProgress_ClassroomIsolation_QTN01() throws Exception {
		// Giáo viên 1 giao Assign 1 ở Lớp 1 (Điểm: 9.0/10)
		AssignmentEntity assign1 = new AssignmentEntity();
		assign1.setExercise(exercise);
		assign1.setClassroom(class1);
		assign1.setTeacher(teacher1);
		assign1.setTitle("Bài Lớp 1");
		assign1.setStartTime(Instant.now().minus(2, ChronoUnit.DAYS));
		assign1.setDueTime(Instant.now().plus(2, ChronoUnit.DAYS));
		assign1.setTotalPoints(BigDecimal.valueOf(10.0));
		assign1.setStatus(AssignmentStatus.ACTIVE);
		assign1.setSnapshotData("[]");
		assign1 = assignmentRepository.save(assign1);

		AssignmentSubmissionEntity sub1 = AssignmentSubmissionEntity.createAttempt(assign1, studentA, 1);
		sub1.setStatus(SubmissionStatus.SUBMITTED);
		sub1.setScore(BigDecimal.valueOf(9.0));
		sub1.setSubmittedAt(Instant.now().minus(1, ChronoUnit.DAYS));
		assignmentSubmissionRepository.save(sub1);

		// Giáo viên 2 giao Assign 2 ở Lớp 2 (Điểm: 4.0/10)
		AssignmentEntity assign2 = new AssignmentEntity();
		assign2.setExercise(exercise);
		assign2.setClassroom(class2);
		assign2.setTeacher(teacher2);
		assign2.setTitle("Bài Lớp 2");
		assign2.setStartTime(Instant.now().minus(2, ChronoUnit.DAYS));
		assign2.setDueTime(Instant.now().plus(2, ChronoUnit.DAYS));
		assign2.setTotalPoints(BigDecimal.valueOf(10.0));
		assign2.setStatus(AssignmentStatus.ACTIVE);
		assign2.setSnapshotData("[]");
		assign2 = assignmentRepository.save(assign2);

		AssignmentSubmissionEntity sub2 = AssignmentSubmissionEntity.createAttempt(assign2, studentA, 1);
		sub2.setStatus(SubmissionStatus.SUBMITTED);
		sub2.setScore(BigDecimal.valueOf(4.0));
		sub2.setSubmittedAt(Instant.now().minus(1, ChronoUnit.DAYS));
		assignmentSubmissionRepository.save(sub2);

		// Khi Giáo viên 1 xem tiến độ của An ở Lớp 1:
		String url = String.format("%s/%d/students/%d", PROGRESS_BASE_URL, class1.getId(), studentA.getId());

		mockMvc.perform(get(url)
						.header("Authorization", "Bearer " + teacher1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.summary.totalAssignments", is(1)))
				.andExpect(jsonPath("$.summary.submittedAssignments", is(1)))
				// Điểm trung bình chỉ tính theo lớp 1 là 90%, KHÔNG bị kéo xuống bởi bài 4.0 điểm của lớp 2
				.andExpect(jsonPath("$.summary.averageScorePercentage", is(90.0)))
				.andExpect(jsonPath("$.assignments", hasSize(1)))
				.andExpect(jsonPath("$.assignments[0].title", is("Bài Lớp 1")));
	}

	@Test
	@DisplayName("HTT-07-CN-006-TC-03: Dữ liệu rỗng — Học sinh mới chưa học hoặc nộp bài nào")
	void testTC03_ClassStudentProgress_EmptyData_NewStudent() throws Exception {
		// Học sinh Bình mới vào Lớp 1, chưa làm bài nào
		String url = String.format("%s/%d/students/%d", PROGRESS_BASE_URL, class1.getId(), studentB.getId());

		mockMvc.perform(get(url)
						.header("Authorization", "Bearer " + teacher1Token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.studentName", is("Học sinh Bình")))
				.andExpect(jsonPath("$.hasActivity", is(false)))
				.andExpect(jsonPath("$.summary.totalAssignments", is(0)))
				.andExpect(jsonPath("$.summary.submittedAssignments", is(0)))
				.andExpect(jsonPath("$.summary.averageScorePercentage", nullValue()))
				.andExpect(jsonPath("$.summary.completedLessonsCount", is(0)))
				.andExpect(jsonPath("$.assignments", hasSize(0)))
				.andExpect(jsonPath("$.completedLessons", hasSize(0)));
	}

	@Test
	@DisplayName("HTT-07-CN-006-TC-04: Kiểm soát quyền truy cập QTN-01 — Không có quyền")
	void testTC04_ClassStudentProgress_AccessControl_QTN01() throws Exception {
		// Case 1: Giáo viên 2 cố xem học sinh ở Lớp 1 (Lớp do Giáo viên 1 phụ trách) -> 403 FORBIDDEN
		String urlClass1 = String.format("%s/%d/students/%d", PROGRESS_BASE_URL, class1.getId(), studentA.getId());
		mockMvc.perform(get(urlClass1)
						.header("Authorization", "Bearer " + teacher2Token))
				.andExpect(status().isForbidden());

		// Case 2: Học sinh cố gọi API xem tiến độ -> 403 FORBIDDEN
		mockMvc.perform(get(urlClass1)
						.header("Authorization", "Bearer " + studentAToken))
				.andExpect(status().isForbidden());

		// Case 3: Giáo viên 1 xem học sinh ngoài lớp (studentOutsider không tham gia Lớp 1) -> 403 FORBIDDEN
		String urlOutsider = String.format("%s/%d/students/%d", PROGRESS_BASE_URL, class1.getId(), studentOutsider.getId());
		mockMvc.perform(get(urlOutsider)
						.header("Authorization", "Bearer " + teacher1Token))
				.andExpect(status().isForbidden());
	}
}
