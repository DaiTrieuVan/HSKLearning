package com.hsk.classroom.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.domain.ClassJoinAttemptEntity;
import com.hsk.classroom.domain.ClassMemberEntity;
import com.hsk.classroom.domain.ClassMemberEventEntity;
import com.hsk.classroom.domain.ClassMemberEventType;
import com.hsk.classroom.domain.ClassMemberStatus;
import com.hsk.classroom.domain.ClassStatus;
import com.hsk.classroom.dto.ClassMemberResponse;
import com.hsk.classroom.dto.ClassResponse;
import com.hsk.classroom.dto.CreateClassCommand;
import com.hsk.classroom.dto.JoinClassCommand;
import com.hsk.classroom.dto.UpdateClassCommand;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;
import com.hsk.classroom.repository.ClassMemberEventRepository;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import com.hsk.common.audit.AuditLogService;

/**
 * HTT-02: Toàn bộ nghiệp vụ quản lý lớp học và thành viên (QTN-01 đến QTN-06).
 */
@Service
public class ClassroomService {

	// Bộ ký tự sinh mã lớp 6 ký tự (loại bỏ 0, O, 1, I để tránh nhầm lẫn)
	private static final String CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
	private static final int CODE_LENGTH = 6;
	private static final SecureRandom RANDOM = new SecureRandom();

	private final ClassRepository classRepository;
	private final ClassMemberRepository classMemberRepository;
	private final ClassMemberEventRepository classMemberEventRepository;
	private final ClassJoinAttemptService classJoinAttemptService;
	private final UserRepository userRepository;
	private final UserRoleRepository userRoleRepository;
	private final AuditLogService auditLogService;

	public ClassroomService(
			ClassRepository classRepository,
			ClassMemberRepository classMemberRepository,
			ClassMemberEventRepository classMemberEventRepository,
			ClassJoinAttemptService classJoinAttemptService,
			UserRepository userRepository,
			UserRoleRepository userRoleRepository,
			AuditLogService auditLogService) {
		this.classRepository = classRepository;
		this.classMemberRepository = classMemberRepository;
		this.classMemberEventRepository = classMemberEventRepository;
		this.classJoinAttemptService = classJoinAttemptService;
		this.userRepository = userRepository;
		this.userRoleRepository = userRoleRepository;
		this.auditLogService = auditLogService;
	}

	/**
	 * HTT-02-CN-001: Giáo viên tạo lớp học mới, sinh join_code 6 ký tự duy nhất (QTN-04).
	 */
	@Transactional
	public ClassResponse createClass(String teacherEmail, CreateClassCommand command) {
		UserEntity teacher = findUser(teacherEmail);
		assertIsTeacherOrAdmin(teacher.getId());

		String joinCode = generateUniqueJoinCode();
		ClassEntity classroom = ClassEntity.create(
				teacher,
				command.title().trim(),
				command.description() != null ? command.description().trim() : null,
				joinCode
		);
		ClassEntity saved = classRepository.save(classroom);

		auditLogService.record(
				teacher,
				"CREATE_CLASS",
				"CLASS",
				saved.getId().toString(),
				"Giáo viên " + teacher.getEmail() + " đã tạo lớp học: " + saved.getTitle() + " (Mã: " + joinCode + ")"
		);

		return ClassResponse.of(saved, 0);
	}

	/**
	 * HTT-02-CN-002: Cập nhật thông tin lớp học (QTN-01).
	 */
	@Transactional
	public ClassResponse updateClass(String teacherEmail, Long classId, UpdateClassCommand command) {
		UserEntity teacher = findUser(teacherEmail);
		ClassEntity classroom = findClass(classId);
		assertTeacherOwnerOrAdmin(teacher, classroom);

		if (classroom.isArchived()) {
			throw new ApiException(ApiErrorCode.CLASS_ALREADY_ARCHIVED);
		}

		classroom.updateInfo(
				command.title().trim(),
				command.description() != null ? command.description().trim() : null
		);
		classRepository.save(classroom);

		auditLogService.record(
				teacher,
				"UPDATE_CLASS",
				"CLASS",
				classId.toString(),
				"Cập nhật thông tin lớp học: " + classroom.getTitle()
		);

		long memberCount = classMemberRepository.countByClassroom_IdAndStatus(classId, ClassMemberStatus.ACTIVE);
		return ClassResponse.of(classroom, memberCount);
	}

