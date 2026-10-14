package com.hsk.common.config;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import com.hsk.account.domain.RoleCode;
import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.account.repository.UserRoleRepository;
import com.hsk.classroom.domain.ClassEntity;
import com.hsk.classroom.repository.ClassMemberRepository;
import com.hsk.classroom.repository.ClassRepository;

@SpringBootTest
@ActiveProfiles("h2")
class DataInitializerTest {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private UserRoleRepository userRoleRepository;

	@Autowired
	private ClassRepository classRepository;

	@Autowired
	private ClassMemberRepository classMemberRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Test
	@DisplayName("Kiểm tra toàn bộ tài khoản và dữ liệu seed mặc định sẵn sàng")
	void testSeedAccountsAndData() {
		// 1. Kiểm tra Admin
		UserEntity admin = userRepository.findByEmailIgnoreCase("admin@hsk.com").orElse(null);
		assertThat(admin).isNotNull();
		assertThat(passwordEncoder.matches("Password123", admin.getPasswordHash())).isTrue();
		assertThat(userRoleRepository.existsByUser_IdAndRole_Code(admin.getId(), RoleCode.ADMIN)).isTrue();

		// In ra hash chuẩn cho script SQL
		System.out.println("BCRYPT_PASSWORD123_HASH=" + admin.getPasswordHash());

		// 2. Kiểm tra Teachers
		UserEntity teacher1 = userRepository.findByEmailIgnoreCase("teacher1@hsk.com").orElse(null);
		assertThat(teacher1).isNotNull();
		assertThat(passwordEncoder.matches("Password123", teacher1.getPasswordHash())).isTrue();
		assertThat(userRoleRepository.existsByUser_IdAndRole_Code(teacher1.getId(), RoleCode.TEACHER)).isTrue();

		UserEntity teacher2 = userRepository.findByEmailIgnoreCase("teacher2@hsk.com").orElse(null);
		assertThat(teacher2).isNotNull();
		assertThat(passwordEncoder.matches("Password123", teacher2.getPasswordHash())).isTrue();
		assertThat(userRoleRepository.existsByUser_IdAndRole_Code(teacher2.getId(), RoleCode.TEACHER)).isTrue();

		// 3. Kiểm tra Students
		UserEntity student1 = userRepository.findByEmailIgnoreCase("student1@hsk.com").orElse(null);
		assertThat(student1).isNotNull();
		assertThat(passwordEncoder.matches("Password123", student1.getPasswordHash())).isTrue();
		assertThat(userRoleRepository.existsByUser_IdAndRole_Code(student1.getId(), RoleCode.STUDENT)).isTrue();

		UserEntity student2 = userRepository.findByEmailIgnoreCase("student2@hsk.com").orElse(null);
		assertThat(student2).isNotNull();
		assertThat(passwordEncoder.matches("Password123", student2.getPasswordHash())).isTrue();
		assertThat(userRoleRepository.existsByUser_IdAndRole_Code(student2.getId(), RoleCode.STUDENT)).isTrue();

		// 4. Kiểm tra Lớp học mẫu HSK101 và thành viên
		ClassEntity classroom = classRepository.findByJoinCode("HSK101").orElse(null);
		assertThat(classroom).isNotNull();
		assertThat(classroom.getTitle()).contains("HSK 1");
		assertThat(classMemberRepository.findByClassroom_IdAndStudent_Id(classroom.getId(), student1.getId())).isPresent();
	}
}
