package com.hsk.aiassistant.domain;

import com.hsk.account.domain.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.persistence.Version;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

/**
 * Bảng ghi nhận số lượt hỏi đáp thành công của học sinh với trợ lý AI theo ngày (HTT-10-CN-004).
 * Hạn mức tối đa: 20 lượt thành công / ngày (theo múi giờ Asia/Ho_Chi_Minh).
 */
@Entity
@Table(
        name = "ai_assistant_daily_usage",
        uniqueConstraints = @UniqueConstraint(name = "uq_ai_assistant_student_date", columnNames = {"student_id", "usage_date"})
)
@EntityListeners(AuditingEntityListener.class)
@Getter
public class AiAssistantDailyUsageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private UserEntity student;

    @Column(name = "usage_date", nullable = false)
    private LocalDate usageDate;

    @Column(name = "successful_count", nullable = false)
    private int successfulCount;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected AiAssistantDailyUsageEntity() {
    }

    public AiAssistantDailyUsageEntity(UserEntity student, LocalDate usageDate) {
        this.student = student;
        this.usageDate = usageDate;
        this.successfulCount = 0;
        this.version = 0L;
    }

    public void incrementCount() {
        this.successfulCount++;
    }
}