	/**
	 * HTT-02-CN-002: Lưu trữ lớp học sang ARCHIVED (QTN-01).
	 */
	@Transactional
	public ClassResponse archiveClass(String teacherEmail, Long classId) {
		UserEntity teacher = findUser(teacherEmail);
		ClassEntity classroom = findClass(classId);
		assertTeacherOwnerOrAdmin(teacher, classroom);

		classroom.archive();
		classRepository.save(classroom);

		auditLogService.record(
				teacher,
				"ARCHIVE_CLASS",
				"CLASS",
				classId.toString(),
				"Lưu trữ lớp học: " + classroom.getTitle()
		);

		long memberCount = classMemberRepository.countByClassroom_IdAndStatus(classId, ClassMemberStatus.ACTIVE);
		return ClassResponse.of(classroom, memberCount);
	}

	/**
	 * HTT-02-CN-004: Danh sách lớp học do giáo viên phụ trách (kèm sĩ số).
	 */
	@Transactional(readOnly = true)
	public List<ClassResponse> getTeacherClasses(String teacherEmail) {
		UserEntity teacher = findUser(teacherEmail);
		List<ClassEntity> classes = classRepository.findByTeacher_IdOrderByCreatedAtDesc(teacher.getId());

		return classes.stream().map(c -> {
			long count = classMemberRepository.countByClassroom_IdAndStatus(c.getId(), ClassMemberStatus.ACTIVE);
			return ClassResponse.of(c, count);
		}).toList();
	}

	/**
	 * HTT-02-CN-003: Học sinh tham gia lớp học bằng mã (QTN-05 & QTN-06).
	 */
	@Transactional
	public ClassResponse joinClass(String studentEmail, JoinClassCommand command) {
		UserEntity student = findUser(studentEmail);
		String normalizedCode = command.code().trim().toUpperCase();

		// QTN-05: Chống dò mã lớp - Giới hạn 10 lần sai trong 1 giờ
		Instant oneHourAgo = Instant.now().minus(1, ChronoUnit.HOURS);
		long failedAttempts = classJoinAttemptService.countFailedAttemptsSince(student.getId(), oneHourAgo);
		if (failedAttempts >= 10) {
			throw new ApiException(ApiErrorCode.CLASS_JOIN_RATE_LIMITED);
		}

		ClassEntity classroom = classRepository.findByJoinCode(normalizedCode).orElse(null);
		if (classroom == null) {
			classJoinAttemptService.recordAttempt(student, normalizedCode, false);
			throw new ApiException(ApiErrorCode.INVALID_JOIN_CODE);
		}

		if (classroom.isArchived()) {
			throw new ApiException(ApiErrorCode.CLASS_ALREADY_ARCHIVED);
		}

		// Kiểm tra trạng thái thành viên hiện tại
		ClassMemberEntity member = classMemberRepository.findByClassroom_IdAndStudent_Id(classroom.getId(), student.getId())
				.orElse(null);

		if (member != null && member.getStatus() == ClassMemberStatus.ACTIVE) {
			throw new ApiException(ApiErrorCode.ALREADY_CLASS_MEMBER);
		}

		if (member != null) {
			// Từng tham gia nhưng đã rời hoặc bị xóa -> kích hoạt lại
			member.restore();
			classMemberRepository.save(member);
		} else {
			ClassMemberEntity newMember = ClassMemberEntity.create(classroom, student);
			classMemberRepository.save(newMember);
		}

		// Ghi nhận nhật ký sự kiện thành viên (QTN-06)
		classMemberEventRepository.save(ClassMemberEventEntity.of(
				classroom, student, student, ClassMemberEventType.JOINED, "Tham gia lớp học qua mã: " + normalizedCode
		));

		// Ghi nhận nỗ lực thành công
		classJoinAttemptService.recordAttempt(student, normalizedCode, true);

		auditLogService.record(
				student,
				"JOIN_CLASS",
				"CLASS",
				classroom.getId().toString(),
				"Học sinh " + student.getEmail() + " tham gia lớp: " + classroom.getTitle()
		);

		long memberCount = classMemberRepository.countByClassroom_IdAndStatus(classroom.getId(), ClassMemberStatus.ACTIVE);
		return ClassResponse.of(classroom, memberCount);
	}

