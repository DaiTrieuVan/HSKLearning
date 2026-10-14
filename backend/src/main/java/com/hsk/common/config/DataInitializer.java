package com.hsk.common.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.RoleEntity;
import com.hsk.account.domain.UiMode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.domain.UserRoleEntity;
import com.hsk.account.repository.RoleRepository;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;

/**
 * Initializes default development accounts (Admin, Teacher, Student) on application startup
 * if they do not exist yet. Only active on non-test profiles.
 */
@Component
@Profile("!test & !test-h2")
public class DataInitializer implements ApplicationRunner {

	private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final UserRoleRepository userRoleRepository;
	private final PasswordEncoder passwordEncoder;

	public DataInitializer(
			UserRepository userRepository,
			RoleRepository roleRepository,
			UserRoleRepository userRoleRepository,
			PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.userRoleRepository = userRoleRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		initAdminUser();
		initTeacherUser();
		initStudentUser();
	}

	private void initAdminUser() {
		String email = "admin@hsk.edu";
		if (userRepository.findByEmailIgnoreCase(email).isEmpty()) {
			log.info("Seeding default Administrator account: {}", email);
			UserEntity admin = UserEntity.register(email, passwordEncoder.encode("Admin@123"), "Quản trị viên Hệ thống");
			admin.switchMode(UiMode.TEACHER);
			UserEntity saved = userRepository.save(admin);

			RoleEntity adminRole = roleRepository.findByCode(RoleCode.ADMIN).orElse(null);
			RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElse(null);
			RoleEntity studentRole = roleRepository.findByCode(RoleCode.STUDENT).orElse(null);

			if (adminRole != null) userRoleRepository.save(UserRoleEntity.of(saved, adminRole, null));
			if (teacherRole != null) userRoleRepository.save(UserRoleEntity.of(saved, teacherRole, null));
			if (studentRole != null) userRoleRepository.save(UserRoleEntity.of(saved, studentRole, null));
		}
	}

	private void initTeacherUser() {
		String email = "teacher@hsk.edu";
		if (userRepository.findByEmailIgnoreCase(email).isEmpty()) {
			log.info("Seeding default Teacher account: {}", email);
			UserEntity teacher = UserEntity.register(email, passwordEncoder.encode("Teacher@123"), "Cô Trương (Giáo viên)");
			teacher.switchMode(UiMode.TEACHER);
			UserEntity saved = userRepository.save(teacher);

			RoleEntity teacherRole = roleRepository.findByCode(RoleCode.TEACHER).orElse(null);
			RoleEntity studentRole = roleRepository.findByCode(RoleCode.STUDENT).orElse(null);

			if (teacherRole != null) userRoleRepository.save(UserRoleEntity.of(saved, teacherRole, null));
			if (studentRole != null) userRoleRepository.save(UserRoleEntity.of(saved, studentRole, null));
		}
	}

	private void initStudentUser() {
		String email = "student@hsk.edu";
		if (userRepository.findByEmailIgnoreCase(email).isEmpty()) {
			log.info("Seeding default Student account: {}", email);
			UserEntity student = UserEntity.register(email, passwordEncoder.encode("Student@123"), "Lý Tiểu Long (Học sinh)");
			student.switchMode(UiMode.STUDENT);
			UserEntity saved = userRepository.save(student);

			RoleEntity studentRole = roleRepository.findByCode(RoleCode.STUDENT).orElse(null);
			if (studentRole != null) userRoleRepository.save(UserRoleEntity.of(saved, studentRole, null));
		}
	}
}
