package com.hsk.classroom.service;

import java.time.Instant;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.hsk.account.domain.UserEntity;
import com.hsk.classroom.domain.ClassJoinAttemptEntity;
import com.hsk.classroom.repository.ClassJoinAttemptRepository;

/**
 * HTT-02-CN-003: Quản lý ghi nhận nỗ lực nhập mã lớp độc lập (REQUIRES_NEW)
 * để bảo đảm số lần nhập sai không bị rollback khi tung ngoại lệ (QTN-05).
 */
@Service
public class ClassJoinAttemptService {

	private final ClassJoinAttemptRepository repository;

	public ClassJoinAttemptService(ClassJoinAttemptRepository repository) {
		this.repository = repository;
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void recordAttempt(UserEntity student, String attemptedCode, boolean successful) {
		repository.save(ClassJoinAttemptEntity.of(student, attemptedCode, successful));
	}

	@Transactional(readOnly = true)
	public long countFailedAttemptsSince(Long studentId, Instant since) {
		return repository.countFailedAttemptsSince(studentId, since);
	}
}