	/**
	 * HTT-02-CN-005: Xem danh sách các lớp học sinh đã tham gia (QTN-02).
	 */
	@Transactional(readOnly = true)
	public List<ClassResponse> getEnrolledClasses(String studentEmail) {
		UserEntity student = findUser(studentEmail);
		List<ClassEntity> classes = classRepository.findEnrolledClassesByStudentId(student.getId());

		return classes.stream().map(c -> {
			long count = classMemberRepository.countByClassroom_IdAndStatus(c.getId(), ClassMemberStatus.ACTIVE);
			return ClassResponse.of(c, count);
		}).toList();
	}

	/**
	 * HTT-02-CN-006: Xem danh sách thành viên lớp học (QTN-01).
	 */
	@Transactional(readOnly = true)
	public List<ClassMemberResponse> getClassMembers(String callerEmail, Long classId, ClassMemberStatus statusFilter) {
		UserEntity caller = findUser(callerEmail);
		ClassEntity classroom = findClass(classId);
		assertTeacherOwnerOrAdmin(caller, classroom);

		List<ClassMemberEntity> members = (statusFilter != null)
				? classMemberRepository.findByClassroom_IdAndStatusOrderByJoinedAtDesc(classId, statusFilter)
				: classMemberRepository.findByClassroom_IdOrderByJoinedAtDesc(classId);

		return members.stream().map(ClassMemberResponse::from).toList();
	}

	/**
	 * HTT-02-CN-007: Xóa học sinh khỏi lớp (QTN-06).
	 */
	@Transactional
	public void removeStudentFromClass(String teacherEmail, Long classId, Long studentId, String reason) {
		UserEntity teacher = findUser(teacherEmail);
		ClassEntity classroom = findClass(classId);
		assertTeacherOwnerOrAdmin(teacher, classroom);

		if (classroom.isArchived()) {
			throw new ApiException(ApiErrorCode.CLASS_ALREADY_ARCHIVED);
		}

		ClassMemberEntity member = classMemberRepository.findByClassroom_IdAndStudent_Id(classId, studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.NOT_CLASS_MEMBER));

		if (member.getStatus() != ClassMemberStatus.ACTIVE) {
			throw new ApiException(ApiErrorCode.NOT_CLASS_MEMBER);
		}

		member.remove();
		classMemberRepository.save(member);

		classMemberEventRepository.save(ClassMemberEventEntity.of(
				classroom, member.getStudent(), teacher, ClassMemberEventType.REMOVED, reason
		));

