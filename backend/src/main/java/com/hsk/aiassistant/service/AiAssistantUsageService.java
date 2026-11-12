package com.hsk.aiassistant.service;

import com.hsk.account.domain.UserEntity;
import com.hsk.account.repository.UserRepository;
import com.hsk.aiassistant.domain.AiAssistantDailyUsageEntity;
import com.hsk.aiassistant.repository.AiAssistantDailyUsageRepository;
import com.hsk.common.api.ApiErrorCode;
import com.hsk.common.api.ApiException;
import jakarta.persistence.OptimisticLockException;
import java.time.LocalDate;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

/**
 * Service quản lý lưu trữ và kiểm soát hạn mức lượt hỏi trợ lý AI (HTT-10-CN-004).
 */
@Service
public class AiAssistantUsageService {

    private final AiAssistantDailyUsageRepository usageRepository;
    private final UserRepository userRepository;
    private final TransactionTemplate transactionTemplate;
    private final ConcurrentHashMap<Long, Object> studentLocks = new ConcurrentHashMap<>();

    public AiAssistantUsageService(
            AiAssistantDailyUsageRepository usageRepository,
            UserRepository userRepository,
            PlatformTransactionManager transactionManager
    ) {
        this.usageRepository = usageRepository;
        this.userRepository = userRepository;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    @Transactional(readOnly = true)
    public int getUsageCount(Long studentId, LocalDate usageDate) {
        return usageRepository.findByStudentIdAndUsageDate(studentId, usageDate)
                .map(AiAssistantDailyUsageEntity::getSuccessfulCount)
                .orElse(0);
    }

    /**
     * Ghi nhận 1 lượt hỏi thành công với transaction nằm hoàn toàn bên trong synchronized block
     * kèm retry bảo vệ khi có xung đột phiên bản giữa các kết nối DB.
     */
    public int recordSuccessfulUsage(Long studentId, LocalDate usageDate, int dailyLimit) {
        Object lock = studentLocks.computeIfAbsent(studentId, id -> new Object());
        synchronized (lock) {
            for (int attempt = 0; attempt < 15; attempt++) {
                try {
                    return transactionTemplate.execute(status -> {
                        AiAssistantDailyUsageEntity usage = usageRepository.findByStudentIdAndUsageDateForUpdate(studentId, usageDate)
                                .orElseGet(() -> {
                                    UserEntity student = userRepository.findById(studentId)
                                            .orElseThrow(() -> new ApiException(ApiErrorCode.UNAUTHORIZED));
                                    return usageRepository.saveAndFlush(new AiAssistantDailyUsageEntity(student, usageDate));
                                });

                        if (usage.getSuccessfulCount() >= dailyLimit) {
                            throw new ApiException(ApiErrorCode.AI_DAILY_LIMIT_REACHED);
                        }

                        usage.incrementCount();
                        usageRepository.saveAndFlush(usage);
                        return usage.getSuccessfulCount();
                    });
                } catch (ObjectOptimisticLockingFailureException | OptimisticLockException e) {
                    // Thử lại với transaction mới
                }
            }

            throw new ApiException(ApiErrorCode.AI_DAILY_LIMIT_REACHED);
        }
    }
}
