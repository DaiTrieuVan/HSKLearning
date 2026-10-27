package com.hsk.aiassistant.repository;

import com.hsk.aiassistant.domain.AiAssistantDailyUsageEntity;
import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository truy vấn và cập nhật hạn mức hỏi đáp trợ lý AI hàng ngày (HTT-10-CN-004).
 */
@Repository
public interface AiAssistantDailyUsageRepository extends JpaRepository<AiAssistantDailyUsageEntity, Long> {

    Optional<AiAssistantDailyUsageEntity> findByStudentIdAndUsageDate(Long studentId, LocalDate usageDate);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT u FROM AiAssistantDailyUsageEntity u WHERE u.student.id = :studentId AND u.usageDate = :usageDate")
    Optional<AiAssistantDailyUsageEntity> findByStudentIdAndUsageDateForUpdate(
            @Param("studentId") Long studentId,
            @Param("usageDate") LocalDate usageDate
    );
}