		auditLogService.record(
				teacher,
				"REMOVE_STUDENT",
				"CLASS",
				classId.toString(),
				"Giáo viên đã xóa học sinh " + member.getStudent().getEmail() + " khỏi lớp. Lý do: " + reason
		);
	}

	/**
	 * HTT-02-CN-009: Khôi phục học sinh đã bị xóa về lớp (QTN-01 & QTN-06).
	 */
	@Transactional
	public void restoreStudentToClass(String teacherEmail, Long classId, Long studentId) {
		UserEntity teacher = findUser(teacherEmail);
		ClassEntity classroom = findClass(classId);
		assertTeacherOwnerOrAdmin(teacher, classroom);

		if (classroom.isArchived()) {
			throw new ApiException(ApiErrorCode.CLASS_ALREADY_ARCHIVED);
		}

		ClassMemberEntity member = classMemberRepository.findByClassroom_IdAndStudent_Id(classId, studentId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.NOT_CLASS_MEMBER));

		member.restore();
		classMemberRepository.save(member);

		classMemberEventRepository.save(ClassMemberEventEntity.of(
				classroom, member.getStudent(), teacher, ClassMemberEventType.RESTORED, "Khôi phục lại bởi giáo viên"
		));

		auditLogService.record(
				teacher,
				"RESTORE_STUDENT",
				"CLASS",
				classId.toString(),
				"Khôi phục học sinh " + member.getStudent().getEmail() + " vào lớp học"
		);
	}

	/**
	 * HTT-02-CN-008: Học sinh tự rời khỏi lớp (QTN-05 & QTN-06).
	 */
	@Transactional
	public void leaveClass(String studentEmail, Long classId) {
		UserEntity student = findUser(studentEmail);
		ClassEntity classroom = findClass(classId);

		if (classroom.isArchived()) {
			throw new ApiException(ApiErrorCode.CLASS_ALREADY_ARCHIVED);
		}

		ClassMemberEntity member = classMemberRepository.findByClassroom_IdAndStudent_Id(classId, student.getId())
				.orElseThrow(() -> new ApiException(ApiErrorCode.NOT_CLASS_MEMBER));

		if (member.getStatus() != ClassMemberStatus.ACTIVE) {
			throw new ApiException(ApiErrorCode.NOT_CLASS_MEMBER);
		}

		member.leave();
		classMemberRepository.save(member);

		classMemberEventRepository.save(ClassMemberEventEntity.of(
				classroom, student, student, ClassMemberEventType.LEFT, "Học sinh chủ động rời lớp"
		));

		auditLogService.record(
				student,
				"LEAVE_CLASS",
				"CLASS",
				classId.toString(),
				"Học sinh " + student.getEmail() + " đã rời lớp " + classroom.getTitle()
		);
	}

	// -------------------------------------------------------------------------
	// Helpers & Guards
	// -------------------------------------------------------------------------

	private String generateUniqueJoinCode() {
		for (int attempt = 0; attempt < 10; attempt++) {
			StringBuilder sb = new StringBuilder(CODE_LENGTH);
			for (int i = 0; i < CODE_LENGTH; i++) {
				sb.append(CODE_ALPHABET.charAt(RANDOM.nextInt(CODE_ALPHABET.length())));
			}
			String code = sb.toString();
			if (!classRepository.existsByJoinCode(code)) {
				return code;
			}
		}
		throw new ApiException(ApiErrorCode.INTERNAL_ERROR, "Không thể sinh mã lớp duy nhất, vui lòng thử lại");
	}

	private UserEntity findUser(String email) {
		return userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
	}

	private ClassEntity findClass(Long classId) {
		return classRepository.findById(classId)
				.orElseThrow(() -> new ApiException(ApiErrorCode.CLASS_NOT_FOUND));
	}

	private void assertIsTeacherOrAdmin(Long userId) {
		boolean isTeacher = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.TEACHER);
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(userId, RoleCode.ADMIN);
		if (!isTeacher && !isAdmin) {
			throw new ApiException(ApiErrorCode.TEACHER_ROLE_NOT_GRANTED);
		}
	}

	private void assertTeacherOwnerOrAdmin(UserEntity caller, ClassEntity classroom) {
		boolean isAdmin = userRoleRepository.existsByUser_IdAndRole_Code(caller.getId(), RoleCode.ADMIN);
		if (!classroom.getTeacher().getId().equals(caller.getId()) && !isAdmin) {
			throw new ApiException(ApiErrorCode.FORBIDDEN);
		}
	}
}
