package com.hsk.common.audit;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.hsk.account.domain.UserEntity;

@Service
public class AuditLogService {

	private final AuditLogRepository auditLogRepository;

	public AuditLogService(AuditLogRepository auditLogRepository) {
		this.auditLogRepository = auditLogRepository;
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void record(UserEntity actor, String action, String entityType, String entityId, String detail) {
		AuditLogEntity entity = AuditLogEntity.of(actor, action, entityType, entityId, detail);
		auditLogRepository.save(entity);
	}
}
