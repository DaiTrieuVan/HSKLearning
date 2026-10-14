package com.hsk.common.audit;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLogEntity, Long> {

	List<AuditLogEntity> findByActionOrderByCreatedAtDesc(String action);

	List<AuditLogEntity> findByEntityTypeAndEntityIdOrderByCreatedAtDesc(String entityType, String entityId);
}
